#!/usr/bin/env node

/**
 * TTS Generator Module
 *
 * Converts markdown content to audio using ElevenLabs TTS API
 * Strips markdown syntax and HTML to get plain text for speech
 */

import fs from 'fs';
import path from 'path';

/**
 * Strip markdown and HTML to get clean text for TTS
 * Preserves paragraph breaks for natural speech pacing
 * Removes code blocks completely (horrible UX when read aloud)
 */
function markdownToPlainText(markdown) {
  let text = markdown;

  // Remove frontmatter (YAML between ---)
  text = text.replace(/^---\n[\s\S]*?\n---\n/m, '');

  // CRITICAL: Remove code blocks FIRST (```...```) - don't read code aloud
  text = text.replace(/```[\s\S]*?```/g, '');

  // Remove inline code backticks (keep the text for single-word code like variable names)
  text = text.replace(/`([^`]+)`/g, '$1');

  // Remove HTML figure tags with image attributions
  text = text.replace(/<figure[\s\S]*?<\/figure>/gi, '');

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Remove markdown image syntax: ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

  // Remove markdown link syntax but keep text: [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove headings markers (## Title -> Title)
  text = text.replace(/^#{1,6}\s+/gm, '');

  // Remove bold/italic markers
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1'); // **bold**
  text = text.replace(/\*([^*]+)\*/g, '$1');     // *italic*
  text = text.replace(/__([^_]+)__/g, '$1');     // __bold__
  text = text.replace(/_([^_]+)_/g, '$1');       // _italic_

  // Remove blockquote markers
  text = text.replace(/^>\s+/gm, '');

  // Remove list markers (- or * or 1.)
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');

  // Remove horizontal rules
  text = text.replace(/^[-*_]{3,}$/gm, '');

  // Normalize whitespace (collapse multiple spaces/newlines)
  text = text.replace(/\n{3,}/g, '\n\n');        // Max 2 consecutive newlines
  text = text.replace(/[ \t]{2,}/g, ' ');        // Collapse spaces
  text = text.trim();

  return text;
}

/**
 * Generate audio file from markdown content using ElevenLabs TTS
 *
 * @param {string} markdownContent - Raw markdown with frontmatter
 * @param {string} outputPath - Absolute path where audio file should be saved
 * @param {object} options - Configuration options
 * @param {string} options.apiKey - ElevenLabs API key (defaults to ELEVENLABS_API_KEY env var)
 * @param {string} options.voiceId - ElevenLabs voice ID (must be provided by user)
 * @param {string} options.modelId - Model ID: 'eleven_multilingual_v2' (default)
 * @returns {Promise<{success: boolean, audioPath?: string, characterCount?: number, error?: string}>}
 */
export async function generateTTS(markdownContent, outputPath, options = {}) {
  const {
    apiKey = process.env.ELEVENLABS_API_KEY,
    voiceId = process.env.ELEVENLABS_VOICE_ID,  // Voice ID to be provided by user
    modelId = 'eleven_multilingual_v2'           // Multilingual v2 model
  } = options;

  if (!apiKey) {
    return {
      success: false,
      error: 'ELEVENLABS_API_KEY environment variable not set'
    };
  }

  if (!voiceId) {
    return {
      success: false,
      error: 'ELEVENLABS_VOICE_ID environment variable not set (voice ID required)'
    };
  }

  try {
    // Convert markdown to plain text
    const plainText = markdownToPlainText(markdownContent);
    const charCount = plainText.length;

    console.log(`   📝 Extracted ${charCount} characters for TTS`);

    // Validate text length (minimum check only)
    if (charCount < 10) {
      return {
        success: false,
        error: 'Extracted text too short (less than 10 characters)'
      };
    }

    // Split text into chunks if needed (ElevenLabs limit is 10,000 chars)
    const MAX_CHUNK_SIZE = 9500;  // Slightly under 10,000 to be safe
    const chunks = [];

    if (charCount <= MAX_CHUNK_SIZE) {
      chunks.push(plainText);
    } else {
      console.log(`   ✂️  Text too long, splitting into chunks...`);

      // Split on paragraph boundaries to maintain natural flow
      const paragraphs = plainText.split('\n\n');
      let currentChunk = '';

      for (const para of paragraphs) {
        if ((currentChunk + para).length <= MAX_CHUNK_SIZE) {
          currentChunk += (currentChunk ? '\n\n' : '') + para;
        } else {
          if (currentChunk) chunks.push(currentChunk);
          currentChunk = para;
        }
      }

      if (currentChunk) chunks.push(currentChunk);
      console.log(`   📦 Split into ${chunks.length} chunks`);
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate audio for each chunk
    const audioBuffers = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkCharCount = chunk.length;

      console.log(`   🎙️  Generating chunk ${i + 1}/${chunks.length} (${chunkCharCount} chars) with ElevenLabs`);

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text: chunk,
            model_id: modelId,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      audioBuffers.push(buffer);
    }

    // Concatenate all audio buffers
    const finalBuffer = Buffer.concat(audioBuffers);
    fs.writeFileSync(outputPath, finalBuffer);

    const fileSizeMB = (finalBuffer.length / 1024 / 1024).toFixed(2);

    console.log(`   ✅ Audio generated: ${fileSizeMB} MB`);

    return {
      success: true,
      audioPath: outputPath,
      characterCount: charCount,
      fileSizeMB: parseFloat(fileSizeMB),
      chunkCount: chunks.length
    };
  } catch (error) {
    return {
      success: false,
      error: `TTS generation failed: ${error.message}`
    };
  }
}

/**
 * Check if TTS audio needs regeneration
 * Returns true if audio is missing or source markdown is newer
 */
export function needsRegeneration(markdownPath, audioPath) {
  if (!fs.existsSync(audioPath)) {
    return true;
  }

  const markdownMtime = fs.statSync(markdownPath).mtime;
  const audioMtime = fs.statSync(audioPath).mtime;

  return markdownMtime > audioMtime;
}

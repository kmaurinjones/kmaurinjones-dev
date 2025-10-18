# Wordle Recreation Architecture

```mermaid
graph LR
    subgraph Browser["Browser (Frontend)"]
        UI["User Interface<br/>(HTML/CSS/JS)"]
        Storage["localStorage<br/>(Stats & State)"]
    end

    subgraph Server["FastAPI Backend"]
        API["API Endpoints<br/>/api/word<br/>/api/validate<br/>/api/check"]
        WordList["Word List<br/>(12,966 valid words)"]
        Logic["Game Logic<br/>(Letter evaluation)"]
    end

    subgraph External["External Services"]
        NYT["NYT Wordle API<br/>(Daily solutions)"]
    end

    UI -->|"1. User plays game"| UI
    UI -->|"2. Select date"| API
    API -->|"3. Fetch solution"| NYT
    NYT -->|"4. Return word"| API
    API -->|"5. Send solution"| UI
    UI -->|"6. Submit guess"| API
    API -->|"7. Validate word"| WordList
    API -->|"8. Evaluate guess"| Logic
    Logic -->|"9. Return results<br/>(correct/present/absent)"| UI
    UI -->|"10. Update display"| UI
    UI -->|"Save stats"| Storage

    style Browser fill:#e1f5ff
    style Server fill:#fff4e1
    style External fill:#ffe1e1
```

## Architecture Notes

**Frontend (Browser)**
- Single-page application (SPA) with vanilla JavaScript
- Manages game state, UI rendering, and animations
- Stores statistics locally in browser

**Backend (FastAPI)**
- Lightweight Python server
- Validates words against comprehensive word list
- Evaluates guesses using authentic Wordle algorithm
- Fetches daily solutions from NYT

**External Integration**
- NYT Wordle API provides official daily puzzle solutions
- Allows playing any historical puzzle from June 19, 2021 onwards

**Flow:**
1. User selects a date and plays the game
2. Backend fetches that date's solution from NYT
3. User submits guesses
4. Backend validates and evaluates each guess
5. Frontend displays results with tile animations
6. Statistics are saved locally in the browser

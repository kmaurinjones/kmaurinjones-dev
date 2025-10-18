# Recreating NYT Connections: When Four Guesses Just Isn't Enough

## Why Build a Connections Clone?

My partner and I love the ritual of solving *NYT Connections* before bed. The only thing that ever
broke the streak was the four-strike limit. Once you miss four guesses, the puzzle ends and you never
learn what the groups were. To keep playing we would reopen incognito windows, reload the puzzle, and
burn through another set of guesses. That friction was enough to convince me to build my own
unlimited-guess version.

## Project Goals

- Recreate the core gameplay with the official daily puzzle feed.
- Remove the four-mistake cap so experimentation stays fun.
- Make historical puzzles easy to browse for practice.
- Ship quickly with a lightweight, maintainable stack.

## Technical Stack at a Glance

I used a minimal setup: FastAPI for the backend, SQLite for caching, and vanilla JavaScript on the
front end. The server fetches puzzle JSON from the New York Times, stores it locally for quick repeat
loads, and serves a single static HTML file. No frameworks or build pipeline required.

### Key Backend Endpoint

```python
@app.get("/api/puzzle/{date}")
async def get_puzzle(date: str):
    cached = get_puzzle_from_db(date)
    if cached:
        return JSONResponse(content=cached)

    async with httpx.AsyncClient() as client:
        base_url = "https://www.nytimes.com/svc/connections/v2/"
        response = await client.get(f"{base_url}{date}.json")
        puzzle_data = response.json()

    save_puzzle_to_db(date, puzzle_data)
    return JSONResponse(content=puzzle_data)
```

SQLite keeps the hosting story simple—everything runs from a single file database—while FastAPI’s
async support makes fetching new puzzles fast.

## Front-End Experience

The client lives in one HTML file with focused JavaScript modules. State is plain objects, and the
logic mirrors the official rules. Tailwind utility classes handle responsive layout without adding a
build step.

### Unlimited Guesses by Design

Instead of tracking mistakes and forcing a failure screen, the app just increments an attempt counter.
You can still stop after four misses if you want the original tension, but the game never locks you
out of learning the categories.

### Historical Puzzle Browser

A simple calendar component requests any published puzzle from the backend, which made it easy to
revisit favourites and test strategies without waiting for the next day’s release.

### Setting Expectations

First-time visitors see a small disclaimer clarifying that the project is an educational recreation
with no NYT affiliation. The acknowledgement lives in `localStorage`, so it only pops up once per
browser session.

## Lessons Learned

- **Keep the stack boring.** FastAPI plus static assets meant I could focus on gameplay instead of
  infrastructure.
- **Unlimited tries change the vibe.** Without the fail state we experiment more, collaborate longer,
  and actually remember the themes.
- **Timezone bugs are sneaky.** Early drafts defaulted to UTC and surfaced the wrong puzzle late at
  night. Leaning on the client’s local timezone fixed it.

## Try It Yourself

The app is live at [connections.kmaurinjones.dev](https://connections.kmaurinjones.dev). The code
still lives in a private repo while I continue to tidy it up, but the playable version is available
if you want to give it a spin.

Building this clone reinforced how much learning happens when you remove artificial limits. We still
play the official Connections daily, but having an unlimited-guess safety net keeps the puzzle fun
even when the categories are way outside our wheelhouse.

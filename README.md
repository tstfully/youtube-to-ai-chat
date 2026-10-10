# YouTube to AI Chat

**Chat with any YouTube video. Every answer links to the exact second it came from.**

A free, open-source skill for Claude Code (and other AI coding agents). Paste a YouTube link, ask anything, and get answers grounded in the video's transcript, with clickable timestamps so you can check every claim.

Want something to share? It can also build a **"chat with this video" web page**: the video player, a searchable transcript, and an AI chat in one HTML file. Click any timestamp in an answer and the video jumps right there.

---

## Two ways to use it

### 1. Chat right in Claude

> *"What does this video say about pricing? https://youtube.com/watch?v=…"*

You'll get a direct answer with timestamp links like [12:34](#), drawn only from what the video actually says. If the video doesn't cover your question, it says so instead of making something up.

Great for:
- **Podcasts and interviews:** "What did she say about hiring?"
- **Lectures:** "Explain the part about eigenvalues again, simpler"
- **Long talks:** "Summarize this in 5 bullets with timestamps"
- **Research:** "Where does he contradict himself?"
- **Any language:** ask in English about a video in Spanish, Japanese, or 100+ other languages

### 2. Build a "chat with this video" page

> *"Make a chat page for this video that I can share with my team"*

You get one HTML file with:
- **The embedded video**, next to a **searchable, clickable transcript** that follows along as it plays
- **An AI chat** that answers from the transcript and cites moments as clickable chips that jump the video
- **Suggested questions** tailored to the video
- **Your choice of model:** Claude Opus 5.5, Sonnet 5.5, or Haiku 5.5
- Light and dark mode, and a mobile layout

The page talks to Claude directly from the viewer's browser using **their own Anthropic API key**, so there's no server and nothing to host or pay for. The key goes only to Anthropic, and is saved on the device only if the viewer chooses. Answers typically cost a cent or two.

## Install with your coding agent

You don't need to use the command line. Send this to Claude Code (or your coding agent):

> Install the youtube-to-ai-chat skill from https://github.com/tstfully/youtube-to-ai-chat into my Claude skills folder (`~/.claude/skills/youtube-to-ai-chat`). Then help me connect a free YouTubeTranscript.dev API key, without me pasting the key into this chat.

### Or install manually

```bash
git clone https://github.com/tstfully/youtube-to-ai-chat ~/.claude/skills/youtube-to-ai-chat
```

## Connect transcripts (free)

The skill reads the video's transcript, so it needs a transcript source. Pick one.

**Option 1: MCP server (recommended for Claude Code, Claude Desktop, Cursor)**

```bash
claude mcp add --transport http youtubetranscript https://mcp.youtubetranscript.dev --header "x-api-token: YOUR_API_KEY"
```

**Option 2: Environment variable.** Set `YOUTUBETRANSCRIPT_API_KEY` to your key. The skill's built-in script (`scripts/fetch-transcript.mjs`, no dependencies) uses it.

Get your key free at [youtubetranscript.dev](https://youtubetranscript.dev) under **Dashboard → API Keys**. The free plan includes 10 credits a month and needs no card. Most videos cost 1 credit. Videos without captions can be transcribed from the audio too.

> 🔒 Never paste an API key into an AI chat, a screenshot, or a public file. Type it directly into your terminal or settings.

**Option 3: Paste a transcript.** Already have one? Paste it in and no key is needed. Without timestamps, answers won't link back to the video.

## No coding agent? No API key?

Try the free [Chat with Video tool](https://www.youtubetranscript.dev/tools/chat) on YouTubeTranscript.dev. Paste a link and start asking, no login required.

## Repo structure

```
youtube-to-ai-chat/
├── SKILL.md                        # Instructions the AI agent follows
├── assets/chat-template.html       # The chat page: player, transcript, chat (no build step)
└── scripts/
    ├── fetch-transcript.mjs        # Zero-dependency transcript fetcher
    └── build-chat-page.mjs         # Safely embeds a transcript into the chat page
```

## Privacy and security

- The chat page has **no backend**. Questions and the transcript go straight from the viewer's browser to `api.anthropic.com`.
- API keys are never written into the page file. Viewers enter their own, and it's kept in memory unless they tick "Remember".
- Transcript text is escaped when embedded and rendered as plain text, so caption content can't run code in the page.

## Companion skills

- [youtube-to-course](https://github.com/tstfully/youtube-to-course): turn a video into an interactive course with quizzes and flashcards
- [youtube-to-case-study](https://github.com/tstfully/youtube-to-case-study): turn a video into a business, marketing, or UX case-study slideshow

## License

MIT. Use it, fork it, and build on it.

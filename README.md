# dungeon ai

> your personal dungeon master, powered by [chatGPT](https://chat.openai.com)

**tldr; a CLI for Dungeons & Dragons**

this app takes user the user on an adventure through a story crafted by AI dungeon master (who was carefully explained their job and will try their best!). a collaboration of human and artificial imaginations <3

this app uses the [chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api) package to interface with ChatGPT. shoutout to [Travis Fischer](https://github.com/transitive-bullshit) for creating this banger API wrapper!

## requirements

you will need:

- Node.js installed on your machine
- a ChatGPT session token for the `.env` file (follow [these instructions](https://github.com/transitive-bullshit/chatgpt-api#how-it-works) to get one)

## run

1. install dependencies

   ```bash
   npm install
   ```

1. create copy of `.env.example` named `.env`

   ```bash
   cp .env.example .env
   ```

1. add your ChatGPT session token to the `SESSION_TOKEN` variable

   ```bash
   # inside .env
   SESSION_TOKEN=your_session_token_here
   ```

1. start the app - **_happy adventuring!_**

   ```bash
   npm start
   ```

# twitter-bot

A program that can help you forward Twitter messages to Telegram.

## Usage

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables to the `.env` file:
   ```shell
   TWITTER_API_KEY=YOUR_TWITTER_API_KEY
   TWITTER_USER_NAME=YOUR_TWITTER_USER_NAME
   TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
   ```
   or
   ```shell
   TWITTER_USER_NAME=YOUR_TWITTER_USER_NAME
   TWITTER_PASSWORD=YOUR_TWITTER_PASSWORD
   TWITTER_EMAIL=YOUR_TWITTER_EMAIL
   TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
   ```
3. Run the following command to install the required dependencies:
   ```bash
   pnpm install
   ```
4. Run the following command to start the bot:
   ```bash
   # Production mode
   pnpm start
   ```
   or
   ```bash
   # Development mode
   pnpm run dev
   ```



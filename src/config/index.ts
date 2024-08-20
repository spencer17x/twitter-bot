import 'dotenv/config';
import * as process from 'node:process';

export const config = {
	twitter: {
		apiKey: process.env.TWITTER_API_KEY!,
		userName: process.env.TWITTER_USERNAME!,
		subUserNames: process.env.TWITTER_SUB_USERNAMES!.split(',')
	},
	telegram: {
		botToken: process.env.TELEGRAM_BOT_TOKEN!,
		chatIds: process.env.TELEGRAM_CHAT_IDS!.split(',')
	},
};
import 'dotenv/config';

export const config = {
	twitter: {
		apiKey: process.env.TWITTER_API_KEY || '',
		userName: process.env.TWITTER_USERNAME || '',
		password: process.env.TWITTER_PASSWORD || '',
		email: process.env.TWITTER_EMAIL || '',
	},
	telegram: {
		adminUserName: process.env.TELEGRAM_ADMIN_USERNAME || '',
		botToken: process.env.TELEGRAM_BOT_TOKEN || '',
	},
	weChat: {
		groupTopics: []
	}
};

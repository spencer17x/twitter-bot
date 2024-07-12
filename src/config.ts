import 'dotenv/config';

export const twitterConfig = {
	apiKey: process.env.TWITTER_API_KEY || '',
	userName: process.env.TWITTER_USER_NAME || '',
	password: process.env.TWITTER_PASSWORD || '',
	email: process.env.TWITTER_EMAIL || '',
};

export const telegramConfig = {
	botToken: process.env.TELEGRAM_BOT_TOKEN || '',
};

export const autoSubUsers = [
	'ultramanm1l',

	'elonmusk',
	'VitalikButerin',
	'aeyakovenko',
	'rajgokal',

	'sagexbabyx',
	'Charles289Calls',
	'yelotree',
	'TheRoaringKitty',
	'Pauly0x',
	'WhaleFUD',
	'TheMisterFrog',
	'blknoiz06',
	'pepecoineth',
	'Darkfarms1',

	'neso',
	's1n3ddd',
	'taulebiii',
	'PepeBoost888',
	'bwenews',
	'klys7788'
];

import { config } from '@/config';
import { bot } from '@/bot';

const main = async () => {
	await bot.launch({
		botToken: config.telegram.botToken,
		twitter: {
			apiKey: config.twitter.apiKey,
			userName: config.twitter.userName,
			subUserNames: config.twitter.subUserNames
		}
	});
	console.log('Bot launched');
};

main().catch(console.error);

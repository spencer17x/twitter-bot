import { Telegraf } from 'telegraf';

import { RettiwtUtils } from '../rettiwt-utils';
import {
	subCommand,
	listCommand,
	startCommand,
	unSubCommand,
	helpCommand,
	setUserCommand
} from '../telegram-utils/command';

export const setUpTg = async (tgBot: Telegraf, twitterClient: RettiwtUtils) => {
	await new Promise((resolve) => {
		tgBot.launch(() => {
			resolve(null);
		});
	});


	startCommand(tgBot);
	listCommand(tgBot, twitterClient);
	subCommand(tgBot, twitterClient);
	unSubCommand(tgBot);
	helpCommand(tgBot);
	setUserCommand(tgBot)
};

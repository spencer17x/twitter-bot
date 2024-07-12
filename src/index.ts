import { Telegraf } from 'telegraf';
import { bold, fmt, link } from 'telegraf/format';
import dayjs from 'dayjs';

import { RettiwtUtils } from './rettiwt-utils';
import { telegramConfig, twitterConfig } from './config';
import { setUpTg } from './telegram-utils';
import { userController } from './controllers/UserController';
import { groupController } from './controllers/GroupController';

const main = async () => {
	const tgBot = new Telegraf(telegramConfig.botToken);

	const client = new RettiwtUtils();

	await client.launch({
		userName: twitterConfig.userName,
		apiKey: twitterConfig.apiKey,
		onUpdate: async (tweet) => {
			const text = fmt([
				bold(tweet.tweetBy.fullName), '发推了\n',
				'内容: ', tweet.fullText, '\n',
				'时间: ', dayjs(tweet.createdAt).format('YYYY-MM-DD HH:mm:ss'), '\n',
				'链接: ', link('查看原文', `https://twitter.com/${tweet.tweetBy.userName}/status/${tweet.id}`)
			]);
			const userName = tweet.tweetBy.userName;
			const chatIds = [
				...userController.users
					.filter(user => user.subUserNames.includes(userName))
					.map(user => +user.id),

				...groupController.groups
					.filter(group => group.subUserNames.includes(userName))
					.map(group => `@${group.id}`)
			];

			chatIds.forEach(chatId => {
				tgBot.telegram.sendMessage(
					chatId,
					text
				);
			});
		},
	});

	await setUpTg(tgBot, client);
};

main().catch(console.error);

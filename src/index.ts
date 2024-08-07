import { Telegraf } from 'telegraf';
import { bold, fmt, link } from 'telegraf/format';
import dayjs from 'dayjs';
import { Tweet } from 'rettiwt-api';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { RettiwtUtils } from './rettiwt-utils';
import { setUpTg } from './telegram-utils';
import { userController } from './controllers/UserController';
import { groupController } from './controllers/GroupController';
import { WechatBot } from './wechat-bot';
import { config } from './config';

dayjs.extend(utc);
dayjs.extend(timezone);

const createTgText = (tweet: Tweet) => {
	return fmt([
		bold(tweet.tweetBy.fullName), '发推了\n',
		'内容: ', tweet.fullText, '\n',
		'北京时间: ', dayjs(tweet.createdAt).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss'), '\n',
		'世界标准时间: ', dayjs(tweet.createdAt).format('YYYY-MM-DD HH:mm:ss'), '\n',
		'链接: ', link('查看原文', `https://twitter.com/${tweet.tweetBy.userName}/status/${tweet.id}`)
	]);
};

const getChatIds = (userName: string) => {
	return [
		...userController.users
			.filter(user => user.subUserNames.includes(userName))
			.map(user => +user.id),

		...groupController.groups
			.filter(group => group.subUserNames.includes(userName))
			.map(group => `@${group.id}`)
	];
};

const sendToTg = async (bot: Telegraf, tweet: Tweet) => {
	getChatIds(tweet.tweetBy.userName)
		.forEach(chatId => {
			bot.telegram.sendMessage(
				chatId,
				createTgText(tweet),
			).catch(console.error);
		});
};

const sendToWeChat = async (bot: WechatBot, tweet: Tweet) => {
	if (bot.bot.isLoggedIn) {
		const rooms = await Promise.all(
			config.weChat.groupTopics
				.map((topic: string) => {
					return bot.bot.Room.find({
						topic
					});
				})
		);

		const text = [
			`${tweet.tweetBy.fullName}发推了`,
			`内容: ${tweet.fullText}`,
			`北京时间: ${dayjs(tweet.createdAt).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')}`,
			`世界标准时间: ${dayjs(tweet.createdAt).format('YYYY-MM-DD HH:mm:ss')}`,
			`链接: https://twitter.com/${tweet.tweetBy.userName}/status/${tweet.id}`
		].join('\n');
		await Promise.all(
			rooms.map(room => room?.say(text))
		);
	}
};

const main = async () => {
	const client = new RettiwtUtils();
	await client.launch({
		userName: config.twitter.userName,
		apiKey: config.twitter.apiKey,
		onUpdate: async (tweet) => {
			sendToTg(tgBot, tweet).catch(console.error);
		},
	});
	console.log('Twitter client launched');

	const tgBot = new Telegraf(config.telegram.botToken);
	await setUpTg(tgBot, client);
	console.log('Telegram bot launched');
};

main().catch(console.error);

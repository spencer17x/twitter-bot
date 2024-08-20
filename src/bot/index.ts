import { Telegraf } from 'telegraf';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { twitterService } from '@/services';
import { config } from '@/config';

interface LaunchOptions {
	botToken: string;
	twitter: {
		apiKey: string;
		userName: string;
		subUserNames?: string[];
	};
}

dayjs.extend(utc);
dayjs.extend(timezone);

export class Bot {
	async launch(options: LaunchOptions) {
		const { botToken, twitter } = options;
		await twitterService.launch({
			apiKey: twitter.apiKey,
			userName: twitter.userName
		});
		console.log('Twitter launched');

		// 订阅未关注的用户
		const followingUserNames = (await twitterService.getFollowing())
			.map(followingUser => followingUser.userName);
		console.log('followingUserNames', followingUserNames.length);
		const subUserNames = twitter.subUserNames || [];
		const userNames = subUserNames.filter(
			(userName) => !followingUserNames.includes(userName),
		);
		await twitterService.sub(userNames);
		console.log('Subscribed to users:', subUserNames.length);

		const bot = new Telegraf(botToken);
		await new Promise((resolve) => {
			bot.launch(() => {
				resolve(null);
			});
		});
		console.log('Telegram bot launched');

		bot.start((ctx) => {
			ctx.reply('Welcome to twitter notify bot');
		});
		bot.command('list', async (ctx) => {
			const users = await twitterService.getFollowing();
			ctx.reply(
				users
					.map((item) => {
						return `[${item.fullName}](https://x.com/${item.userName})`;
					})
					.join('\n'),
				{
					parse_mode: 'Markdown'
				}
			).catch(console.error);
		});

		void twitterService.checkUpdate({
			onUpdate: async (tweet) => {
				console.log('onUpdate:', tweet);
				if (subUserNames.some((userName) => userName === tweet.tweetBy.userName)) {
					console.log('New tweet:', tweet);
					config.telegram.chatIds.forEach(chatId => {
						bot.telegram.sendMessage(
							chatId,
							[
								`*${tweet.tweetBy.fullName}* 发推了`,
								`内容: ${tweet.fullText}`,
								`北京时间: ${dayjs(tweet.createdAt).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')}`,
								`世界时间: ${dayjs(tweet.createdAt).utc().format('YYYY-MM-DD HH:mm:ss')}`,
								`链接: [查看原文](https://twitter.com/${tweet.tweetBy.userName}/status/${tweet.id})`
							].join('\n')
						).catch(console.error);
					});
				}
			},
			onUpdateError: (error) => {
				console.error(error);
			}
		});
	}
}

export const bot = new Bot();
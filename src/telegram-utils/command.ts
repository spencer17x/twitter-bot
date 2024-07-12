import { Telegraf } from 'telegraf';
import { fmt, link } from 'telegraf/format';

import { AuthLevel, userController } from '../controllers/UserController';
import { groupController } from '../controllers/GroupController';
import { RettiwtUtils } from '../rettiwt-utils';

const userPrefix = '-user';
const groupPrefix = '-group=';

const noPermissionText = () => {
	return `You don't have permission.Please contact the admin: @${process.env.ADMIN_TG_USERNAME}`;
};

export const listCommand = (tgBot: Telegraf, twitterClient: RettiwtUtils) => {
	tgBot.command('list', async (ctx) => {
		const createReplyText = async (subUserNames: string[]) => {
			const users = await twitterClient.listSubUsers();

			const links = users
				.filter((item) => subUserNames.includes(item.userName))
				.map((item) => {
					return link(`${item.fullName}\n`, `https://twitter.com/${item.userName}`);
				});
			return links?.length ? fmt(links) : 'No sub users';
		};

		const type = ctx.message.text.split(' ')[1];

		if (type.includes(userPrefix)) {
			const tgUserId = ctx.from.id + '';
			const subUserNames = userController.findUser(tgUserId)?.subUserNames || [];
			const text = await createReplyText(subUserNames);

			await ctx.reply(text);
			return;
		}

		if (type.includes(groupPrefix)) {
			const tgUserId = ctx.from.id + '';
			const groupId = type.replace(groupPrefix, '');
			const subUserNames = groupController.findGroup(tgUserId, groupId)?.subUserNames || [];
			const text = await createReplyText(subUserNames);

			await ctx.reply(text);
			return;
		}
	});
};

export const subCommand = (tgBot: Telegraf, twitterClient: RettiwtUtils) => {
	tgBot.command('sub', async (ctx) => {
		try {
			const tgUser = userController.findUser(ctx.from.id + '');
			if (tgUser?.authLevel === AuthLevel.Guest) {
				await ctx.reply(noPermissionText());
				return;
			}

			const [type, ...userNames] = ctx.message.text.split(' ').slice(1);

			if (!userNames.length) {
				await ctx.reply('Please enter the users who want to subscribe');
				return;
			}
			await twitterClient.sub(userNames);

			if (type.includes(userPrefix)) {
				userController.addSubUserNames(ctx.from.id + '', userNames);
			}

			if (type.includes(groupPrefix)) {
				const groupId = type.replace(groupPrefix, '');
				groupController.addSubUserNames(ctx.from.id + '', groupId, userNames);
			}

			await ctx.reply('sub success');
		} catch (e) {
			console.error(e);
			await ctx.reply('sub failed');
		}
	});
};

export const unSubCommand = (tgBot: Telegraf) => {
	tgBot.command('unsub', async (ctx) => {
		try {
			const tgUser = userController.findUser(ctx.from.id + '');
			if (tgUser?.authLevel === AuthLevel.Guest) {
				await ctx.reply(noPermissionText());
				return;
			}

			const [type, ...userNames] = ctx.message.text.split(' ').slice(1);

			if (!userNames.length) {
				await ctx.reply('Please enter the users who want to unsubscribe');
				return;
			}
			// await twitterClient.unsub(userNames);

			if (type.includes(userPrefix)) {
				userController.removeSubUserNames(ctx.from.id + '', userNames);
			}

			if (type.includes(groupPrefix)) {
				const groupId = type.replace(groupPrefix, '');
				groupController.removeSubUserNames(ctx.from.id + '', groupId, userNames);
			}

			await ctx.reply('unsub success');
		} catch (e) {
			console.error(e);
			await ctx.reply('unsub failed');
		}
	});
};

export const startCommand = (tgBot: Telegraf) => {
	tgBot.start((ctx) => {
		userController.register(ctx.from.id + '');

		ctx.reply('Welcome to twitter notify bot');
	});
};

export const helpCommand = (tgBot: Telegraf) => {
	tgBot.help((ctx) => {
		ctx.reply(
			fmt([
				'/help - Docs\n',
				'/start - Register user\n',
				'/list - Show subscribed users. Usage: /list -user or /list -group=groupId\n',
				'/sub - Subscribe users. Usage: /sub -user userName1 userName2 or /sub -group=groupId userName1 userName2\n',
				'/unsub - Unsubscribe users. Usage: /unsub -user userName1 userName2 or /unsub -group=groupId userName1 userName2\n',
			])
		);
	});
};

export const setUserCommand = (tgBot: Telegraf) => {
	tgBot.command('setUser', async (ctx) => {
		const currentTgUser = userController.findUser(ctx.from.id + '');
		if (currentTgUser?.authLevel !== AuthLevel.Admin) {
			await ctx.reply(noPermissionText());
			return;
		}

		const [tgUserId, authLevel] = ctx.message.text.split(' ').slice(1);
		userController.setAuthLevel(tgUserId, authLevel as AuthLevel);
	});
};

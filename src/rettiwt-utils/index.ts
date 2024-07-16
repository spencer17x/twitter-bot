import { IRettiwtConfig, Rettiwt, Tweet, User } from 'rettiwt-api';

export interface LaunchLoginOptions {
	password: string;
	email: string;
}

export type LaunchOptions = {
	userName: string;
	onUpdate: (tweet: Tweet) => void;
	onUpdateError?: (error: unknown) => void;
} & (LaunchLoginOptions | IRettiwtConfig);

export type checkUpdateCallback = Pick<LaunchOptions, 'onUpdate' | 'onUpdateError'>

export class RettiwtUtils {
	private loginUserName: string = '';
	private client: Rettiwt | null = null;
	private tweets: Tweet[] = [];
	private launchTime: number = 0;

	private checkUpdate = async (callback: checkUpdateCallback) => {
		try {
			console.log('Checking for new tweets...');
			const { onUpdate, onUpdateError } = callback;
			const result = await this.getClient().user.followed();
			const list = result.list;

			for (const lItem of list) {
				if (
					!this.tweets.some(tweet => tweet.id === lItem.id) &&
					new Date(lItem.createdAt).getTime() - this.launchTime >= 0
				) {
					const message = {
						userName: lItem.tweetBy.userName,
						fullName: lItem.tweetBy.fullName,
						text: lItem.fullText,
						createAt: lItem.createdAt,
						tweetId: lItem.id
					};
					this.tweets.push(lItem);
					console.log(`New tweet: `, message);
					onUpdate(lItem);
				}
			}

			const delayMs = Math.floor(Math.random() * 25 + 5) * 1000;
			console.log(`Delay for ${delayMs / 1000} seconds...`);
			await new Promise((resolve) => {
				setTimeout(resolve, delayMs);
			});
		} catch (error) {
			console.error('checkUpdate error:', error);
			if (callback.onUpdateError) {
				callback.onUpdateError(error);
			}
		} finally {
			console.log('Next checkUpdate...');
			this.checkUpdate(callback).catch(console.error);
		}
	};

	public getClient = () => {
		if (!this.client) {
			throw new Error('Client not initialized');
		}

		return this.client;
	};

	public launch = async (options: LaunchOptions) => {
		if ('password' in options) {
			const { email, userName, password } = options;
			this.client = new Rettiwt();
			await this.client.auth.login(email, userName, password);
		} else {
			this.client = new Rettiwt(options);
		}

		const {
			userName,
			onUpdate, onUpdateError
		} = options;

		this.loginUserName = userName;
		this.launchTime = Date.now();

		this.checkUpdate({
			onUpdate,
			onUpdateError
		}).catch(console.error);
	};

	public sub = async (users: string[]) => {
		console.log(`Start subscribing to users`);

		for (const userName of users) {
			console.log(`Subscribing to user: ${userName}`);
			const user = await this.getClient().user.details(userName);
			await this.getClient().user.follow(user?.id || '');
			console.log(`Subscribed to user: ${userName}`);

			const delayMs = Math.floor(Math.random() * 5 + 1) * 1000;
			console.log(`Delay for ${delayMs / 1000} seconds...`);
			await new Promise((resolve) => {
				setTimeout(resolve, delayMs);
			});
		}

		console.log(`Finished subscribing to users`);
	};

	public unsub = async (users: string[]) => {
		console.log(`Start unsubscribing to users`);

		for (const userName of users) {
			console.log(`Unsubscribing to user: ${userName}`);
			const user = await this.getClient().user.details(userName);
			await this.getClient().user.unfollow(user?.id || '');
			console.log(`Unsubscribed to user: ${userName}`);


			const delayMs = Math.floor(Math.random() * 5 + 1) * 1000;
			console.log(`Delay for ${delayMs / 1000} seconds...`);
			await new Promise((resolve) => {
				setTimeout(resolve, delayMs);
			});
		}

		console.log(`Finished unsubscribing to users`);
	};

	public listSubUsers = async () => {
		const user = await this.getClient().user.details(this.loginUserName);
		const result = await this.getClient().user.following(user?.id || '');
		return result.list;
	};
}

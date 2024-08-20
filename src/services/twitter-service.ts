import { Rettiwt, Tweet } from 'rettiwt-api';

export interface LaunchOptions {
	apiKey: string;
	userName: string;
}

export interface checkUpdateCallback {
	onUpdate?: (tweet: Tweet) => void;
	onUpdateError?: (error: unknown) => void;
}

export class TwitterService {
	private userName: string = '';
	private client: Rettiwt | null = null;
	private tweets: Tweet[] = [];
	private launchTime: number = 0;

	/**
	 * 检查消息更新
	 * @param callback
	 */
	public checkUpdate = async (callback: checkUpdateCallback = {}) => {
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
					onUpdate?.(lItem);
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

	/**
	 * 启动服务
	 * @param options
	 */
	public launch = async (options: LaunchOptions) => {
		const { apiKey, userName } = options;
		this.client = new Rettiwt({
			apiKey
		});
		console.log('Twitter login');

		this.userName = userName;
		this.launchTime = Date.now();

		// this.checkUpdate({
		// 	onUpdate,
		// 	onUpdateError
		// }).catch(console.error);
	};

	/**
	 * 订阅用户
	 * @param users
	 */
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

	/**
	 * 获取关注列表
	 */
	public getFollowing = async () => {
		const user = await this.getClient().user.details(this.userName);
		const result = await this.getClient().user.following(user?.id || '');
		return result.list;
	};
}

export const twitterService = new TwitterService();
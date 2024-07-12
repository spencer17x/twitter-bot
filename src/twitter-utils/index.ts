import { requestHomeLatestTimeline } from './request';

export interface Tweet {
	tweetId: string;
	createAt: string;
	name: string;
	screenName: string;
	fullText: string;
}

export const start = async () => {
	const tweets: Tweet[] = [];

	const result = await requestHomeLatestTimeline();
	const instructions = result.data.home.home_timeline_urt.instructions;
	const entries = instructions.reduce((prev: any, cur: any) => {
		if (cur.type === 'TimelineAddEntries') {
			prev.push(...cur.entries);
		}
		return prev;
	}, []);

	const notify = (tweet: Tweet) => {
		const isExist = tweets.some((tweet) => tweet.tweetId === tweet.tweetId);
		const isExpired = Date.now() - new Date(tweet.createAt).getTime() > 0;
		if (isExist || isExpired) return;

		tweets.push(tweet);
		console.log(`${tweet.screenName} 发推了: `, tweet);
	};

	for (const entry of entries) {
		if (entry.entryId.startsWith('home-conversation-')) {
			const items = entry.content.items;
			for (const item of items) {
				const result = item.item.itemContent.tweet_results.result;
				const core = result.core;
				const legacy = result.legacy;
				const tweet = {
					tweetId: result.rest_id,
					createAt: legacy.created_at,
					name: core.user_results.result.name,
					screenName: core.user_results.result.screen_name,
					fullText: legacy.full_text,
				};
				notify(tweet);
			}
		}

		if (entry.entryId.startsWith('tweet-')) {
			const result = entry.content.itemContent.tweet_results.result;
			const core = result.core;
			const legacy = result.legacy;
			const tweet = {
				tweetId: result.rest_id,
				createAt: legacy.created_at,
				name: core.user_results.result.name,
				screenName: core.user_results.result.screen_name,
				fullText: legacy.full_text,
			};
			notify(tweet);
		}
	}
};

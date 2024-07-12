import * as fs from 'node:fs';
import path from 'node:path';

import { CommonController } from './CommonController';

export enum AuthLevel {
	Admin = 'admin',
	User = 'user',
	Guest = 'guest'
}

interface User {
	id: string;
	subUserNames: string[];
	createAt: number;
	authLevel: AuthLevel;
}

const filePath = path.resolve('./db/users.json');

export class UserController extends CommonController {
	users: User[] = [];

	constructor() {
		super();
		this.createFileIfNotExists(filePath);
		this.users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
	}

	/**
	 * 更新数据库
	 * @private
	 */
	private update() {
		fs.writeFileSync(
			filePath,
			JSON.stringify(this.users, null, 2)
		);
	}

	/**
	 * 查找用户
	 * @param userId
	 */
	public findUser(userId: string) {
		return this.users.find(user => user.id === userId);
	}

	/**
	 * 注册用户
	 * @param userId
	 */
	public register(userId: string) {
		const user = this.findUser(userId);
		if (!user) {
			this.users.push({
				id: userId,
				subUserNames: [],
				createAt: Date.now(),
				authLevel: AuthLevel.Guest
			});
		}

		this.update();
	}

	/**
	 * 添加自己订阅的用户
	 * @param userId
	 * @param userNames
	 */
	public addSubUserNames(userId: string, userNames: string[]) {
		this.register(userId);

		const user = this.findUser(userId);
		if (!user) {
			return;
		}
		user.subUserNames = Array.from(new Set([...user.subUserNames, ...userNames]));

		this.update();
	}

	/**
	 * 移除自己订阅的用户
	 * @param userId
	 * @param userNames
	 */
	public removeSubUserNames(userId: string, userNames: string[]) {
		const user = this.findUser(userId);
		if (!user) {
			return;
		}
		user.subUserNames = user.subUserNames.filter(userName => !userNames.includes(userName));

		this.update();
	}

	public setAuthLevel(userId: string, authLevel: AuthLevel) {
		const user = this.findUser(userId);
		if (!user) {
			return;
		}
		user.authLevel = authLevel;

		this.update();
	}
}

export const userController = new UserController();

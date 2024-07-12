import * as fs from 'node:fs';
import path from 'node:path';

import { CommonController } from './CommonController';
import { userController } from './UserController';

interface Group {
	id: string;
	subUserNames: string[];
	createAt: number;
	ownerId: string;
}

export const filePath = path.resolve('./db/groups.json');

class GroupController extends CommonController {
	groups: Group[] = [];

	constructor() {
		super();
		this.createFileIfNotExists(filePath);
		this.groups = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
	}

	/**
	 * 更新数据
	 * @private
	 */
	private update() {
		fs.writeFileSync(
			filePath,
			JSON.stringify(this.groups, null, 2)
		);
	}

	/**
	 * 查找群组
	 * @param userId
	 * @param groupId
	 * @private
	 */
	public findGroup(userId: string, groupId: string) {
		return this.groups.find(group => group.id === groupId && group.ownerId === userId);
	}

	/**
	 * 添加群组订阅用户
	 * @param userId
	 * @param groupId
	 * @param subUserNames
	 */
	public addSubUserNames(userId: string, groupId: string, subUserNames: string[]) {
		userController.register(userId);

		const group = this.findGroup(userId, groupId);
		if (!group) {
			this.groups.push({
				id: groupId,
				subUserNames,
				createAt: Date.now(),
				ownerId: userId
			});
		} else {
			group.subUserNames = Array.from(new Set([...group.subUserNames, ...subUserNames]));
		}

		this.update();
	}

	/**
	 * 移除群组订阅用户
	 * @param userId
	 * @param groupId
	 * @param subUserNames
	 */
	public removeSubUserNames(userId: string, groupId: string, subUserNames: string[]) {
		const group = this.findGroup(userId, groupId);
		if (!group) {
			return;
		}
		group.subUserNames = group.subUserNames.filter(userName => !subUserNames.includes(userName));

		this.update();
	}
}

export const groupController = new GroupController();

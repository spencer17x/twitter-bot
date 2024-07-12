import fs from 'node:fs';
import path from 'node:path';

export class CommonController {
	public createFileIfNotExists(filePath: string, data: unknown = []) {
		const dir = path.dirname(filePath);

		// 检查目录是否存在，如果不存在则创建目录
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
			console.log(`目录 ${dir} 已创建`);
		}

		// 检查文件是否存在，如果不存在则创建文件
		if (!fs.existsSync(filePath)) {
			fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
			console.log(`文件 ${filePath} 已创建`);
		} else {
			console.log(`文件 ${filePath} 已存在`);
		}
	}
}

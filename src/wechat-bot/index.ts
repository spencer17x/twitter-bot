import { Contact, Message, ScanStatus, WechatyBuilder, WechatyOptions } from 'wechaty';
import qrTerm from 'qrcode-terminal';
import { WechatyInterface } from 'wechaty/impls';

export class WechatBot {
	bot: WechatyInterface;

	constructor(options: WechatyOptions) {
		this.bot = WechatyBuilder.build(options);

		this.onScan = this.onScan.bind(this);
		this.onLogin = this.onLogin.bind(this);
		this.onLogout = this.onLogout.bind(this);
		this.onMessage = this.onMessage.bind(this);
		this.onError = this.onError.bind(this);
		this.bot.on('scan', this.onScan);
		this.bot.on('login', this.onLogin);
		this.bot.on('logout', this.onLogout);
		this.bot.on('message', this.onMessage);
		this.bot.on('error', this.onError);
	}

	async launch() {
		return this.bot.start();
	}

	private onScan(qrcode: string, status: ScanStatus) {
		if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
			qrTerm.generate(qrcode, { small: true });

			const qrcodeImageUrl = [
				'https://wechaty.js.org/qrcode/',
				encodeURIComponent(qrcode),
			].join('');

			console.log('onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl);
		} else {
			console.log('onScan: %s(%s)', ScanStatus[status], status);
		}
	}

	private onLogin(user: Contact) {
		console.log(`${user.name()} login`);
	}

	private onLogout(user: Contact) {
		console.log(`${user.name()} logout`);
	}

	private onMessage(msg: Message) {
		console.log('RECEIVED: ', msg);
	}

	private onError(e: Error) {
		console.error('Bot error:', e);
	}
}

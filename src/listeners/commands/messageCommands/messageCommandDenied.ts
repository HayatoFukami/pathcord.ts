import type { Events, MessageCommandDeniedPayload } from '@sapphire/framework';
import { Listener, type UserError } from '@sapphire/framework';

export class UserEvent extends Listener<typeof Events.MessageCommandDenied> {
	public override async run({ context, message: content }: UserError, { message }: MessageCommandDeniedPayload) {
		// `context: {silent: true }` は UserError をサイレントにします:
		// この使用例としては、たとえば `eval` コマンドを実行するときの権限エラーなどが挙げられます。
		if (Reflect.get(Object(context), 'silent')) return;

		return message.reply({ content, allowedMentions: { users: [message.author.id], roles: [] } });
	}
}

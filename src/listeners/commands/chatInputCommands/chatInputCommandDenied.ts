import type { ChatInputCommandDeniedPayload, Events } from '@sapphire/framework';
import { Listener, UserError } from '@sapphire/framework';

export class UserEvent extends Listener<typeof Events.ChatInputCommandDenied> {
	public override async run({ context, message: content }: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		// `context: {silent: true }` は UserError をサイレントにします:
		// この使用例としては、たとえば `eval` コマンドを実行するときの権限エラーなどが挙げられます。
		if (Reflect.get(Object(context), 'silent')) return;

		if (interaction.deferred || interaction.replied) {
			return interaction.editReply({
				content,
				allowedMentions: { users: [interaction.user.id], roles: [] }
			});
		}

		return interaction.reply({
			content,
			allowedMentions: { users: [interaction.user.id], roles: [] },
			ephemeral: true
		});
	}
}

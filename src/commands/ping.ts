import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationCommandType, ApplicationIntegrationType, InteractionContextType, Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'ping pong'
})
export class UserCommand extends Command {
	// チャット入力とコンテキストメニューコマンドを登録する
	public override registerApplicationCommands(registry: Command.Registry) {
		// 共通の統合タイプとコンテキストを作成する
		// これにより、コマンドをギルドやDMで使用できるようになります
		const integrationTypes: ApplicationIntegrationType[] = [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall];
		const contexts: InteractionContextType[] = [
			InteractionContextType.BotDM,
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel
		];

		// チャット入力コマンドの登録
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			integrationTypes,
			contexts
		});

		// どのメッセージからでも利用できるコンテキストメニューコマンドを登録する
		registry.registerContextMenuCommand({
			name: this.name,
			type: ApplicationCommandType.Message,
			integrationTypes,
			contexts
		});

		// どのユーザーでも使用できるコンテキストメニューコマンドを登録する
		registry.registerContextMenuCommand({
			name: this.name,
			type: ApplicationCommandType.User,
			integrationTypes,
			contexts
		});
	}

	// メッセージコマンド
	public override async messageRun(message: Message) {
		return this.sendPing(message);
	}

	// チャット入力（スラッシュ）コマンド
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		return this.sendPing(interaction);
	}

	// コンテキストメニューコマンド
	public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
		return this.sendPing(interaction);
	}

	private async sendPing(interactionOrMessage: Message | Command.ChatInputCommandInteraction | Command.ContextMenuCommandInteraction) {
		const pingMessage =
			interactionOrMessage instanceof Message
				? interactionOrMessage.channel?.isSendable() && (await interactionOrMessage.channel.send({ content: 'Ping?' }))
				: await interactionOrMessage.reply({ content: 'Ping?', fetchReply: true });

		if (!pingMessage) return;

		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
			pingMessage.createdTimestamp - interactionOrMessage.createdTimestamp
		}ms.`;

		if (interactionOrMessage instanceof Message) {
			return pingMessage.edit({ content });
		}

		return interactionOrMessage.editReply({
			content
		});
	}
}

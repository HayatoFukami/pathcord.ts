// 明示的に定義されていない限り、NODE_ENV を development に設定します。
process.env.NODE_ENV ??= 'development';

import { ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
import '@sapphire/plugin-logger/register';
import { setup } from '@skyra/env-utilities';
import * as colorette from 'colorette';
import { join } from 'node:path';
import { srcDir } from './constants';

// デフォルトの動作を一括上書きに設定する
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

// 環境変数の読み取り
setup({ path: join(srcDir, '.env') });

// カラーレットを有効にする
colorette.createColors({ useColor: true });

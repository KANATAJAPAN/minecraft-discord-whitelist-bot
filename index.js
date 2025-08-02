require('dotenv').config();
const { Client, Collection, GatewayIntentBits, REST, Routes, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();

// コマンドの読み込み
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
const commandsData = [];

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commandsData.push(command.data.toJSON());
  } else {
    console.warn(`[警告] ${file} は正しいコマンドモジュールではありません。`);
  }
}

// スラッシュコマンド登録用RESTクライアント
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('スラッシュコマンドをグローバル登録中...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commandsData },
    );
    console.log('スラッシュコマンドをグローバル登録しました。');
  } catch (error) {
    console.error('スラッシュコマンド登録中にエラーが発生しました:', error);
  }
})();

// イベント読み込み
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// interactionCreateイベントでコマンド実行
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error('コマンド実行時エラー:', err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'エラーが発生しました。', ephemeral: true });
    } else {
      await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
    }
  }
});

process.on('unhandledRejection', error => {
  console.error('未処理のPromise拒否:', error);
});
process.on('uncaughtException', error => {
  console.error('未処理の例外:', error);
});

client.login(process.env.BOT_TOKEN)
  .then(() => console.log('Botが起動しました。'))
  .catch(err => {
    console.error('Botの起動に失敗しました:', err);
    process.exit(1);
  });

module.exports = client;

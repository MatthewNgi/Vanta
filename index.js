require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Events,
  ChannelType,
  PermissionsBitField
} = require('discord.js');

const fs = require('fs');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Load config
const configPath = './data/config.json';

let config = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath))
  : {};

function saveConfig() {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

// READY EVENT
client.once(Events.ClientReady, () => {
  console.log(`⚙️ Vanta online as ${client.user.tag}`);
});

// INTERACTIONS
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const guildId = interaction.guildId;

  if (!config[guildId]) {
    config[guildId] = {
      personality: "default"
    };
  }

  const personality = config[guildId].personality;

  // 🔹 PING
  if (interaction.commandName === 'ping') {
    return interaction.reply('⚙️ Vanta: Pong.');
  }

  // 🔹 HELP
  if (interaction.commandName === 'help') {
    return interaction.reply(`
⚙️ **Vanta Commands**
/setup - Setup server system
/personality - Change bot style
/ticket - Create support ticket
/ping - Check bot status
    `);
  }

  // 🔹 SETUP SYSTEM
  if (interaction.commandName === 'setup') {
    const guild = interaction.guild;

    const category = await guild.channels.create({
      name: 'Vanta System',
      type: ChannelType.GuildCategory
    });

    await guild.channels.create({
      name: 'tickets',
      type: ChannelType.GuildText,
      parent: category.id
    });

    await guild.channels.create({
      name: 'logs',
      type: ChannelType.GuildText,
      parent: category.id
    });

    return interaction.reply('⚙️ Vanta setup complete.');
  }

  // 🔹 PERSONALITY SYSTEM
  if (interaction.commandName === 'personality') {
    const mode = interaction.options.getString('mode');

    config[guildId].personality = mode;
    saveConfig();

    return interaction.reply(`⚙️ Personality set to **${mode}**`);
  }

  // 🔹 TICKET SYSTEM
  if (interaction.commandName === 'ticket') {
    const guild = interaction.guild;

    const channel = await guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        }
      ]
    });

    return interaction.reply(`🎟️ Ticket created: ${channel}`);
  }
});

// LOGIN
client.login(process.env.TOKEN);
require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if Vanta is online'),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all commands'),

  new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup Vanta system in this server'),

  new SlashCommandBuilder()
    .setName('personality')
    .setDescription('Change Vanta personality')
    .addStringOption(option =>
      option.setName('mode')
        .setDescription('Choose mode')
        .setRequired(true)
        .addChoices(
          { name: 'default', value: 'default' },
          { name: 'dark', value: 'dark' },
          { name: 'funny', value: 'funny' }
        )),

  new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Create a support ticket')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Deploying commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Commands deployed!');
  } catch (err) {
    console.error(err);
  }
})();
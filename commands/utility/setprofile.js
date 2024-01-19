const { SlashCommandBuilder } = require('discord.js');
const Tables = require('../../dbInit.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setprofile')
        .setDescription('Set the active wishlist to be viewed and edited')
        .addIntegerOption(option =>
            option
                .setName('profile')
                .setDescription('A number between 1 and 3')
                .setRequired(true)),
    async execute(interaction) {
        const profile = interaction.options.getInteger('profile');
        if (profile <= 0 || profile > 3){
            return interaction.reply({ content: 'Must be between 1 and 3', ephemeral: true });
        }
        const user = await Tables.Users.findOne({ where: { username: interaction.user.username } });
        if (user) {
            await user.update({ active_profile: profile });
            return interaction.reply(`Set active wishlist to profile ${profile}`);
        } else {
            return interaction.reply('Set up your account first with the command: /setwishes');
        }
    },
};
const { SlashCommandBuilder } = require('discord.js');
const Tables = require('../../dbInit.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removechar')
        .setDescription('Remove a character from active wishlist.')
        .addStringOption(option =>
            option
                .setName('character')
                .setDescription('Character to remove')
                .setRequired(true)),
    async execute(interaction) {
        const charInput = interaction.options.getString('character');
        const user = await Tables.Users.findOne({ where: { username: interaction.user.username } });
        if (!user) {
            return interaction.reply('Set up your account first with the command: /setwishes');
        }

        const deletedChar = await Tables.Wishlist.destroy({ where: { username: interaction.user.username, profile: user.active_profile, target: charInput } });
        if (!deletedChar) return interaction.reply({ content: `Character not found in wishlist ${user.active_profile}`, ephemeral: true });
        return interaction.reply(`Removed ${charInput}`);
    },
};
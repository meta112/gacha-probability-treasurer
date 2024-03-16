const { SlashCommandBuilder } = require('discord.js');
const Tables = require('../../dbInit.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copylist')
        .setDescription('Copy a profile into another profile')
        .addIntegerOption(option =>
            option
                .setName('dest')
                .setDescription('Wishlist profile to overwrite')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('src')
                .setDescription('Wishlist profile to copy from')
                .setRequired(true)),
    async execute(interaction) {
        const dest = interaction.options.getInteger('dest');
        const src = interaction.options.getInteger('src');
        if (dest <= 0 || dest > 3 || src <= 0 || src > 3){
            return interaction.reply({ content: 'Must be between 1 and 3', ephemeral: true });
        }
        if (dest == src) return interaction.reply({ content: 'Must input different numbers', ephemeral: true });
        return interaction.reply('');
    },
};
const { SlashCommandBuilder } = require('discord.js');
const Tables = require('../../dbInit.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copylist')
        .setDescription('Remove a character from active wishlist.')
        .addStringOption(option =>
            option
                .setName('dest')
                .setDescription('Wishlist profile to overwrite')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('src')
                .setDescription('Wishlist profile to copy from')
                .setRequired(true)),
    async execute(interaction) {

        return interaction.reply('');
    },
};
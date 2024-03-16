const { SlashCommandBuilder } = require('discord.js');
const Tables = require('../../dbInit.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copylist')
        .setDescription('Copy a profile into another profile')
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
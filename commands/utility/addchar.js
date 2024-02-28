const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Tables = require('../../dbInit.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('addchar')
        .setDescription('Add a character to your active wishlist.'),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('newchar')
            .setTitle('Add a Character');

        const newTarget = new TextInputBuilder()
            .setCustomId('newTarget')
            .setLabel('Character:')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const cons = new TextInputBuilder()
            .setCustomId('cons')
            .setLabel('Desired constellation (assume currently own none):')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const versions_away = new TextInputBuilder()
            .setCustomId('versions_away')
            .setLabel('Number of versions away (e.g. 4.0 -> 4.2 is 2):')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const firsthalf = new TextInputBuilder()
            .setCustomId('firsthalf')
            .setLabel('Is the character banner in the first half? (yes/no)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const version = new TextInputBuilder()
            .setCustomId('version')
            .setLabel('Version:')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const actionRow1 = new ActionRowBuilder().addComponents(newTarget);
        const actionRow2 = new ActionRowBuilder().addComponents(cons);
        const actionRow3 = new ActionRowBuilder().addComponents(versions_away);
        const actionRow4 = new ActionRowBuilder().addComponents(firsthalf);
        const actionRow5 = new ActionRowBuilder().addComponents(version);

        modal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4, actionRow5);
        await interaction.showModal(modal);
    },
};
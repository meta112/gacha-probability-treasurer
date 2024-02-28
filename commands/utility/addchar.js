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
            .setLabel('Desired constellation:')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const versions_away = new TextInputBuilder()
            .setCustomId('versions_away')
            .setLabel('Number of version changes away:')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const firsthalf = new TextInputBuilder()
            .setCustomId('firsthalf')
            .setLabel('Is the character in the first half? (yes/no)')
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
    async process(interaction) {
        const newTarget = interaction.fields.getTextInputValue('newTarget');
        const cons = parseInt(interaction.fields.getTextInputValue('cons'));
        const versions_away = parseInt(interaction.fields.getTextInputValue('versions_away'));
        const firsthalf = interaction.fields.getTextInputValue('firsthalf');
        const version = interaction.fields.getTextInputValue('version');

        let user = await Tables.Users.findOne({ where: { username: interaction.user.username } });
        if (!user) {
            try {
                user = await Tables.Users.create({
                    username: interaction.user.username,
                });
                interaction.reply(`Adding new user ${user.username}`);
            } catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    return interaction.reply('Error: tried to create duplicate user');
                }
                return interaction.reply('Something went wrong with updating user.');
            }
        }
        const character = await Tables.Wishlist.findOne({ where: { username: interaction.user.username, profile: user.active_profile, target: newTarget } });
        if (character) {
            return interaction.reply(`${newTarget} is already in ${interaction.user.username}'s profile ${user.active_profile}.`);
        }


        if (!Number.isInteger(cons) || cons < 0){
            await interaction.reply({ content: 'Constellation must be a non-negative integer', ephemeral: true });
        } else if (!Number.isInteger(versions_away) || versions_away < 0) {
            await interaction.reply({ content: 'Versions away must be a non-negative integer', ephemeral: true });
        } else if (typeof firsthalf !== 'string' || firsthalf.length == 0
        || (firsthalf.trim().toLowerCase() !== 'yes' && firsthalf.trim().toLowerCase() !== 'no')){
            await interaction.reply({ content: 'Type "yes" or "no" to answer if the character is in the first half or not', ephemeral: true });
        } else {
            try {
                const newChar = await Tables.Wishlist.create({
                    username: interaction.user.username,
                    profile: user.active_profile,
                    target: newTarget,
                    cons: cons,
                    versions_away: versions_away,
                    firsthalf: (firsthalf.trim().toLowerCase() === 'yes' ? true : false),
                    version: version,
                });
                return interaction.reply(`Adding ${newChar.target} to ${interaction.user.username}'s profile ${user.active_profile}.`);
            } catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    return interaction.reply('Error: tried to create duplicate user');
                }
                return interaction.reply('Something went wrong with updating user.');
            }
        }
    },
};
const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Tables = require('../../dbInit.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('editchar')
        .setDescription('Edit a character in your active wishlist.')
        .addStringOption(option =>
            option
                .setName('character')
                .setDescription('Character to edit')
                .setRequired(true)),
    async execute(interaction) {

        const charInput = interaction.options.getString('character');
        const user = await Tables.Users.findOne({ where: { username: interaction.user.username } });
        if (!user) {
            return interaction.reply('Set up your account first with the command: /setwishes');
        }
        const character = await Tables.Wishlist.findOne({ where: { username: interaction.user.username, profile: user.active_profile, target: charInput } });
        if (!character) {
            return interaction.reply(`${charInput} not found in ${interaction.user.username}'s profile ${user.active_profile}.`);
        }

        const modal = new ModalBuilder()
            .setCustomId(`editchar_${charInput}`)
            .setTitle('Edit a Character');

        const target = new TextInputBuilder()
            .setCustomId('target')
            .setLabel('Character:')
            .setStyle(TextInputStyle.Short)
            .setValue(`${charInput}`)
            .setRequired(true);

        const cons = new TextInputBuilder()
            .setCustomId('cons')
            .setLabel('Desired constellation:')
            .setStyle(TextInputStyle.Short)
            .setValue(`${character.cons}`)
            .setRequired(true);

        const versions_away = new TextInputBuilder()
            .setCustomId('versions_away')
            .setLabel('Number of version changes away:')
            .setStyle(TextInputStyle.Short)
            .setValue(`${character.versions_away}`)
            .setRequired(true);

        const firsthalf = new TextInputBuilder()
            .setCustomId('firsthalf')
            .setLabel('Is the character in the first half? (yes/no)')
            .setStyle(TextInputStyle.Short)
            .setValue(`${character.firsthalf ? 'yes' : 'no'}`)
            .setRequired(true);

        const version = new TextInputBuilder()
            .setCustomId('version')
            .setLabel('Version:')
            .setStyle(TextInputStyle.Short)
            .setValue(`${character.version}`)
            .setRequired(true);

        const actionRow1 = new ActionRowBuilder().addComponents(target);
        const actionRow2 = new ActionRowBuilder().addComponents(cons);
        const actionRow3 = new ActionRowBuilder().addComponents(versions_away);
        const actionRow4 = new ActionRowBuilder().addComponents(firsthalf);
        const actionRow5 = new ActionRowBuilder().addComponents(version);

        modal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4, actionRow5);
        await interaction.showModal(modal);
    },
    async process(interaction, origname) {
        const target = interaction.fields.getTextInputValue('target');
        const cons = parseInt(interaction.fields.getTextInputValue('cons'));
        const versions_away = parseInt(interaction.fields.getTextInputValue('versions_away'));
        const firsthalf = interaction.fields.getTextInputValue('firsthalf');
        const version = interaction.fields.getTextInputValue('version');

        const user = await Tables.Users.findOne({ where: { username: interaction.user.username } });
        const character = await Tables.Wishlist.findOne({ where: { username: interaction.user.username, profile: user.active_profile, target: origname } });

        if (!Number.isInteger(cons) || cons < 0){
            await interaction.reply({ content: 'Constellation must be a non-negative integer', ephemeral: true });
        } else if (!Number.isInteger(versions_away) || versions_away < 0) {
            await interaction.reply({ content: 'Versions away must be a non-negative integer', ephemeral: true });
        } else if (typeof firsthalf !== 'string' || firsthalf.length == 0
        || (firsthalf.trim().toLowerCase() !== 'yes' && firsthalf.trim().toLowerCase() !== 'no')){
            await interaction.reply({ content: 'Type "yes" or "no" to answer if the character is in the first half or not', ephemeral: true });
        } else {
            try {
                await character.update({ username: interaction.user.username,
                                        profile: user.active_profile,
                                        target: target,
                                        cons: cons,
                                        versions_away: versions_away,
                                        firsthalf: (firsthalf.trim().toLowerCase() === 'yes' ? true : false),
                                        version: version });
                    return interaction.reply(`Edited ${character.target} in ${interaction.user.username}'s profile ${user.active_profile}.`);
            } catch (e) {
                return interaction.reply('Something went wrong with updating wishlist.');
            }
        }
    },
};
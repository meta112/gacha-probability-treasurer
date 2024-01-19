const { SlashCommandBuilder } = require('discord.js');
const Tables = require('../../dbInit.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeversion')
        .setDescription('Remove a specified version from the version list')
        .addNumberOption(option =>
            option
                .setName('version')
                .setDescription('Version number e.g. 4.4 or 5.0')
                .setRequired(true)),
    async execute(interaction) {
        let versionInput = interaction.options.getNumber('version');
        if (Number.isInteger(versionInput)) {
            versionInput = versionInput.toString() + '.0';
        } else {
            versionInput = versionInput.toString();
        }
        const deletedVersion = await Tables.Versions.destroy({ where: { version: versionInput } });
        if (!deletedVersion) return interaction.reply({ content: 'That version doesn\'t exist', ephemeral: true });
        return interaction.reply(`Deleted Version ${versionInput}`);
    },
};
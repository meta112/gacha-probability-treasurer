const { SlashCommandBuilder } = require('discord.js');
const Tables = require('../../dbInit.js');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('defineversion')
        .setDescription('Set the release date (MM/DD/YYYY) for a given version')
        .addNumberOption(option =>
            option
                .setName('version')
                .setDescription('Version number e.g. 4.4 or 5.0')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('date')
                .setDescription('Release date of version (format: MM/DD/YYYY)')
                .setRequired(true)),
    async execute(interaction) {

        let versionInput = interaction.options.getNumber('version');
        if (versionInput < 1) return interaction.reply({ content: 'Version should be at least 1.0', ephemeral: true });
        const dateStr = interaction.options.getString('date');
        if (dateStr.length != 10 || !Number.isInteger(parseInt(dateStr[0])) || !Number.isInteger(parseInt(dateStr[1])) ||
        !Number.isInteger(parseInt(dateStr[3])) || !Number.isInteger(parseInt(dateStr[4])) || !Number.isInteger(parseInt(dateStr[6])) ||
        !Number.isInteger(parseInt(dateStr[7])) || !Number.isInteger(parseInt(dateStr[8])) || !Number.isInteger(parseInt(dateStr[9])) ||
        dateStr[2] !== '/' || dateStr[5] !== '/'){
            return interaction.reply({ content: 'Date must have format MM/DD/YYYY', ephemeral: true });
        }
        const date = new Date(dateStr);
        if (isNaN(date)){
            return interaction.reply({ content: 'Invalid date entered', ephemeral: true });
        }

        if (Number.isInteger(versionInput)) {
            versionInput = versionInput.toString() + '.0';
        } else {
            versionInput = versionInput.toString();
        }
        const version = await Tables.Versions.findOne({ where: { version: versionInput } });
        if (version) {
            await version.update({ date: date });
            return interaction.reply(`Set Version ${versionInput} to start ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`);
        } else {
            try {
                await Tables.Versions.create({ version: versionInput, date: date });
                return interaction.reply(`Set Version ${versionInput} to start ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`);
            } catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    return interaction.reply('Error: tried to create duplicate entry');
                }
                return interaction.reply('Something went wrong with updating version.');
            }
        }
    },
};
const { SlashCommandBuilder } = require('discord.js');
const Tables = require('../../dbInit.js');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
module.exports = {
    data: new SlashCommandBuilder()
        .setName('versionlist')
        .setDescription('Display all set starting dates of versions'),
    async execute(interaction) {

        const versionList = await Tables.Versions.findAll();
        versionList.sort((a, b) => a.date - b.date);
        let result = 'Defined versions:';
        for (let i = 0; i < versionList.length; i++){
            result =
`${result}
Version ${versionList[i].version} starts on ${months[versionList[i].date.getMonth()]} ${versionList[i].date.getDate()}, ${versionList[i].date.getFullYear()}`;
        }
        return interaction.reply(result);
    },
};
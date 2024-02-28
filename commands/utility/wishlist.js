const { SlashCommandBuilder } = require('discord.js');
const Tables = require('../../dbInit.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wishlist')
        .setDescription('Display current wishlist. Change the active list to edit with /setprofile'),
    async execute(interaction) {
        const user = await Tables.Users.findOne({ where: { username: interaction.user.username } });
        if (!user) return interaction.reply({ content: 'Wishlist empty', ephemeral: true });

        const wishlist = await Tables.Wishlist.findAll({ where: { username: interaction.user.username, profile: user.active_profile } });

        wishlist.sort((a, b) => a.versions_away - b.versions_away);
        let result = `${interaction.user.username}'s wishlist ${user.active_profile}:`;
        for (let i = 0; i < wishlist.length; i++){
            const c = wishlist[i];
            result =
`${result}
- ${c.target} C${c.cons}:   ${c.firsthalf ? 'first' : 'second'} half of Version ${c.version}, in ${c.versions_away} versions`;
        }
        return interaction.reply(result);
    },
};
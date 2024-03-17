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

        await Tables.Wishlist.destroy({ where: { username: interaction.user.username, profile: dest } });
        const chars = await Tables.Wishlist.findAll({ where: { username: interaction.user.username, profile: src } });
        try {
            console.log(`entering try: ${chars}`);
            for (let i = 0; i < chars.length; i++){
                console.log(i);
                const c = chars[i];
                const newchar = await Tables.Wishlist.create({
                    username: interaction.user.username,
                    profile: dest,
                    target: c.target,
                    cons: c.cons,
                    versions_away: c.versions_away,
                    firsthalf: c.firsthalf,
                    version: c.version,
                });
                console.log(`Copying ${c.target} as ${newchar.target}`);
            }
            return interaction.reply(`Copied Wishlist ${src} into Wishlist ${dest}.`);
        } catch (e) {
            return interaction.reply('Something went wrong with updating wishlist.');
        }
    },
};
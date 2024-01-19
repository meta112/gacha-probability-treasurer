const { SlashCommandBuilder } = require('discord.js');
const Tables = require('../../dbInit.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewme')
        .setDescription('View your current pity and number of Primogems, Starglitters, and Fates.'),
    async execute(interaction) {

        const user = await Tables.Users.findOne({ where: { username: interaction.user.username } });
        if (!user){
            return interaction.reply({ content: 'User not found' });
        }
        const result =
`Editing wishlist ${user.active_profile}

My Wish Bank Account: 
${user.primogems} Primogems
${user.starglitter} Masterless Starglitter
${user.fates} Intertwined Fates
${user.pity} pity with ${user.guaranteed ? '' : 'no '}guarantee
        
Total wishes: ${user.primogems / 160 + user.starglitter / 5 + user.fates}`;

        await interaction.reply(result);

    },
};
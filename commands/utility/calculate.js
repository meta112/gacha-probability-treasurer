const { SlashCommandBuilder } = require('discord.js');
const Tables = require('../../dbInit.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calculate')
		.setDescription('Simulates wishes to find probability of achieving wishlist')
        .addIntegerOption(option =>
            option
                .setName('futurewishes')
                .setDescription('Number of wishes you expect to gain by the end. If empty, will be estimated based on version dates.')),
	async execute(interaction) {
        await interaction.deferReply();
        let rand = 0;
        let three = 0;
        let four = 0;
        let five = 0;
        let pity4 = 0;
        let pity5 = 0;
        let softpity = 0;

        const user = await Tables.Users.findOne({ where: { username: interaction.user.username } });
        if (!user){
            return interaction.reply({ content: 'User not found' });
        }
        // calculate number of wishes
        const primogems = user.primogems;
        const fates = user.fates;
        const starglitter = user.starglitter;
        let n = parseInt(primogems / 160 + fates + starglitter / 5);
        const fwInput = interaction.options.getInteger('futurewishes');
        if (fwInput) {
            if (fwInput >= 0) {
                n += fwInput;
            } else {
                return interaction.editReply('Cannot enter negative number.');
            }
        }

        console.log(n);
        //

        let result = `You pulled ${n} times and got:`;
        for (let i = 0; i < n; i++){
            if (pity5 > 73){
                softpity = (pity5 - 73) * 60;
            } else {
                softpity = 0;
            }
            rand = Math.floor(Math.random() * 1000 + 1);

            if (rand > 1000 - 6 - softpity){
                five++;
                pity5 = 0;
                pity4++;
            } else if (pity4 >= 9 || rand > 1000 - 6 - softpity - 51){
                    four++;
                    pity5++;
                    pity4 = 0;
            } else {
                three++;
                pity4++;
                pity5++;
            }
        }
        const pthree = three / (n * 10) * 100;
        const pfour = four / (n * 10) * 100;
        const pfive = five / (n * 10) * 100;
        result = `${result}
${five} 5-stars
${four} 4-stars
${three} 3-stars
Proportion of each rarity:
${pfive.toPrecision(3)}% 5-star
${pfour.toPrecision(3)}% 4-star
${pthree.toPrecision(4)}% 3-star`;

        await interaction.editReply(result);
	},
};
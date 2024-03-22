const { SlashCommandBuilder } = require('discord.js');
const Tables = require('../../dbInit.js');

function numwishes(interaction){
    const user = Tables.Users.findOne({ where: { username: interaction.user.username } });
    if (!user){
        console.log('User not found');
        return null;
    }
    console.log(`Found user ${interaction.user.username}`);
    return 5;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calculate')
		.setDescription('Simulates wishes to find probability of achieving wishlist'),
	async execute(interaction) {
        await interaction.deferReply();
        let rand = 0;
        let three = 0;
        let four = 0;
        let five = 0;
        let pity4 = 0;
        let pity5 = 0;
        let softpity = 0;
        // placeholder n
        const n = numwishes(interaction);
        let result = `You pulled ${n} times and got:`;
        for (let i = 0; i < n; i++){
            for (let j = 0; j < 10; j++){
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
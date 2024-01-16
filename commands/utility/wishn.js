const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wishn')
		.setDescription('Simulates n 10-pull wishes with no 4* or 5* pity and outputs the wish stats')
        .addIntegerOption(option =>
            option
                .setName('n')
                .setDescription('Number of 10-pulls')
                .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        let rand = 0;
        let three = 0;
        let four = 0;
        let five = 0;
        const n = interaction.options.getInteger('n');
        let result = `You pulled ${n * 10} times and got:`;
        for (let i = 0; i < n; i++){
            for (let j = 0; j < 10; j++){
                rand = Math.floor(Math.random() * 1000 + 1);
                if (rand <= 943){
                    three++;
                } else if (rand <= 994){
                    four++;
                } else {
                    five++;
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
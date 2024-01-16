const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wish')
		.setDescription('Simulates a 10-pull wish with no pity'),
	async execute(interaction) {
        await interaction.deferReply();
        let rand = 0;
        let result = 'You got:';
        let pity4 = false;
        for (let i = 0; i < 10; i++){
            rand = Math.floor(Math.random() * 1000 + 1);
            if (i == 9 && !pity4){
                if (rand <= 994){
                    result = `${result}
                    4*`;
                } else {
                    result = `${result}
                    5*`;
                }
            } else if (rand <= 943){
                result = `${result}
                3*`;
            } else if (rand <= 994){
                result = `${result}
                4*`;
                pity4 = true;
            } else {
                result = `${result}
                5*`;
                pity4 = true;
            }
        }

        await interaction.editReply(result);
	},
};
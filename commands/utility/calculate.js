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

        const user = await Tables.Users.findOne({ where: { username: interaction.user.username } });
        if (!user){
            return interaction.reply({ content: 'User not found' });
        }

        let rand = 0;
        let pity4 = 0;
        let pity5 = user.pity;
        let softpity = 0;
        let guarantee = user.guaranteed;

        // calculate number of wishes

        const primogems = user.primogems;
        const fates = user.fates;
        const starglitter = user.starglitter;
        let n = Math.floor(primogems / 160) + fates + Math.floor(starglitter / 5);

        const wishlist = await Tables.Wishlist.findAll({ where: { username: interaction.user.username, profile: user.active_profile } });
        wishlist.sort((a, b) => a.versions_away - b.versions_away);
        let targetcount = 0;
        for (let i = 0; i < wishlist.length; i++){
            targetcount += (wishlist[i].cons + 1);
        }

        const targetarr = new Array(targetcount);
        const wishcountarr = new Array(targetcount);
        const simresultarr = new Array(targetcount);
        const currdate = new Date();
        const msInDay = 1000 * 60 * 60 * 24;
        targetcount = 0;
        for (let i = 0; i < wishlist.length; i++){
            const version = await Tables.Versions.findOne({ where: { version: wishlist[i].version } });
            if (!version){
                return interaction.editReply(`Version ${wishlist[i].version} not found for ${wishlist[i].target}`);
            }
            const versiondate = new Date(version.date);
            if (!(wishlist[i].firsthalf)) versiondate.setDate(versiondate.getDate() + 21);
            let monthdiff = ((versiondate.getFullYear() - currdate.getFullYear()) * 12 - currdate.getMonth() + versiondate.getMonth());
            monthdiff = monthdiff < 0 ? 0 : monthdiff;
            const primodailies = Math.floor((versiondate - currdate) / msInDay) * 60;
            const primoabyss = (monthdiff * 2 + (currdate.getDate() <= 15 ? 1 : 0) - (versiondate.getDate() <= 15 ? 1 : 0)) * 600;
            const fateshop = monthdiff * 5;
            const primopatches = 20 * 4 + 300 + 600 + 60;
            let primoevents = wishlist[i].versions_away * 2260;
            const currverprogress = Math.floor((version.date - currdate) / msInDay) % 42;
            if (currverprogress <= 7) {
                primoevents += 2260;
            } else if (currverprogress <= 20) {
                primoevents += 1695;
            } else if (currverprogress <= 26) {
                primoevents += 1130;
            } else if (currverprogress <= 35) {
                primoevents += 565;
            }
            if (!(wishlist[i].firsthalf)){
                primoevents += 1130;
            }

            for (let con = 0; con <= wishlist[i].cons; con++){
                targetarr[targetcount] = `${wishlist[i].target} C${con}`;
                wishcountarr[targetcount] = n + Math.floor((primodailies + primoabyss + primopatches + primoevents) / 160)
                                            + fateshop;
                simresultarr[targetcount] = 0;
                targetcount++;
            }
        }
        const fwInput = interaction.options.getInteger('futurewishes');
        if (fwInput) {
            if (fwInput >= 0) {
                n += fwInput;
                for (let i = 0; i < wishcountarr.length; i++){
                    wishcountarr[i] = n;
                }
            } else {
                return interaction.editReply('Cannot enter negative number.');
            }
        }

        console.log(n);
        //
        const numSimulations = 1000000;
        const maxrolls = wishcountarr[wishcountarr.length - 1];
        for (let test1 = 0; test1 < wishcountarr.length; test1++){
            console.log(wishcountarr[test1]);
        }
        console.log(`${typeof maxrolls} ${maxrolls}`);

        const oldpity4 = pity4;
        const oldpity5 = pity5;

        const oldguarantee = guarantee;

        let result = `You pulled ${maxrolls} times!`;
        if (fwInput) {
            result =
`Warning: Manually estimating wish gain may not be accurate for targets at different dates.

${result}`;
        }
        for (let sim = 0; sim < numSimulations; sim++) {
            targetcount = 0;
            pity4 = oldpity4;
            pity5 = oldpity5;

            guarantee = oldguarantee;
            for (let i = 1; i <= maxrolls; i++){
                if (pity5 > 73){
                    softpity = (pity5 - 73) * 60;
                } else {
                    softpity = 0;
                }
                rand = Math.floor(Math.random() * 1000 + 1);
                while (targetcount < wishcountarr.length && i > wishcountarr[targetcount]) targetcount++;
                if (targetcount >= wishcountarr.length) break;
                if (rand > 1000 - 6 - softpity){
                    pity5 = 0;
                    pity4++;

                    const win5050 = Math.floor(Math.random() * 2);
                    if (guarantee || win5050 == 1){
                        simresultarr[targetcount]++;
                        guarantee = false;
                        targetcount++;
                        if (targetcount >= wishcountarr.length) break;
                    } else {
                        guarantee = true;
                    }
                } else if (pity4 >= 9 || rand > 1000 - 6 - softpity - 51){
                        pity5++;
                        pity4 = 0;
                } else {
                    pity4++;
                    pity5++;
                }

            }
        }
        result = `${result}
Probability of rolling wishlist targets:
`;
        for (let i = 0; i < simresultarr.length; i++){
            result = `${result}
${targetarr[i]}: ${(simresultarr[i] / numSimulations * 100).toPrecision(3)}%`;
        }
        /*
        result = `${result}
${five} 5-stars
${four} 4-stars
${three} 3-stars
Proportion of each rarity:
${pfive.toPrecision(3)}% 5-star
${pfour.toPrecision(3)}% 4-star
${pthree.toPrecision(4)}% 3-star`;
*/

        await interaction.editReply(result);
	},
};
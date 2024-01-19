const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Tables = require('../../dbInit.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwishes')
        .setDescription('Set your current pity and number of Primogems, Starglitters, and Fates.'),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('wishbank')
            .setTitle('Wish Bank Account');

        const user = await Tables.Users.findOne({ where: { username: interaction.user.username } });

        const primogemInput = new TextInputBuilder()
            .setCustomId('primogemInput')
            .setLabel('Number of Primogems:')
            .setStyle(TextInputStyle.Short)
            .setValue(user ? user.primogems.toString() : '0')
            .setRequired(true);

        const starglitterInput = new TextInputBuilder()
            .setCustomId('starglitterInput')
            .setLabel('Amount of Starglitter:')
            .setStyle(TextInputStyle.Short)
            .setValue(user ? user.starglitter.toString() : '0')
            .setRequired(true);

        const fateInput = new TextInputBuilder()
            .setCustomId('fateInput')
            .setLabel('Number of Intertwined Fates:')
            .setStyle(TextInputStyle.Short)
            .setValue(user ? user.fates.toString() : '0')
            .setRequired(true);

        const pityInput = new TextInputBuilder()
            .setCustomId('pityInput')
            .setLabel('Pity count:')
            .setStyle(TextInputStyle.Short)
            .setValue(user ? user.pity.toString() : '0')
            .setRequired(true);

        const guaranteedInput = new TextInputBuilder()
            .setCustomId('guaranteedInput')
            .setLabel('Do you have guaranteed on 50/50? (yes/no)')
            .setStyle(TextInputStyle.Short)
            .setValue(user ? (user.guaranteed ? 'yes' : 'no') : 'no')
            .setRequired(true);

        const actionRow1 = new ActionRowBuilder().addComponents(primogemInput);
        const actionRow2 = new ActionRowBuilder().addComponents(starglitterInput);
        const actionRow3 = new ActionRowBuilder().addComponents(fateInput);
        const actionRow4 = new ActionRowBuilder().addComponents(pityInput);
        const actionRow5 = new ActionRowBuilder().addComponents(guaranteedInput);

        modal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4, actionRow5);
        await interaction.showModal(modal);
    },
    async process(interaction) {
        const primos = parseFloat(interaction.fields.getTextInputValue('primogemInput'));
        const starglitter = parseFloat(interaction.fields.getTextInputValue('starglitterInput'));
        const fates = parseFloat(interaction.fields.getTextInputValue('fateInput'));
        const pity = parseFloat(interaction.fields.getTextInputValue('pityInput'));
        const guaranteed = interaction.fields.getTextInputValue('guaranteedInput');
        console.log(`${primos} ${typeof primos} ${starglitter} ${typeof starglitter} ${fates} ${typeof fates} ${pity} ${typeof pity} ${guaranteed} ${typeof guaranteed}`);

        if (!Number.isInteger(primos) || !Number.isInteger(starglitter) || !Number.isInteger(fates) || !Number.isInteger(pity)){
            await interaction.reply({ content: 'Inputs must be numbers', ephemeral: true });
        } else if (primos < 0 || starglitter < 0 || fates < 0 || pity < 0) {
            await interaction.reply({ content: 'Numbers must not be negative', ephemeral: true });
        } else if (pity > 89) {
            await interaction.reply({ content: 'Pity must be below 90', ephemeral: true });
        } else if (typeof guaranteed !== 'string' || guaranteed.length == 0
        || (guaranteed.trim().toLowerCase() !== 'yes' && guaranteed.trim().toLowerCase() !== 'no')){
            await interaction.reply({ content: `Type 'yes' or 'no' to answer if you have the 50/50 guarantee or not ${typeof guaranteed}`, ephemeral: true });
        } else {
            const user = await Tables.Users.findOne({ where: { username: interaction.user.username } });
            if (user) {
                await user.update({ primogems: primos, starglitter: starglitter, fates: fates, pity: pity,
                guaranteed: (guaranteed.trim().toLowerCase() === 'yes' ? true : false) });
                return interaction.reply(`User ${interaction.user.username} updated their wish bank account`);
            } else {
                try {
                    const newUser = await Tables.Users.create({
                        username: interaction.user.username,
                        primogems: primos,
                        starglitter: starglitter,
                        fates: fates,
                        pity: pity,
                        guaranteed: (guaranteed.trim().toLowerCase() === 'yes' ? true : false),
                    });
                    return interaction.reply(`New user ${newUser.username} set their wish bank account`);
                } catch (e) {
                    if (e.name === 'SequelizeUniqueConstraintError') {
                        return interaction.reply('Error: tried to create duplicate user');
                    }
                    return interaction.reply('Something went wrong with updating user.');
                }
            }
        }
    },
};
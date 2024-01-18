const { Events } = require('discord.js');

const Tables = require ('../dbInit.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        Tables.Users.sync();
        Tables.Versions.sync();
        Tables.Wishlist.sync();
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
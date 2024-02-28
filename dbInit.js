// run this once to initialize the database

const Sequelize = require('sequelize');


const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

module.exports = {
    Users: sequelize.define('users', {
        username: {
            type: Sequelize.STRING,
            unique: true,
        },
        active_profile: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
        primogems: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        starglitter: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        fates: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        pity: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        guaranteed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    }),
    Wishlist: sequelize.define('wishlist', {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        profile: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        target: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        cons: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        versions_away: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        firsthalf: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        version: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }),
    Versions: sequelize.define('versions', {
        version: {
            type: Sequelize.STRING,
            unique: true,
        },
        date: {
            type: Sequelize.DATE,
            unique: true,
        },
    }),
};

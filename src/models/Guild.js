const mongoose = require('mongoose');

const GuildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        default: '!'
    },
    roles: [{
        roleId: String,
        level: Number
    }],
    channels: [{
        channelId: String,
        type: String
    }],
    commands: [{
        name: String,
        description: String,
        category: String,
        usage: String,
        aliases: [String],
        permissions: [String],
        roles: [String],
        channels: [String],
        cooldown: Number,
        enabled: Boolean
    }]
});


module.exports = mongoose.model('Guild', GuildSchema);
const mongoose = require('mongoose');

const GuildSchema = new mongoose.Schema({
    id: { 
        type: String,
        required: true 
    },
    name: String,
    icon: String,
    owner: Boolean,
    permissions: Number,
    features: [String],
    permissions_new: String,
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
}, { _id : false });

const UserSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true
    },
    username: String,
    discriminator: String,
    avatar: String,
    guilds: [GuildSchema] // an array of subdocuments
});

module.exports = mongoose.model('User', UserSchema);

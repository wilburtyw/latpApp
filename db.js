const { default: mongoose } = require('mongoose');

require('dotenv').config()

// user object
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    items_buy: [{ type: String, ref: 'Item_buy.title' }],
    items_share: [{ type: String, ref: 'Item_share.title' }],
});

const settingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    zipcodeList: [{ type: String }],
    yearRange: { type: [Number], min: 2010, max: 2022 },
    transparency: { type: Number, min: 0, max: 1 },
    mapType: { type: String, enum: ['heat', 'bubble', 'chropleth'] },
    colorPalette: { type: String, enum: ['blue', 'red', 'yellow'] },
});

const userSettingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    settings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Setting' }]
});

const User = mongoose.model('User', userSchema);
const Setting = mongoose.model('Settings', settingSchema)
const UserSettings = mongoose.model('UserSettings', userSettingSchema);

module.exports = {
    User,
    Setting,
    UserSettings
}

// Using cloud database
mongoose.connect(process.env.DB);
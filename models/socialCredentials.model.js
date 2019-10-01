const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialCredentialsSchema = new Schema({
    uid: String,
    provider: String
});

const SocialCredentials = mongoose.model('SocialCredentials', SocialCredentialsSchema);
module.exports = SocialCredentials;
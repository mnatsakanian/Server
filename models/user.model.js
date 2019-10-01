const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
    email: String,
    hash: String,
    firstName: String,
    lastName: String,
    birthDate: String,
    imageUrl: String,
    assignedTests: [{ type: ObjectId, ref: 'Test' }],
    completedTests: [{ type: ObjectId, ref: 'Test'}],
    permissions: [ String ],
    socials: [{ type: ObjectId, ref: 'SocialCredentials' }]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
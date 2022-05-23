const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const review = require('./review')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    avi: String,
    displayName: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
    ],
    bio: String,
    platform: String,
    //when the admin boolean is set to true it allows users to edit and delete games
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
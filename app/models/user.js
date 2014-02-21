'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    about: String,
    website: {
        type: String
    },
    location: String,
    tags: [
        {type: String, lowercase: true, trim: true}
    ],
    meta: {
        updated_at: Date,
        last_visit: Date
    },
    providers:{
        facebook_id: String
    }
});

UserSchema.pre('save', function (next) {
    this.updated_at = new Date;
    if (!this.created_at) {
        this.created_at = new Date;
    }
    next();
});

mongoose.model('User', UserSchema);
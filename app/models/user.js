'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    userId:{
        type: String,
        required: true,
        unique: true
    },
    data: {
        username: {
            type: String,
            required: true
        },
        name: String,
        email: {
            type: String,
            required: true,
            unique: true
        },
        about: String,
        website: {
            type: String
        },
        location: {
            city: String,
            state: String,
            longitude: String,
            latitude: String
        },
        tags: [
            {type: String, lowercase: true, trim: true}
        ],
        meta: {
            updated_at: Date,
            last_visit: Date
        }
    },
    providers:{
        facebook_id: {
            type: String,
            unique: true
        }
    }
});

UserSchema.pre('save', function (next) {
    this.data.meta.updated_at = new Date;
    if (!this.data.meta.created_at) {
        this.data.meta.created_at = new Date;
    }
    next();
});

var model = mongoose.model('User', UserSchema);
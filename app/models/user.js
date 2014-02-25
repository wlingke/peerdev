'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    data: {
        userId:{
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
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
            created_at: Date
        },
        model_type: String
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
    if(!this.data.model_type){
        this.data.model_type = "user";
    }
    next();
});

var model = mongoose.model('User', UserSchema);
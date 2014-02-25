'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('validator');

var validateMsg = function(append){
    return "'{PATH}': '{VALUE}' " + append;
}

var UserSchema = new Schema({
    data: {
        userId:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: [function(val){
                return validator.isLength(val, 0, 30) && /^[a-z\d]*$/i.test(val);
            }, validateMsg('must be less than length 30 and only contain alphanumerics.')]
        },
        username: {
            type: String,
            required: true,
            validate: [function(val){
                return validator.isLength(val, 0, 30) && /^[a-z\d.]*$/i.test(val);
            }, validateMsg('must be less than length 30 and only contain alphanumeric and the period.')]
        },
        name: {
            type: String,
            required: true,
            validate: [function(val){
                return validator.isLength(val, 0, 80);
            }, validateMsg('length cannot exceed 80.')]
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [function(val){
                return validator.isEmail(val) && validator.isLength(0,255);
            }, validateMsg('must be an email with length less than 255')]
        },
        about: {
            type: String,
            validate: [function(val){
                //front end only allows 1000, but allowing extra here for some buffer
                return validator.isLength(0, 1500);
            }, validateMsg('length cannot exceed 1500')]
        },
        website: {
            type: String,
            validate: [function(val){
                return validator.isURL(val, {protocols: ['http', 'https']})
            }, validateMsg('must be a URL with protocol http or https')]
        },
        location: {
            city: {
                type: String,
                validate: [function(val){
                    return validator.isLength(val,0, 50);
                }, validateMsg('length cannot exceed 50')]
            },
            state: {
                type: String,
                validate: [function(val){
                    return validator.isLength(0,20);
                }, validateMsg('length cannot exceed 20')]
            },
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
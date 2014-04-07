'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('validator'),
    AlchemyAPI = require('app/alchemyapi/alchemyapi'),
    alchemyapi = new AlchemyAPI(),
    _ = require('lodash'),
    MAX_KEYS = 30;

var validateMsg = function (append) {
    return "'{PATH}': '{VALUE}' " + append;
}

var ProjectSchema = new Schema({

    title: {
        type: String,
        required: true,
        validate: [function (val) {
            return validator.isLength(val, 0, 200);
        }, validateMsg('length cannot exceed 200.')]
    },
    description: {
        type: String,
        required: true,
        validate: [function (val) {
            //front end only allows 5000, but allowing extra here for some buffer
            return validator.isLength(val, 0, 6000);
        }, validateMsg('length cannot exceed 6000')]
    },
    website: {
        type: String,
        validate: [function (val) {
            //added length validator to allow for empty
            return validator.isURL(val, {protocols: ['http', 'https'], require_protocol: true}) || validator.isLength(val, 0, 0)
        }, validateMsg('must be a URL with protocol http or https')]
    },
    why_join: {
        type: String,
        validate: [function (val) {
            //front end only allows 2500, but allowing extra here for some buffer
            return validator.isLength(val, 0, 3000);
        }, validateMsg('length cannot exceed 3000')]
    },
    is_paid: Boolean,
    work_from: {
        type: String,
        validate: [function (val) {
            return validator.isLength(val, 0, 20);
        }, validateMsg('length cannot exceed 20')]
    },
    city: {
        type: String,
        validate: [function (val) {
            return validator.isLength(val, 0, 50);
        }, validateMsg('length cannot exceed 50')]
    },
    state: {
        type: String,
        validate: [function (val) {
            return validator.isLength(val, 0, 20);
        }, validateMsg('length cannot exceed 20')]
    },
    loc: {
        type: [Number], //longitude, latitude
        validate: [function (val) {
            val = val || [];
            //array is instantiated but is not required so need to allow length = 0 case.
            return val.length === 0 || val.length === 2;
        }, validateMsg('must be an array of length 2')]

    },
    tags: {
        type: [
            {type: String, lowercase: true, trim: true}
        ],
        validate: [function (val) {
            val = val || [];
            return val.length <= 10;
        }, validateMsg('can have at most 10 elements')]
    },
    meta: {
        updated_at: Date,
        created_at: Date
    },
    model_type: String,
    keywords: {
        type: [
            {
                type: String,
                lowercase: true,
                trim: true
            }
        ],
        validate: [function (val) {
            val = val || [];
            return val.length <= 25;
        }, validateMsg('can have at most 25 elements')],
        index: true
    },

    owner: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }

});

ProjectSchema.pre('save', function (next) {
    this.meta.updated_at = new Date;
    if (!this.meta.created_at) {
        this.meta.created_at = new Date;
    }
    if (!this.model_type) {
        this.model_type = "project";
    }
    var keywords = this.tags.slice();
    var model = this;

    //Generates keywords based on title and description
    alchemyapi.keywords('text', this.title + ' ' + this.description, { keywordExtractMode: 'strict', maxRetrieve: MAX_KEYS}, function (response) {
        if (response.status === "OK") {
            response.keywords.forEach(function (value) {
                if (value.relevance > .4) {
                    keywords = keywords.concat(value.text.split(/ |-/));
                }
            });
            model.keywords = _.uniq(keywords).slice(0, MAX_KEYS);
        }
        next()
    });
});

ProjectSchema.methods.matchesOwnerId = function (id) {
    var compare = this.owner._id || this.owner;
    if (!compare.equals) {
        return false;
    }
    return compare.equals(id);

};

ProjectSchema.index({'loc': '2d'})

var model = mongoose.model('Project', ProjectSchema);
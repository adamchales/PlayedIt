const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});

const Joi = baseJoi.extend(extension);

module.exports.gameSchema = Joi.object({
    game: Joi.object({
        title: Joi.string().required().escapeHTML(),
        images: Joi.string(),
        genre: Joi.string().required().escapeHTML(),
        platform: Joi.string().required().escapeHTML(),
        releaseYear: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
        review: Joi.object({
            rating: Joi.number().required(),
            body: Joi.string().required().escapeHTML(),
        }).required()
})
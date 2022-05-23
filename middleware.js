const {gameSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Game = require('./models/game');
const Review = require('./models/review');
const user = require('./models/user.js');

module.exports.loggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to do that!');
        return res.redirect('/login');
    }
    next();
}

module.exports.gameValidator = (req, res, next) =>{
    const { error } = gameSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400);
    } else{
        next();
    }
}

module.exports.isAuthor = async(req, res, next) =>{
    const { id } = req.params;
    const games = await Game.findById(id);
    if(!games.author.equals(req.user._id) || !req.user.isAdmin){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/games/${games._id}`);
    }
    next();
}

module.exports.reviewValidator = (req, res, next) =>{
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400);
    } else{
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) =>{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id) || !req.user.isAdmin){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/games/${id}`);
    }
    next();
}
const Game = require('../models/game');
const Review = require('../models/review');

//allows a user to post a review 
module.exports.createReview = async(req, res)=>{
    const game = await Game.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    game.reviews.push(review);
    await review.save();
    await game.save();
    req.flash('success', 'Review created!')
    res.redirect(`/games/${game._id}`)
};

//allows a user to delete a review
module.exports.deleteReview = async(req,res)=>{
    const { id, reviewId } = req.params;
    Game.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
    await Review.findOneAndDelete(reviewId);
    req.flash('success', 'review erased!');
    res.redirect(`/games/${id}`);
};
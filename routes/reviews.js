const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const {loggedIn, reviewValidator, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews')

//this allows a user to post a review
router.post('/', loggedIn, reviewValidator, wrapAsync(reviews.createReview));

//allows a user to delete a review 
router.delete('/:reviewId', loggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;
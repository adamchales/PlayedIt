/*Basic model for a game entry*/

const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    genre: String,
    platform: String,
    releaseYear: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    avgRating: {type: Number, default: 0}
});

GameSchema.post('findOneAndDelete', async function (doc){
    if(doc){
        await review.remove({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

//this logic calculates the average rating of each game
GameSchema.methods.calculateAvgRating = function() {
	let ratingsTotal = 0;
	if(this.reviews.length) {
		this.reviews.forEach(review => {
			ratingsTotal += review.rating;
		});
		this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10) / 10;
	} else {
		this.avgRating = ratingsTotal;
	}
	const floorRating = Math.floor(this.avgRating);
	this.save();
	return floorRating;
}


module.exports = mongoose.model('Game', GameSchema);
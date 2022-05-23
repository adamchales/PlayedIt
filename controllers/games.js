const Game = require('../models/game');
const review = require('../models/review');
const { post } = require('../routes/users');

//this will take the user to the list of all currently submitted games
//this also contains the logic using regex that allows a user to search by game title 

module.exports.index = async(req, res)=>{
        var noMatch = null;
        if(req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            Game.find({title: regex}, function(err, allGames){
               if(err){
                   console.log(err);
               } else {
                  if(allGames.length < 1) {
                      noMatch = "We did not find any games matching your search!";
                  }
                  res.render("games/index",{games:allGames, noMatch: noMatch});
               }
            });
        } else {
            Game.find({}, function(err, allGames){
               if(err){
                   console.log(err);
               } else {
                  res.render("games/index",{games:allGames, noMatch: noMatch});
               }
            });
        }
    };

//this will bring a user to the submission form
module.exports.submitNew = (req, res)=>{
    return res.render('games/submit');
};

//this will create a new game and upload it to the database
module.exports.createGame = async(req, res, next) =>{
    const game = new Game(req.body.game);
    game.images = req.files.map(f =>({
        url: f.path, filename: f.filename
    }));
    game.author = req.user._id;
    await game.save();
    req.flash('success', 'Game submitted!');
    return res.redirect(`/games/${game._id}`)
    };

//this will allow the user to view a game's page
module.exports.viewGame = async(req, res)=>{
    const game = await Game.findById(req.params.id).populate({
        path:'reviews',
            populate: {
                path: 'author'}
            }).populate('author');
    let floorRating = game.calculateAvgRating();
    if(!game){
        req.flash('error', 'That game does not exist!');
        return res.redirect('/games');
    };
    return res.render('games/view', { game, floorRating });
};

//this will allow an authorized user to edit the game's information
module.exports.editForm = async(req, res) =>{
    const game = await Game.findById(req.params.id)
    return res.render('games/edit', { game })
};

module.exports.editGame = async (req, res)=>{
    const { id } = req.params;
    const game = await Game.findByIdAndUpdate(id,{...req.body.game})
    const images = req.files.map(f=> ({url: f.path, filename: f.filename}))
    game.images.push(...images);
    req.flash('success', 'Successfully updated game!')
    await game.save();
    return res.redirect(`/games/${game._id}`)
};

//this implements a delete function for authors or admins
module.exports.deleteGame = async(req, res)=>{
    const { id } = req.params;
    await Game.findByIdAndDelete(id);
    req.flash('success', 'Game erased!')
    return res.redirect('/games');
};


//part of the search logic
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
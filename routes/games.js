const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Game = require('../models/game');
const {loggedIn, isAuthor, gameValidator} = require('../middleware');
const games = require('../controllers/games')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

/*Going to the games view directs user to the index of all games*/
router.get('/', wrapAsync(games.index));

/* These two will allow users to submit a new game to the database*/
router.get('/submit', loggedIn, (games.submitNew));

router.post('/', loggedIn, upload.array('image'), gameValidator, wrapAsync(games.createGame));
/* This takes users to the view page that details each game */
router.get('/:id', wrapAsync(games.viewGame));

/* These will implement an editing function for existing games; 
restricted to submitting users or administrator users only to ensure
that game information is correct */
router.get('/:id/edit', loggedIn, isAuthor, wrapAsync(games.editForm));

router.put('/:id', loggedIn, isAuthor, upload.array('image'), gameValidator, wrapAsync(games.editGame));

/* This will implement a delete function for authorized administrator 
users to ensure there are no duplicated games or games that don't exist.*/

router.delete('/:id', loggedIn, wrapAsync(games.deleteGame));

module.exports = router;
require('dotenv').config();


const express = require('express');
const { default: mongoose } = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const ExpressError= require('./utils/ExpressError')
const session = require('express-session');
const path = require('path');;
const games = require('./routes/games');
const reviews = require('./routes/reviews');
const users = require('./routes/users')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const router = require('./routes/users');
const req = require('express/lib/request');
const res = require('express/lib/response');
const game = require('./models/game');
const review = require('./models/review');
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl = process.env.DB_URL;
const MongoStore = require('connect-mongo');
/*Connecting the app to MongoDB*/
mongoose.connect(dbUrl);
//mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error!'));
db.once('open', ()=>{
    console.log('Connected to database!')
});

const secret = process.env.SECRET || 'shh'

const store = new MongoStore({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    }
});

store.on('error', function(e){
    console.log('session error!', e)
});

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    }
}
/*Express connection and functionality*/
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize()); 


app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', users);
app.use('/games', games);
app.use('/games/:id/reviews', reviews);

app.get('/', (req,res)=>{
    res.render('home')
});

/*Error handling via express */
app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next)=>{
    const { statusCode= 500, message = 'something went wrong'} = err;
    res.status(statusCode).render('error', { err });
})

//profile logic
router.get("/users/:id", (req, res) => {
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "something went wrong");
            return res.redirect('/')
        }
        review.find().where('author.id').equals(foundUser._id).exec(function(err, reviews){
            if(err){
                req.flash("error", "something went wrong");
                return res.redirect('/')
            }
        }
        )
        res.render('users/profile', {user: foundUser, review: reviews})
    })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})


const game = require('../models/game');
const User = require('../models/user');

//shows the register page
module.exports.showRegister = (req, res)=>{
    res.render('users/register');
};

/* submits new user info; multiple uses of return res to fix an async
error i was getting */
module.exports.registerUser = async(req, res, next)=>{
    try{
    const { email, username, password, displayName, avi, bio, platform} = req.body;
    const user = new User({username, email, displayName, avi, bio, platform});
    if (req.body.admincode === '38Pi%!'){
        user.isAdmin = true;
    }
    const registeredUser = await User.register(user, password);
    req.flash('success', 'Account Created!');
    req.login(registeredUser, err => {
        if(err) return next(err);
    }) } catch(e){
        req.flash('error', e.message);
       return res.redirect('register');
    }
    return res.redirect('/games');
};

//shows login page and logs user in
module.exports.loginPage = (req, res)=>{
    return res.render('users/login');
 };

 
module.exports.loginUser = (req, res)=>{
        req.flash('success', 'Welcome Back!');
        const redirectUrl = req.session.returnTo|| '/games';
        delete req.session.returnTo;
        return res.redirect(redirectUrl);
    };

//logs user out
module.exports.logout = (req, res) =>{
    req.logout();
    req.flash('success', 'Logged Out!');
    return res.redirect('/games');
};
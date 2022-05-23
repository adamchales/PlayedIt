/* including this on all async functions will automatically apply the
error catcher */

module.exports = func =>{
    return (req, res, next) =>{
        func(req, res, next).catch(next);
    }
}
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");
const User = require("../models/user");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async function (req, res, next) {
  try {
    const {username, password } = req.body;
    if (await User.authenticate(username, password)) {
        let token = jwt.sign({username}, SECRET_KEY  );
        User.updateLoginTimestamp(username);
        return res.json({token});
    }
    throw new ExpressError("Invalid user/password", 400)
  }
  catch (err) {
    return next(err);
  }
});


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async function (req, res, next) {
  try {
    const {username, password, first_name, last_name, phone } = req.body;
    const user = User.register(username, password, first_name, last_name, phone)
    let token = jwt.sign({username}, SECRET_KEY  );
    User.updateLoginTimestamp(username);
    return res.json({token});
      }
  catch (err) {
    return next(err);
  }
});


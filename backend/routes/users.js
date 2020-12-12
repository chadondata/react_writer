const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const user_name = req.body.user_name;

    const new_user = new User({user_name});

    new_user.save()
        .then(() => res.json('User added'))
        .catch(err => res.status(400).json('Error ' + err));
    
});
module.exports = router;

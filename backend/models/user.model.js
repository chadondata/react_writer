const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user_schema = new Schema({
    user_name: {
        type: String
        , required : true
        , unique : true
        , trim : true
        , minlength : 3
    }
}, {
    timestamps : true
});

const User = mongoose.model('User', user_schema);

module.exports = User;
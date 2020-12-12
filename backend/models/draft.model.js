const mongoose = require('mongoose');
const { MdGpsFixed } = require('react-icons/md');

const Schema = mongoose.Schema;

const draft_schema = new Schema({
    draft_description : { type : String }
    , target_word_count : { type : Number }
    , current_word_count : { type : Number, required : true }
    , date_started : { type : Date, required : true }
    , last_modified_date : { type : Date, required : true }
    , user_email : {type : String, required : true}
    , content : {type : Schema.Types.Mixed, required : true}
    , date_trashed : { type : Date }
}, {
    timestamps : true
});

const Draft = mongoose.model("Draft", draft_schema);

module.exports = Draft;

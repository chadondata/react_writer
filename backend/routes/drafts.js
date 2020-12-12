const router = require('express').Router();
let Draft = require('../models/draft.model');

router.route('/add').post((req, res) => {
    const draft_description = req.body.draft_description;
    const target_word_count = Number(req.body.target_word_count);
    const current_word_count = Number(req.body.current_word_count);
    const date_started = Date(req.body.date_started);
    const last_modified_date = Date(req.body.last_modified_date);
    const user_email = req.body.user_email;
    const content = req.body.content;

    const new_draft = new Draft({
        draft_description 
        , target_word_count 
        , current_word_count 
        , date_started 
        , last_modified_date 
        , user_email 
        , content
    });

    new_draft.save()
        .then(() => res.json(new_draft.id))
        .catch(err => {
            console.log(err);
            res.status(400).json('Error: ' + err)
        });
});

router.route('/').get((req, res) => {
    Draft.find({}).select("-content")
        .then(drafts => {
            res.json(drafts);
        })
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/:id').get((req, res) => {
    Draft.findById(req.params.id)
        .then(draft => {
            //console.log(JSON.stringify(draft));
            res.json(draft);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Draft.findByIdAndDelete(req.params.id)
        .then(() => res.json('Draft deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Draft.findById(req.params.id)
        .then(draft => {
            draft.draft_description = req.body.draft_description;
            draft.target_word_count = Number(req.body.target_word_count);
            draft.current_word_count = Number(req.body.current_word_count);
            draft.date_started = Date(req.body.date_started);
            draft.last_modified_date = Date(req.body.last_modified_date);
            draft.user_email = req.body.user_email;
            draft.content = req.body.content;

            draft.save()
                .then(() => res.json('Draft updated'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
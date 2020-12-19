import React, {Component}from 'react';
import {MdSave, MdClose, MdCreate, MdCheckBox, MdCheckBoxOutlineBlank, MdFileDownload, MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ProgressBar from 'react-bootstrap/ProgressBar';
import axios from 'axios';
import ConfigDetails from '../config/config' // `${ConfigDetails().backend_uri}endpoint/`

import 'draft-js/dist/Draft.css';
import '../App.css';


export default class MyEditor extends Component {
    constructor(props) {
        super(props);
         
        this.state = {
            editorState : EditorState.createEmpty()
            , description : ''
            , target_word_count : 500
            , current_word_count : 0
            , percent_complete : 0
            , date_started : new Date()
            , last_modified_date : new Date()
            , user : "NihilisticFurniture"
            , id : this.props.match.params.id
            // These props are used for the auto save feature
            , auto_save : true
            , dirty : false
            , saving : false
            // state elements for the viewport
            , full_screen : false
        };

        this.onChange = editorState => {
            this.handleChange(editorState);
        }
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
    }

    componentDidMount() {
        console.log('Found id ' + this.props.match.params.id)
        if(this.props.match.params.id) {
            axios.get(`${ConfigDetails().backend_uri}drafts/${this.props.match.params.id}`)
                .then(response => {
                    
                    const raw_content = response.data.content;
                    const converted_from_raw = convertFromRaw(JSON.parse(raw_content)); 
                    const es = EditorState.createWithContent(converted_from_raw);

                    this.setState({
                        editorState : es
                        , description : response.data.draft_description
                        , target_word_count : response.data.target_word_count
                        , current_word_count : response.data.current_word_count
                        , date_started : response.data.createdAt
                        , last_modified_date : response.data.last_modified_date
                        , user : response.data.user_email
                        , id : response.data._id
                        // These props are used for the auto save feature
                        , auto_save : true
                        , dirty : false
                        , saving : false                        
                    })
                    console.log(response.data.date_started);
                })
                .then( () => {
                    
                    this.recalculateStatistics();
                })
                .then(() => {
                    this.interval = setInterval(() => this.auto_save(), 3000);
                })
        } else {
            this.interval = setInterval(() => this.auto_save(), 3000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
      }

    handleChange = (es) => {
        this.setState({
            editorState : es
            , last_modified_date : new Date()
            , dirty : true
        }, this.recalculateStatistics);
    }

    recalculateStatistics = () => {
        this.recalculateWordCount();
        const word_count    = this.state.current_word_count;
        const target        = (this.state.target_word_count && this.state.target_word_count > 0) ? this.state.target_word_count : 1;
        const percent       = word_count / target;
        this.setState({percent_complete : percent});
    }

    recalculateWordCount = () => {
        const wordcount = this.getWordCount();
        this.setState({current_word_count : wordcount})   
    }

    getRaw = () => {
        return convertToRaw(this.state.editorState.getCurrentContent());
    }

    auto_save = () => {
        if(this.state.dirty && this.state.auto_save && !this.state.saving) this.save();
    }

    save = () => {
        this.setState({
            saving : true
        }, ()=>{
            const save_structure = {
                content : JSON.stringify(this.getRaw())
                , draft_description : this.state.description
                , target_word_count : this.state.target_word_count
                , current_word_count : this.state.current_word_count
                , percent_complete : this.state.percent_complete
                , date_started : this.state.date_started
                , last_modified_date : this.state.last_modified_date
                , user_email : this.state.user
            };

            if(!this.state.id) {
                axios.post(`${ConfigDetails().backend_uri}drafts/add`, save_structure)
                    .then(res => this.setState({id : res.data}, this.toggle_saving));
            } else {
                axios.post(`${ConfigDetails().backend_uri}drafts/update/${this.state.id}`, save_structure)
                    .then(this.toggle_saving);
            }
        });
    }

    toggle_saving = () => {
        this.setState( {
            dirty : false
            , saving : false
        });
    }
    toggle_auto_save = () => {
        this.setState({auto_save : (!this.state.auto_save)});
    }

    render_auto_save = () => {
        return ( (this.state.auto_save) ? <MdCheckBox /> : <MdCheckBoxOutlineBlank /> );
    }

    render_save = () => {
        if (!this.state.auto_save || this.state.dirty) {
            return ( <Button onClick={this.save} disabled={!this.state.dirty} variant="dark"><MdSave /> Save</Button> );
        } else {
            return ((this.state.saving) ?
                <Button onClick={this.save} variant="dark"><MdSave /> Saving</Button>
                : <Button disabled variant="dark"><MdSave /> Saved</Button>
            )
        }
    }


    render_fullscreen = () => { // Will revisit this in a later version
        if(this.state.full_screen) {
            return(
                <Button variant="dark" onClick={this.toggle_fullscreen}>
                    <MdFullscreenExit /> Leave Full Screen
                </Button>
            )
        } else {
            return(
                <Button variant="dark" onClick={this.toggle_fullscreen}>
                    <MdFullscreen /> Go Full Screen
                </Button>
            )
        }

    }

    toggle_fullscreen = () => {
        const element = document.getElementById('editor');
        const edit = document.getElementById('entry');
        if(!this.state.full_screen) {

            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen()
            }
            console.log(edit);
        } else {
            if(document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if (document.msExitFullScreen) document.msExitFullScreen();
        }
        this.setState({ full_screen : !this.state.full_screen });
        
    }


    getWordCount = () => {
        const current_content = this.state.editorState.getCurrentContent().getPlainText(' ');
        let counter = 0;
        if(this.state.editorState.getCurrentContent().hasText()) {
            if (current_content.length === 0) return 0;
            let str = current_content
                .replace(/(^\s*)|(\s*$)/gi,"")
                .replace(/(\r\n|\r|\n){2,}/g, " ")
                .replace(/\n/, " ")
                .replace(/[ ]{2,}/gi," ")
                .replace(/\n /,"\n");
            
            counter = str.split(' ').length
        }
        

        return counter;
    }

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if(newState) {
            this.onChange(newState);
            return 'handled';
        }

        return 'not-handled';
    }

    handleDescriptionChange = (e) => {
        this.setState({
            description : e.target.value
        });
    }

    handleTargetWordCountChange = (e) => {
        this.setState({
            target_word_count : e.target.value
        });
    }

    handleHTMLDownload = () => {
        /*const element = document.createElement('a');
        const contents = `Peep this h*ckin masterpiece by ${this.state.user}
        Created on ${this.state.date_started}
        Last modified on ${this.state.last_modified_date}
        Downloaded on ${new Date()}
        Has completed ${this.state.current_word_count} out of ${this.state.target_word_count} words.
        Okay, so here starts the good part: `*/
        

    }

    handleDownload = () => {
        const element = document.createElement("a");
        const contents = 
            `Peep this h*ckin masterpiece by ${this.state.user}
Created on ${this.state.date_started}
Last modified on ${this.state.last_modified_date}
Downloaded on ${new Date()}
Has completed ${this.state.current_word_count} out of ${this.state.target_word_count} words.
Okay, so here starts the good part: 

${this.state.editorState.getCurrentContent().getPlainText('')}`
        ;

        const file = new Blob([contents], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "heck_yeah.txt";
        document.body.appendChild(element) // For that spicy Firefox stuff
        element.click();
    }


    
    render() {
        return ( 
            <div className="container-fluid text-dark" id="editor">
                <ButtonToolbar className="mb-3">
                    <ButtonGroup size="sm">
                        <Button href="/write" variant="dark"><MdCreate /> New</Button>
                        {this.render_save()}
                        <Button onClick={this.toggle_auto_save} variant={(this.state.auto_save) ? "primary" : "danger"} >
                            {this.render_auto_save()} Autosave
                        </Button>
                        {this.render_fullscreen()}
                        <Button onClick={this.handleDownload} variant="dark"><MdFileDownload /> Download</Button>
                        <Button variant="dark" href='/'><MdClose /> Close</Button>
                    </ButtonGroup> 
                </ButtonToolbar>
                    <div className="mt-2 form-row">
                        <div className="form-group col-md-8">
                            <label>Give your materpiece a h*ckin description </label>
                            <input type="text"
                                required
                                className="form-control"
                                value={this.state.description}
                                onChange={this.handleDescriptionChange}
                                placeholder="Go ahead and type. It's kay."
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label>How many words in this jam?</label>
                            <input type="text"
                                required
                                className="form-control"
                                value={this.state.target_word_count}
                                onChange={this.handleTargetWordCountChange}
                            />
                        </div>
                    </div>
                     
                    <div id="entry" className="shadow editors bg-light text-dark pt-3" >
                            <Editor editorState={this.state.editorState} handleKeyCommand={this.handleKeyCommand} onChange={this.onChange} placeholder="Start h*ckin writing here!!"/>
                    </div>
                    <div className="container pt-3 text-secondary bg-light text-right">
                        Word Count: {this.state.current_word_count} / {this.state.target_word_count} ( { Math.round(this.state.percent_complete*100, 2) }%)
                    </div>    
                    <div className="container pt-3">
                        <ProgressBar now={Math.round(this.state.percent_complete*100)} label={`${Math.round(this.state.percent_complete*100, 2)}%`} />
                    </div> 
    
            </div>
        );
    }

}
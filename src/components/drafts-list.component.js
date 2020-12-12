import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {MdDelete, MdFolderOpen, MdSort} from 'react-icons/md';
import axios from 'axios';

const Draft= props => (
    <tr>
        <td>
            {
                (props.draft.draft_description) ? props.draft.draft_description : "No Description. Bummer"
            }
        </td>
        <td style={{"textAlign" : "right"}}>{props.draft.current_word_count}</td>
        <td style={{"textAlign" : "right"}}>{props.draft.target_word_count}</td>
        <td style={{"textAlign" : "right"}}>{Math.round((props.draft.current_word_count / ((props.draft.target_word_count) ? props.draft.target_word_count : 1)) * 100, 2)}</td>
        <td style={{"textAlign" : "right"}}>{Intl.DateTimeFormat(navigator.language, { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' }).format(new Date(props.draft.createdAt))} </td>
        <td style={{"textAlign" : "right"}}>{Intl.DateTimeFormat(navigator.language, { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' }).format(new Date(props.draft.updatedAt))} </td>
        <td style={{"textAlign" : "center"}}>
            <Link to={"/editor/"+props.draft._id}><MdFolderOpen /></Link> | <a href="/" onClick={() => { props.deleteDraft(props.draft._id) }}><MdDelete /></a>
        </td>
    </tr>
)

export default class DraftsList extends Component {
    constructor(props) {
        super(props);
        this.deleteDraft = this.deleteDraft.bind(this);
        this.state = { drafts : [] };
        
    }

    componentDidMount() {
        this.loadDrafts();
    }

    loadDrafts() {
        axios.get('http://192.168.1.10:5000/drafts/')
            .then(response => {
                this.setState({ drafts: response.data });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    deleteDraft(id) {
        axios.delete('http://192.168.1.10:5000/drafts/' + id)
            .then(res => console.log(res.data))
            .catch((error) => console.log(error));
        
        this.setState({
            drafts : this.state.drafts.filter(d => d._id !== id)
        });
    }

    draftsList() {
        return this.state.drafts.map(current_draft => { 
            return <Draft draft={current_draft} deleteDraft={this.deleteDraft} key={current_draft._id}/>;
        })
    } 

    sortDescription = () => {
        let d = this.state.drafts;
        let sort_order = this.state.draft_description_sort_order;
        if(!sort_order) sort_order = 1;
        d.sort((a, b) => (a.draft_description <= b.draft_description) ? -1 * sort_order : 1 * sort_order);

        sort_order *= -1;
        this.setState({drafts : d, draft_description_sort_order : sort_order});
    }

    sortCurrent = () => {
        let d = this.state.drafts;
        let sort_order = this.state.current_word_count_sort_order;
        if(!sort_order) sort_order = 1;
        d.sort((a, b) => (a.current_word_count <= b.current_word_count) ? -1 * sort_order : 1 * sort_order);

        sort_order *= -1;
        this.setState({drafts : d, current_word_count_sort_order : sort_order});
    }

    sortTarget = () => {
        let d = this.state.drafts;
        let sort_order = this.state.target_word_count_sort_order;
        if(!sort_order) sort_order = 1;
        d.sort((a, b) => (a.target_word_count <= b.target_word_count) ? -1 * sort_order : 1 * sort_order);

        sort_order *= -1;
        this.setState({drafts : d, target_word_count_sort_order : sort_order});
    }

    sortPercent = () => {
        let d = this.state.drafts;
        let sort_order = this.state.percent_sort_order;
        if(!sort_order) sort_order = 1;
        d.sort((a, b) => (Math.round((a.current_word_count / ((a.target_word_count) ? a.target_word_count : 1)) * 100, 2) <= Math.round((b.current_word_count / ((b.target_word_count) ? b.target_word_count : 1)) * 100, 2) ) ? -1 * sort_order : 1 * sort_order);

        sort_order *= -1;
        this.setState({drafts : d, percent_sort_order : sort_order});
    }

    sortDateStarted = () => {
        let d = this.state.drafts;
        let sort_order = this.state.createdAt_sort_order;
        if(!sort_order) sort_order = 1;
        d.sort((a, b) => (a.createdAt <= b.createdAt) ? -1 * sort_order : 1 * sort_order);

        sort_order *= -1;
        this.setState({drafts : d, createdAt_sort_order : sort_order});
    }

    sortLastModified= () => {
        let d = this.state.drafts;
        let sort_order = this.state.updatedAt_sort_order;
        if(!sort_order) sort_order = 1;
        d.sort((a, b) => (a.updatedAt <= b.updatedAt) ? -1 * sort_order : 1 * sort_order);

        sort_order *= -1;
        this.setState({drafts : d, updatedAt_sort_order : sort_order});
    }

    render() {
        return (
            <div>
                <h3>Your h*ckin ossum drafts</h3>
                <div className='table-responsive'>
                    <table className="table">
                        <thead className="thead-light">
                            <tr>
                                <th>Description <MdSort onClick={this.sortDescription} /></th>
                                <th style={{"textAlign" : "right"}}>Word Count <MdSort onClick={this.sortCurrent} /></th>
                                <th style={{"textAlign" : "right"}}>Target <MdSort onClick={this.sortTarget} /></th>
                                <th style={{"textAlign" : "right"}}>% <MdSort onClick={this.sortPercent} /></th>
                                <th style={{"textAlign" : "right"}}>Date Started <MdSort onClick={this.sortDateStarted} /></th>
                                <th style={{"textAlign" : "right"}}>Last Modified <MdSort onClick={this.sortLastModified} /></th>
                                <th style={{"textAlign" : "center"}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.draftsList()}
                        </tbody>
                    </table>
                </div>
            </div>
        ) 
    }
}
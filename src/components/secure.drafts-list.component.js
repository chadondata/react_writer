import React, { Component } from 'react';
import {MdDelete, MdSort } from 'react-icons/md';
import { IoMdTrash } from 'react-icons/io'
import Button from 'react-bootstrap/Button';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import ConfigDetails from '../config/config' // `${ConfigDetails().backend_uri}endpoint/`
import { withOktaAuth } from '@okta/okta-react';

const renderDeleteTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Put this in the bin.
    </Tooltip>
);

async function checkUser() {
    if(this.props.authState.isAuthenticated && !this.state.user) {
        if(this._isMounted) {
            this.setState({
                user : this.props.authState.idToken.claims.email
                , name : this.props.authState.idToken.claims.name
            });
        }
    }
}

const Draft= props => (
    <tr>
        <td onClick={() => { window.location.href = "/editor/"+props.draft._id}}>
            {
                (props.draft.draft_description) ? props.draft.draft_description : "No Description. Bummer"
            }
        </td>
        <td onClick={() => { window.location.href = "/editor/"+props.draft._id}} style={{"textAlign" : "right"}}>{props.draft.current_word_count}</td>
        <td onClick={() => { window.location.href = "/editor/"+props.draft._id}} style={{"textAlign" : "right"}}>{props.draft.target_word_count}</td>
        <td onClick={() => { window.location.href = "/editor/"+props.draft._id}} style={{"textAlign" : "right"}}>{Math.round((props.draft.current_word_count / ((props.draft.target_word_count) ? props.draft.target_word_count : 1)) * 100, 2)}</td>
        <td onClick={() => { window.location.href = "/editor/"+props.draft._id}} style={{"textAlign" : "right"}}>{Intl.DateTimeFormat(navigator.language, { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' }).format(new Date(props.draft.createdAt))} </td>
        <td onClick={() => { window.location.href = "/editor/"+props.draft._id}} style={{"textAlign" : "right"}}>{Intl.DateTimeFormat(navigator.language, { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' }).format(new Date(props.draft.updatedAt))} </td>
        <td style={{"textAlign" : "center"}}>
        <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderDeleteTooltip}
        >
           <Button variant="danger" onClick={() => { props.deleteDraft(props.draft._id) }}> <MdDelete /></Button>
        </OverlayTrigger>       
        
        </td>
    </tr>
)

export default withOktaAuth(class SecureDraftsList extends Component {
    _isMounted = false;
    _loaded = false;

    constructor(props) {
        super(props);
        this.deleteDraft = this.deleteDraft.bind(this);
        this.checkUser = checkUser.bind(this)
        this.state = { drafts : [] };
        
    }

    componentDidMount() {
        this._isMounted = true;
        this.checkUser();
        this.loadDrafts();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate() {
        this._isMounted = true;
        this.checkUser();
        this.loadDrafts();
    }

    loadDrafts() { 
        console.log(this.state); 
        if(!this._loaded) {
            axios.get(`${ConfigDetails().backend_uri}drafts/list/` + this.state.user)
                .then(response => {
                    this.setState({ drafts: response.data });
                    this._loaded = true
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    deleteDraft(id) {
        axios.post(`${ConfigDetails().backend_uri}drafts/trash/`+ id)
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
                <Container fluid>
                    <Row>
                        <Col sm={10}><h3>{this.state.name}'s h*ckin ossum drafts</h3></Col>
                        <Col sm={2}><Button href="/bin" variant='light'><IoMdTrash /> View the Bin</Button></Col>
                    </Row>
                </Container>
                
                <div className='table-responsive'>
                    <table className="table table-hover">
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
});
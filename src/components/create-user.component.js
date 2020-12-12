import React, {Component} from 'react';
import axios from 'axios'

export default class CreateUser extends Component {
    onChangeUserName(e) {
        this.setState({
            user_name : e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const new_user = {
            user_name : this.state.user_name
        };

        axios.post('http://192.168.1.10:5000/users/add', new_user)
            .then(res => console.log(res.data));

        this.setState({
            user_name : ''
        })
    }
    constructor(props) {
        super(props);

        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            user_name : ''
        };
    }
    render() {
        return (
            <div>
                <h3>Create New User</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>User Name </label>
                        <input type="text" required className="form-control"
                            value={this.state.user_name}
                            onChange={this.onChangeUserName}
                        />
                    </div>  
                    <div className="form-group">
                        <input type="submit" value="Create" className="btn btn-primary" />
                    </div>          
                </form>
            </div>
        )
    }
}
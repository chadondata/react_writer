import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useOktaAuth, withOktaAuth } from '@okta/okta-react';
import { MdAccountCircle } from 'react-icons/md';

function AuthInfo() {
    const { oktaAuth, authState } = useOktaAuth();
    const logout = () => { oktaAuth.signOut(); }

    const account_button = authState.isAuthenticated ? <Button variant="dark" onClick={ logout }><MdAccountCircle /> Logout</Button> : <Button variant="dark" href='/login'><MdAccountCircle /> Login</Button>
    return account_button;
}

async function checkUser() {
    if(this.props.authState.isAuthenticated && !this.state.userInfo) {
        const userInfo = this.props.authState.idToken.claims.email;
        if(this._isMounted) {
            this.setState({userInfo});
        }
    }
}

export default withOktaAuth(class SecureNavBar extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {userInfo : null };
        this.checkUser = checkUser.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;
        this.checkUser();
    }

    async componentDidUpdate() {
        this._isMounted = true;
        this.checkUser();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

  render() {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/">Just H*ckin Write</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/write">Write!</Nav.Link>
                    <Nav.Link href="/drafts">Saved Drafts</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href="/#">{this.state.userInfo && this.state.userInfo} </Nav.Link>
                    <AuthInfo />
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
  }
});

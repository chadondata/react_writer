import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { useHistory } from 'react-router';


import 'bootstrap/dist/css/bootstrap.min.css';

import SecureNavBar from './components/secure.navbar.component';
import DraftsList from './components/drafts-list.component';
import SecureDraftsList from './components/secure.drafts-list.component'
import SecureTrashedDraftsList from './components/secure.trash_bin.component';
import SecureEditor from './components/secure.editor.component';
import Login from './components/login.component';

const oktaAuth = new OktaAuth({
  issuer: 'https://dev-597434.okta.com/oauth2/default',
  clientId: '0oa1lnc62dSIscQOW4x7',
  redirectUri: window.location.origin + '/login/callback'
});

function SecureApp() {
    const history = useHistory();

    const onAuthRequired = function() {
        history.push('./login');
    }


    return (
        <Router>
            <Security oktaAuth={oktaAuth} onAuthRequired={onAuthRequired}>
            <div className="container" id="content">
                <SecureNavBar />
                <Route path="/" exact component={DraftsList} />
                <Route path="/login" exact component={Login} />
                <SecureRoute path="/drafts" exact component={SecureDraftsList} />
                <SecureRoute path="/editor/:id" component={SecureEditor} /> 
                <SecureRoute path="/write" component={SecureEditor} />
                <SecureRoute path="/secure_write" exact component={SecureEditor}/>
                <SecureRoute path="/bin" component={ SecureTrashedDraftsList } />
                <Route path='/login/callback' component={LoginCallback}/>
            </div>
        </Security>
        </Router>

  );
}

export default SecureApp;
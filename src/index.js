import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
//import { Security } from '@okta/okta-react';

// import App from './App';
import SecureApp from './SecureApp';


/* const config = {
  clientId: '0oa1lnc62dSIscQOW4x7',
  issuer: 'https://dev-597434.okta.com/oauth2/default',
  redirectUri: 'http://localhost:3000/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
};
*/

ReactDOM.render(
  <BrowserRouter>
      <SecureApp />
  </BrowserRouter>
  ,  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

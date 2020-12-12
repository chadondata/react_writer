import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import MainNavbar from "./components/navbar.component";
//import ExercisesList from './components/exercises-list.component';
import CreateUser from './components/create-user.component';
import MyEditor from './components/editor.component';
import DraftsList from './components/drafts-list.component'

function App() {
  return (
      <Router>
      <div className="container">
        <MainNavbar />
        <br />
        <Route path="/" exact component={DraftsList} />
        <Route path="/user" component={CreateUser} />
        <Route path="/editor/:id" component={MyEditor} /> 
        <Route path="/write" component={MyEditor} />
      </div>
    </Router>

  );
}

export default App;
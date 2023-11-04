import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import the component you want to render for the "/add" route
import Add from './components/Add'; // Replace 'AddComponent' with the actual component name
import View from './components/View';
import Share from './components/Share';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/add" element={<Add />} /> {/* Define the route for "/add" */}
      <Route path="/view" element={<View />} />
      <Route path="/share" element={<Share />} />
      <Route path="/" element={<App />} /> {/* Define the route for the root path */}
    </Routes>
  </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();
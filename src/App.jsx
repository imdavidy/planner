import {Routes, Route, NavLink, Outlet} from 'react-router-dom';
import axios from 'axios';

import './App.css'

axios.defaults.baseURL = 'http://localhost:3000';

function App() {


  return (
    <>
      <div id="header" className="top-nav">
        <h1>Planner</h1>
        <nav>
          <ul>
            <li>
              <NavLink className="menu-item" to="/contacts">Contact List</NavLink>
            </li>
            {/*  removes feature
            <li>
              <NavLink to="/events">Events</NavLink>
            </li>
            */}
          </ul>
        </nav>
      </div>
      <div id={"detail"} className="main-body">
        <Outlet />
      </div>
    </>
  )
}

export default App

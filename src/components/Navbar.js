import React, { Component } from "react";
import Identicon from 'identicon.js';
import { Link } from 'react-router-dom'; 
import logo from '../images/logo.png';
import './App.css';

class Navbar extends Component {

    render() {
        return (

        <nav style={{ backgroundColor: '#3F48CC' }} className="navbar navbar-dark fixed-top flex-md-nowrap shadow">
          <img src={logo} alt="logo" />
               <div className="padding-1">
                  <Link to="/" className="link-spacing"> 
                      <button type='button' className='btn btn-primary'>Home</button>
                  </Link>
                  <Link to="/add" className="link-spacing"> 
                      <button type='button' className='btn btn-primary'>Add</button>
                  </Link>
                  <Link to="/view" className="link-spacing"> 
                      <button type='button' className='btn btn-primary'>View</button>
                  </Link>
                  <Link to="/share" className="link-spacing"> 
                      <button type='button' className='btn btn-primary'>Share</button>
                  </Link>
                  
                </div>
          <ul className='navbar-nav px-3'>
            <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
                <small className='text-secondary'>
                  <small id='account'> {this.props.account} </small>

                </small>
                { this.props.account ? 
                    <img className="ml-2"
                    width='30'
                    height='30'
                    src={`data:image/png;base64, ${new Identicon(this.props.account, 30).toString()}`}
                    />
                    : <span></span>
                }      
            </li>
          </ul>
        </nav>

        );
    }
}

export default Navbar;
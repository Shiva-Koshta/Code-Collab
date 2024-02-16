import React from 'react';
import mainlogo from '../res/bg.png';
import GoogleButton from 'react-google-button';
import '../styles/Login.css';
const Login = () => {
    return (
        <div>
            <div className="loginContainer">
                <div className="loginPage">
                    <div className="loginForm">
                        <h1 className="loginHeading">Login here</h1>
                        {/* <button className="btn signInGoogle"> Sign in with Google</button> */}
                        <GoogleButton />
                        <div className="footerLinks">
                            <a href="/about-us">About Us</a>
                            <a href="/faq">FAQ</a>
                            <a href="/help">Help</a>
                        </div>
                    </div>
                </div>
                <div className="panel-container">
                    <div className="panel right-panel">
                        <img src={mainlogo} alt="" className="image" />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login

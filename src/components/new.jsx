import React from 'react'
import '../components/new.css';

function New() {
    return (
        <div>
           
      <div className="header">
        <button className="login-button">Login</button>
        <div className="or-divider">OR</div>
        <button className="create-account-button">Create Account</button>
      </div>
      <div className="input-section">
        <p className="prompt">Please enter your Email ID or Phone number</p>
        <input type="text" className="input-field" placeholder="Enter Your Email ID or Phone number" />
      </div>
      <div className="checkbox-section">
        <input type="checkbox" id="keep-signed-in" className="checkbox" checked />
        <label htmlFor="keep-signed-in" className="checkbox-label">Keep me signed in</label>
      </div>

      <div className="auth-container">
      <button className="auth-button">Login</button>
      <div className="or-container">
        <span className="or-text">OR</span>
      </div>
      <button className="auth-button">Create Account</button>
    </div>


  <form>
    <label class="checkbox-container">
        <input type="checkbox"/>
        <span class="checkmark"></span>
    </label>
</form>  


        </div>
        
    )
}

export default New

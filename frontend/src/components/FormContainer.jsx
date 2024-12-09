import React from "react";
import { useNavigate } from "react-router-dom";
import '../theme/FormContainer.css';

const FormContainer = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/main"); // Navigăm către pagina MainPage
  };

  return (
    <div className="form-container">
      <div className="col col-1">
        <div className="image-layer">
          <img src="src/assets/white-outline.png" className="form-image-main" alt="Main" />
          <img src="src/assets/dots.png" className="form-image dots" alt="Dots" />
          <img src="src/assets/coin.png" className="form-image coin" alt="Coin" />
          <img src="src/assets/spring.png" className="form-image spring" alt="Spring" />
          <img src="src/assets/rocket.png" className="form-image rocket" alt="Rocket" />
          <img src="src/assets/cloud.png" className="form-image cloud" alt="Cloud" />
        </div>
        <p className="featured-words">You Are Few Minutes Away to Boost Your Skills</p>
      </div>
      <div className="col col-2">
        <div className="btn-box">
          <button className="btn btn-1" id="login">
            Sign In
          </button>
          <button className="btn btn-2" id="Register">
            Sign Up
          </button>
        </div>

        <div className="login-form">
          <div className="form-title">
            <span>Sign In</span>
          </div>
        </div>
        <div className="form-inputs">
          <div className="input-box">
            <input type="text" className="input-field" placeholder="Username" required />
            <i className="bx bx-user icon"></i>
          </div>
          <div className="input-box">
            <input type="password" className="input-field" placeholder="Password" required />
            <i className="bx bx-lock-alt icon"></i>
          </div>
          <div className="forgot-pass">
            <a href="#">Forgot Password?</a>
          </div>
          <div className="input-box">
            <button className="input-submit" onClick={handleLogin}>
              <span>Sign In</span>
              <i className="bx bx-right-arrow-alt"></i>
            </button>
          </div>
        </div>
        <div className="social-login">
          <i className="bx bxl-google"></i>
          <i className="bx bxl-facebook"></i>
          <i className="bx bxl-twitter"></i>
          <i className="bx bxl-github"></i>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;

import React from "react";
import { mainLogo } from "./../../../assets/image";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  return (
    <div className="WelcomePage">
      <div className="mainLogo">
        <img src={mainLogo} alt="" />
      </div>

      <main>
        <div className="text">
          <h1>
            Welcome at <br /> <span>HeliCoin</span>
          </h1>
          <p>
            "Be brave ! Strap in, grab the mic, gear up, and fly the
            chopper.....because the crypto skies are yours to conquer!"
          </p>
          <Link to="/signup">Get started</Link>
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;

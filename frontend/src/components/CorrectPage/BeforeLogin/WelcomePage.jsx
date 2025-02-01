import React from "react";
import { mainLogo } from "./../../../assets/image";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import { fadeIn } from "./../../../assets/auth";

const WelcomePage = () => {
  return (
    <div className="WelcomePage">
      <div className="mainLogo">
        <img src={mainLogo} alt="" />
      </div>

      <motion.main
        variants={fadeIn("up", 0.1)}
        initial="hidden"
        whileInView={"show"}
      >
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
      </motion.main>
    </div>
  );
};

export default WelcomePage;

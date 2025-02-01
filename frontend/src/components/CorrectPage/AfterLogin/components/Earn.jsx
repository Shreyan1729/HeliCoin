import React from "react";
import { bottom } from "./Images/image";

const Earn = () => {
  return (
    <section className="Earn">
      <h1>Let's make bond deeper</h1>

      <br />

      <main className="buttons">
        <div className="earn-button">
          Heli in Telegram
          <div className="claim">Claim</div>
        </div>
        <div className="earn-button">
          Heli in Instagram
          <div className="claim">Claim</div>
        </div>
        <div className="earn-button">
          Heli in Twitter
          <div className="claim">Claim</div>
        </div>
        <div className="earn-button">
          Heli in Youtube
          <div className="claim">Claim</div>
        </div>
      </main>

      <img src={bottom} alt="" className="bottom" />
    </section>
  );
};

export default Earn;

import React from "react";
import "./HomeMain.css";

const HomeMain = () => {
  return (
    <div
      className="home-main"
      style={{ backgroundImage: `url(/gangsters.jpg)` }}
    >
      <div className="main-text">
        <h2>Bienvenue sur KoalaBestBet ! </h2>
        <p>
         Créez vos équipes,<br/> défiez vos amis,<br/>misez sur vos
          matchs de E-sport préférés,<br/>
        </p>
        <h3>Pour devenir le meilleur Koalastikeurs, et
          raflez la mise !</h3>
      </div>
    </div>
  );
};

export default HomeMain;

import React from "react";
import "./HomeConcept.css";

const HomeConcept = () => {
  return (
    <div
      className="home-concept"
      id="Home-Concept"
      style={{
        backgroundImage: `url(/csgo.jpg)`,
      }}
    >
      <div className="concept-text">
        <h2>Le concept</h2>
        <p>
          Pariez sur des matchs e-sport CS-GO
          <br />
          Championnat de 2 a 5 joueurs
          <br />
          Pronostiquer de 2 a 5 paris <br />
          A l'issue d'un championnat, recolter des KoalasCoins
          <br />
          Pour devenir le mythique Koala Supreme !!!!
          <br />
        </p>
      </div>
    </div>
  );
};

export default HomeConcept;

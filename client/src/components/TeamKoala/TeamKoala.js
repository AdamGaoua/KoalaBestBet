import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./TeamKoala.css";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const TeamKoala = () => {
  return (
    <div>
      <Header />
      <div
        className="team-content"
        style={{ backgroundImage: `url(/cs-go-rose.png)` }}
      >


        <div className="team-card" >
          <div className="content">
            <div className="picture">
              <img
                className="avatar-img"
                src="./avatarMicka.jpg"
                alt="avatar-micka"
                />
            </div>
            <h1>Michael "Product Owner"</h1>
            <p>
              Il est l'inventeur du
              KoalaBestBet. Il est en outre l’inventeur du KoalaCoin (la monnaie
              des koalastikeurs) Il appartient à la tribu des DevFront Javascript spécialisé en React
            </p>
            <LinkedInIcon
              style={{
                fontFamily: "Quantico",
                backgroundColor: "#0A66C2",
                height: "35px",
                width: "35px",
                borderRadius: "5px",
                marginTop: "15px",
              }}
            />
          </div>
        </div>

           

        
        <div className="team-card">
          <div className="content">
            <div className="picture">
              <img
                className="avatar-img"
                src="./images/avatar/ava_21.jpg"
                alt="avatar-adam"
              />
            </div>
            <h1>Adam "Scrum Master,LeadDev front"</h1>
            <p>
            Il guide notre troupe de gentils Koalas pour qu’ils donnent toujours le meilleur d’eux-mêmes. <br/>Il est le garant de la cohésion du groupe.<br/>  
            FullStack Javascript spécialisé en React

            </p>
            <LinkedInIcon
              style={{
                fontFamily: "Quantico",
                backgroundColor: "#0A66C2",
                height: "35px",
                width: "35px",
                borderRadius: "5px",
                marginTop: "15px",
              }}
            />
          </div>
        </div>
        <div className="team-card">
          <div className="content">
            <div className="picture">
              <img
                className="avatar-img"
                src="./images/avatar/ava_15.png"
                alt="avatar-kevin"
              />
            </div>
            <h1>Kevin "LeadBack"</h1>
            <p>
            La clé de voûte côté back du KoalaBestBet.<br/> 
            FullStack Javascript spécialisé en Data et API

            </p>
            <LinkedInIcon
              style={{
                fontFamily: "Quantico",
                backgroundColor: "#0A66C2",
                height: "35px",
                width: "35px",
                borderRadius: "5px",
                marginTop: "15px",
              }}
            />
          </div>
        </div>
        <div className="team-card" data-tilt>
          <div className="content">
            <div className="picture">
              <img
                className="avatar-img"
                src="./images/avatar/ava_12.jpg"
                alt="avatar-antony"
              />
            </div>
            <h1>Antony "Git Master"</h1>
            <p>
            Second du LeadDev côté back, il veille en outre sur le workTree des Koalas et s’assure que chacun soit bien sur sa branche.
            </p>
            <LinkedInIcon
              style={{
                fontFamily: "Quantico",
                backgroundColor: "#0A66C2",
                height: "35px",
                width: "35px",
                borderRadius: "5px",
                marginTop: "15px",
              }}
            />
          </div>
        </div>
      </div>

      <Footer />
      <script type="text/javascript" src="vanilla-tilt.js"></script>
    </div>
  );
};

export default TeamKoala;

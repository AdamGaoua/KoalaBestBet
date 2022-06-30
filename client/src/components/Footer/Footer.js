import React from "react";
import "./Footer.css";
import Button from "@mui/material/Button";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <Button
        className="btn-footer"
        variant="contained"
        style={{ fontFamily: "Quantico", backgroundColor: "#592715", transition:"all .2s ease-in-out" }}
        href="mailto:koalabestbet@gmail.com"
      >
        Nous contacter
      </Button>
      <div className="btn-social">
        <FacebookRoundedIcon color="primary" />
        <InstagramIcon color="secondary" />
        <TwitterIcon color="primary" />
      </div>
      <div className="footer-text">
        <NavLink className="btn-team" to="/Team-Koala">
          <Button variant="text" style={{ color: "white",textDecoration:"none" }}>
            La Team Koala
          </Button>
        </NavLink>
        <Button variant="text" color="success">
          CGU
        </Button>
        <Button variant="text" style={{ color: "white" }}>
          Mentions légales
        </Button>
      </div>
    </div>
  );
};

export default Footer;

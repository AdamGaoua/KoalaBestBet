import { Avatar, Button, Stack } from "@mui/material";
import React from "react";
import { NavLink, Link } from "react-router-dom";
import HomeModal from "../HomeModal/HomeModal";
import "./Header.css";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useNavigate } from "react-router-dom";
import {useState} from 'react';

const HeaderConnected = ({ isLogged, setIsLogged }) => {
  const [askDeco, setAskDeco]= useState(false)
  const navigate = useNavigate();
  let data = JSON.parse(localStorage.getItem("infosUser"));
  const { avatar_path} = data;

  const handleAskDeco = () => {
    setAskDeco(true);
  }

  const handleDeco = () => {
    localStorage.removeItem("infosUser");
    sessionStorage.removeItem("token");
    localStorage.removeItem('infosMatchs');

    navigate("/");
    setIsLogged(false);
    setAskDeco(false);
  };
  return (
    <>
    <div className="header">
      <HomeModal />
      <div className="menu-desktop">
        <div id="header-nav" className="menu-items">
          <ul>
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <Link to="/MyGroups">Mes groupes</Link>
            </li>
          
          <li>
            <Link to="/groupe">Créer un groupe</Link>
          </li>
        </ul>
      </div>
      <div className="img-koala">
        <img src="./koala.svg" alt="" />
      </div>
      <div className="menu-connexion">
        <div className="menu-items">
          <ul>
            <li className="classement">
              <Link to="/groupClassement">Classement</Link>
            </li>
          </ul>
        </div>
        <div className="profil-deconnexion">
          <Stack
            spacing={2}
            direction="row"
            sx={{ justifyContent: "flex-end" , alignItems:"center"}}
          >
            
            <img className='avatar' src={avatar_path} alt="koala avatar"/>
            <h5 style={{fontSize:"16px",fontWeight:500}}>Bonjour {data.username}</h5>
            <NavLink className="btn-header" to="/Profil">
              <Button style={{fontFamily:'Quantico',backgroundColor:'#332E38'}} variant="contained">Profil</Button>
            </NavLink>

            <div className="power-icon">
              <PowerSettingsNewIcon onClick={handleAskDeco} />
            </div>
            {askDeco &&
            <div>
              <p> Etes-vous sur de vouloir vous déconnecter ?</p>
              <Button onClick={handleDeco}style={{color:'red'}} > oui, je valide</Button>
              <Button onClick={()=>{setAskDeco(false)}} style={{color:'white'}}> Annuler </Button> 
            </div>
            }
          </Stack>
        </div>
      </div>
    </div>
    <div className="title-mobile">
        <h1>KoalaBestBet</h1>
    </div>
    </div>
  </>
    
  );
};

export default HeaderConnected;

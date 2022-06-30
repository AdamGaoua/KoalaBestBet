import { Button, Stack } from '@mui/material';
import React from 'react';
import { NavLink,Link as Lien} from 'react-router-dom';
import HomeModal from '../HomeModal/HomeModal';
import "./Header.css";
 import { Anchor } from "antd"; 


const HeaderNotConnected = () => {
   const {Link } = Anchor;
    return (
        <div className="header">
      <HomeModal />
      <div className="menu-desktop">
        <div className="menu-items">
          <ul>
            <li>              
              <Lien to="/">Accueil</Lien>             
            </li>
            <li>
            <Anchor affix={false}  ><Link href="/#Home-Concept" title="Le concept" ></Link></Anchor>
            </li>
            <li>
              
              <Anchor affix={false}><Link href="/#idranking" title="Classement"></Link></Anchor>
              
            </li>
          </ul>
        </div>
        <div className="img-koala">
          <img src="./koala.svg" alt="" />
        </div>
        <div className="menu-connexion">
          <div>

          <Stack
            spacing={2}
            direction="row"
            sx={{ justifyContent: "flex-end" }}
          >
            <NavLink  className="btn-header"to="/connexion">
              <Button  variant="contained"
              style={{fontFamily:'Quantico' ,backgroundColor:'#592715'}}>Connexion</Button>
            </NavLink>
            <NavLink to="/inscription" className="btn-header">
              <Button variant="contained"   style={{fontFamily:'Quantico',backgroundColor:'#332E38'}}>Inscription</Button>
            </NavLink>
          </Stack>
            </div>

          <div className="mdp-forgot">
            <Stack
              spacing={2}
              direction="row"
              sx={{ justifyContent: "flex-end" }}            
            />
          </div>
        </div>
      </div>
      
      <div className="title-mobile">
        <h1>KoalaBestBet</h1>
      </div>
    </div>
    );
};

export default HeaderNotConnected;
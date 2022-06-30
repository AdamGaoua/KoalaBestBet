import React from 'react';
import "./NotFound.css";
import { Button} from '@mui/material';
import { NavLink} from 'react-router-dom';



const NotFound = () => {
    return (
        <div className='content-404'>
            
            <div className="info">
                <div className="glitch-bloc">
                     <p className="invisible-text">404</p>
                     <p className="glitchedAnim">404</p>
                     <p className="glitchedAnim">404</p>
                     <p className="glitchedAnim">404</p>
                </div>
                <p className="txt-info">Tu es perdu petit Koala ? 🛠️</p>
                <img  className='img-404' src="/404koala.jpg" alt="koala"/>

                <NavLink  className="btn-header"to="/">
              <Button  variant="contained"
              style={{fontFamily:'Quantico' ,backgroundColor:'#592715'}}>Accueil</Button>
            </NavLink>
        </div>
            
        </div>
    );
};

export default NotFound;
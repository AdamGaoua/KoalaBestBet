import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import "./HomeModal.css";
import { NavLink } from "react-router-dom";


const HomeModal = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height:'70%',
        border: '2px solid #000',
        boxShadow: 24,
        background: 'linear-gradient(90deg, rgba(54, 89, 89, 1) 0%, rgba(89, 45, 29, 1) 100%, rgba(0, 0, 0, 1) 100%)',
        p: 4,
      };
  
    return (
      <div>
        <Button onClick={handleOpen}>
          <div className="hamburger-menu"><img src="/burger.svg.png" alt="hamburger"></img></div>
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >
          <Box sx={style} >
              <div className="modal-box">
             <p className="cross-modal"onClick={handleClose} >X</p>
        <NavLink to="/">
            <h2 onClick={handleClose}  >Accueil</h2>
          
        </NavLink>
        <NavLink to="/connexion">
            <h2>Connexion</h2>

        </NavLink>
        <NavLink to="/inscription">
            <h2>Inscription</h2>

        </NavLink>
        <NavLink to="/classement">
            <h2>Classement</h2>

        </NavLink>
        <NavLink to="/contact">
            <h2>Contact</h2>

        </NavLink>
        <NavLink to="/teamkoala">
            <h2>TeamKoala</h2>

        </NavLink>
              </div>
          </Box>
        </Modal>
      </div>
    );
};

export default HomeModal;

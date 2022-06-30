import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./MyGroup.css";
import axios from 'axios';
import {useState} from 'react';
import { useNavigate } from "react-router-dom";



const MyGroup = ({name, nb_participants, nb_participants_max, hasBet, group_id, setDataGroup, dataGroup}) => {
  const token = sessionStorage.getItem('token');  
  const infosUser = JSON.parse(localStorage.getItem('infosUser'));
  const {id} = infosUser;
  const [askDelete, setAskDelete] = useState(false);
  
  const navigate = useNavigate();

  
  const handleClick= (e)=>{
    
    localStorage.removeItem('group_id');
    localStorage.setItem("group_id", e.target.value);
  }

  const handleAskDelete = ()=>{
    setAskDelete(true);
  }

  const handleDelete = () =>{
    
    axios.delete(`${process.env.REACT_APP_BASE_URL}/delete-group/group/${group_id}`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(response=>{
      
        
        const dataGroupFiltered = dataGroup.filter((item)=> item.group_id !== group_id);
        
        setDataGroup(dataGroupFiltered);     
        setAskDelete(false);
      

      
      
      return axios.get(`${process.env.REACT_APP_BASE_URL}/infos/user/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
    })
    .then(response =>{
      // localStorage.removeItem('infosUser');
      localStorage.setItem('infosUser', JSON.stringify(response.data[0]));
      navigate('/MyGroups');
      
    })
    .catch(error=>console.error(error));
  }
  
  return (
    <>
    
      <div className="my-group">
      <div className="name-of-group">
        <h1>{name}</h1> 
      </div>
      <div className="members">
        <h1>Membres {nb_participants}/{nb_participants_max}</h1>
      </div>
      <div className="my-group-button">
        {hasBet ?  <NavLink  style={{textDecoration:"none"}} to="/Groupclassement" > <Button variant="contained" className="btn-hover" style={{fontFamily:'Quantico',backgroundColor:'#332E38',marginRight:'15px',transition:"all .2s ease-in-out"}} value={group_id} onClick={handleClick} >Voir le classement</Button></NavLink> :
        <NavLink to="/myBets">
          <Button className="btn-hover" value={group_id} variant="contained" style={{fontFamily:'Quantico',backgroundColor:'#332E38',marginRight:'15px',transition:"all .2s ease-in-out"}} onClick={handleClick}>Voir le groupe</Button>
        </NavLink>
        }
        <Button className="btn-hover" variant="outlined"  style={{fontFamily:'Quantico' ,backgroundColor:'#592715',color:'white',transition:"all .2s ease-in-out"}} onClick={handleAskDelete}> Quitter le groupe</Button> 
        {askDelete &&
        <>
        <p style={{color:'black',marginTop:'5px'}}> Etes vous sur de vouloir quitter le groupe ?</p>
        <Button onClick={handleDelete}style={{color:'red'}}  > oui, je valide</Button>
        <Button onClick={()=>{setAskDelete(false)}} style={{color:'white'}} > Annuler </Button> 
        </>       
        }
      </div>
    </div>    
    </>
  );
};

export default MyGroup;

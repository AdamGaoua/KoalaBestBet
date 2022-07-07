import React from "react";
import Header from "../Header/Header";
import MyGroup from "./MyGroup/MyGroup";
import "./MyGroups.css";
import Footer from "../Footer/Footer";
import axios from 'axios';
import { useState } from "react";
import { useEffect } from 'react';
import {useForm} from 'react-hook-form';
import {Button, 
        Box, 
        FormControl, 
        InputLabel, 
        Modal, 
        Input} from '@mui/material';

import {saveAuthorization,RequestToJoinGroup, RequestToListsGroups} from '../../requests/index';


const MyGroups = () => {

  
  const infosUser = JSON.parse(localStorage.getItem('infosUser'));
  const token = sessionStorage.getItem('token');
  const [dataGroup,setDataGroup] = useState([]);
  const [link, setLink]=useState([]);
  const { register, handleSubmit } = useForm();
  const [error, setError]= useState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '5px solid #592715',
      boxShadow: 24,
      p: 4,
    };  


    
  async function onSubmit (){
    try {
      
      await saveAuthorization(token);
      const response = await RequestToJoinGroup(link);
      console.log(response);
      if (response.status===200){
        setError(response.data.error)
      }     
      if (response.status===201){
        requestListGroupsByUser(); 
      }
      setOpen(false);  
    } catch (error) {
      console.error(error);
    }
    

    // return axios.get(`${process.env.REACT_APP_BASE_URL}/invite/${link}`,{
    //   headers: {
    //     Accept: 'application/json',
    //     Authorization: 'Bearer ' + token
    //   }
    //   })
    //   .then(response=>{
    //     if (response.status===200){
    //       return setError(response.data.error)
    //     }     
    //     if (response.status===201){
    //      requestListGroupsByUser(); 
    //     }
    //     setOpen(false);        
    //   })
  }
  async function requestListGroupsByUser() {
    
    try {
      
      saveAuthorization(token);
      const response = await RequestToListsGroups(infosUser.id);
      setDataGroup(response.data);      
      localStorage.setItem(`infosMatchs`, JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
    }
    // axios.get(`${process.env.REACT_APP_BASE_URL}/list/groups/user/${infosUser.id}`, {
    //   headers: {
    //     Accept: 'application/json',
    //     Authorization: 'Bearer ' + token
    //   }
    //   })
    // .then(response => {      
    //   setDataGroup(response.data);      
    //   localStorage.setItem(`infosMatchs`, JSON.stringify(response.data));
   
    // })
    // .catch(error=>console.error(error))
  }
  
  useEffect(() => {
    requestListGroupsByUser();    
  },[]);



  return (
    <>
        <Header />
        <div className="MyGroups-content" style={{ backgroundImage: `url(/onevsone.jpg)` }}>
        {dataGroup.map(data=>(
          
          <MyGroup key={data.group_id} {...data} setDataGroup={setDataGroup} dataGroup={dataGroup} />
        ))}
        <div className='main'>
        {error &&
          <div className='alert'>
        <p>{error}</p>
        </div>
        }
        <Button className="btn-rejoindre-groupe"
        onClick={handleOpen} style={{fontFamily:'Quantico' ,backgroundColor:'#592715', color:'white',transition:"all .2s ease-in-out"}} > Rejoindre un groupe </Button>
        </div>
        <div className="mygroups-modal">
        <Modal
        open={open}
        onClose={handleClose}>
          <Box sx={style}
          borderRadius={5}>
          <form className="ModalJoin" onSubmit={handleSubmit(onSubmit)}>
            <FormControl variant="outlined">
              <InputLabel sx={{ width:'100px'}} htmlFor="link"> lien d'invitation </InputLabel>
              <Input
              sx={{ width:'300px'}}
              id="link"
              value={link}
              {...register('link')}
              onChange={(e)=> setLink(e.target.value)}
              />
            </FormControl>
            <Button
            type="submit"
            variant="contained" style={{fontFamily:'Quantico' ,backgroundColor:'#592715'}}> Valider </Button>
            </form>
          </Box>
        </Modal>
            </div>
            </div>
        <Footer />       
    </>
   
  );
};

export default MyGroups;

import React from 'react'
import {useState} from 'react';
import { useForm } from 'react-hook-form';
import './CreateGroup.css';
import { Input,
 Box,
InputLabel, 
Select, 
MenuItem,
Button
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import axios from 'axios';
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import {RequestToMatchsIncoming, saveAuthorization, RequestToCreateGroup, RequestToLogin} from '../../requests/index'





function CreateGroup (){

    const [name,setName] = useState('');
    const [number,setNumber] = useState('');
    const [data, setData] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [matchSelected, setMatchSelected]= useState([]);
    const [test, setTest]= useState([]);
    const [invitationChecked, setInvitationChecked] = useState(false);
    const [invitation, setInvitation]= useState(null);
      const [error, setError]= useState();
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const token = sessionStorage.getItem('token');
    const infosUser = JSON.parse(localStorage.getItem('infosUser'));
    const {invitation_link, id} = infosUser;   

    const handleSelectionModelChange = ((newSelectionModel) => {
        const id = newSelectionModel;                     
        setMatchSelected(id);        
        if (newSelectionModel.length <= 5) {
        setSelectionModel(newSelectionModel);
        }
    });
  
    useEffect(()=>{
        
        setTest([...matchSelected]);
    }, [matchSelected])

    const columns = [
        {field:'pari_id', hide:true},
        {field:'matchStarted', headerName:'Début de match',width: 300,headerAlign: 'center',align:"center"},
        {field:'matchName', headerName:'Nom du match', width: 800,headerAlign: 'center',align:"center"},
        {field:`teamName1`, headerName: `Nom de l'équipe 1`, width: 300,headerAlign: 'center',align:"center"},
        {field:`teamName2`, headerName:`Nom de l'équipe 2`, width: 300,headerAlign: 'center',align:"center"}       
    ]
  
    const rows = 
         data.map((value)=>{        
        // const date = value.begin_at;        
        // let datecheck = date.split('').reverse().join('');        
        // const myDate = datecheck.slice(10).split('').reverse().join('');
        // const myDateArray = myDate.split('');        
        // const newDate = `${myDateArray[8]}${myDateArray[9]}${myDateArray[7]}${myDateArray[5]}${myDateArray[6]}${myDateArray[4]}${myDateArray[0]}${myDateArray[1]}${myDateArray[2]}${myDateArray[3]}`
        
         return {id :value.id, pari_id:value.id, matchStarted: value.matchStarted, matchName: value.name, teamName1: value.opponents[0].opponent1.name, teamName2: value.opponents[0].opponent2.name}
         })
  
    async function requestMatchsIncoming(){  
        saveAuthorization(token);
            try {
                const response = await RequestToMatchsIncoming();
                const filteredData = response.data.filter((match)=> match.opponents[0] && match.begin_at!==null)
                setData(filteredData);
                
            } catch (error) {
                console.error(error);
            }      

    //     const options = {
    //     method: 'GET',
    //     url: `${process.env.REACT_APP_BASE_URL}/list/matchs/upcoming`,        
    //     headers: {
    //         Accept: 'application/json',
    //         Authorization: `Bearer ${token}`}
    //     };

    //     axios.request(options).then(response => {
    //     const filteredData = response.data.filter((match)=> match.opponents[0] && match.begin_at!==null)
    //     setData(filteredData);
        
    //     }).catch(function (error) {
    //     console.error(error);
    //     });
        
     }

    useEffect(() => {
        requestMatchsIncoming();        
      },[]);
    
    async function onSubmit (data){
        
        try {
            saveAuthorization(token);
            const response = await RequestToCreateGroup(data, matchSelected);
            console.log(response);
            if(response.status === 201) {
                setInvitation(response.data.invitation_link);
                const res = await RequestToLogin(id);
                    if (res.status===201){
                        localStorage.setItem('infosUser', JSON.stringify(res.data[0]));
                        setInvitationChecked(true); 
                    }
                    else{
                        setError(res.data.error)
                    }
            }            
        } catch (error) {
           console.error(error); 
        }

        // return axios.put(`${process.env.REACT_APP_BASE_URL}/create-group`,{name : data.name, nbJoueurs: parseInt(data.nbJoueurs), matchs_id: matchSelected},{
        //     headers: {
        //       Accept: 'application/json',
        //       Authorization: 'Bearer ' + token
        //     }
        // })
        // .then(response=>{       
        //     if(response.status === 201) {
        //         setInvitation(response.data.invitation_link);            
        //     return axios.get(`${process.env.REACT_APP_BASE_URL}/infos/user/${id}`, {
        //         headers: {
        //           Accept: 'application/json',
        //           Authorization: 'Bearer ' + token
        //         }
        //     })
        //     }
        //     else {
        //         setError(response.data.error)
        //     }
        // })
        // .then(response =>{
        //     localStorage.setItem('infosUser', JSON.stringify(response.data[0]));
        //     setInvitationChecked(true);
        // })
        // .catch(error=>{console.error("error", error)})
    }
    
    const handleClick = () => {
        navigate('/mygroups')
    }
    return (
        <div className="container">
        <Header />
        
        {invitation_link===null &&
        <>
        <div className="createGroup"
        style={{ backgroundImage: `url(/gangsters.jpg)` }}>
                            {error &&
                <div className='alert'>
                <p>{error}</p>
                 </div>
                    }
        <Box className="createGroup-box">
        
            <form className="createGroup-form" onSubmit={handleSubmit(onSubmit)}>
                <InputLabel style={{color:'white',fontFamily:'Quantico',fontSize:24}} htmlFor="name"> Nom du groupe </InputLabel> 
                <Input                
                id="name"
                style={{color:'white'}}
                placeholder="Nom du groupe"
                required 
                helperText="Aucun espace n'est accepté dans le nom du groupe"               
                value={name}
                {...register('name')}
                onChange={(e)=>setName(e.target.value)} />
                <InputLabel style={{color:'white'}} htmlFor="number" > Nombre de joueurs </InputLabel>
                <Select
                id="number"
                style={{color:'white'}}
                required
                value={number}
                {...register('nbJoueurs')}
                onChange={(e)=>setNumber(e.target.value)}
                >
                    <MenuItem
                    value={2}>2</MenuItem>
                    <MenuItem
                    value={3}>3</MenuItem>
                    <MenuItem
                    value={4}>4</MenuItem>
                    <MenuItem
                    value={5}>5</MenuItem>

                </Select>

                <DataGrid 
                
                className="createGroup-grid"
                style={{ height: 400, width: '100%',color:'white' }}
                columns={columns}
                rows= {rows}                
                pageSize={10}
                checkboxSelection
                selectionModel={selectionModel}
                value={matchSelected}
                onSelectionModelChange={handleSelectionModelChange}
                />
                
                <Button className="createGroup-btn" type="submit"style={{color:'white'}}> Générer un lien d'invitation</Button>
                {invitation_link!==null? <></> : <> </>}

            </form>
        </Box>
        </div>
        </>    
        }

        {invitation_link!==null && 
        <> 
        <div className='invitation-link'>
            <div className='invitation-link-message'>
        <p> Ton groupe a bien été créé ! Partage ce code d'invitation à tes potes !  <br/>
        <br/>
        <span style={{cursor:"pointer",color:"red"}}>
        {invitation_link} <br/>
        </span>

        <br/>
        </p>
        
        <p> Un seul groupe peut être créé par un joueur, n'hésite pas à quitter le groupe une fois les matchs terminés </p> 
        <Button variant="contained" style={{fontFamily:'Quantico',color:"white",backgroundColor:"rgba(89, 45, 29, 1)",marginTop:"25px"}}onClick={handleClick}> Retour à mes groupes </Button>
        </div>
        </div>
        </>}

        <Footer />  
        </div>
    )

}

export default CreateGroup;
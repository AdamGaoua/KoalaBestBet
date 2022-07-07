import imgConnexionLarge from '../../assets/images/imgConnexionLarge.jpg'
import './Connexion.css';
import {useState} from 'react';
import { useForm } from 'react-hook-form';
import {useNavigate, Link } from 'react-router-dom';
import {RequestToLogin, RequestToToken, saveAuthorization} from '../../requests/index'

import AccountCircle from '@mui/icons-material/AccountCircle';
import LockRoundedIcon from '@mui/icons-material/LockRounded';


import {
  Box,
  InputAdornment,
  FormControl,
  Input,
  InputLabel,
  Button,
  Link as ReLink
} from '@mui/material';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

function Connexion () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const { register, handleSubmit } = useForm();
  const [error, setError]= useState();
  const navigate = useNavigate();  
  
  async function onSubmit (data){     
    try {      
      const response = await RequestToToken(data);
      if (response.status===200){
        return setError(response.data.error)
      }     
      if (response.status===201){
        const token = response.data.token;
        const userId = response.data.userId;
        sessionStorage.setItem('token', response.data.token); 
        saveAuthorization(token);
        const res = await RequestToLogin(userId);
        if(res.status===201){
          localStorage.setItem('infosUser', JSON.stringify(res.data[0]))  
          navigate("/");
        }
      } 

    } catch (error) {
      console.error(error);
    }
  } 
    return (
            
      <div className="container">
        <Header />
        <div className="connexion">
        <img className ="connexion-img" src= {imgConnexionLarge} alt="un joueur de cs-go devant un ordinateur" />

        <Box className="connexion-box">
        <div className="connexion-form">
        <h1
        style={{fontFamily:'Quantico'}}
        className="Connexion-title">Se connecter</h1>

        <form  onSubmit={handleSubmit(onSubmit)}> 

          <div>
        <FormControl variant="outlined">  
         <InputLabel htmlFor="username" />
         
        <Input
          style={{fontFamily: 'Noto Sans', fontSize:'16px',color:'white'}}
          id="username"
          placeholder="email"
          type="email"
          required
          value={email}
          {...register("email", {required:"Requis"})}
          onChange={(e)=> setEmail(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          } />
        </FormControl>

          </div>
         
        <div className='connexion-input-password'>

        <FormControl style={{textDecoration:'none'}} > 
        <InputLabel htmlFor="password" />
        
        <Input
        style={{fontFamily: 'Noto Sans', fontSize:'16px',color:'white'}}
          type="password"
          placeholder="Mot de passe" 
          id="password"
          required
          value={password}
          {...register("password", {required:"Requis"})}
          onChange={(e)=> setPassword(e.target.value)}          
          startAdornment={
            <InputAdornment position="start">
              <LockRoundedIcon />
            </InputAdornment>
          }
          
          />
         </FormControl> 
          </div>
          
          <div>

        
        <Button className="connexion-no-account" ><ReLink  color="inherit" underline="none"> <Link style={{color:'white',textDecoration:'none'}} to="/inscription">Vous n'avez pas de compte ? Inscrivez-vous </Link> </ReLink>
        </Button>
        </div>
        <div>

        
        </div>
        <div>

        <Button type="submit"
        style={{fontFamily:'Quantico' ,backgroundColor:'#332E38'}}
        
        variant="contained"> 

        Se connecter </Button>

        {error &&
          <div className='alert'>
        <p>{error}</p>
        </div>
        }
        </div>

            
        
        </form>
        </div>
        </Box>
        </div>
        <Footer />
        </div>
    )
}


export default Connexion;
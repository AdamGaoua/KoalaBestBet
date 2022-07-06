import imgInscription from '../../assets/images/polizei2.png'
import './Inscription.css';

//Material ui - icon
import AccountCircle from '@mui/icons-material/AccountCircle'
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockRoundedIcon from '@mui/icons-material/LockRounded';


import {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import { useForm } from 'react-hook-form';

//Material ui component
import {
  Box,
  InputAdornment,
  FormControl,
  Input,
  InputLabel,
  Button
} from '@mui/material';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import {RequestToSignup,saveAuthorization} from '../../requests/index'


function Inscription () {
  
  const [username, setUsername]=useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordconfirm, setConfirmPassword] = useState('');
  const [error, setError] = useState();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  async function onSubmit(data){
    try {
      
      // saveAuthorization(token);
      const response = await RequestToSignup(data);
      
      if (response.status===200){
        
        setError(response.data);
      }
      if (response.status===201){
        
        navigate('/connexion')
      }
    } catch (error) {
      console.error(error);
    }

  }
  // axiosInstance.put('/signup-action', data)
  // .then(response=>{
    
  //   if (response.status===200){
      
  //     setError(response.data);
  //   }
  //   if (response.status===201){
      
  //     navigate('/connexion')
  //   }
  // })
  // .catch(error=> {console.error(error)})
  // 
  
    return (
        <div className="container">
          <Header />
        <div className="inscription">
        
        <img className="inscription-img" src={imgInscription} alt="un joueur de cs-go devant un ordinateur"/>
        <div className="inscription-box">
          <div className='form-box'>
          

        <Box 
        sx={{ '& > :not(style)': { m: 1 } }}>
        <h1 className="inscription-title">S'inscrire</h1>
        <form className="inscription-form" onSubmit={handleSubmit(onSubmit)}>

        <FormControl variant="outlined"> 
         <InputLabel htmlFor="pseudo"/>
         
        <Input
          id="pseudo"
          placeholder="Pseudo"
          style={{color:'white'}}
          required
          value={username}
          {...register('username', {required:'Requis'})}
          onChange={(e)=> setUsername(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          } />
          </FormControl>

          <FormControl>
        <InputLabel htmlFor="firstname"/>
          
        <Input
          id="firstname"
          style={{color:'white'}}
          placeholder="Prénom"
          required
          value={firstname}
          {...register('firstname')}
          onChange={(e)=> setFirstname(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          }
          
        />
        </FormControl>

        <FormControl>
        <InputLabel htmlFor="laststname" />
         
        <Input
          id="lastname"
          style={{color:'white'}}
          placeholder="Nom"
          required
          value={lastname}
          {...register('lastname',{required:"Requis"})}
          onChange={(e)=>setLastname(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          }
        
        />
        </FormControl>

        <FormControl>
        <InputLabel htmlFor="email" />
       
        <Input
          placeholder="Email"
          style={{color:'white'}}
          type="email"  
          id="email"
          required
          value={email}
          {...register('email')}
          onChange={(e)=>setEmail(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <AlternateEmailIcon />
            </InputAdornment>
          }
        
        />
        </FormControl>
        <FormControl>
        <InputLabel htmlFor="password" />
         
        <Input
          type="password"
          style={{color:'white'}}
          placeholder="Mot de passe" 
          id="password"
          required
          value={password}
          {...register('password')}
          onChange={(e)=>setPassword(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <LockRoundedIcon />
            </InputAdornment>
          }
        />
        </FormControl>
        
        <FormControl>
        <InputLabel htmlFor="confirmPassword"/>
         
        <Input
        style={{color:'white'}}
          placeholder="Confirmer votre mot de passe"
          type="password"
          id="passwordconfirm"
          required
          value={passwordconfirm}
          {...register('passwordconfirm')}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <LockRoundedIcon />
            </InputAdornment>
          }          
          />
        </FormControl>
        
        <Button type ="submit" style={{fontFamily:'Quantico',backgroundColor:'#332E38'}} variant="contained"        
        > 
        Valider </Button>
        {error && 
        <div className='alert'>
        <p>{error}</p>
        </div>
        }
        </form>
        
        </Box>
        </div>
        </div>
        </div>
        <Footer />
        </div>
    )
}

export default Inscription;
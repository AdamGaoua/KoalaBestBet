import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Profil.css';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';

import {saveAuthorization, RequestToDeleteUser,RequestToUpdateUser} from '../../requests';

import {Box, 
        Card,
        CardContent,
        Typography,
        InputLabel,
        Input,
        FormControl,
        Modal,
        Button,
} from '@mui/material'

function Profil(){
    const token = sessionStorage.getItem('token');
    const infosUser = JSON.parse(localStorage.getItem('infosUser'));    
    const {koalacoin, avatar_path, id, grade} = infosUser;

    const [actualFirstname,setActualFirstname]= useState(infosUser.firstname);
    const [actualLastname, setActualLastname] = useState(infosUser.lastname);
    const [actualUsername, setActualUsername] = useState(infosUser.username);    
    const [actualEmail, setActualEmail] = useState(infosUser.email);

    const [username, setUsername] = useState(actualUsername);
    const [firstname, setFirstname] = useState(actualFirstname);
    const [lastname, setLastname] = useState(actualLastname);
    const [email, setEmail] = useState(actualEmail);    
    const [password, setPassword] = useState('');
    const [error, setError] = useState();

    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'rgba(54, 89, 89, 0.65)',
        color: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius:'15px',
        fontWeigth:'bold',
      };
      const style2 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width:"500px",
        heigth:"100px",
        bgcolor: 'rgba(54, 89, 89, 0.65)',
        textAlign: 'center',
        border: '2px solid #000',
        color: "#C7C7C7",
        boxShadow: 24,
        p: 4,
        borderRadius:'15px',
        fontWeigth:'bold',
      };

    async function onSubmit(data){
       
        try {
           saveAuthorization(token);
           const response = await RequestToUpdateUser(id, data);
          
           if (response.status===201){
                setOpen(false);
                setActualEmail(data.email);
                setActualUsername(data.username);
                setActualFirstname(data.firstname);
                setActualLastname(data.lastname);          
            }
            if (response.status===200){
                setError(response.data.error);                
            }

        } catch (error) {
        console.error(error); 
        }
    }
  
    async function handleDelete(){
        try {
            saveAuthorization(token);
            const response = await RequestToDeleteUser(id);
            if (response.status===201){
                localStorage.removeItem('infosUser');
                sessionStorage.removeItem('token');
                localStorage.removeItem('infosMatchs');
                localStorage.removeItem('invitationLink');
                navigate("/");
            }

        } catch (error) {
            console.error(error);
        }       
    }
    return (
        <div className="profil">
            <Header />
            <div  className='profil-content'style={{ backgroundImage: `url(/gaming.jpg)` }} >

            <div className="profil-box" >
            
            <Card style={{background:'transparent',marginTop:'30px'}}>
                <div className='profil-info'>

                <CardContent>
                    <Typography style={{fontFamily:'Quantico',backgroundColor:'#592715',color:'white',fontSize:'24px',width:'200px'}}> Mon Profil </Typography>
                </CardContent>
                <div className='avatar-profil'>
                <img className='img-profil' src={avatar_path} alt="koala avatar"/>

                </div>
                <p> Pseudo : {actualUsername}</p>
                <p> Prénom : {actualFirstname}</p>
                <p> Nom de famille : {actualLastname}</p>
                <p> E-mail: {actualEmail}</p>
                <p> KoalaCoin : {koalacoin}</p>
                <p> Grade : {grade} </p>
                </div>
                <div className='btn-profil'>

                <Button 
                style={{fontFamily:'Quantico',backgroundColor:'#332E38',color:'white'}}
                onClick={handleOpen}> Modifier mes infos de profil </Button>
                </div>
                <div className='modal-profil'>

                <Modal
                
                open={open}
                onClose={handleClose}>
                    <Box fontWeight="fontWeightBold"
                    sx={style}>
                
                    <form className="profil-form" onSubmit={handleSubmit(onSubmit)}>

                        <FormControl fontWeight="fontWeightBold" variant="outlined"> 
                        <InputLabel style={{color:"#C7C7C7"}} htmlFor="pseudo">Pseudo</InputLabel>
                        
                        <Input
                        margin="dense"
                        id="pseudo"
                        style={{color:"#C7C7C7"}}
                        placeholder="Pseudo"
                        value={username}
                        {...register('username')}
                        onChange={(e)=> setUsername(e.target.value)}
                            
                        />
                        </FormControl>

                        <FormControl  style={{marginTop:'35px'}}>
                        <InputLabel style={{color:"#C7C7C7"}} htmlFor="firstname">Prénom</InputLabel>
                        
                        <Input
                        id="firstname"
                        style={{color:"#C7C7C7"}}
                        margin="dense"
                        placeholder="Prénom"
                        value={firstname}
                        {...register('firstname')}
                        onChange={(e)=> setFirstname(e.target.value)}
                        />
                        </FormControl>

                        <FormControl style={{marginTop:'35px'}}>
                        <InputLabel style={{color:"#C7C7C7"}} htmlFor="laststname">Nom</InputLabel>
                        
                        <Input
                        id="lastname"
                        style={{color:"#C7C7C7"}}
                        placeholder="Nom"
                        value={lastname}
                        {...register('lastname')}
                        onChange={(e)=>setLastname(e.target.value)}
                        />
                        </FormControl>

                        <FormControl style={{marginTop:'35px'}}>
                        <InputLabel style={{color:"#C7C7C7"}} htmlFor="email">Email</InputLabel>

                        <Input
                        placeholder="Email"
                        style={{color:"#C7C7C7"}}
                        type="email"  
                        id="email"
                        value={email}
                        {...register('email')}
                        onChange={(e)=>setEmail(e.target.value)}
                        />
                        </FormControl>
                        <FormControl style={{marginTop:'35px'}} >
                        <InputLabel style={{color:"#C7C7C7"}} htmlFor="password">Mot de passe actuel</InputLabel>
                        
                        <Input
                        type="password"
                        style={{color:"#C7C7C7"}}
                        placeholder="Mot de passe" 
                        id="password"
                        required
                        value={password}
                        {...register('password')}
                        onChange={(e)=>setPassword(e.target.value)}
                        />
                        </FormControl>
                        
                        <Button style={{fontFamily:'Quantico',backgroundColor:'#332E38',marginTop:'50px',marginLeft:'50px'}}
                        type="submit"
                        variant="contained"> Valider </Button>
                        {error &&
                        <div className='alert1'>
                            <p> {error} </p>
                        </div>
                        }
                    </form>
                    </Box>

            </Modal>
                        </div>
        

        
                <div className='btn-supprimer'>

                <Button
                style={{fontFamily:'Quantico',backgroundColor:'red',color:'white',marginTop:'15px'}}
                onClick={handleOpenDelete}
                > supprimer mon profil </Button>
                </div>
                </Card>
                </div>

            
            
            <div className='modal-delete'>
            <Modal  open={openDelete}
                onClose={handleCloseDelete}>
            <Box fontWeight="fontWeightBold" sx={style2}>
                <p> Etes vous sur de supprimer votre compte ?</p>
                <Button style={{fontFamily:'Quantico',backgroundColor:'GREEN',marginTop:'50px',marginLeft:'50px', color:'white'}} onClick={handleDelete}> oui, je valide</Button>
                <Button style={{fontFamily:'Quantico',backgroundColor:'RED',marginTop:'50px',marginLeft:'50px', color:'white'}} onClick={()=>{setOpenDelete(false)}}> Annuler </Button>

            </Box> 
            </Modal>
                    </div>
            

            <Footer />
        </div>
            </div>
    )
}

export default Profil;
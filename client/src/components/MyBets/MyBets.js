import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./MyBets.css";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import {FormLabel, 
        RadioGroup,
        FormControl,
        Box,
        FormControlLabel,
        Radio,
        Button
 } from '@mui/material'

import { useNavigate } from "react-router-dom";
import { NavLink} from 'react-router-dom';
import {saveAuthorization, RequestToListsMatchs} from '../../requests/index'

const MyBets = () => {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();  
  const group_id = JSON.parse(localStorage.getItem('group_id'));
  const [error, setError] = useState();
  const [dataMatch, setDataMatch] = useState([]);
  const [value, setValue] = useState({});
 

  useEffect(() => {
    let options = {};
    dataMatch.forEach((match, i) => {
      options[`value${i}`] = 0;
    });
    setValue({ ...options });
  }, []);

  async function requestListMatchsByGroup() {
    try {
      saveAuthorization(token);
      const response = await RequestToListsMatchs(group_id);
      if(response.status === 201) {
      setDataMatch(response.data);
      } else {
      setError(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
    // axios.get(`${process.env.REACT_APP_BASE_URL}/list/matchs/group/${group_id}`,{
    //   headers: {
    //     Accept: 'application/json',
    //    Authorization: 'Bearer ' + token
    //   }
    // })
    // .then(response => {
    //   if(response.status === 201) {
    //     setDataMatch(response.data);
    //   } else {
    //     setError(response.data.error);
    //   }
    // })
    // .catch(error=>console.error(error));
  }
  useEffect(() => {
    requestListMatchsByGroup();    
  },[]); 
  
  const handleChange = (event, inputValue) =>{
    event.persist();
    const name = event.target.name;
    setValue({ ...value, [name]: inputValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = {
      bets: Object.values(value).map(id=> +id)
    }
    

    axios.put(`${process.env.REACT_APP_BASE_URL}/create-bet/group/${group_id}`, result,{
      headers: {
        Accept: 'application/json',
       Authorization: 'Bearer ' + token
      }
    })
    .then(response => {
      
      navigate("/mygroups");
      
      
    })
    .catch(error=>console.error(error));
  }
  
  
  
  return (
      <>
      <Header />
      <div
        className="mybets-content"
        style={{ backgroundImage: `url(/csgo-tireur.jpg)` }}
        >
        <img className="mybets-csgo-logo" src="./csgo-logo.svg" alt="2 tireurs de cs go"/>
        <div className="main">
        {error &&
          <div className='alert'>
        <p>{error}</p>
        <NavLink  className="btn-header"to="/mygroups">
              <Button  variant="contained"
              style={{fontFamily:'Quantico' ,backgroundColor:'#592715'}}>Mes Groupes</Button>
            </NavLink>
          </div>
        }
        
         {!error &&
      <div className="main-bet">
      <form type="submit" onSubmit={handleSubmit}>
        <Box>
            <FormControl style={{ flexDirection:'row',color:'white' }}>              
              <FormLabel className="title-bets" style={{ fontFamily:'Quantico',color: "#592715",fontWeight:'bold', fontSize:"20px" }}> choisis ton gagnant</FormLabel>

            
              {dataMatch && dataMatch.map((match, i) => (
              
              <div className="my-bet-confirmation" key={match.match_id}>
              <div className="bet-box-choice">
              <div className="bet-box">
                  <div className="img-logo-box">
                    <div>
                      {match.team1_logo===null &&
                      <img className="img-team-logo" src="/unknown.png" alt={match.team1_name}/>
                      }
                      {match.team1_logo!==null && 
                      
                    <img className="img-team-logo" src={match.team1_logo} alt={match.team1_name} />
                      }

                    </div>
                    <div>
                <img className="img-team-logo" src="/VS.png" alt="versus" />

                    </div>
                    <div>
                    {match.team2_logo===null &&
                      <img className="img-team-logo" src="/unknown.png" alt={match.team2_name}/>
                      }
                      {match.team2_logo!==null && 
                      
                    <img className="img-team-logo" src={match.team2_logo} alt={match.team2_name} />
                      }

                    </div>
                  </div>
                <RadioGroup
                name={`value${i}`}
                value={value[`value${i}`]}
                onChange={handleChange}
                style={{ fontFamily:'Quantico',flexDirection:'row',color:'white' }}
                >
                  <div className="bets-team">
                    <div>
                <FormControlLabel style={{ fontFamily:'Quantico',color: "white" }}value = {match.team1_id} control={<Radio />} label={match.team1_name} />
                
                    </div>
                    <div>
                <FormControlLabel style={{ fontFamily:'Quantico',color: "white" }}value = {match.team2_id} control={<Radio />} label={match.team2_name} />

                    </div>
                  </div>
                
                </RadioGroup>
              </div>
              </div>
              </div>
              ))}
              </FormControl> 
              </Box>            
          

              <div className="my-bets-button">
              <Button style={{ fontFamily:'Quantico',color: "white",backgroundColor:'#332E38',width:200 }} className="button-mybets" type="submit"> Valider </Button>
              </div>
            </form>  
            </div>   
            }       
            </div>
      </div>
            
              <Footer />
      </>
      
                       
  );
};

export default MyBets;

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './RankingByGroup.css';
import {Button} from '@mui/material';

import { saveAuthorization, RequestToRankingGroup, RequestToLogin,RequestToVerifyBet,RequestToUpdatePoints } from '../../requests';

import  {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink} from 'react-router-dom';


function RankingByGroup (){
    const [classementGroup, setClassementGroup] = useState([]);
    const navigate = useNavigate();
    const group_id = localStorage.getItem('group_id');    
    const token = sessionStorage.getItem('token');
    const infosUser = JSON.parse(localStorage.getItem('infosUser'));
    const {id} = infosUser;    
    const [error, setError] = useState();

    async function requestRankingGroup(){
        try {
            saveAuthorization(token);
            const response = await RequestToRankingGroup(group_id);
            if (response.status === 200) {
                setError(response.data.error);
            }
            if (response.status===201){
                setClassementGroup(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function requestVerifyBet (){

        try {
          saveAuthorization(token);
          const response = await RequestToVerifyBet(group_id);
          if (response.status===201){
            const res = await RequestToUpdatePoints(group_id);
            if (res.status===200){
                setError(res.data.error)
            }
            if (res.status===201){
                requestRankingGroup();
                const resp = await RequestToLogin(id);
                if (resp.status===201){
                    localStorage.setItem('infosUser', JSON.stringify(resp.data[0]))  
                }
            }
          } else {
              setError(response.data.error)
          }  
        } catch (error) {
            console.error(error);
        }
    }
        useEffect(()=>{
            
            if (!group_id){
                navigate('/mygroups')
            }
            requestRankingGroup();
            
            requestVerifyBet(); 
        },[])
   
    return (
        <div >

        <Header />
                
                <div className="groupClassement">
                <div className='classementTable'>
                {error &&
                <div className='alert'>
                <p>Statut :{error}</p>
                <NavLink  className="btn-header1"to="/mygroups">
                <Button  variant="contained"
                style={{fontFamily:'Quantico' ,backgroundColor:'#592715'}}>Mes Groupes</Button>
                </NavLink>
                </div>
                } 
                {classementGroup && classementGroup.playerRank && classementGroup.betFromUser &&
                <div className='table1'>  
                <table className="tftable" border="1">
                    
                <caption><h2>Rappel de mes pronostics pour le groupe : {classementGroup.playerRank[0].name}</h2> </caption>
                    <thead>
                        <tr>
                            
                            <th>Nom du match</th>
                            <th>Gagnant pronostiqué</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                    {classementGroup.betFromUser.map((bet)=>(
                
                        <tr key={bet.id}>
                            <td>{bet.name}</td>
                            <td>{bet.winner_bet}</td>
                                    
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>  
                }
            {classementGroup && classementGroup.playerRank && 
            <div className='table2'>
            <table className="tftable" border="1">
            <caption><h2>Classement actuel des membres du groupe</h2> </caption>
                <thead>
                    <tr >
                        <th>Pseudo</th>
                        <th>Nombre de match</th>
                        <th>Score actuel</th>
                    </tr>
                </thead>
                <tbody>
                {classementGroup.playerRank.map((classement)=>(
            
                    <tr key={classement.id}>
                        <td>{classement.username}</td>
                        <td>{classement.bet_total_number}</td>
                        <td>{classement.winning_bet}</td>            
                    </tr>
                ))}
                </tbody>
            </table>
           </div>  
            }
            {classementGroup && classementGroup.matchLive && classementGroup.matchLive.length >0 &&
            <div className='table3'>
            <table className="tftable" border="1">
            <caption><h2>Match en cours </h2> </caption>
                <thead>
                    <tr>
                        
                        <th> Equipe 1</th>
                        <th> Score </th>                       
                        <th> Equipe 2</th>
                    </tr>
                </thead>
            <tbody>
                {classementGroup.matchLive.map((classement)=>(
                    
                    <tr key={classement.id}>
                        
                        <td>{classement.team1_name}
                        {classement.team1_logo===null && 
                        <img className="img-team-logo-rank" src="/unknown.png"/>
                        }
                        {classement.team1_logo!==null && 
                        <img className="img-team-logo-rank" src={classement.team1_logo} />
                        }</td>
                        <td> {classement.team1_score} - {classement.team2_score}</td>                        
                        <td>{classement.team2_name} 
                        {classement.team2_logo===null && 
                        <img className="img-team-logo-rank" src="/unknown.png"/>
                        }
                        {classement.team2_logo!==null && 
                        <img className="img-team-logo-rank" src={classement.team2_logo} />
                        }</td>

                    </tr>
                ))}
            </tbody>
         </table>
                 
             </div>
            }
            {classementGroup && classementGroup.matchIncoming && classementGroup.matchIncoming.length > 0  &&
            <>
            <table className="tftable" border="1">
            <caption><h2>Match à venir</h2> </caption>
                <thead>
                    <tr>
                        <th>début du match</th>
                        <th>Equipe 1</th>
                        <th>Equipe 2</th>
                    </tr>
                </thead>
                <tbody>
                {classementGroup.matchIncoming.map((classement)=>(
                    <tr key={classement.id}>
                        <td>{classement.match_begin_at} </td>
                        <td>{classement.team1_name}
                        {classement.team1_logo===null && 
                        <img className="img-team-logo-rank" src="/unknown.png"/>
                        }
                        {classement.team1_logo!==null && 
                        <img className="img-team-logo-rank" src={classement.team1_logo} />
                        }</td>
                        <td>{classement.team2_name} 
                        {classement.team2_logo===null && 
                        <img className="img-team-logo-rank" src="/unknown.png"/>
                        }
                        {classement.team2_logo!==null && 
                        <img className="img-team-logo-rank" src={classement.team2_logo} />
                        }</td>
                     </tr>

                ))}
                </tbody>
            </table>               
            </>
            }
            {classementGroup && classementGroup.matchFinished && classementGroup.matchFinished.length > 0  &&
            <>
            <table className="tftable" border="1">
            <caption> <h2>Matchs finis </h2></caption>
                <thead>
                    <tr>
                        
                        <th> Equipe 1</th>
                        <th> Score </th>
                        <th> Equipe 2</th>
                    </tr>
                </thead>
                <tbody>
                {classementGroup.matchFinished.map((classement)=>(
                     <tr key={classement.id}>
                        <td>{classement.team1_name}
                        {classement.team1_logo===null && 
                        <img className="img-team-logo-rank" src="/unknown.png"/>
                        }
                        {classement.team1_logo!==null && 
                        <img className="img-team-logo-rank" src={classement.team1_logo} />
                        }</td>
                        <td>{classement.team1_score} - {classement.team2_score} </td>                        
                        <td>{classement.team2_name} 
                        {classement.team2_logo===null && 
                        <img className="img-team-logo-rank" src="/unknown.png"/>
                        }
                        {classement.team2_logo!==null && 
                        <img className="img-team-logo-rank" src={classement.team2_logo} />
                        }</td>
                     </tr>

                ))}
                </tbody>
            </table>               
            </>
            }
             

        <Footer />
        </div>
        </div>
        </div>
        
        )
        
}

export default RankingByGroup;
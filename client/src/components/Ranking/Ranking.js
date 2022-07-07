import React from "react";
import "./Ranking.css";
import {useState, useEffect} from 'react';
import {RequestToRanking} from '../../requests/index'


const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  
async function requestRanking () {
    try {
      const response = await RequestToRanking();
      if (response.status===201){
        setRanking(response.data)
      }
    } catch (error) {
      console.error(error);
    }
   }

  useEffect(()=>{
    requestRanking();
  }, [])
  
  return (
    <div id="idranking" className="ranking">
      <h1>Classement général</h1>
      <div className="form-container">
        
      </div>
      <div className="ranking-array">
        <table className="tftable" border="1">

          <thead>
            <tr>
              <th> Position </th>
              <th> Pseudo </th>
              <th> KoalaCoins </th>
              <th> Grade </th>
            </tr>
          </thead>
          <tbody>
          
          {ranking && ranking.map((player)=>(

          <tr key={player.position}>
            <td> {player.position}</td>
            <td> {player.username}</td>
            <td> {player.koalacoin}</td>
            <td> {player.grade}</td>
          </tr> 
          ))}
        
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ranking;

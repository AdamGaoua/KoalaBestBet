import "./App.css";
import Inscription from "../Inscription/Inscription";
import { Routes, Route } from "react-router-dom";
import Connexion from "../Connexion/Connexion";
import Home from "../Home/Home";
import CreateGroup from "../CreateGroup/CreateGroup";
import MyBets from "../MyBets/MyBets";
import MyGroups from "../MyGroups/MyGroups";
import Profil from '../Profil/Profil';
import RankingByGroup from "../RankingByGroup/RankingByGroup";
import NotFound from "../NotFound/NotFound";
import TeamKoala from "../TeamKoala/TeamKoala";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/groupe" element={<CreateGroup />} />
        <Route path="/mybets" element={<MyBets />} />
        <Route path="/groupClassement" element={<RankingByGroup />}/>
        <Route path="/Team-Koala" element={<TeamKoala />} />
        <Route path="/mygroups" element={<MyGroups />} />
        <Route path="/Profil" element={<Profil />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

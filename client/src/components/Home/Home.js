import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import HomeConcept from "../HomeConcept/HomeConcept";
import HomeMain from "../HomeMain/HomeMain";
import Ranking from "../Ranking/Ranking";
const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <HomeMain />
      <HomeConcept />
      <Ranking />
      <Footer />
    </div>
  );
};

export default Home;

import "./Header.css";

import HeaderNotConnected from "./HeaderNotConnected";
import HeaderConnected from "./HeaderConnected";
import { useEffect } from "react";
import { useState } from "react";

function Header() {
  
  const data = () => {
    return sessionStorage.getItem("token");
  
  } 
  const [isLogged, setIsLogged] = useState(false);
  
  useEffect(() => {
    if (data()) {
      setIsLogged(true); }
    },[isLogged]);
    

  

  return (
    <div className="header">
      {isLogged ? <HeaderConnected  isLogged={isLogged} setIsLogged={setIsLogged}/> : <HeaderNotConnected  />}
    </div>
  );
}

export default Header;

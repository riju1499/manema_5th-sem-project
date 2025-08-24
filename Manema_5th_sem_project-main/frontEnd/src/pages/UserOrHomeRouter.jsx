import { useContext, useEffect, useLayoutEffect } from "react"
import { AuthContext } from "../handles/AuthProvider"
import HomePage from "./HomePage";

const UserOrHomeRouter = () => {

    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

    useLayoutEffect(() => {
      const access = localStorage.getItem('accessToken');
      const refresh = localStorage.getItem('refreshToken');
      
      if(access && refresh){
        console.log('logged in');
        setIsAuthenticated(true);
      }else{
        setIsAuthenticated(false);
      }
    }, []); 

  return (
    <>
        {/* {isAuthenticated ? (
            <UserHomePage />
        ): (
            <HomePage />
        )} */}
        <HomePage />
    </>
  )
}

export default UserOrHomeRouter

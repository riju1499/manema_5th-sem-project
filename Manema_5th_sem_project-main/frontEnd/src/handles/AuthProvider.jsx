import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext(null);

const AuthProvider = ({children}) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [animationPlayed, setAnimationPlayed] = useState(false);

  return (
    <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, animationPlayed, setAnimationPlayed}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

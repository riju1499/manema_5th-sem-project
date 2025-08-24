import React, { createContext, useContext, useState } from 'react';

export const AdminAuthContext = createContext(null);

const AdminAuthProvider = ({children}) => {

    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    return (
        <AdminAuthContext.Provider value={{isAdminLoggedIn, setIsAdminLoggedIn}}>
            {children}
        </AdminAuthContext.Provider>
  )
}

export default AdminAuthProvider;

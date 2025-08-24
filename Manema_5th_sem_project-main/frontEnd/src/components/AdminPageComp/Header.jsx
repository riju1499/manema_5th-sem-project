import { faCircleInfo, faGauge, faMinus, faPlus, faPlusMinus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AdminAuthContext } from '../../handles/AdminAuthProvider'

const Header = () => {

    const navigate = useNavigate();

    const {setIsAdminLoggedIn} = useContext(AdminAuthContext);

    const logOUt = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAdminLoggedIn(false);
        navigate('/admin');
    }

  return (
    <div className='h-[10vh] w-full px-6 py-3 flex justify-between relative'>
        <div className='h-auto w-1/6 text-4xl flex justify-center items-center gap-2 text-orange-500 hover:text-orange-400'>
            <FontAwesomeIcon icon={faGauge} />
            <Link to={'/admin'}>DashBoard</Link>
        </div>
        <div className='h-auto w-1/6 text-xl flex justify-center items-center'>
            <button onClick={logOUt} className=' flex justify-center items-center gap-2 text-gray-500 hover:text-gray-300'>
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>Log Out</span>
            </button>
        </div>
        <div className='h-auto w-full bg-[rgba(30,30,30,0.2)] absolute top-[10vh] left-0 flex justify-center items-center gap-6'>
            <Link className='text-orange-600 hover:text-orange-400 flex justify-center items-center gap-2 px-4 py-2 hover:bg-gray-800' to={''}>
            <FontAwesomeIcon icon={faPlusMinus} />
            <span>Add Movies</span>
            </Link>
            {/* <Link className='text-orange-600 hover:text-orange-400 flex justify-center items-center gap-2 px-4 py-2 hover:bg-gray-800' to={'details'}>
            <FontAwesomeIcon icon={faCircleInfo} />
            <span>Show Details</span>
            </Link> */}
            <Link className='text-orange-600 hover:text-orange-400 flex justify-center items-center gap-2 px-4 py-2 hover:bg-gray-800' to={'removeMovies'}>
            <FontAwesomeIcon icon={faPlusMinus} />
            <span>Remove Movies</span>
            </Link>
        </div>
    </div>
  )
}

export default Header

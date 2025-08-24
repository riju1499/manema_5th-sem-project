import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { AdminAuthContext } from '../handles/AdminAuthProvider'
import AdminDashBoard from './AdminDashBoard';
import { useNavigate } from 'react-router-dom';
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { backend_api } from '../handles/apiHandler';
import { toast } from 'react-toastify';
import { ProgressBar, Puff, Vortex } from 'react-loader-spinner'

const AdminRoutePage = () => {

    const navigate = useNavigate();

    const {isAdminLoggedIn, setIsAdminLoggedIn} = useContext(AdminAuthContext);


    useLayoutEffect(() => {

        const refreshToken = localStorage.getItem('refreshToken');
        const accessToken = localStorage.getItem('accessToken');
        if(refreshToken && accessToken) {
            setIsAdminLoggedIn(true);
        }

    }, []);



    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const handleInputs = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const [loading, setLoading] = useState(false);
    const logIn = async (e) => {
        setLoading(true);
        e.preventDefault();
    
        if(formData.username == '' || formData.password == ''){
            toast("Both fields are required.", {
                className: 'custom-toast',
                progressClassName: 'custom-progress-bar',
            });
            setLoading(false);
            return;
        }

        try {
            const isAdminResponse = await backend_api.post('verifyAdmin/', formData);
            const { is_admin } = isAdminResponse.data;
            if(is_admin){
                const response = await backend_api.post('token/', formData);
                const accessToken = response.data.access;
                const refreshToken = response.data.refresh;
                console.log("Yo access token: " + accessToken + "\nYo chai refresh token: " + refreshToken)
                
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                setIsAdminLoggedIn(true);
                navigate('/admin'); 
            }else{
                toast("You are not an admin.", {
                    className: 'custom-toast-fail',
                    progressClassName: 'custom-progress-bar-fail',
                });
            }


        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    
        setFormData({
            username: "",
            password: "",
        });
    };


  return (
    <>
        {isAdminLoggedIn ? (
            <AdminDashBoard />
        ): (
        <div className='h-screen w-screen flex flex-col gap-4 justify-center items-center bg-theme-dark'>
            <form onSubmit={logIn} className='h-[50vh] w-[26%] rounded-xl shadow-dense bg-gray-950 flex flex-col gap-10 px-4 py-2 items-center relative' >
                <div className='mb-4 mt-2'>
                    <h1 className='text-2xl text-center font-bold text-gray-200'>Hey There Admin !</h1>
                </div>
                <div className='flex flex-col justify-center items-center w-[85%]'>
                    <label htmlFor="username" className='flex gap-1 justify-center items-center self-start text-gray-300'>
                        <FontAwesomeIcon icon={faUser} />
                        <span>Admin Username</span>
                    </label>
                    <input value={formData.username} onChange={handleInputs} type="text" name='username' className='bg-gray-950 border-b border-orange-500 p-2 focus:outline-none w-full text-gray-400' autoComplete='off'/>
                </div>
                <div className='flex flex-col justify-center items-center w-[85%]'>
                    <label htmlFor="password" className='flex gap-1 justify-center items-center self-start text-gray-300'>
                        <FontAwesomeIcon icon={faKey} />
                        <span>Admin Password</span>
                    </label>
                    <input value={formData.password} onChange={handleInputs} type="password"  name='password' className='bg-gray-950 border-b border-orange-500 p-2 focus:outline-none w-full text-gray-400' autoComplete='off'/>
                </div>
                <div className='flex flex-col justify-center items-center h-[10%] w-[85%]'>
                    <button onClick={logIn} type='submit' className='w-full bg-orange-500 text-black rounded h-[100%] hover:bg-yellow-500 font-medium flex justify-center items-center'>
                        {loading ? (
                            <Vortex
                            visible={true}
                            height="30"
                            width="30"
                            ariaLabel="vortex-loading"
                            wrapperStyle={{}}
                            wrapperClass="vortex-wrapper"
                            colors={['white', 'black', 'gray', 'blue', 'brown', 'red']}
                            />
                        ): (
                            <span>Submit</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
        )}
    </>
  )
}

export default AdminRoutePage

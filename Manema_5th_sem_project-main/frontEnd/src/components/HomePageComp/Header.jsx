import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faPassport, faReceipt, faSearch, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { toast } from 'react-toastify';
import { AuthContext } from '../../handles/AuthProvider';
import { FormShowContext } from '../../pages/HomePage';
import { backend_api } from '../../handles/apiHandler';

const Header = () => {
    //for authentication of the user, whether the user is logged in or not
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

    const {showForm, setShowForm} = useContext(FormShowContext);

    useEffect(() => {
        showForm ? setShowSignUpForm(true) : setShowSignUpForm(false);
    }, [showForm]);

    //refs here
    const logoRef = useRef(null);
    const rightNavigationRef = useRef(null);
    
    //form show state variable here
    const [showSignUpForm, setShowSignUpForm] = useState(false);

    //animation played state variable here
    const {animationPlayed, setAnimationPlayed} = useContext(AuthContext);

    //movie name from the search bar
    const [movieName, setMovieName] = useState('');

    //to navigate or redirect users
    const navigate = useNavigate();

    //setting the serach movie var here and re-directing
    const initiateSearchMovie = (e) => {
        e.preventDefault();
        if(movieName.trim() === ''){
            toast("Type a movie's name first.", {
                className: 'custom-toast',
                progressClassName: 'custom-progress-bar',
            });
            return;
        }
        navigate(`${movieName}`);
        setMovieName('');
    }

    const hanldeInput = (e) => {
        setMovieName(e.target.value);
    }

    //animation for headers here
    useGSAP(() => {

        const headerTimeline = gsap.timeline();

        if(!animationPlayed){
            headerTimeline.fromTo(logoRef.current.children, {
                opacity: 0,
            }, {
                delay: 0.4,
                opacity: 1,
                duration: 1.6,
                ease: 'power1.out',
            })
    
            headerTimeline.fromTo(rightNavigationRef.current.children, {
                opacity: 0,
                y: -15,
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
                ease: 'power1.out',
            })
            setAnimationPlayed(true);   
        }

    }, []);

    //form refs here
    const formModalRef = useRef(null); 

    //handling clicking in the from background 
    const handleFormModal = () => {
        if(formModalRef.current){
            formModalRef.current.classList.add('hidden');
            formModalRef.current.classList.remove('flex');
            setShowForm(false);
        }
    }

    //handling clicking inside the form
    const hanldeModalFormClick = (e) => {
        e.stopPropagation();
    }


    //form vairables here
    const [rePassword, setRePassword] = useState('');
    const [signUpFormData, setSignUpFormData] = useState({
        username: '',
        password: '',
    })
    const [signInFormData, setSignInFormData] = useState({
        usernameTwo: '',
        passwordTwo: '',
    })


    //form data here

    //handling sign up form data
    const hanldeSignUpFormData = (e) => {
        if(e.target.name == 'rePassword'){
            setRePassword(e.target.value);
        }else{
            setSignUpFormData({...signUpFormData, [e.target.name]: e.target.value});
        }
    }

    //handling sign in form data
    const handleSignInFormData = (e) => {
        setSignInFormData({...signInFormData, [e.target.name]: e.target.value});
    }



    //var for handling loading
    const [loading, setLoading] = useState(false);

    //form submits here

    //sign up form submit
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(signUpFormData.username == '' || signUpFormData.password == '' || rePassword == ''){
            toast("You must fill up every fields in order to sign up.", {className: "custom-toast-fail", progressClassName: "custom-progress-bar-fail"});
        }


        if(signUpFormData.password !== rePassword){
            toast('The passwords do not match', {className: "custom-toast-fail", progressClassName: "custom-progress-bar-fail"});
            return;
        }

        try{
            const formData = new FormData();
            formData.append('username', signUpFormData.username);
            formData.append('password', signUpFormData.password);
            const response = await backend_api.post('', formData);
            console.log(response)
            if(response.status == 201){
                toast.success("Created the account successfully.", {className: "custom-toast"});
                try{
                    const loginResponse = await backend_api.post('token/', formData);
                    const {access, refresh} = loginResponse.data;
                    localStorage.setItem('accessToken', access);
                    localStorage.setItem('refreshToken', refresh);

                    if(loginResponse.status == 200){
                        toast.success("You have logged in successfully.", {className: 'custom-toast'});
                        setSignInFormData({
                            usernameTwo: '',
                            passwordTwo: '',
                        })
                        formModalRef.current.classList.remove('flex');
                        formModalRef.current.classList.add('hidden');
                        setIsAuthenticated(true);
                        navigate('/');
                    }
                }catch(error){
                    if(error.response){
                        toast.error('Failed to log in.', {className: "custom-toast-fail", progressClassName: "custom-progress-bar-fail"});
                    }else if(error.request){
                        toast.error('Failed to connect to the server, Please try again later.', {className: "custom-toast-fail", progressClassName: "custom-progress-bar-fail"});
                    }else{
                        toast.error('Some error has occurred.', {className: "custom-toast-fail", progressClassName: "custom-progress-bar-fail"});
                        console.log(error);
                    }
                }finally{
                    setSignUpFormData({
                        username: "",
                        password: "",
                    })
                    setLoading(false);
                }

            }
        }catch(error){
            if(error.response){
                toast.error("Something went wrong when trying to register, please try again later.", {className: "custom-toast-fail"});
            }else if(error.request){
                toast.error("Couldn't connect with the server.", {className: "custom-toast-fail"});
            }else{
                toast.error("Something went wrong, please try again later.", {className: "custom-toast-fail"});
            }
        }finally{
            setSignUpFormData({
                username: "",
                password: "",
            })
            setLoading(false);
        }
    }

    //sign in form submit
    const hanldeSignInSubmit = (e) => {
        e.preventDefault();

        if(signInFormData.usernameTwo == '' || signInFormData.passwordTwo == ''){
            toast('Both fields are required.', {className: "custom-toast-fail", progressClassName: "custom-progress-bar-fail"});
            return;
        }
        
        const login = async () => {
            try{
                const formData = new FormData();
                formData.append('username', signInFormData.usernameTwo);
                formData.append('password', signInFormData.passwordTwo);
                
                const response = await backend_api.post('token/', formData);
                const {access, refresh} = response.data;
                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);

                if(response.status == 200){
                    toast.success("You have logged in successfully.", {className: 'custom-toast'});
                    setSignInFormData({
                        usernameTwo: '',
                        passwordTwo: '',
                    })
                    formModalRef.current.classList.remove('flex');
                    formModalRef.current.classList.add('hidden');
                    setIsAuthenticated(true);
                    navigate('/');
                }
            }catch(error){
                if(error.response){
                    toast.error('Failed to log in.', {className: "custom-toast-fail", progressClassName: "custom-progress-bar-fail"});
                }else if(error.request){
                    toast.error('Failed to connect to the server, Please try again later.', {className: "custom-toast-fail", progressClassName: "custom-progress-bar-fail"});
                }else{
                    toast.error('Some error has occurred.', {className: "custom-toast-fail", progressClassName: "custom-progress-bar-fail"});
                    console.log(error);
                }
            }
        }
        login();
        return;
    }

    //for handling the form popup
    useEffect(() => {
        if(showForm){
            formModalRef.current.classList.remove('hidden');
            formModalRef.current.classList.add('flex');
        }
    }, [showForm]);

    const logOut = (e) => {
        e.preventDefault();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        toast.success('Successfully logged out.', {className: "custom-toast"});
        navigate('/');
    }

  return (
    <div className='h-[8vh] w-full flex items-center justify-between px-6 py-2 relative z-[100]'>
        <div className='h-full w-1/2 '>
            <Link ref={logoRef} to={'/'} className='relative z-[10] cursor-default'>
                <div className='absolute z-[20] top-1 -left-3 h-[100%] w-[12vw] cursor-pointer'></div>
                <img className='h-full scale-[4] ml-[5%] mt-[2%]' src={logo} alt="logo" />
            </Link>
        </div>
        <div ref={rightNavigationRef} className='h-full w-1/2 flex items-center justify-end gap-12 mt-2'>
            <div className='h-full'>
                <form onSubmit={initiateSearchMovie} className='h-full flex items-center gap-4'>
                    <button>
                        <FontAwesomeIcon icon={faSearch} className='cursor-pointer text-2xl hover:text-white hover:text-2xl transition-hover duration-150 -mr-1 active:text-xl'/>
                    </button>
                    <input value={movieName} onChange={hanldeInput} className={`${isAuthenticated ? 'h-[80%]' : 'h-[90%]'} rounded bg-gray-700 px-2 py-1 focus:outline-none focus:outline-gray-500 text-gray-200`} type="text" placeholder='Search Movies' />
                </form>
            </div>
            <button onClick={() => {formModalRef.current.classList.remove('hidden'); formModalRef.current.classList.add('flex'); setShowSignUpForm(true)}} className={`h-[80%] px-4 bg-orange-600 text-gray-800 rounded hover:px-5 active:px-4 hover:bg-orange-500 transition-hover duration-150 font-bold ${isAuthenticated ? 'hidden' : ''}`}>Sign Up</button>
            <button onClick={() => {formModalRef.current.classList.remove('hidden'); formModalRef.current.classList.add('flex'); setShowSignUpForm(false)}} className={`hover:outline hover:outline-orange-600 px-5 h-[80%] transition-hover duration-100 hover:text-gray-200 rounded active:outline-orange-500 ${isAuthenticated ? 'hidden' : ''}`}>Log In</button>
            <button onClick={logOut} className={`hover:border border-b hover:border-orange-600 px-5 h-[80%] transition-hover duration-100 hover:text-gray-200 rounded active:border-orange-500 ${isAuthenticated ? '' : 'hidden'}`}>Log Out</button>


            <div onClick={handleFormModal} ref={formModalRef} className='h-screen w-screen fixed top-0 left-0 hidden bg-theme-light-dark z-[1000] justify-center items-center'>

                {showSignUpForm ? (
                    <div className={`h-auto w-1/2 flex justify-center items-center`}>
                    <form onSubmit={handleSignUpSubmit} onClick={hanldeModalFormClick} className='h-[75vh] w-[55%] rounded-xl shadow-dense bg-gray-950 flex flex-col gap-10 px-4 py-2 items-center relative' >
                        <div onClick={() => {formModalRef.current.classList.add('hidden');}} className='absolute top-4 right-4'>
                            <FontAwesomeIcon icon={faXmark} className='hover:text-white cursor-pointer'/>
                        </div>
                        <div className='mb-4 mt-2'>
                            <h1 className='text-2xl text-center font-bold text-gray-200'>Sign Up From Here</h1>
                        </div>
                        <div className='flex flex-col justify-center items-center w-[85%]'>
                            <label htmlFor="username" className='flex gap-1 justify-center items-center self-start text-gray-300'>
                                <FontAwesomeIcon icon={faUser} />
                                <span>Username</span>
                            </label>
                            <input type="text" name='username' onChange={hanldeSignUpFormData} value={signUpFormData.username} className='bg-gray-950 border-b border-orange-500 p-2 focus:outline-none w-full' autoComplete='off'/>
                        </div>
                        <div className='flex flex-col justify-center items-center w-[85%]'>
                            <label htmlFor="username" className='flex gap-1 justify-center items-center self-start text-gray-300'>
                                <FontAwesomeIcon icon={faKey} />
                                <span>Password</span>
                            </label>
                            <input type="password" name='password' onChange={hanldeSignUpFormData} value={signUpFormData.password} className='bg-gray-950 border-b border-orange-500 p-2 focus:outline-none w-full' autoComplete='off'/>
                        </div>
                        <div className='flex flex-col justify-center items-center w-[85%]'>
                            <label htmlFor="username" className='flex gap-1 justify-center items-center self-start text-gray-300'>
                                <FontAwesomeIcon icon={faKey} />
                                <span>Re-Type Password</span>
                            </label>
                            <input type="password" name='rePassword' onChange={hanldeSignUpFormData} value={rePassword} className='bg-gray-950 border-b border-orange-500 p-2 focus:outline-none w-full' autoComplete='off'/>
                        </div>
                        <div className='flex flex-col justify-center items-center h-[8%] w-[85%]'>
                            <button type='submit' className='w-full bg-orange-500 text-black rounded h-[100%] hover:bg-yellow-500 font-medium'>Submit</button>
                        </div>
                        <div className='flex flex-col justify-center items-center w-[85%]'>
                            <h4>Already have an account? <button onClick={() => setShowSignUpForm(false)} className='underline text-blue-600'>Login Instead.</button></h4>
                        </div>
                    </form>
                    </div>
                ): (
                    <div className='h-auto w-1/2 flex justify-center items-center'>
                    <form onSubmit={hanldeSignInSubmit} onClick={hanldeModalFormClick} className='h-[60vh] w-[55%] rounded-xl shadow-dense bg-gray-950 flex flex-col gap-10 px-4 py-2 items-center relative' >
                        <div onClick={() => {formModalRef.current.classList.add('hidden');}} className='absolute top-4 right-4'>
                            <FontAwesomeIcon icon={faXmark} className='hover:text-white cursor-pointer'/>
                        </div>
                        <div className='mb-4 mt-2'>
                            <h1 className='text-2xl text-center font-bold text-gray-200'>Sign In From Here</h1>
                        </div>
                        <div className='flex flex-col justify-center items-center w-[85%]'>
                            <label htmlFor="usernameTwo" className='flex gap-1 justify-center items-center self-start text-gray-300'>
                                <FontAwesomeIcon icon={faUser} />
                                <span>Username</span>
                            </label>
                            <input type="text" name='usernameTwo' value={signInFormData.usernameTwo} onChange={handleSignInFormData}  className='bg-gray-950 border-b border-orange-500 p-2 focus:outline-none w-full' autoComplete='off'/>
                        </div>
                        <div className='flex flex-col justify-center items-center w-[85%]'>
                            <label htmlFor="passwordTwo" className='flex gap-1 justify-center items-center self-start text-gray-300'>
                                <FontAwesomeIcon icon={faKey} />
                                <span>Password</span>
                            </label>
                            <input type="password" value={signInFormData.passwordTwo} onChange={handleSignInFormData} name='passwordTwo' className='bg-gray-950 border-b border-orange-500 p-2 focus:outline-none w-full' autoComplete='off'/>
                        </div>
                        <div className='flex flex-col justify-center items-center h-[10%] w-[85%]'>
                            <button type='submit' className='w-full bg-orange-500 text-black rounded h-[100%] hover:bg-yellow-500 font-medium'>Submit</button>
                        </div>
                        <div className='flex flex-col justify-center items-center w-[85%]'>
                            <h4>Don't have an account? <button onClick={() => setShowSignUpForm(true)} className='underline text-blue-600'>Sign Up Instead.</button></h4>
                        </div>
                    </form>
                </div>
                )}  
                


            </div>
        </div>
    </div>
  )
}   

export default Header

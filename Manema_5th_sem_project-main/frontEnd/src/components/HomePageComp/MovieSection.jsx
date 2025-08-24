import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useContext, useRef } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { AuthContext } from '../../handles/AuthProvider';

const MovieSection = () => {

  //refs here
  const scrollIntoRef = useRef(null);
  const movieCardsRef = useRef(null);

  //animation solely for now_playing link
  const nowPlayingRef = useRef(null);

  const {isAuthenticated, animationPlayed, setAnimationPlayed} = useContext(AuthContext);

  useGSAP(() => {

    const movieSectionTimeline = gsap.timeline();

    if(!animationPlayed){
      movieSectionTimeline.fromTo(scrollIntoRef.current.children, {
        opacity: 0,
        y: 10,
      }, {
        delay: 1.8,
        y:0,
        opacity: 1,
        duration: 1,
        ease: 'power1.out',
      })

      movieSectionTimeline.fromTo(movieCardsRef.current, {
        opacity: 0,
      }, {
        opacity: 1,
        duration: 1,
        ease: 'power1.out',
      })
      setAnimationPlayed(true);
    }



  }, []);



  // const handleScroll = () => {
  //   if (scrollIntoRef.current) {
  //     scrollIntoRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };


  return (
    <div className='h-auto w-full relative -top-[8vh]'>
        <div ref={scrollIntoRef} className='h-[8vh] w-full flex justify-center items-center gap-8'>
          <NavLink className={`hover:text-gray-200`} to={'popular'}>Popular Movies</NavLink>
          <NavLink className={`hover:text-gray-200`} to={'top_rated'}>Top Rated Movies</NavLink>
          <NavLink className={`hover:text-gray-200`} to={'upcoming'}>Upcoming Movies</NavLink>
          {isAuthenticated && (
            <NavLink className={`hover:text-gray-200`} to={'now_playing'}>Now Playing</NavLink>
          )}
        </div>

        <div ref={movieCardsRef}>
          <Outlet />
        </div>
    </div>
  )
}

export default MovieSection;
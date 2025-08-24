import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { movie_api } from '../../handles/apiHandler';
gsap.registerPlugin(ScrollTrigger);

const MovieCards = (props) => {

  const movie = props.movie;

  //refs here
  const movieCardRef = useRef(null);
  const movieCardDatailsRef = useRef(null);
  const movieCardButtonsRef = useRef(null);


  useGSAP(() => {

    gsap.fromTo(movieCardRef.current, {
      y: 10,
      opacity: 0,
    }, {  
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: movieCardRef.current,
        start: 'top bottom',
        end: 'bottom center',
        scrub: true,
        // markers: true,
      }
    })


  }, []);

  const movieCardHover = () => {
    gsap.to(movieCardRef.current, {
      boxShadow: '4px 4px 10px orange',
      duration: 0.2,
      ease: 'power1.out',
    })

    gsap.to(movieCardDatailsRef.current.children, {
      y: -20,
      duration: 0.4,
      ease: 'power1.out',
    })
    gsap.to(movieCardButtonsRef.current.children, {
      y: -18,
      duration: 0.4,
      ease: 'power1.out',
    })
  }

  const movieCardUnHover = () => {

    gsap.to(movieCardRef.current, {
      boxShadow: 'none',
    })

    gsap.to(movieCardDatailsRef.current.children, {
      y: 0,
      duration: 0.2,
      ease: 'power1.out',
    })
    gsap.to(movieCardButtonsRef.current.children, {
      y: 0,
      duration: 0.4,
      ease: 'power1.out',
    })
  }


  return (
    <div ref={movieCardRef} onMouseEnter={movieCardHover} onMouseLeave={movieCardUnHover} className='h-[54vh] w-[20%] rounded relative px-4 py-4 flex flex-col justify-around gap-12 border border-yellow-900'>

      <div className="h-[30%] w-full relative z-[40]"></div>

      <div ref={movieCardDatailsRef} className='relative z-[90] text-gray-300 flex flex-col gap-4'>
        <h1 className='text-xl text-yellow-500 font-playwrite line-clamp-2 font-bold'>{movie.title}</h1>
        <p className='line-clamp-4 text-sm w-[80%]'>{movie.overview ? movie.overview : "Movie Details Unavailable"}</p>
      </div>

      <div ref={movieCardButtonsRef} className='relative z-[90] flex justify-between w-full text-sm'>
      {props.isNowPlaying && (
        <button className='py-2 px-4 bg-orange-900  text-black rounded hover:px-5 active:px-4 hover:bg-orange-500 transition-hover duration-150'>Book</button>
      )}
        <Link to={`/movie/${movie.id}`} className={`hover:border hover:border-orange-600 px-5 py-2 transition-hover duration-100 hover:text-gray-200 rounded active:border-orange-500 ${props.isNowPlaying ? '' : "border-l"}`}>See Details</Link>
      </div>


      <div className={`h-full w-full absolute top-0 left-0 rounded z-[40] opacity-80 ${movie?.backdrop_path ? 'bg-cover' : 'bg-none'}`} style={movie?.backdrop_path ? { backgroundImage: `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')` } : {}}> </div>

      <div className='h-full w-full absolute top-0 left-0 z-[50] bg-gradient-to-t from-[rgba(0,0,6,1)] via-[rgba(12,12,21,0.6)] to-[rgba(0,0,6,0.4)]from-[10%]'></div>
    </div>
  )
}

export default MovieCards

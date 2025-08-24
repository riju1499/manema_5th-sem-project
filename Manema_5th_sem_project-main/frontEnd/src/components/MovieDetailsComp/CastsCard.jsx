import React, { useState } from 'react'

const CastsCard = ({cast}) => {
    

    const [hovering, setHovering] = useState(false);

  return (
    <div  onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} className='h-[50vh] w-[15vw] relative z-[10] flex-shrink-0'>
        <img src={`https://image.tmdb.org/t/p/w200${cast.profile_path}`} className='h-full w-full rounded-xl opacity-80' alt="movie_cast_profile_image" />
        <div className={`absolute top-0 left-0 h-full w-full bg-gradient-to-t flex flex-col px-4 py-2 justify-end from-theme-dark via-[rgba(0,0,0,0.8)] to-transparent ${hovering ? 'block' : 'hidden'} text-gray-400 pointer-events-none pb-8`}>
            <h1 className='text-gray-300 text-xl'>{cast.name}</h1>
            <h2>as {cast.character}</h2>
        </div>
    </div>
  )
}

export default CastsCard

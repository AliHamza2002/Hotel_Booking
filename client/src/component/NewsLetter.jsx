import React from 'react'
import { assets } from '../assets/assets'
import Title from './Title'

const NewsLetter = () => {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 pb-20 md:pb-24 bg-transparent">
      <div className="flex flex-col items-center text-center max-w-5xl w-full mx-auto rounded-2xl px-4 sm:px-6 md:px-8 py-12 md:py-16 bg-gray-900 text-white">
        
        <Title 
          tittle="Stay Inspired"  
          subTittle="Join our newsletter and be the first to discover new destinations, exclusive offers, and travel inspiration." 
        />

        {/* Input + Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 w-full max-w-md">
          <input 
            type="email" 
            className="bg-white/10 px-4 py-3 border border-white/20 rounded-md outline-none w-full text-sm placeholder-gray-400 focus:ring-1 focus:ring-white/50" 
            placeholder="Enter your email" 
          />
          <button 
            className="flex items-center justify-center gap-2 group bg-black px-5 sm:px-7 py-3 rounded-md active:scale-95 transition-all hover:bg-white hover:text-black"
          >
            Subscribe
            <img 
              src={assets.arrowIcon} 
              alt="arrow-icon" 
              className="w-3.5 invert group-hover:invert-0 group-hover:translate-x-1 transition-all duration-300" 
            />
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-gray-400 mt-6 text-xs sm:text-sm leading-relaxed">
          By subscribing, you agree to our Privacy Policy and consent to receive updates.
        </p>
      </div>
    </div>
  )
}

export default NewsLetter




// import React from 'react'
// import { assets } from '../assets/assets'
// import Title from './Title'

// const NewsLetter = () => {
//   return (
//     <div className='px-24 pb-24'>

//     <div className="flex flex-col items-center max-w-5xl lg:w-full rounded-2xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-30 bg-gray-900 text-white">
           
//            <Title tittle="Stay Inspired"  subTittle="Join our newsletter and be the first to discover new destination, exclusive offers, and travel inspiration. "/>

//             <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
//                 <input type="text" className="bg-white/10 px-4 py-2.5 border border-white/20 rounded outline-none max-w-66 w-full" placeholder="Enter your email" />
//                 <button className="flex items-center justify-center gap-2 group bg-black px-4 md:px-7 py-2.5 rounded active:scale-95 transition-all">Subscribe
//                     <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 invert group-hover:translate-x-1 transition-all' />
//                 </button>
//             </div>
//             <p className="text-gray-500 mt-6 text-xs text-center">By subscribing, you agree to our Privacy Policy and consent to receive updates.</p>
//         </div>
//     </div>
//   )
// }

// export default NewsLetter
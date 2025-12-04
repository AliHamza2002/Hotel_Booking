import React from 'react'
import Title from './Title'
import { testimonials } from '../assets/assets'
import StarRating from './StarRating'

const Testimonial = () => {
  return (
    <div className="flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 bg-slate-50 pt-16 md:pt-20 pb-24 md:pb-32">
      <Title 
        tittle="What Our Guest Say" 
        subTittle="Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world." 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-16 w-full max-w-7xl">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial.id} 
            className="bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full"
          >
            {/* User Info */}
            <div className="flex items-center gap-3">
              <img 
                className="w-12 h-12 rounded-full object-cover" 
                src={testimonial.image} 
                alt={testimonial.name} 
              />
              <div>
                <p className="font-playfair text-lg font-semibold">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.address}</p>
              </div>
            </div>

            {/* Star Rating — unchanged logic */}
            <div className="flex items-center gap-1 mt-4">
              <StarRating />
            </div>

            {/* Review Text */}
            <p className="text-gray-600 text-sm md:text-base mt-4 italic leading-relaxed">
              “{testimonial.review}”
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonial










// import React from 'react'
// import Title from './Title'
// import { testimonials } from '../assets/assets'
// import StarRating from './StarRating'

// const Testimonial = () => {
//   return (
//     <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-32'>
//         <Title tittle={"What Our Guest Say"} 
//         subTittle={"Discover why discerning travelers consistenly choose QuickStay for their exclusive and luxurious accomodations around the world. "}/>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 w-full max-w-7xl ">
//                 {testimonials.map((testimonial) => (
//                     <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow">
//                         <div className="flex items-center gap-3">
//                             <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
//                             <div>
//                                 <p className="font-playfair text-xl">{testimonial.name}</p>
//                                 <p className="text-gray-500">{testimonial.address}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-1 mt-4">
//                             <StarRating/>
//                         </div>
//                         <p className="text-gray-500 max-w-90 mt-4">"{testimonial.review}"</p>
//                     </div>
//                 ))}
//             </div>
//     </div>
//   )
// }

// export default Testimonial
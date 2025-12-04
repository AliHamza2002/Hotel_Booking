import React from "react";
import Title from "../component/Title";
import { experienceData } from "../assets/assets";

const Experience = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="w-full h-[300px] md:h-[380px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000')",
        }}
      >
        <div className="bg-black/40 w-full h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Experiences
          </h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-16">
        {/* Title Component */}
        <Title
          tittle="Unforgettable Experiences"
          subTittle="Discover activities, tours, adventures, and special moments designed to elevate your stay."
        />

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {experienceData.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-56 object-cover"
              />

              {/* Content */}
              <div className="p-5 flex flex-col">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-600 mt-2 text-sm">
                  {item.description}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <p className="font-semibold text-indigo-600 text-lg">
                    {item.price}
                  </p>
                  <span className="text-gray-500 text-sm">{item.location}</span>
                </div>

                <button className="mt-6 py-2 rounded-lg font-semibold text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-indigo-600 text-white rounded-2xl p-10 text-center shadow-lg">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Ready for your next adventure?
          </h2>
          <p className="mt-3 opacity-90">
            Book experiences curated especially for you.
          </p>

          <button className="mt-6 px-6 py-2 text-indigo-600 bg-white rounded-lg font-medium hover:bg-gray-100 transition-all">
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
};

export default Experience;

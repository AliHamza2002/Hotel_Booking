import React, { useState, useEffect } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { roomAPI, bookingAPI } from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarRating from "../component/StarRating";
import HotelCard from "../component/HotelCard";

const CheckBox = ({ label, selected = false, onChange = () => { } }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => { } }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [openFilter, setOpenFilter] = useState(false);
  const [allRooms, setAllRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = [
    { label: "$ 0 to 500", min: 0, max: 500 },
    { label: "$ 500 to 1000", min: 500, max: 1000 },
    { label: "$ 1000 to 2000", min: 1000, max: 2000 },
    { label: "$ 2000 to 3000", min: 2000, max: 3000 }
  ];
  const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];

  useEffect(() => {
    fetchRooms();
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [allRooms, selectedRoomTypes, selectedPriceRanges, selectedSort]);

  const fetchRooms = async () => {
    try {
      setLoading(true);

      // Get search parameters from URL
      const city = searchParams.get('city');
      const checkIn = searchParams.get('checkIn');
      const checkOut = searchParams.get('checkOut');
      const guests = searchParams.get('guests');

      let response;

      // If search parameters exist, use booking search endpoint
      if (city || checkIn || checkOut || guests) {
        const params = {};
        if (city) params.city = city;
        if (checkIn) params.checkIn = checkIn;
        if (checkOut) params.checkOut = checkOut;
        if (guests) params.guests = guests;

        response = await bookingAPI.searchAvailableRooms(params);
      } else {
        // Otherwise get all rooms
        response = await roomAPI.getAllRooms();
      }

      const roomList = response.data?.data || [];
      setAllRooms(roomList);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      setAllRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allRooms];

    // Filter by room type
    if (selectedRoomTypes.length > 0) {
      filtered = filtered.filter(room =>
        selectedRoomTypes.includes(room.roomType)
      );
    }

    // Filter by price range
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(room => {
        return selectedPriceRanges.some(range => {
          const priceRange = priceRanges.find(pr => pr.label === range);
          return room.pricePerNight >= priceRange.min && room.pricePerNight <= priceRange.max;
        });
      });
    }

    // Apply sorting
    if (selectedSort) {
      if (selectedSort === "Price Low to High") {
        filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
      } else if (selectedSort === "Price High to Low") {
        filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
      } else if (selectedSort === "Newest First") {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }

    setFilteredRooms(filtered);
  };

  const handleRoomTypeChange = (checked, label) => {
    if (checked) {
      setSelectedRoomTypes([...selectedRoomTypes, label]);
    } else {
      setSelectedRoomTypes(selectedRoomTypes.filter(type => type !== label));
    }
  };

  const handlePriceRangeChange = (checked, label) => {
    if (checked) {
      setSelectedPriceRanges([...selectedPriceRanges, label]);
    } else {
      setSelectedPriceRanges(selectedPriceRanges.filter(range => range !== label));
    }
  };

  const handleSortChange = (label) => {
    setSelectedSort(label);
  };

  const clearFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedPriceRanges([]);
    setSelectedSort("");
  };

  // Helper function to get amenities as array
  const getAmenitiesArray = (amenities) => {
    if (!amenities) return [];
    if (Array.isArray(amenities)) return amenities;
    if (typeof amenities === 'object') {
      return Object.keys(amenities).filter(key => amenities[key]);
    }
    return [];
  };

  // Get search info for display
  const getSearchInfo = () => {
    const city = searchParams.get('city');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');

    if (!city && !checkIn && !checkOut && !guests) return null;

    const parts = [];
    if (city) parts.push(city);
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn).toLocaleDateString();
      const checkOutDate = new Date(checkOut).toLocaleDateString();
      parts.push(`${checkInDate} - ${checkOutDate}`);
    }
    if (guests) parts.push(`${guests} guest${guests > 1 ? 's' : ''}`);

    return parts.join(' • ');
  };

  const searchInfo = getSearchInfo();

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-36 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32">
      {/* ===== Left Column: Room List ===== */}
      <div className="w-full lg:w-3/4">
        {/* Header */}
        <div className="flex flex-col items-start text-left mb-6">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-[40px]">
            {searchInfo ? 'Search Results' : 'Hotel Rooms'}
          </h1>
          {searchInfo ? (
            <div className="mt-2">
              <p className="text-sm md:text-base text-gray-500/90">
                Showing available rooms for: <span className="font-medium text-gray-700">{searchInfo}</span>
              </p>
              <button
                onClick={() => {
                  navigate('/rooms');
                  window.scrollTo(0, 0);
                }}
                className="text-sm text-blue-600 hover:underline mt-1"
              >
                Clear search
              </button>
            </div>
          ) : (
            <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-2xl">
              Take advantage of our limited-time offers and special packages to
              enhance your stay and create unforgettable memories.
            </p>
          )}
          {(selectedRoomTypes.length > 0 || selectedPriceRanges.length > 0 || selectedSort) && (
            <p className="text-sm text-gray-600 mt-2">
              Showing {filteredRooms.length} of {allRooms.length} rooms
            </p>
          )}
        </div>

        {/* Rooms */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading rooms...</div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {allRooms.length === 0
                ? `No rooms available${searchInfo ? ' for your search criteria' : ''}`
                : 'No rooms match your filter criteria'}
            </p>
            {allRooms.length > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                Clear Filters
              </button>
            )}
            {searchInfo && allRooms.length === 0 && (
              <button
                onClick={() => {
                  navigate('/rooms');
                  window.scrollTo(0, 0);
                }}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                View All Rooms
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room, index) => (
              <HotelCard key={room._id} room={room} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* ===== Right Column: Filter ===== */}
      <div className="bg-white w-full lg:w-80 border border-gray-300 text-gray-600 rounded-xl shadow-sm mb-8 lg:mb-0 lg:mt-16">
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-2.5 border-gray-300 ${openFilter ? "border-b" : "lg:border-b"
            }`}
        >
          <p className="text-base font-medium text-gray-800">FILTER</p>
          <div className="text-xs cursor-pointer">
            <span
              onClick={() => setOpenFilter(!openFilter)}
              className="lg:hidden"
            >
              {openFilter ? "HIDE" : "SHOW"}
            </span>
            <span
              onClick={clearFilters}
              className="hidden lg:block hover:underline"
            >
              CLEAR
            </span>
          </div>
        </div>

        {/* Filter content */}
        <div
          className={`${openFilter ? "h-auto" : "h-0 lg:h-auto overflow-hidden"
            } transition-all duration-500`}
        >
          {/* Popular Filter */}
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Room Type</p>
            {roomTypes.map((roomType, index) => (
              <CheckBox
                key={index}
                label={roomType}
                selected={selectedRoomTypes.includes(roomType)}
                onChange={handleRoomTypeChange}
              />
            ))}
          </div>

          {/* Price Range */}
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRanges.map((range, index) => (
              <CheckBox
                key={index}
                label={range.label}
                selected={selectedPriceRanges.includes(range.label)}
                onChange={handlePriceRangeChange}
              />
            ))}
          </div>

          {/* Sort By */}
          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSort === option}
                onChange={handleSortChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;

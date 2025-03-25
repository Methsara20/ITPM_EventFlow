import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowLeft, FiMapPin, FiInfo } from "react-icons/fi";

const VenueSelection = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const fetchVenues = async (searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      // Using OpenStreetMap/Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=10`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error("No venues found for this location. Try a different search term.");
      }
      
      // Get photos using Wikimedia Commons
      const venuesWithPhotos = await Promise.all(
        data.map(async (venue) => {
          try {
            // First try with the full display name
            let thumbnail = await fetchPhoto(venue.display_name);
            
            // If no result, try with just the main part of the name
            if (!thumbnail) {
              const mainName = venue.display_name.split(",")[0];
              thumbnail = await fetchPhoto(mainName);
            }
            
            return {
              ...venue,
              photo: thumbnail || "https://via.placeholder.com/300x200?text=No+Image+Available"
            };
          } catch {
            return {
              ...venue,
              photo: "https://via.placeholder.com/300x200?text=No+Image+Available"
            };
          }
        })
      );
      
      setVenues(venuesWithPhotos);
      setHasSearched(true);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching venues:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhoto = async (name) => {
    try {
      const photoResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=400&titles=${encodeURIComponent(name)}&origin=*`
      );
      const photoData = await photoResponse.json();
      const pages = photoData.query?.pages;
      return pages ? Object.values(pages)[0]?.thumbnail?.source : null;
    } catch {
      return null;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchVenues(query);
    }
  };

  const handleSelectVenue = (venue) => {
    navigate("/ted", {
      state: {
        selectedVenue: {
          display_name: venue.display_name,
          photo: venue.photo,
          lat: venue.lat,
          lon: venue.lon,
          address: venue.address
        }
      }
    });
  };

  const getAddressString = (address) => {
    if (!address) return "";
    const parts = [
      address.road,
      address.neighbourhood,
      address.suburb,
      address.city || address.town || address.village,
      address.country
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <FiArrowLeft className="text-xl" />
        </button>
        <h1 className="text-3xl font-bold">Select Event Location</h1>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-gray-400">
            <FiSearch className="text-xl" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for locations (e.g., 'beach in Maldives', 'hotel in Paris')"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="ml-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Tip: Be specific with your location for better results
        </p>
      </form>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Searching for venues...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0 text-red-500">
              <FiInfo className="text-xl" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Search Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <button 
                onClick={() => fetchVenues(query)}
                className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : hasSearched && venues.length === 0 ? (
        <div className="text-center py-12">
          <FiMapPin className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No venues found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or using more specific terms.
          </p>
        </div>
      ) : venues.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {venues.length} {venues.length === 1 ? "Venue" : "Venues"} Found
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div 
                key={venue.place_id} 
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSelectVenue(venue)}
              >
                <div className="relative h-48 bg-gray-100">
                  <img 
                    src={venue.photo} 
                    alt={venue.display_name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="font-bold text-white text-lg truncate">
                      {venue.display_name.split(",")[0]}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  {venue.address && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      <FiMapPin className="inline mr-1 text-gray-400" />
                      {getAddressString(venue.address)}
                    </p>
                  )}
                  <button className="mt-3 w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                    Select Venue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <FiSearch className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Search for venues</h3>
          <p className="mt-1 text-sm text-gray-500">
            Enter a location above to find potential event venues
          </p>
        </div>
      )}
    </div>
  );
};

export default VenueSelection;
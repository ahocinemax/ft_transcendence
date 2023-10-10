import React, { useState } from 'react';
import "./SearchComponent.css"

interface SearchProps {
  onSearch: (query: string) => void;
}

const SearchComponent: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // const handleSearch = () => {
  //   onSearch(searchQuery);
  // };

  return (
    <div className="searchbar_component_div">
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* <button className="search_button" onClick={handleSearch}>BOUTON?</button> */}
    </div>
  );
};

export default SearchComponent;

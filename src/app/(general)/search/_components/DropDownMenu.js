"use client";

import { useState } from "react";

function CityFilter({ filterCitys, onFilterCitysChange }) {
  const citys = [
    "aliso viejo",
    "anaheim",
    "brea",
    "buena park",
    "costa mesa",
    "cypress",
    "dana point",
    "fountain valley",
    "fullerton",
    "garden grove",
    "huntington beach",
    "irvine",
    "la habra",
    "la palma",
    "laguna beach",
    "laguna hills",
    "laguna niguel",
    "laguna woods",
    "lake forest",
    "los alamitos",
    "mission viejo",
    "newport beach",
    "orange",
    "placentia",
    "rancho santa margarita",
    "san clemente",
    "san juan capistrano",
    "santa ana",
    "seal beach",
    "stanton",
    "tustin",
    "villa park",
    "westminster",
    "yorba linda",
  ];

  const handleRadioClick = (city) => {
    const newFilterCitys = new Set();

    for (const c of filterCitys) {
      newFilterCitys.add(c);
    }

    newFilterCitys.add(city);

    onFilterCitysChange(newFilterCitys);
  };

  const handleRestClick = () => {
    const newFilterCitys = new Set();

    onFilterCitysChange(newFilterCitys);
  };

  return (
    <div>
      <p className="font-semibold">citys</p>
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex gap-1">
          <input
            id="city-reset"
            type="radio"
            checked={filterCitys.size === 0}
            onChange={handleRestClick}
          />
          <label htmlFor="city-reset" className="text-sm whitespace-nowrap">
            remove all filters
          </label>
        </div>
        {citys.map((city) => (
          <div key={city} className="flex gap-1">
            <input
              id={city}
              type="radio"
              value={city}
              checked={filterCitys.has(city)}
              onChange={(e) => handleRadioClick(e.target.value)}
            />
            <label htmlFor={city} className="text-sm whitespace-nowrap">
              {city}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesFilter({ filterCategories, onFilterCategoriesChange }) {
  const categories = [
    "fast food",
    "restaurant",
    "aquarium",
    "zoo",
    "museum",
    "library",
    "park",
    "public",
    "government",
  ];
  const handleRadioClick = (category) => {
    const newFilterCategories = new Set();

    for (const c of filterCategories) {
      newFilterCategories.add(c);
    }

    newFilterCategories.add(category);

    onFilterCategoriesChange(newFilterCategories);
  };

  const handleResetClick = () => {
    const newFilterCategories = new Set();

    onFilterCategoriesChange(newFilterCategories);
  };

  return (
    <div>
      <p className="font-semibold">categories</p>
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex gap-1">
          <input
            id="categories-reset"
            type="radio"
            checked={filterCategories.size === 0}
            onChange={handleResetClick}
          />
          <label
            htmlFor="categories-reset"
            className="text-sm whitespace-nowrap"
          >
            remove all filters
          </label>
        </div>
        {categories.map((category) => (
          <div key={category} className="flex gap-1">
            <input
              id={category}
              type="radio"
              value={category}
              checked={filterCategories.has(category)}
              onChange={(e) => handleRadioClick(e.target.value)}
            />
            <label htmlFor={category} className="text-sm whitespace-nowrap">
              {category}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DropDownMenu({
  filterCitys,
  filterCategories,
  onFilterCitysChange,
  onFilterCategoriesChange,
}) {
  const [display, setDisplay] = useState(false);

  const handleButtonClick = () => {
    setDisplay(!display);
  };

  return (
    <div className="ml-2 relative">
      <button
        onClick={handleButtonClick}
        className="btn text-sm rounded-sm h-full px-6"
      >
        filters
      </button>
      {display && (
        <div className="dropdown-menu right-0 top-16 absolute">
          <CityFilter
            filterCitys={filterCitys}
            onFilterCitysChange={onFilterCitysChange}
          />
          <CategoriesFilter
            filterCategories={filterCategories}
            onFilterCategoriesChange={onFilterCategoriesChange}
          />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

import SearchBar from "./SearchBar";
import LocationPosts from "./LocationPosts";

export default function FilterableLocationPosts({ locations }) {
  const [filterSearch, setFilterSearch] = useState("");
  const [filterCitys, setFilterCitys] = useState(new Set());
  const [filterCategories, setFilterCategories] = useState(new Set());

  return (
    <>
      <SearchBar
        filterSearch={filterSearch}
        filterCitys={filterCitys}
        filterCategories={filterCategories}
        onFilterSearchChange={setFilterSearch}
        onFilterCitysChange={setFilterCitys}
        onFilterCategoriesChange={setFilterCategories}
      />
      <LocationPosts
        locations={locations}
        filterSearch={filterSearch}
        filterCitys={filterCitys}
        filterCategories={filterCategories}
      />
    </>
  );
}

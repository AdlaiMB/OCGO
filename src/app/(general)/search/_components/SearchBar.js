import DropDownMenu from "./DropDownMenu";

export default function SearchBar({
  filterSearch,
  filterCitys,
  filterCategories,
  onFilterSearchChange,
  onFilterCitysChange,
  onFilterCategoriesChange,
}) {
  return (
    <div className="flex justify-between">
      <input
        type="search"
        value={filterSearch}
        onChange={(e) => onFilterSearchChange(e.target.value)}
        placeholder="search ..."
        className="searchbar p-2.5 text-base md:p-3 md:text-lg focus:border-blue-500 focus:outline-none focus:ring-0"
      />
      <DropDownMenu
        filterCitys={filterCitys}
        filterCategories={filterCategories}
        onFilterCitysChange={onFilterCitysChange}
        onFilterCategoriesChange={onFilterCategoriesChange}
      />
    </div>
  );
}

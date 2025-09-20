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
        className="searchbar p-3 text-lg"
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

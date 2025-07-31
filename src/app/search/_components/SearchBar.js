export default function SearchBar() {
  return (
    <form className="w-[80%]">
      <input
        className="w-[80%] bg-white text-black p-[1em]"
        type="text"
        placeholder="Search..."
      />
      <select name="city" id="city-select" className="w-[10%]">
        <option value="" className="text-black">
          city
        </option>
        <option value="costa mesa" className="text-black">
          costa mesa
        </option>
        <option value="santa ana" className="text-black">
          santa ana
        </option>
        <option value="newport" className="text-black">
          newport
        </option>
        <option value="irivne" className="text-black">
          irvine
        </option>
      </select>
      <select name="category" id="category-select" className="w-[10%]">
        <option value="" className="text-black">
          category
        </option>
        <option value="food" className="text-black">
          food
        </option>
        <option value="entertainment" className="text-black">
          entertainment
        </option>
        <option value="park" className="text-black">
          park
        </option>
        <option value="museum" className="text-black">
          museum
        </option>
        <option value="historical" className="text-black">
          historical
        </option>
        <option value="shop" className="text-black">
          shop
        </option>
        <option value="cafe" className="text-black">
          cafe
        </option>
        <option value="federal" className="text-black">
          federal
        </option>
      </select>
    </form>
  );
}

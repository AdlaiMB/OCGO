import { Fragment } from "react";

export default function List({ children, items, renderItem }) {
  return (
    <div className="bg-gray-500 w-full">
      {children}
      <ul className="flex flex-col items-center gap-4 px-[4%] py-4">
        {items.map((item, index) => (
          <Fragment key={index}>{renderItem(item)}</Fragment>
        ))}
      </ul>
    </div>
  );
}

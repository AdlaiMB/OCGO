"use client";
import { useState } from "react";

export default function DropDownHours({ hours, currentDay }) {
  const [display, setDisplay] = useState(false);

  const handleDisplay = () => {
    setDisplay(!display);
  };

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div id="LocationHours" className="capitalize relative w-fit">
      <span className="font-semibold">hours: </span>
      <div className="inline-block">
        {`${currentDay} ${hours[currentDay][0]} ${
          hours[currentDay][1] ? `- ${hours[currentDay][1]}` : ""
        } `}
      </div>
      <button
        onClick={handleDisplay}
        className="btn text-xs md:text-sm font-medium px-2 py-1 ml-2 "
      >
        V
      </button>
      {display && (
        <div className="dropdown-menu absolute right-0 top-9 capitalize flex-col gap-1 w-full">
          {days.map((day) => (
            <div
              key={day}
              className="grid grid-cols-[40%_auto_auto_auto] gap-0.5"
            >
              <span>{day}</span>
              <span className="whitespace-nowrap">{hours[day][0]}</span>
              {hours[day][1] && <span>-</span>}
              <span className="whitespace-nowrap">
                {hours[day][1] ? hours[day][1] : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import type { SeasonComponentProps } from "../types/seasonsTypes";

export const SeasonComponent = ({
  background,
  title,
  description,
}: SeasonComponentProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      className="flex bg-cover bg-center w-12 lg:w-6 relative"
      style={{ backgroundImage: background }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`h-full w-12 p-4 z-1 absolute z-1 ${
          isHovered ? "visible-overlay" : "hidden-overlay"
        }`}
      />
      <div className="flex flex-column min-h-screen justify-content-center align-items-center p-4 w-12 z-2">
        <h1 className="text-4xl mb-3 text-center text-with-shadow">{title}</h1>
        <p
          className="text-xl text-left line-height-3 p-5 text-with-shadow"
          style={{ whiteSpace: "pre-line", maxWidth: "600px" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

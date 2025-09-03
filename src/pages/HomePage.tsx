import { homePageStrings } from "../strings/homePageStrings";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/allProducts");
  };

  return (
    <div>
      <div
        className="bg-cover bg-center"
        style={{ backgroundImage: `url(${homePageStrings.logoUrl})` }}
      >
        <div
          className="flex flex-column min-h-screen justify-content-center align-items-center p-4"
          style={{ backgroundColor: "rgb(0, 0, 0, 0.4)" }}
        >
          <h1 className="text-4xl mb-3 text-center text-with-shadow">{homePageStrings.title}</h1>
          <p
            className="text-xl text-left line-height-3 p-5 text-with-shadow"
            style={{ whiteSpace: "pre-line", maxWidth: "600px" }}
          >
            {homePageStrings.description}
          </p>
          <Button
            icon={"pi pi-shop"}
            label={homePageStrings.storeButton}
            className="my-5"
            onClick={handleNavigate}
          />
        </div>
      </div>

      <div className="flex flex-wrap">
        <div
          className="bg-cover bg-center w-12 lg:w-6"
          style={{ backgroundImage: `url(${homePageStrings.winterUrl})` }}
        >
          <div className="flex flex-column min-h-screen justify-content-center align-items-center p-4 gradient-overlay">
            <h1 className="text-4xl mb-3 text-center text-with-shadow">
              {homePageStrings.faseOneTitle}
            </h1>
            <p
              className="text-xl text-left line-height-3 p-5 text-with-shadow"
              style={{ whiteSpace: "pre-line", maxWidth: "600px" }}
            >
              {homePageStrings.faseOneDescription}
            </p>
          </div>
        </div>

        <div
          className="bg-cover bg-center w-12 lg:w-6"
          style={{ backgroundImage: `url(${homePageStrings.springUrl})` }}
        >
          <div className="flex flex-column min-h-screen justify-content-center align-items-center p-4 gradient-overlay">
            <h1 className="text-4xl mb-3 text-center text-with-shadow">
              {homePageStrings.faseTwoTitle}
            </h1>
            <p
              className="text-xl text-left line-height-3 p-5 text-with-shadow"
              style={{ whiteSpace: "pre-line", maxWidth: "600px" }}
            >
              {homePageStrings.faseTwoDescription}
            </p>
          </div>
        </div>

        <div
          className="bg-cover bg-center w-12 lg:w-6"
          style={{ backgroundImage: `url(${homePageStrings.summerUrl})` }}
        >
          <div className="flex flex-column min-h-screen justify-content-center align-items-center p-4 gradient-overlay">
            <h1 className="text-4xl mb-3 text-center text-with-shadow">
              {homePageStrings.faseThreeTitle}
            </h1>
            <p
              className="text-xl text-left line-height-3 p-5 text-with-shadow"
              style={{ whiteSpace: "pre-line", maxWidth: "600px" }}
            >
              {homePageStrings.faseThreeDescription}
            </p>
          </div>
        </div>

        <div
          className="bg-cover bg-center w-12 lg:w-6"
          style={{ backgroundImage: `url(${homePageStrings.fallUrl})` }}
        >
          <div className="flex flex-column min-h-screen justify-content-center align-items-center p-4 gradient-overlay">
            <h1 className="text-4xl mb-3 text-center text-with-shadow">
              {homePageStrings.faseFourTitle}
            </h1>
            <p
              className="text-xl text-left line-height-3 p-5 text-with-shadow"
              style={{ whiteSpace: "pre-line", maxWidth: "600px" }}
            >
              {homePageStrings.faseFourDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

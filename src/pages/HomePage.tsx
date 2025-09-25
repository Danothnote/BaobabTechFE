import { homePageStrings } from "../strings/homePageStrings";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { SeasonComponent } from "../components/SeasonComponent";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/allProducts");
  };

  return (
    <div>
      <div
        className="bg-cover bg-center"
        style={{ backgroundImage: `url(${homePageStrings.landingUrl})` }}
      >
        <div
          className="flex flex-column min-h-screen justify-content-center align-items-center p-4"
          style={{ backgroundColor: "rgb(0, 0, 0, 0.4)" }}
        >
          <h1 className="text-4xl mb-3 text-center text-with-shadow">
            {homePageStrings.title}
          </h1>
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
        <SeasonComponent
          background={`url(${homePageStrings.winterUrl})`}
          title={homePageStrings.faseOneTitle}
          description={homePageStrings.faseOneDescription}
        />
        <SeasonComponent
          background={`url(${homePageStrings.springUrl})`}
          title={homePageStrings.faseTwoTitle}
          description={homePageStrings.faseTwoDescription}
        />
        <SeasonComponent
          background={`url(${homePageStrings.winterUrl})`}
          title={homePageStrings.faseThreeTitle}
          description={homePageStrings.faseThreeDescription}
        />
        <SeasonComponent
          background={`url(${homePageStrings.winterUrl})`}
          title={homePageStrings.faseFourTitle}
          description={homePageStrings.faseFourDescription}
        />
      </div>
    </div>
  );
};

import { Avatar } from "primereact/avatar";
import { navbarStrings } from "../strings/navbarStrings";
import { footerStrings } from "../strings/footerStrings";

export const FooterComponent = () => {
  return (
    <footer className="py-6 px-3" id={navbarStrings.pages[2].id}>
      <h1 className="text-xxl mb-3 text-center">{footerStrings.title}</h1>
      <div className="flex flex-wrap justify-content-around">
        <div className="flex flex-column align-items-center col-12 md:col-3 mb-4 md:mb-0">
          <h4 className="text-xl mb-3">{footerStrings.about.title}</h4>
          <ul className="p-0 m-0 mt-3">
            {footerStrings.about.list.map((item, index) => (
              <li key={index} className="mb-2 text-lg">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-column align-items-center col-12 md:col-3 mb-4 md:mb-0">
          <h4 className="text-xl mb-3 text-center">
            {footerStrings.social.title}
          </h4>
          <div className="flex flex-column gap-3">
            {footerStrings.social.list.map((social, index) => (
              <a
                key={index}
                href={social.socialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex align-items-center text-white-alpha-80 hover:text-white no-underline"
              >
                <Avatar
                  image={social.iconUrl}
                  shape="circle"
                  className="mr-2"
                  size="normal"
                />
                <span className="text-lg">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-column align-items-center col-12 md:col-3">
          <h4 className="text-xl mb-3 text-center">
            {footerStrings.contact.title}
          </h4>
          <div className="flex flex-column gap-3">
            {footerStrings.contact.list.map((contact, index) => (
              <a
                key={index}
                href={`https://wa.me/${contact.number.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex align-items-center text-white-alpha-80 hover:text-white no-underline"
              >
                <Avatar
                  image={contact.iconUrl}
                  shape="circle"
                  className="mr-2"
                  size="normal"
                />
                <span className="text-lg">{contact.number}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-7 text-sm text-white-alpha-60">
        <p>
          &copy; {new Date().getFullYear()} {footerStrings.copyright}
        </p>
      </div>
    </footer>
  );
};

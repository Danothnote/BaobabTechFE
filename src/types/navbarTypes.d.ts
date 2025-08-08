export interface NavbarStrings {
  logo: {
    src: string;
    alt: string;
  };
  avatar: {
    id: string;
    alt: string;
  };
  profileMenu: MenuLink[];
  greetings: {
    label: string;
    id: string;
  };
  loginButton: {
    label: string;
    id: string;
  };
  pages: MenuLink[];
}

export interface MenuLink {
  page: string;
  label: string;
  id: string;
  icon: string,
}
export interface FooterStrings {
  title: string;
  about: {
    title: string;
    list: string[];
  };
  social: {
    title: string;
    list: {
      name: string;
      iconUrl: string;
      socialUrl: string;
    }[];
  };
  contact: {
    title: string;
    list: {
      number: string;
      iconUrl: string;
    }[];
  };
  copyright: string;
}

export type WithChildren<T = {}> = T & { children?: React.ReactNode };

export type WithRestProps<T = {}> = T & { [x: string]: any };

// It'd be great to be able to use graphql-codegen to make these types...

export type User = {
  id: number;
  name: string;
  email: string;
  linkPages?: LinkPage[];
};

export type ImageField = {
  id: number;
  filesize: number;
  width: number;
  height: number;
  extension: string; // Actually an enum
  ref: string;
  src: string;
};

export type LinkPage = {
  id: number;
  title: string;
  heading: string;
  subheading: string;
  slug: string;
  background: string;
  avatarImage: ImageField;
  status: string;
  links: LinkPageLink[];
  owner: User;
};

export type LinkPageLink = {
  id: number;
  content: string;
  url: string;
  icon: string;
  iconColor: string;
  image: ImageField;
  imageBackground: string;
  linkPage: LinkPage;
};

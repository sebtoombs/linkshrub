export type WithChildren<T = {}> = T & { children?: React.ReactNode };

export type WithRestProps<T = {}> = T & { [x: string]: any };

export type ImageField = {
  id: number;
  filesize: number;
  width: number;
  height: number;
  extension: string; // Actually an enum
  ref: string;
  src: string;
};

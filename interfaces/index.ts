export type WithChildren<T = {}> = T & { children?: React.ReactNode };

export type WithRestProps<T = {}> = T & { [x: string]: any };

export default function omit(o: any, props: string[]) {
  if (typeof o !== "object") return {};
  const keys = Object.keys(o).filter((k) => !props.includes(k));
  return Object.assign(
    {},
    ...keys.map((prop: string) => ({ [prop]: o[prop] }))
  );
}

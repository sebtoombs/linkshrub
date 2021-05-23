export default function pick(o: any, props: string[]) {
  if (typeof o !== "object") return {};
  return Object.assign(
    {},
    ...props.map((prop: string) => ({ [prop]: o[prop] }))
  );
}

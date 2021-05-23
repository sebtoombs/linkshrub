import slugifyLib from "slugify";

export default function slugify(string: string = ""): string {
  return slugifyLib(string, {
    replacement: "-",
    lower: true,
    strict: true,
    locale: "en",
  });
}

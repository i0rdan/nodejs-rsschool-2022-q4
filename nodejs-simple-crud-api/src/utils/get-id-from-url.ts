import { BASIC_ENDPOINT } from "./constants/constants";

export function getIdFromUrl(url: string | undefined): string {
  if (url) {
    const [_, id] = url.split(`${BASIC_ENDPOINT}/`);
    return id;
  }
  return '';
}

import check from "./controllers/check.ts";
import checkPrefix from "./controllers/checkPrevix.ts";

const checkRoute = async (url: URL, path: string, headers: any) => {
  return check(url, path, headers);
};

const checkPrefixRoute = async (url: URL, path: string, headers: any) => {
  return checkPrefix(url, path, headers);
};

export { checkRoute, checkPrefixRoute };

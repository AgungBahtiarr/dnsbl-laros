import { check } from "./controllers/check";
import { checkPrefix } from "./controllers/checkPrevix";

const checkRoute = async (url: URL, headers: any) => {
  return await check(url, headers);
};

const checkPrefixRoute = async (url: URL, headers: any) => {
  return await checkPrefix(url, headers);
};

export { checkRoute, checkPrefixRoute };

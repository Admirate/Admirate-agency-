const CDN_HOST = [
  "https:/",
  "/mshehtxywddtdxxkbnuu",
  ".supabase.co",
].join("");

const STORAGE_PATH = "/storage/v1/object/public";

export const asset = (path: string) =>
  `${CDN_HOST}${STORAGE_PATH}/website%20assets/${encodeURIComponent(path).replace(/%2F/g, "/")}`;

export const video = (path: string) =>
  `${CDN_HOST}${STORAGE_PATH}/videos/${encodeURIComponent(path).replace(/%2F/g, "/")}`;

export const clientLogo = (path: string) =>
  `${CDN_HOST}${STORAGE_PATH}/client%20logos/${encodeURIComponent(path).replace(/%2F/g, "/")}`;

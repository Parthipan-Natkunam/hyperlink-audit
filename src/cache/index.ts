import { ProtocolIssue } from "@rules/protocol";

type CacheData = {
  data: ProtocolIssue;
  timeStamp: number;
};

const dataValidityDays = 10;
const ttlDaysInMilliseconds = 60 * 60 * 24 * dataValidityDays;

const cache = new Map<string, CacheData>();

const getData = (page: string) => {
  if (cache.has(page)) return cache.get(page);
  return null;
};

const setData = (page: string, data: CacheData) => {
  cache.set(page, data);
};

const hasValidData = (page: string) => {
  if (!cache.has(page)) return false;
  return Date.now() - cache.get(page)!.timeStamp < ttlDaysInMilliseconds;
};

export default Object.freeze({
  hasValidData,
  getData,
  setData,
});

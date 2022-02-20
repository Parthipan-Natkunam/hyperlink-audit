import cheerio from "cheerio";
import axios from "axios";

const loadSite = async (url: string) => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  return $;
};

const parseLinks = ($: cheerio.Root) => {
  return $("a")
    .map((_, element) => ({
      link: $(element).attr("href")?.trim(),
    }))
    .get();
};

export default Object.freeze({
  loadSite,
  parseLinks,
});

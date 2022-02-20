import express, { Application, Request } from "express";
import { nanoid } from "nanoid";
import { config } from "./config";
import protocolValidator, { Protocol, ProtocolIssue } from "@rules/protocol";
import cache from "@cache/index";
import scrapper from "@scrapper/index";

const app: Application = express();
const { port } = config;

type AuditQueryParam = {
  page: string;
};

//TODO: Refactor and modularize this
app.get("/audit", async (req: Request<{}, {}, {}, AuditQueryParam>, res) => {
  const {
    query: { page },
  } = req;
  const url = page ? decodeURI(page) : null;
  if (!url) {
    res.status(400);
    res.json({ error: "invalid site url" });
    return;
  }
  const protocol = protocolValidator.getProtocol(url);
  if (!protocol) {
    res.status(400);
    res.json({ error: "bad site url" });
    return;
  }

  let result: ProtocolIssue;
  if (cache.hasValidData(url)) {
    result = cache.getData(url)!.data;
  } else {
    const scrapperRoot = await scrapper.loadSite(url);
    const links = scrapper.parseLinks(scrapperRoot);

    const cleansedLinks = links.map((item) => {
      if (/^\//.test(item.link)) {
        return {
          padded: url.replace(/\/$/, "") + item.link,
          original: item.link,
        };
      }
      return {
        original: item.link,
        padded: item.link,
      };
    });

    cleansedLinks.forEach((link) => {
      const linkProtocol = protocolValidator.getProtocol(link.padded);
      protocolValidator.addDetectedHyperlink({
        protocol: linkProtocol as Protocol,
        data: {
          link: link.original,
          detectedAt: url,
          uid: nanoid(),
        },
      });
    });

    result = protocolValidator.getIssues();
    cache.setData(url, { data: result, timeStamp: Date.now() });
    protocolValidator.resetHyperlinkMap();
  }

  res.json({ url, protocol, result });
});

app.listen(port);

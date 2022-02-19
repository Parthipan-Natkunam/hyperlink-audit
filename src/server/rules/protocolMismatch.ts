export type Protocol = "http" | "https";
export type IssueCode = "MIXED" | "INSECURE" | "NOISSUE";

type HyperlinkMeta = {
  link: string;
  detectedAt: string;
  uid: string;
};

export type ProtocolInstances = {
  hyperlinks: HyperlinkMeta[];
  count: number;
};

export type ProtocolInfo = {
  protocol: Protocol;
  data: HyperlinkMeta;
};

export type ProtocolIssue = {
  code: IssueCode;
  message: string;
  secureProtocol: ProtocolInstances | null;
  insecureProtocol: ProtocolInstances | null;
};

const protocolRegex = new RegExp(/(\S*):(\/\/)(?:\S)/);
const detectedhyperlinks = new Map<Protocol, ProtocolInstances>();

const addDetectedHyperlink = (payload: ProtocolInfo) => {
  if (detectedhyperlinks.has(payload.protocol)) {
    const previouslyDetectedData = detectedhyperlinks.get(payload.protocol)!;
    const count = previouslyDetectedData.count + 1;
    detectedhyperlinks.set(payload.protocol, {
      hyperlinks: [...previouslyDetectedData.hyperlinks, payload.data],
      count,
    });
    return;
  }

  detectedhyperlinks.set(payload.protocol, {
    hyperlinks: [payload.data],
    count: 1,
  });
};

const getLinkCounts = (protocol: Protocol) =>
  detectedhyperlinks.get(protocol)?.count ?? 0;

const getProtocol = (url: string) => {
  const detectedProtocol = protocolRegex.exec(url)?.[1];
  return detectedProtocol?.length ? detectedProtocol : null;
};

const checkHasMultipleProtocols = () =>
  getLinkCounts("http") > 0 && getLinkCounts("https") > 0;

const checkHasOnlyNonSecureProtocol = () =>
  getLinkCounts("http") > 0 && getLinkCounts("https") === 0;

const getIssues = (): ProtocolIssue => {
  if (checkHasMultipleProtocols()) {
    return {
      code: "MIXED",
      message:
        "The website has hyperlinks with mixed protocols (http, https). Hence it Might be vulnerable to https downgrade attacks",
      secureProtocol: detectedhyperlinks.get("https")!,
      insecureProtocol: detectedhyperlinks.get("http")!,
    };
  }

  if (checkHasOnlyNonSecureProtocol()) {
    return {
      code: "INSECURE",
      message:
        "All detected hyperlinks on the site are served through insecure http. consider upgrading to https to prevent MITM attacks",
      insecureProtocol: detectedhyperlinks.get("http")!,
      secureProtocol: null,
    };
  }

  return {
    code: "NOISSUE",
    message: "All the detected hyperlinks use the secured https protocol",
    insecureProtocol: null,
    secureProtocol: detectedhyperlinks.get("https")!,
  };
};

export default Object.freeze({
  getProtocol,
  getIssues,
  addDetectedHyperlink,
});

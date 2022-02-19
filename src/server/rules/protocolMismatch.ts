const protocolRegex = new RegExp(/(\S*):(\/\/)(?:\S)/);

const getProtocol = (url: string) => {
  const detectedProtocol = protocolRegex.exec(url)?.[1];
  return detectedProtocol?.length ? detectedProtocol : null;
};

export default Object.freeze({
  getProtocol,
});

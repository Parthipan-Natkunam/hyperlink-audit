import protocolValidator from "@rules/protocolMismatch";

describe("Protocol Mismatch Rules", () => {
  describe("getProtocol", () => {
    it("should return null for an invalid url", () => {
      expect(protocolValidator.getProtocol("duishci/uhsdhgks/")).toBeNull();
      expect(protocolValidator.getProtocol("://www.test.org")).toBeNull();
      expect(protocolValidator.getProtocol("www.simplesite.com")).toBeNull();
      expect(protocolValidator.getProtocol("12rssdvkljs9opew")).toBeNull();
    });

    it("should return specific protocol for a valid url", () => {
      expect(protocolValidator.getProtocol("http://www.mysite.org")).toEqual(
        "http"
      );
      expect(
        protocolValidator.getProtocol("https://www.test.org/team/page/1/")
      ).toEqual("https");
      expect(
        protocolValidator.getProtocol("ws://12ertwkxnpewo.test.io")
      ).toEqual("ws");
    });
  });
});

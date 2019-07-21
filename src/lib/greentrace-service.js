import debugLib from "debug"
const debug = debugLib("tgwf:greenTraceService")

import GreenTrace from "@tgwf/greentrace-cli";

debug("Code for the page checker goes here. We needn't load up all the vue and electron gubbins")

const GreenTraceService = {
  async fetchHopsFordomain(domain) {
    if (domain.length < 4) {
      return []
    }
    const newHops = await GreenTrace.trace(domain);

    console.log({ newHops })
    let newTGWFHopCoords = newHops.map(hop => {
      let hopVal = Object.values(hop)[0];
      hopVal.ll = [hopVal.ll[1], hopVal.ll[0]]
      Object.values(hop)[0] = hopVal
      return hop;
    });
    console.log({ newTGWFHopCoords });
    return newTGWFHopCoords
  }

}

export default GreenTraceService
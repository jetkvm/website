/*
  The $splat route _landingpage_.docs.$.tsx doesn't get called on Index,
  so we simply re-export the loader and RouteComponent from that file.
 */

import RouteComponent from "./_landingpage_.docs.$";

export { loader } from "./_landingpage_.docs.$";
export { meta } from "./_landingpage_.docs.$";
export default RouteComponent;

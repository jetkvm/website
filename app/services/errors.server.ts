import { json } from "@remix-run/node";

/**
 * This helper function helps us to return the accurate HTTP status,
 * 400 Bad Request, to the client.
 */
export const BadRequestResponse = (message: string) =>
  json({ error: { message } }, { status: 400 });
export const NotFoundResponse = () =>
  new Response(null, { status: 404, statusText: "Not Found" });
export const NotImplementedError = () =>
  json(null, { status: 404, statusText: "Not Implemented" });

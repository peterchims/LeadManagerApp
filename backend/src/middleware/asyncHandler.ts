import type { NextFunction, Request, RequestHandler, Response } from "express";

// Express 4 does not forward rejected promises from async route handlers to
// the error middleware, so every async route must be wrapped with this.
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}

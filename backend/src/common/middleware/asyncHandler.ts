import { Request, Response, NextFunction } from 'express';

export type AsyncHandler<Req extends Request = Request> = (
  req: Req,
  res: Response,
  next: NextFunction,
) => Promise<any>;

const asyncHandler =
  <Req extends Request = Request>(fn: AsyncHandler<Req>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req as Req, res, next)).catch(next);

export default asyncHandler;

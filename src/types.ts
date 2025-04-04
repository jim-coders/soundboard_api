import type { Response } from 'express';

export type ControllerResponse = Promise<Response<
  any,
  Record<string, any>
> | void>;

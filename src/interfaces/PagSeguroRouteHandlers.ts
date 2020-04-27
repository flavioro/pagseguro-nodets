import { Request, Response } from 'express';
import { PagSeguroTransaction } from './PagSeguroTransaction';

export type OnInitFunction = (req: Request, res: Response) => void;

export type OnLoadFunction = (
  transaction: PagSeguroTransaction,
  req: Request,
  res: Response
) => void;

export type OnErrorFunction = (
  error: Error,
  req: Request,
  res: Response
) => void;

export interface PagSeguroRouteHandlers {
  checkoutTransparente?: {
    boleto?: {
      onInit?: OnInitFunction;
      onLoad?: OnLoadFunction;
      onError?: OnErrorFunction;
    };
    cartaoCredito?: {
      onInit?: OnInitFunction;
      onLoad?: OnLoadFunction;
      onError?: OnErrorFunction;
    };
    debitoOnline?: {
      onInit?: OnInitFunction;
      onLoad?: OnLoadFunction;
      onError?: OnErrorFunction;
    };
  };
}

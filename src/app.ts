import express, { NextFunction, Request, Response } from 'express';
import PagSeguro from './PagSeguro';
import PagSeguroError from './errors/PagSeguroError';
import { PagSeguroConfig } from './interfaces/PagSeguroConfig';
import { PagSeguroRouteHandlers } from './interfaces/PagSeguroRouteHandlers';
import Log from './helper/Log';

const config: PagSeguroConfig = {
  email: 'vhmf171@hotmail.com', // email da conta do pagseguro
  token: '2C233DAC692E48D7A30D4F5946FCA8E9', // token pagseguro
  appId: 'app5602760038', // ID da aplicação (pagamento recorrente)
  appKey: 'AA2A53776C6CD50444AA4FB9E9ADE13C', // Key da aplicação (pagemento recorrente)
  env: 'sandbox',
  logDir: `${__dirname}/log/pagseguro.log`,
  logConsole: false,
  notificationURL: 'http://localhost:3333/authorization/notification',
  redirectURL: 'http://localhost:3333/authorization/response',
};

const handlers: PagSeguroRouteHandlers = {
  checkoutTransparente: {
    boleto: {
      onLoad: (transaction, req, res): void => {
        Log.info({ transaction, req, res });
      },
    },
  },
};

const app = express();
app.use(express.json());
app.use(PagSeguro.init(config, handlers));

app.use((e: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (e instanceof PagSeguroError) {
    return res.status(e.code).json({
      status: e.message,
      message: e.body,
    });
  }

  // eslint-disable-next-line no-console
  console.error(e);
  return res.status(500).json({
    status: 'error',
    message: `${e.name} - ${e.message}`,
  });
});

app.listen(3333, () => {
  Log.info(`🚀 Server started on port ${3333}!`);
});

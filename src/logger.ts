import { createLogger, format, Logger, transports } from 'winston';

export default (filename: string, debug: boolean): Logger => {
  const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.File({ filename })],
  });

  if (debug && process.env.NODE_ENV !== 'production') {
    logger.add(
      new transports.Console({
        format: format.combine(
          format.prettyPrint({ depth: 10, colorize: true })
        ),
      })
    );
  }

  return logger;
};

import { createLogger, format, Logger, transports } from 'winston';

export default class Log {
  private static log: Logger;

  private static empty = (): void => {
    /* ignored */
  };
  static info = Log.log?.info || Log.empty;
  static error = Log.log?.error || Log.empty;
  static warn = Log.log?.warn || Log.empty;
  static debug = Log.log?.debug || Log.empty;

  static init(filename: string, logConsole = false): void {
    Log.log = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.File({ filename })],
    });

    if (logConsole && process.env.NODE_ENV !== 'production') {
      Log.log.add(
        new transports.Console({
          format: format.combine(
            format.prettyPrint({ depth: 10, colorize: true })
          ),
        })
      );
    }
  }
}

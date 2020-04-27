import { createLogger, format, transports, LeveledLogMethod } from 'winston';

export default class Log {
  private static innerLog: Log;
  // private readonly log: Logger;
  private readonly info: LeveledLogMethod;
  private readonly warn: LeveledLogMethod;
  private readonly error: LeveledLogMethod;
  private readonly debug: LeveledLogMethod;

  constructor(fileName: string, logConsole: boolean) {
    const logger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.File({ filename: fileName })],
    });
    // eslint-disable-next-line no-console
    console.log('Log file configured in:', fileName);

    if (logConsole && process.env.NODE_ENV !== 'production') {
      logger.add(
        new transports.Console({
          format: format.combine(
            format.prettyPrint({ depth: 10, colorize: true })
          ),
        })
      );
    }

    this.info = logger.info.bind(logger);
    this.warn = logger.warn.bind(logger);
    this.error = logger.error.bind(logger);
    this.debug = logger.debug.bind(logger);
  }

  static get info(): LeveledLogMethod {
    return Log.instance.info;
  }

  static get warn(): LeveledLogMethod {
    return Log.instance.warn;
  }

  static get error(): LeveledLogMethod {
    return Log.instance.error;
  }

  static get debug(): LeveledLogMethod {
    return Log.instance.debug;
  }

  static init(filename: string, logConsole = false): void {
    Log.instance = Log.innerLog || new Log(filename, logConsole);
  }

  static get instance(): Log {
    if (!Log.innerLog) {
      Log.init('pagseguro.log');
    }
    return Log.innerLog;
  }

  static set instance(log: Log) {
    Log.innerLog = log;
  }
}

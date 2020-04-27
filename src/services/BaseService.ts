import { PagSeguroConfig } from '../interfaces/PagSeguroConfig';
import Log from '../helper/Log';
import Request, {
  RequestFunction,
  RequestFunctionBody,
} from '../helper/Request';

export default abstract class BaseService {
  protected readonly config: PagSeguroConfig;

  protected get post(): RequestFunctionBody {
    return Request.instance.post;
  }

  protected get get(): RequestFunction {
    return Request.instance.get;
  }

  constructor(config: PagSeguroConfig) {
    this.config = config;
    Log.init(this.config.logDir, this.config.logConsole);
    Request.init(this.config);
  }
}

import { PagSeguroConfig } from '../interfaces/PagSeguroConfig';

const validateConfig = (params: PagSeguroConfig): boolean => {
  const { email, token, env, logDir } = params;
  return !!(email && token && env && logDir);
};

export default validateConfig;

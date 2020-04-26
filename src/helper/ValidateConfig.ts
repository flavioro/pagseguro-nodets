import { PagSeguroConfig } from '../interfaces/PagSeguroConfig';

const validateConfig = (params: PagSeguroConfig): boolean => {
  const { email, token, env, log } = params;
  return !!(email && token && env && log);
};

export default validateConfig;

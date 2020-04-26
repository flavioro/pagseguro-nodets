const getBaseUrl = (env: 'sandbox' | 'production' = 'sandbox'): string => {
  if (env === 'production') {
    return 'https://ws.pagseguro.uol.com.br';
  }
  return 'https://ws.sandbox.pagseguro.uol.com.br';
};

export default getBaseUrl;

import { j2xParser } from 'fast-xml-parser';

const jsonToXml = (json: object): object => {
  // eslint-disable-next-line new-cap
  return new j2xParser({ format: true }).parse(json);
};

export default jsonToXml;

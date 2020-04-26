export interface PagSeguroSender {
  name: string;
  email: string;
  phone: {
    areaCode: string;
    number: string;
  };
  documents: {
    document: {
      type: string;
      value: string;
    }[];
  };
}

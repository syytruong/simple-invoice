export interface Invoice {
  bankAccount: {
    bankId: string;
    sortCode: string;
    accountNumber: string;
    accountName: string;
  };
  customer: {
    firstName: string;
    lastName: string;
    contact: {
      email: string;
      mobileNumber: string;
    };
    addresses: {
      premise: string;
      countryCode: string;
      postcode: string;
      county: string;
      city: string;
    }[];
  };
  documents: {
    documentId: string;
    documentName: string;
    documentUrl: string;
  }[];
  invoiceReference: string;
  invoiceNumber: string;
  currency: string;
  invoiceDate: string;
  dueDate: string;
  description: string;
  customFields: {
    key: string;
    value: string;
  }[];
  extensions: {
    addDeduct: "ADD" | "DEDUCT";
    value: number;
    type: "FIXED_VALUE" | "PERCENTAGE";
    name: string;
  }[];
  items: InvoiceItem[];
}
export interface InvoiceItem {
  itemReference: string;
  description: string;
  quantity: number;
  rate: number;
  itemName: string;
  itemUOM: string;
  customFields: {
    key: string;
    value: string;
  }[];
  extensions: {
    addDeduct: string;
    value: number;
    type: string;
    name: string;
  }[];
}
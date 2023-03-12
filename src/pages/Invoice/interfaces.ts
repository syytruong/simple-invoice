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
    addresses: unknown[];
  };
  invoiceReference: string;
  invoiceNumber: string;
  currency: string;
  invoiceDate: string;
  invoiceId: string;
  dueDate: string;
  description: string;
  customFields: {
    key: string;
    value: number;
  }[];
  extensions: unknown[];
  totalSubAmount: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  balanceAmount: number;
  status: {
    key: string;
    value: boolean;
  }[];
  type: string;
  version: string;
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
    value: number;
  }[];
  extensions: {
    addDeduct: string;
    value: number;
    type: string;
    name: string;
  }[];
}

export interface FetchInvoicesQueryParams {
  fromDate?: string;
  toDate?: string;
  pageSize: number;
  pageNum: number;
  ordering: string;
  sortBy: string;
  dateType: string;
  status?: string;
  keyword?: string;
}

import { useState, Fragment } from 'react';
import axios from 'axios';
import { API } from '../../constants';
import { faker } from '@faker-js/faker';
import { Invoice, InvoiceItem } from './interfaces'
interface FormErrors {
  invoiceReference?: string;
  invoiceDate?: string;
  description?: string;
  amount?: string;
}

const generateInvoice = (invoiceReference: string, dueDate: string, description: string, amount: number, items: InvoiceItem[]): Invoice => {
  const invoice: Invoice = {
    bankAccount: {
      bankId: "123456",
      sortCode: faker.finance.routingNumber(),
      accountNumber: faker.finance.account(),
      accountName: faker.name.findName(),
    },
    customer: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      addresses: [
        {
          premise: faker.address.secondaryAddress(),
          countryCode: faker.address.countryCode(),
          postcode: faker.address.zipCode(),
          county: faker.address.county(),
          city: faker.address.city(),
        },
      ],
    },
    invoiceReference,
    invoiceNumber: faker.finance.ethereumAddress(),
    currency: faker.finance.currencyCode(),
    invoiceDate: faker.date.future().toISOString().substring(0, 10),
    dueDate,
    description,
    items,
    customFields: [
      {
        key: "invoiceCustomField",
        value: faker.random.words(),
      },
    ],
    extensions: [
      {
        addDeduct: "ADD",
        value: faker.datatype.number(100),
        type: "PERCENTAGE",
        name: faker.random.words(),
      },
      {
        addDeduct: "DEDUCT",
        type: "FIXED_VALUE",
        value: faker.datatype.number(100),
        name: faker.random.words(),
      },
    ],
    totalAmount: amount,
    balanceAmount: amount,
    totalTax: faker.datatype.number({ min: 0, max: 100 }),
    totalDiscount: faker.datatype.number({ min: 0, max: 100 }),
    totalSubAmount: (amount || 0) - (faker.datatype.number({ min: 0, max: 100 }) || 0) + (faker.datatype.number({ min: 0, max: 100 }) || 0),
    invoiceId: faker.datatype.uuid(),
    status: [],
    type: faker.random.word(),
    version: faker.datatype.number({ min: 1, max: 10 }).toString(),
  };

  return invoice;
};

function generateRandomInvoiceItem(): InvoiceItem {
  const itemReference = Math.random().toString();
  const description = `Item description ${Math.random()}`;
  const quantity = Math.floor(Math.random() * 10) + 1;
  const rate = Math.floor(Math.random() * 100) + 1;
  const itemName = `Item ${Math.random()}`;
  const itemUOM = `UOM ${Math.random()}`;
  const customFields = [
    {
      key: `Custom Field ${Math.random()}`,
      value: `Custom Value ${Math.random()}`
    }
  ];
  const extensions = [
    {
      addDeduct: Math.random() > 0.5 ? "ADD" : "DEDUCT",
      value: Math.floor(Math.random() * 10) + 1,
      type: Math.random() > 0.5 ? "FIXED_VALUE" : "PERCENTAGE",
      name: `Extension ${Math.random()}`
    }
  ];
  return {
    itemReference,
    description,
    quantity,
    rate,
    itemName,
    itemUOM,
    customFields,
    extensions,
  };
}

export default function CreateInvoice(): JSX.Element {
  const ACCESS_TOKEN = localStorage.getItem('access_token');
  const ORG_TOKEN = localStorage.getItem('org_token');

  const [open, setOpen] = useState(false);
  const [invoiceReference, setInvoiceReference] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const resetForm = (): void => {
    setInvoiceReference('');
    setInvoiceDate('');
    setDescription('');
    setAmount(0);
  };

  const validateForm = (): boolean => {
    const cloneErrors = {...errors};
    if (!invoiceReference) {
      cloneErrors.invoiceReference = 'Invoice Reference is required';
    }
    if (!invoiceDate) {
      cloneErrors.invoiceDate = 'Invoice Date is required';
    }
    if (!description) {
      cloneErrors.description = 'Description is required';
    }
    if (!amount) {
      cloneErrors.amount = 'Amount is required';
    } else if (amount < 0) {
      cloneErrors.amount = 'Amount cannot be negative';
    }
    setErrors(cloneErrors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    const valid = validateForm();

    if (valid) {
      setIsLoading(true);

      const invoiceItems: InvoiceItem[] = [];
      const newInvoiceItem = generateRandomInvoiceItem();

      invoiceItems.push(newInvoiceItem);


      const invoice: Invoice = generateInvoice(invoiceReference, invoiceDate, description, amount, invoiceItems);

      try {
        await axios.post(
          `${API.url}/invoice-service/2.0.0/invoices`,
          { invoices: [invoice] },
          {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              'Operation-Mode': 'SYNC',
              'org-token': ORG_TOKEN,
              'Content-type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
      handleClose();
    }
  };

  const handleClose = (): void => {
    setOpen(false);
    resetForm();
  };

  return (
    <Fragment>
      <button
        className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 capitalize"
        onClick={(): void => setOpen(true)}
      >
        Create new invoice
      </button>

      <div
        className={`fixed z-10 inset-0 overflow-y-auto ${!open && 'hidden'}`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
            onClick={(): void => setOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div
            className="p-4 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full mb-52"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="container mx-auto px-4">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-1 p-4">
                  <label htmlFor="invoiceReference" className="block text-gray-700 font-bold mb-2">Invoice Reference:</label>
                  <input
                    type="text"
                    id="invoiceReference"
                    value={invoiceReference}
                    onChange={(event): void => setInvoiceReference(event.target.value)}
                    className="w-full px-4 py-2 leading-tight border rounded-lg focus:outline-none focus:shadow-outline"
                  />
                  {errors.invoiceReference && <div className="text-red-500">{errors.invoiceReference}</div>}
                </div>
                <div className="mb-1 p-4">
                  <label htmlFor="invoiceDate" className="block text-gray-700 font-bold mb-2">Due Date:</label>
                  <input
                    type="date"
                    id="invoiceDate"
                    value={invoiceDate}
                    onChange={(event): void => setInvoiceDate(event.target.value)}
                    className="w-full px-4 py-2 leading-tight border rounded-lg focus:outline-none focus:shadow-outline"
                  />
                  {errors.invoiceDate && <div className="text-red-500">{errors.invoiceDate}</div>}
                </div>
                <div className="mb-1 p-4">
                  <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description:</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(event): void => setDescription(event.target.value)}
                    className="w-full px-4 py-2 leading-tight border rounded-lg focus:outline-none focus:shadow-outline"
                    rows={3}
                    style={{ resize: 'none' }}
                  />
                  {errors.description && <div className="text-red-500">{errors.description}</div>}
                </div>
                <div className="mb-1 p-4">
                  <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">Amount:</label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(event): void => setAmount(parseFloat(event.target.value))}
                    className="w-full px-4 py-2 leading-tight border rounded-lg focus:outline-none focus:shadow-outline"
                  />
                  {errors.amount && <div className="text-red-500">{errors.amount}</div>}
                </div>
                <div className="flex justify-between p-4">
                  <button
                    disabled={isLoading}
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 bg-gray-200 text-black rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 ml-2 mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                  >
                    {isLoading ? 'Creating Invoice...' : 'Create Invoice'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

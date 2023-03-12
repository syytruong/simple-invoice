import { useState, Fragment } from 'react';
import axios from 'utils/axios';
import { API } from '../../constants';
import { faker } from '@faker-js/faker';
import { Invoice, InvoiceItem } from './interfaces';
import { FieldValues, useForm } from 'react-hook-form';
import { INPUT } from 'constants/style';

const generateInvoice = (
  invoiceReference: string,
  dueDate: string,
  description: string,
  amount: number,
  items: InvoiceItem[],
): Invoice => {
  const invoice: Invoice = {
    bankAccount: {
      bankId: '123456',
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
        key: 'invoiceCustomField',
        value: faker.datatype.number(15),
      },
    ],
    extensions: [
      {
        addDeduct: 'ADD',
        value: faker.datatype.number(100),
        type: 'PERCENTAGE',
        name: faker.random.words(),
      },
      {
        addDeduct: 'DEDUCT',
        type: 'FIXED_VALUE',
        value: faker.datatype.number(100),
        name: faker.random.words(),
      },
    ],
    totalAmount: amount,
    balanceAmount: amount,
    totalTax: faker.datatype.number({ min: 0, max: 100 }),
    totalDiscount: faker.datatype.number({ min: 0, max: 100 }),
    totalSubAmount:
      (amount || 0) -
      (faker.datatype.number({ min: 0, max: 100 }) || 0) +
      (faker.datatype.number({ min: 0, max: 100 }) || 0),
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
      value: Math.floor(Math.random() * 20) + 1,
    },
  ];
  const extensions = [
    {
      addDeduct: Math.random() > 0.5 ? 'ADD' : 'DEDUCT',
      value: Math.floor(Math.random() * 10) + 1,
      type: Math.random() > 0.5 ? 'FIXED_VALUE' : 'PERCENTAGE',
      name: `Extension ${Math.random()}`,
    },
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FieldValues): Promise<void> => {
    const { invoiceReference, invoiceDate, description, amount } = data;
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
        },
      );
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
    handleClose();
  };

  const handleClose = (): void => {
    reset();
    setOpen(false);
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
          <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleClose}>
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <div
            className="p-4 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full mb-52"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="container mx-auto px-4">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="mb-1 p-4">
                  <label htmlFor="invoiceReference" className="block text-gray-700 font-bold mb-2">
                    Invoice Reference:
                  </label>
                  <input
                    type="text"
                    className={`w-full ${errors.email ? INPUT.ERROR : INPUT.DEFAULT}`}
                    {...register('invoiceReference', { required: true })}
                  />
                  {errors.invoiceReference && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      <span>Invoice Reference is required.</span>
                    </p>
                  )}
                </div>
                <div className="mb-1 p-4">
                  <label htmlFor="invoiceDate" className="block text-gray-700 font-bold mb-2">
                    Due Date:
                  </label>
                  <input
                    type="date"
                    className={`w-full ${errors.email ? INPUT.ERROR : INPUT.DEFAULT}`}
                    {...register('invoiceDate', { required: true })}
                  />
                  {errors.invoiceDate && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      <span>Invoice Date is required.</span>
                    </p>
                  )}
                </div>
                <div className="mb-1 p-4">
                  <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                    Description:
                  </label>
                  <textarea
                    rows={3}
                    style={{ resize: 'none' }}
                    className={`w-full ${errors.email ? INPUT.ERROR : INPUT.DEFAULT}`}
                    {...register('description', { required: true })}
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      <span>Description is required.</span>
                    </p>
                  )}
                </div>
                <div className="mb-1 p-4">
                  <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">
                    Amount:
                  </label>
                  <input
                    type="number"
                    className={`w-full ${errors.email ? INPUT.ERROR : INPUT.DEFAULT}`}
                    {...register('amount', { required: true })}
                  />
                  {errors.amount && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      <span>Description is required.</span>
                    </p>
                  )}
                </div>
                <div className="flex justify-between p-4">
                  <button
                    type="reset"
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

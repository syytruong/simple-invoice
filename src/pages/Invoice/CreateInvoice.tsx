import { useState, Fragment } from 'react';
import axios from 'axios';
import { API_URL } from '../../constant';
interface InvoiceItem {
  itemReference: string;
  description: string;
  quantity: number;
  rate: number;
}

interface Invoice {
  invoiceReference: string;
  invoiceDate: string;
  description: string;
  amount: number;
  items: InvoiceItem[];
}

interface FormErrors {
  invoiceReference?: string;
  invoiceDate?: string;
  description?: string;
  amount?: string;
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
      const itemReference = `itemRef-${Math.floor(Math.random() * 1000)}`;
      const description = `Description-${Math.floor(Math.random() * 1000)}`;
      const quantity = Math.floor(Math.random() * 10) + 1;
      const rate = Math.floor(Math.random() * 1000) + 1;

      invoiceItems.push({
        itemReference,
        description,
        quantity,
        rate,
      });

      const invoice: Invoice = {
        invoiceReference,
        invoiceDate,
        description,
        amount,
        items: invoiceItems,
      };

      try {
        const response = await axios.post(
          `${API_URL.baseURL}/invoice-service/2.0.0/invoices`,
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

        console.log(response.data);
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
                  <label htmlFor="invoiceDate" className="block text-gray-700 font-bold mb-2">Invoice Date:</label>
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

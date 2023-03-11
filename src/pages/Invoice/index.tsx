import { INPUT } from 'constants/style';
import { useState, useEffect, useCallback } from 'react';
import CreateInvoice from './CreateInvoice';
import axios from 'axios';
import { API_URL } from '../../constants';
import { Invoice } from './interfaces'
interface QueryParams {
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

export default function InvoicePage(): JSX.Element {
  const ORDER_TYPES = {
    ascending: 'ASCENDING',
    desending: 'DESCENDING',
  }

  const access_token = localStorage.getItem('access_token');
  const org_token = localStorage.getItem('org_token');

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ** Params for API call
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(ORDER_TYPES.ascending);
  const [sortBy, setSortBy] = useState('');
  const [status, setStatus] = useState('');

  // Use debouncedKeyword state to prevent using another 3rd party
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [keyword]);

  const fetchInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      let queryParams: QueryParams = {
        pageSize: limit,
        pageNum: page,
        ordering: order,
        dateType: 'INVOICE_DATE',
        sortBy: sortBy,
        status: status,
      };
  
      if (debouncedKeyword?.length) {
        queryParams = {...queryParams, keyword: debouncedKeyword};
      }

      if (start) {
        queryParams = {...queryParams, fromDate: start};
      }

      if (end) {
        queryParams = {...queryParams, toDate: end};
      }
  
      const response = await axios({
        url: `${API_URL.baseURL}/invoice-service/1.0.0/invoices`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'org-token': org_token,
        },
        params: queryParams,
      });
  
      console.log(response.data);
      setInvoices(response.data);
    } catch (error) {
      throw new Error('Error fetching invoices' + error);
    } finally {
      setIsLoading(false);
    }
  }, [access_token, debouncedKeyword, end, limit, order, org_token, page, sortBy, start, status]);
  
  useEffect(() => {
    if (access_token && org_token) {
      fetchInvoices();
    }
  }, [access_token, org_token, fetchInvoices]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = event.target.value;
    setKeyword(inputValue);
  };

  const resetFilter = (): void => {
    setStart('');
    setEnd('');
    setOrder(ORDER_TYPES.ascending);
    setSortBy('CREATED_DATE');
    setStatus('PAID');
    setKeyword('');
  };

  return (
    <div className="container mx-auto py-10 min-h-screen">
      <div className="flex flex-col md:w-3/4 lg:w-1/2 xl:w-2/3 mx-auto">
        <div className="mb-5 grid md:grid-cols-2 gap-4">
          <div className="mt-0 sm:mt-0">
            <CreateInvoice />
          </div>
          <div>
            <input
              placeholder="Input to search"
              className={INPUT.DEFAULT}
              value={keyword}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm12 0a8 8 0 018 8v-2a6 6 0 00-6-6h-2zm-8 0a4 4 0 014-4V4a8 8 0 00-8 8h4zm12 0a4 4 0 01-4 4v2a6 6 0 006-6h2z"></path>
            </svg>
            <span className="text-lg text-gray-500">Loading...</span>
          </div>
        ) : (
          <div className="border-b border-gray-200 shadow">
            {invoices.length > 0 ? (
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-2 text-xs text-gray-500">Reference</th>
                    <th className="px-6 py-2 text-xs text-gray-500">Description</th>
                    <th className="px-6 py-2 text-xs text-gray-500">Quantity</th>
                    <th className="px-6 py-2 text-xs text-gray-500">Created at</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {invoices.map((invoice) => (
                    <tr key={invoice.invoiceReference} className="whitespace-nowrap">
                      <td className="px-6 py-4 text-sm text-gray-500">{invoice.invoiceReference}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{invoice.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{invoice.items.length}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{invoice.invoiceDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-lg text-gray-500">No invoices found!</p>
                <button
                  className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={(): void => resetFilter()}
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
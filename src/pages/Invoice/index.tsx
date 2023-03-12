import { useState, useEffect, useCallback } from 'react';
import CreateInvoice from './CreateInvoice';
import { Invoice, FetchInvoicesQueryParams } from './interfaces';
import { fetchInvoices } from '../../services/apiServices';
import InvoiceList from './InvoiceList';
import { INPUT } from '../../constants/style'

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
  const [limit, setLimit] = useState(10); // TODO: do paginate
  const [page, setPage] = useState(1); // TODO: do paginate
  const [order, setOrder] = useState(ORDER_TYPES.ascending);
  const [dateType, setDateType] = useState('INVOICE_DATE')
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

  const getInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      let queryParams: FetchInvoicesQueryParams = {
        pageSize: limit,
        pageNum: page,
        ordering: order,
        dateType: dateType,
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
  
      const invoices = await fetchInvoices(access_token, org_token, queryParams);

      setInvoices(invoices);
    } catch (error) {
      throw new Error('Error fetching invoices' + error);
    } finally {
      setIsLoading(false);
    }
  }, [access_token, dateType, debouncedKeyword, end, limit, order, org_token, page, sortBy, start, status]);
  
  useEffect(() => {
    if (access_token && org_token) {
      getInvoices();
    }
  }, [access_token, org_token, getInvoices]);

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-5xl w-full px-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="w-full sm:w-auto">
              <CreateInvoice />
            </div>
            <div className="w-full sm:w-auto">
              <input
                className="w-full px-4 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs md:max-w-md lg:max-w-lg sm:w-72 md:w-80 lg:w-96"
                placeholder="Input to search"
                value={keyword}
                onChange={handleInputChange}
              />
            </div>

          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 mr-2">
                <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" stroke="currentColor"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm12 0a8 8 0 018 8v-2a6 6 0 00-6-6h-2zm-8 0a4 4 0 014-4V4a8 8 0 00-8 8h4zm12 0a4 4 0 01-4 4v2a6 6 0 006-6h2z"></path>
              </svg>
              <span className="text-gray-600 font-medium">Loading...</span>
            </div>
          ) : (
            <InvoiceList invoices={invoices} resetFilter={resetFilter}/>
          )}
        </div>
      </div>
    </div>
  );
}
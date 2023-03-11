import { INPUT } from 'constant/style';
import { useState, useEffect } from 'react';
import CreateInvoice from './CreateInvoice';
import axios from 'axios';
import { API_URL } from '../../constant';

interface Invoice {
  id: string;
}
interface QueryParams {
  fromDate: string;
  toDate: string;
  pageSize: number;
  pageNum: number;
  ordering: 'ASCENDING' | 'DESCENDING';
  sortBy: string;
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
  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  });
  const [end, setEnd] = useState(new Date());
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(ORDER_TYPES.ascending);
  const [sortBy, setSortBy] = useState('CREATED_DATE');
  const [status, setStatus] = useState('PAID');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchInvoices = async (): Promise<void> => {
      try {
        setIsLoading(true);
        let queryParams: QueryParams = {
          fromDate: start.toISOString().substring(0, 10),
          toDate: end.toISOString().substring(0, 10),
          pageSize: limit,
          pageNum: page,
          ordering: "ASCENDING",
          sortBy: sortBy,
          status: status,
        };

        if (keyword?.length) {
          queryParams = {...queryParams, keyword: keyword};
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
    };

    if (access_token && org_token) {
      fetchInvoices();
    }
  }, [access_token, end, keyword, limit, order, org_token, page, sortBy, start, status]);

  return (
    <div className="container flex justify-center mx-auto py-10">
      <div className="flex flex-col">
        <div className="w-full">
          <div className="mb-5 grid md:grid-cols-2 sm:grid-cols-1 gap-4">
            <div>
              <CreateInvoice />
            </div>

            <div>
              <input placeholder="Input to search" className={INPUT.DEFAULT} />
            </div>
          </div>

          <div className="border-b border-gray-200 shadow">
            <table className="divide-y divide-gray-300 ">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-2 text-xs text-gray-500">ID</th>
                  <th className="px-6 py-2 text-xs text-gray-500">Name</th>
                  <th className="px-6 py-2 text-xs text-gray-500">Email</th>
                  <th className="px-6 py-2 text-xs text-gray-500">Created_at</th>
                  <th className="px-6 py-2 text-xs text-gray-500">Download</th>
                  <th className="px-6 py-2 text-xs text-gray-500">Delete</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                <tr className="whitespace-nowrap">
                  <td className="px-6 py-4 text-sm text-gray-500">1</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Jon doe</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">jhondoe@example.com</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">2021-1-12</td>
                  <td className="px-6 py-4">
                    <a href="#" className="px-4 py-1 text-sm text-blue-600 bg-blue-200 rounded-md">
                      Download
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <a href="#" className="px-4 py-1 text-sm text-red-400 bg-red-200 rounded-md">
                      Delete
                    </a>
                  </td>
                </tr>
                <tr className="whitespace-nowrap">
                  <td className="px-6 py-4 text-sm text-gray-500">1</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Jon doe</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">jhondoe@example.com</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">2021-1-12</td>
                  <td className="px-6 py-4">
                    <a href="#" className="px-4 py-1 text-sm text-blue-600 bg-blue-200 rounded-md">
                      Download
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <a href="#" className="px-4 py-1 text-sm text-red-400 bg-red-200 rounded-md">
                      Delete
                    </a>
                  </td>
                </tr>
                <tr className="whitespace-nowrap">
                  <td className="px-6 py-4 text-sm text-gray-500">1</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">Jon doe</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">jhondoe@example.com</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">2021-1-12</td>
                  <td className="px-6 py-4">
                    <a href="#" className="px-4 py-1 text-sm text-blue-600 bg-blue-200 rounded-md">
                      Download
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <a href="#" className="px-4 py-1 text-sm text-red-400 bg-red-200 rounded-md">
                      Delete
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
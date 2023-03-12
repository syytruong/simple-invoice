import React from 'react';
import { Invoice } from './interfaces';
interface Props {
  invoices: Invoice[] | null;
  resetFilter: () => void;
}
  
const InvoiceList: React.FC<Props> = ({ invoices, resetFilter }) => {
  return (
    <div>
      {invoices?.length ? (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Reference</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Created at</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.invoiceId}>
                <td className="border px-4 py-2">{invoice.invoiceId}</td>
                <td className="border px-4 py-2">
                  <div>{invoice.description}</div>
                </td>
                <td className="border px-4 py-2">
                  <div>{invoice.balanceAmount}</div>
                </td>
                <td className="border px-4 py-2">{invoice.invoiceDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center justify-center h-48">
          <p className="text-gray-500 text-lg">No invoices found!</p>
          <button
            className="mt-4 px-6 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring shadow-lg"
            onClick={(): void => resetFilter()}
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
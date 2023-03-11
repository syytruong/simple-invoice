import { INPUT } from 'constant/style';

export default function InvoicePage(): JSX.Element {
  return (
    <div className="container flex justify-center mx-auto py-10">
      <div className="flex flex-col">
        <div className="w-full">
          <div className="mb-5 grid md:grid-cols-2 sm:grid-cols-1 gap-4">
            <div>
              <button className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 capitalize">
                create invoice
              </button>
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
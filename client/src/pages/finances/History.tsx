import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ComponentLoader from '../../components/ComponentLoader';
import {
  categorizeHealthScore,
  categorizeHealthScoreColor,
} from '../../helpers';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { HistoryType, statusType } from '../../types';
import RootLayout from '../RootLayout';

const History = () => {
  const [historyData, setHistoryData] = useState<HistoryType[]>([]);
  const [status, setStatus] = useState<statusType>({
    loading: true,
    error: null,
  });

  const axiosPrivate = useAxiosPrivate();

  const getHistoryData = async () => {
    try {
      const response = await axiosPrivate.get('/finances');
      const data = response.data;
      const respData = data.data;

      console.log(respData);
      setHistoryData(respData.finances);
      setStatus({
        loading: false,
        error: null,
      });
    } catch (error) {}
  };

  useEffect(() => {
    getHistoryData();
  }, []);

  return (
    <ComponentLoader
      status={status}
      component={
        <RootLayout>
          <h1 className="text-3xl font-semibold border-b-2 border-b-gray-600">
            Finance History
          </h1>
          <div className="">
            <Link
              to="/finances/calculate"
              className="float-right bg-green-700 text-white px-3 py-1 rounded-md text-md inline-block"
            >
              <span
                className="font-bold mr-1"
                dangerouslySetInnerHTML={{ __html: '&plus;' }}
              />
              Calculate New Finance
            </Link>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left border border-gray-400 px-2 py-2">
                  Income
                </th>
                <th className="text-left border border-gray-400 px-2 py-2">
                  Expense
                </th>
                <th className="text-left border border-gray-400 px-2 py-2">
                  Debts
                </th>
                <th className="text-left border border-gray-400 px-2 py-2">
                  Assets
                </th>
                <th className="text-left border border-gray-400 px-2 py-2">
                  Score
                </th>
                <th className="text-justify border border-gray-400 px-2 py-2">
                  Calculated At
                </th>
                <th className="text-justify border border-gray-400 px-2 py-2">
                  Verdict
                </th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((finance: HistoryType, key: number) => (
                <tr key={key}>
                  <td className="border border-gray-400 px-2 py-2">
                    ${finance.income}
                  </td>
                  <td className="border border-gray-400 px-2 py-2">
                    ${finance.expense}
                  </td>
                  <td className="border border-gray-400 px-2 py-2">
                    ${finance.debts}
                  </td>
                  <td className="border border-gray-400 px-2 py-2">
                    ${finance.assets}
                  </td>
                  <td className="border border-gray-400 px-2 py-2">
                    {finance.score?.toFixed(2)}
                  </td>
                  <td className="border border-gray-400 px-2 py-2">
                    {finance.calculated_at}
                  </td>
                  <td className="border border-gray-400 px-2 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-sm text-white font-semibold ${
                        finance.score == null
                          ? 'bg-gray-400 text-gray-800'
                          : categorizeHealthScoreColor(finance.score)
                      }`}
                    >
                      {categorizeHealthScore(finance.score ? finance.score : 0)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <Link
              to="/dashboard"
              className="underline text-green-700 font-semibold"
            >
              Back to Dashboard
            </Link>
          </div>
        </RootLayout>
      }
    />
  );
};

export default History;

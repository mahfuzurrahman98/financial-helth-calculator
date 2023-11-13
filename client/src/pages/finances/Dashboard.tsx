import { useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { Link } from 'react-router-dom';
import ComponentLoader from '../../components/ComponentLoader';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { DashboardDataType, FinanceType, statusType } from '../../types';
import RootLayout from '../RootLayout';

const ScatterChart = ({ scatterChartData }: { scatterChartData: [] }) => {
  console.log(scatterChartData);
  return (
    <Chart
      width={'100%'}
      height={'400px'}
      chartType="ScatterChart"
      loader={<div>Loading Scater Chart...</div>}
      data={scatterChartData}
      // add border to the chart
      options={{
        title: 'Scatter Plot Chart',
        hAxis: { title: 'Month', minValue: 0, maxValue: 12 },
        vAxis: { title: 'Score', minValue: 0, maxValue: 1 },
        trendlines: {
          0: {
            type: 'exponential',
            color: 'green',
          },
        },
      }}
    />
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardDataType>({
    recent_finances: [],
    total: 0,
    total_income: 0,
    total_expense: 0,
    last_debts: 0,
    last_assets: 0,
    total_score: 0,
    average_score: 0,
  });
  const [status, setStatus] = useState<statusType>({
    loading: true,
    error: null,
  });

  const [lineChartData, setLineChartData] = useState<any>([]);
  const [scatterChartData, setScatterChartData] = useState<any>([]);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const axiosPrivate = useAxiosPrivate();

  const getDashboardData = async () => {
    try {
      const response = await axiosPrivate.get('/finances/dashboard');
      const data = response.data;
      const respData = data.data;

      console.log(respData);

      // total_score with 2 decimal places
      if (respData.total > 0) {
        setDashboardData({
          recent_finances: respData.recent_finances,
          total: respData.total,
          total_income: respData.total_income,
          total_expense: respData.total_expense,
          last_debts: respData.last_debts,
          last_assets: respData.last_assets,
          total_score: respData.total_score.toFixed(2),
          average_score: respData.average_score.toFixed(2),
        });

        let currentMonth = new Date().getMonth() + 1;

        let _lineChartData: any = [];
        let _scatterChartData: any = [];

        respData.recent_finances.forEach((finance: FinanceType) => {
          let _month = currentMonth;
          currentMonth -= 1;

          if (currentMonth < 1) {
            currentMonth = 12;
          }

          _lineChartData.push([
            months[_month - 1],
            finance.income,
            finance.expense,
          ]);

          _scatterChartData.push([months[_month - 1], finance.score]);
        });

        _lineChartData.push(['Month', 'Income($)', 'Expenses($)']);
        _scatterChartData.push(['Month', 'Score']);

        _lineChartData.reverse();
        _scatterChartData.reverse();

        setLineChartData(_lineChartData);
        setScatterChartData(_scatterChartData);
      }
      setStatus({
        loading: false,
        error: null,
      });
    } catch (error) {}
  };

  let currentMonthNumber = new Date().getMonth() + 1;
  const getMonthName = (key: number) => {
    const monthIndex = ((currentMonthNumber - key + 11) % 12) + 1;
    return months[monthIndex - 1];
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <ComponentLoader
      status={status}
      component={
        <RootLayout>
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tile 1: Your current score */}
            <div className="bg-green-50 p-6 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">Your Current Score</h2>
              <p className="text-2xl text-green-800">
                {dashboardData.total_score}
              </p>
            </div>

            {/* Tile 2: Your average score */}
            <div className="bg-green-50 p-6 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">Your Average Score</h2>
              <p className="text-2xl text-green-800">
                {dashboardData.average_score}
              </p>
            </div>

            {/* Tile 3: Your total income */}
            <div className="bg-green-50 p-6 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">Your Total Income</h2>
              <p className="text-2xl text-green-800">
                ${dashboardData.total_income}
              </p>
            </div>

            {/* Tile 4: Your assets */}
            <div className="bg-green-50 p-6 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">Your Assets</h2>
              <p className="text-2xl text-green-800">
                ${dashboardData.last_assets}
              </p>
            </div>

            {/* Tile 5: Your total expense */}
            <div className="bg-green-50 p-6 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">Your Total Expense</h2>
              <p className="text-2xl text-green-800">
                ${dashboardData.total_expense}
              </p>
            </div>

            {/* Tile 6: Total debts */}
            <div className="bg-green-50 p-6 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">Total Debts</h2>
              <p className="text-2xl text-green-800">
                ${dashboardData.last_debts}
              </p>
            </div>
          </div>

          {lineChartData.length > 0 ? (
            <>
              <Chart
                chartType="LineChart"
                loader={<div>Loaidng Income-Expense Chart...</div>}
                width="100%"
                height="400px"
                data={lineChartData}
                options={{
                  title: 'Income-Expense Chart',
                  curveType: 'function',
                  legend: { position: 'bottom' },
                }}
              />

              <ScatterChart scatterChartData={scatterChartData} />
            </>
          ) : (
            <></>
          )}

          <div className="mt-8">
            <div className="mb-5">
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

            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-b-gray-600">
              Recent Finances
            </h2>

            <table className="w-full table-auto bg-green-50">
              <thead>
                <tr>
                  <th className="text-left border border-gray-400 p-2">
                    Month
                  </th>
                  <th className="text-left border border-gray-400 p-2">
                    Income
                  </th>
                  <th className="text-left border border-gray-400 p-2">
                    Expense
                  </th>
                  <th className="text-left border border-gray-400 p-2">
                    Debts
                  </th>
                  <th className="text-left border border-gray-400 p-2">
                    Assets
                  </th>
                  <th className="text-left border border-gray-400 p-2">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recent_finances.map(
                  (finance: FinanceType, key: number) => (
                    <tr key={key}>
                      <td className="border border-gray-400 px-2 py-2">
                        {getMonthName(key)}
                      </td>
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
                    </tr>
                  )
                )}
              </tbody>
            </table>

            <div className="mt-4">
              <Link
                to="/finances/history"
                className="underline text-green-800 font-semibold"
              >
                View All History
              </Link>
            </div>
          </div>
        </RootLayout>
      }
    />
  );
};

export default Dashboard;

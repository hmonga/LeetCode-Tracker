import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './ProgressChart.css';

export default function ProgressChart({ stats }) {
  const data = [
    { name: 'Easy', value: stats.easySolved || 0, color: '#00b8a3' },
    { name: 'Medium', value: stats.mediumSolved || 0, color: '#ffc01e' },
    { name: 'Hard', value: stats.hardSolved || 0, color: '#ff375f' },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-card">
          <h3 className="chart-title">Progress Distribution</h3>
          <p className="no-data">No solved problems yet. Start solving to see your progress!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-card">
        <h3 className="chart-title">Progress Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


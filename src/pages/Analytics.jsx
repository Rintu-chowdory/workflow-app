import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts'

const weeklyData = [
  { day: 'Mon', created: 4, completed: 3 },
  { day: 'Tue', created: 6, completed: 5 },
  { day: 'Wed', created: 3, completed: 2 },
  { day: 'Thu', created: 8, completed: 7 },
  { day: 'Fri', created: 5, completed: 4 },
  { day: 'Sat', created: 2, completed: 1 },
  { day: 'Sun', created: 1, completed: 0 },
]

const monthlyTrend = [
  { month: 'Jan', tasks: 18 }, { month: 'Feb', tasks: 24 },
  { month: 'Mar', tasks: 31 }, { month: 'Apr', tasks: 27 },
  { month: 'May', tasks: 35 }, { month: 'Jun', tasks: 22 },
]

const categoryData = [
  { name: 'Development', value: 40, color: '#6366f1' },
  { name: 'Design', value: 25, color: '#8b5cf6' },
  { name: 'Marketing', value: 20, color: '#ec4899' },
  { name: 'Other', value: 15, color: '#94a3b8' },
]

const summaryStats = [
  { label: 'Total Tasks', value: '47', change: '+12%', up: true },
  { label: 'Completed', value: '31', change: '+8%', up: true },
  { label: 'Avg. per Day', value: '3.2', change: '-5%', up: false },
  { label: 'On-time Rate', value: '84%', change: '+3%', up: true },
]

export default function Analytics() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics</h1>
        <p className="text-gray-500 text-sm">Track your productivity trends and task insights</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryStats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{s.value}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.up ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
              {s.change} this month
            </span>
          </div>
        ))}
      </div>

      {/* Weekly bar chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Weekly Activity</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
            <Legend iconType="circle" iconSize={8} />
            <Bar dataKey="created" name="Created" fill="#c7d2fe" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Monthly Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
              <Line
                type="monotone" dataKey="tasks" name="Tasks"
                stroke="#6366f1" strokeWidth={2.5}
                dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-5">By Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" cx="45%" cy="50%" outerRadius={75} innerRadius={45}>
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Legend iconType="circle" iconSize={8} layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

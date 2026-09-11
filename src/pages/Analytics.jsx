import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts'
import { supabase } from '../lib/supabase'
import { useDark } from '../lib/useTheme'

const CATEGORY_COLORS = {
  Development: '#6366f1',
  Design: '#8b5cf6',
  Marketing: '#ec4899',
  Research: '#f59e0b',
  Other: '#94a3b8',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Analytics() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const dark = useDark()

  useEffect(() => {
    supabase.from('tasks').select('*').then(({ data }) => {
      setTasks(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const tick = { fontSize: 12, fill: dark ? '#94a3b8' : '#64748b' }
  const grid = dark ? '#1f2937' : '#f1f5f9'
  const tooltipStyle = dark
    ? { background: '#111827', border: '1px solid #374151', borderRadius: 12, color: '#e5e7eb' }
    : { borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }
  const legendText = value => (
    <span style={{ color: dark ? '#94a3b8' : '#475569', fontSize: 12 }}>{value}</span>
  )

  const total = tasks.length
  /* NOTE: status values are 'todo' | 'in_progress' | 'done' — kept in
     sync with the Tasks page (a previous version counted 'done', which never
     matched real data). */
  const completed = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const completionRate = total ? Math.round((completed / total) * 100) : 0

  // Weekly activity — group by day of week
  const weeklyMap = DAYS.map(d => ({ day: d, created: 0, completed: 0 }))
  tasks.forEach(t => {
    const idx = new Date(t.created_at).getDay()
    weeklyMap[idx].created += 1
    if (t.status === 'done') weeklyMap[idx].completed += 1
  })
  const weeklyData = [...weeklyMap.slice(1), weeklyMap[0]]

  // Monthly trend — last 6 months
  const now = new Date()
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return { month: MONTHS[d.getMonth()], year: d.getFullYear(), tasks: 0, completed: 0 }
  })
  tasks.forEach(t => {
    const d = new Date(t.created_at)
    const match = monthlyData.find(m => MONTHS.indexOf(m.month) === d.getMonth() && m.year === d.getFullYear())
    if (match) {
      match.tasks += 1
      if (t.status === 'done') match.completed += 1
    }
  })

  // Category breakdown
  const catMap = {}
  tasks.forEach(t => { const c = t.category || 'Other'; catMap[c] = (catMap[c] || 0) + 1 })
  const categoryData = Object.entries(catMap).map(([name, value]) => ({
    name, value, color: CATEGORY_COLORS[name] || '#94a3b8',
  }))

  const summaryStats = [
    { label: 'Total Tasks', value: String(total), sub: 'all time' },
    { label: 'Completed', value: String(completed), sub: `${completionRate}% rate` },
    { label: 'In Progress', value: String(inProgress), sub: 'active now' },
    { label: 'To Do', value: String(tasks.filter(t => t.status === 'todo').length), sub: 'not started' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Live data from your {total} task{total !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryStats.map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{s.value}</p>
            <span className="text-xs text-gray-400 dark:text-gray-500">{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Weekly Activity</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Tasks created &amp; completed by day of week</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
            <XAxis dataKey="day" tick={tick} axisLine={false} tickLine={false} />
            <YAxis tick={tick} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" iconSize={8} formatter={legendText} />
            <Bar dataKey="created" name="Created" fill={dark ? '#4f46e5' : '#c7d2fe'} radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Monthly Trend</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Last 6 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
              <XAxis dataKey="month" tick={tick} axisLine={false} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} formatter={legendText} />
              <Line type="monotone" dataKey="tasks" name="Created" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">By Category</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Task distribution</p>
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">No tasks yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" cx="45%" cy="50%" outerRadius={75} innerRadius={45}>
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} layout="vertical" align="right" verticalAlign="middle" formatter={legendText} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

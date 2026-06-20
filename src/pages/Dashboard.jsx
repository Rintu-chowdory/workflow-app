import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const INITIAL_TASKS = [
  { id: 1, title: 'Design landing page mockup', priority: 'high', status: 'in-progress', due: '2026-06-22' },
  { id: 2, title: 'Set up CI/CD pipeline', priority: 'medium', status: 'todo', due: '2026-06-25' },
  { id: 3, title: 'Write unit tests for auth module', priority: 'high', status: 'completed', due: '2026-06-20' },
  { id: 4, title: 'Update API documentation', priority: 'low', status: 'todo', due: '2026-06-28' },
  { id: 5, title: 'Code review — payments PR', priority: 'high', status: 'completed', due: '2026-06-19' },
  { id: 6, title: 'Fix mobile nav bug', priority: 'medium', status: 'in-progress', due: '2026-06-21' },
]

const QUOTES = [
  'The secret of getting ahead is getting started.',
  'Focus on being productive instead of busy.',
  'Small progress is still progress.',
  'Done is better than perfect.',
]

const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }
const STATUS_COLORS = { completed: '#6366f1', 'in-progress': '#f59e0b', todo: '#94a3b8' }

export default function Dashboard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', status: 'todo', due: '' })
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const quote = QUOTES[new Date().getDay() % QUOTES.length]

  const stats = {
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    high: tasks.filter(t => t.priority === 'high').length,
  }

  const statusData = [
    { name: 'Completed', value: stats.completed, color: '#6366f1' },
    { name: 'In Progress', value: stats.inProgress, color: '#f59e0b' },
    { name: 'To Do', value: stats.todo, color: '#94a3b8' },
  ]

  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#22c55e' },
  ]

  const weekData = [
    { day: 'Mon', done: 3 }, { day: 'Tue', done: 5 }, { day: 'Wed', done: 2 },
    { day: 'Thu', done: 7 }, { day: 'Fri', done: 4 }, { day: 'Sat', done: 1 }, { day: 'Sun', done: 0 },
  ]

  const completionRate = tasks.length ? Math.round((stats.completed / tasks.length) * 100) : 0

  function handleAddTask(e) {
    e.preventDefault()
    if (!newTask.title.trim()) return
    setTasks(prev => [...prev, { ...newTask, id: Date.now() }])
    setNewTask({ title: '', priority: 'medium', status: 'todo', due: '' })
    setShowModal(false)
  }

  function toggleStatus(id) {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t
      const next = t.status === 'todo' ? 'in-progress' : t.status === 'in-progress' ? 'completed' : 'todo'
      return { ...t, status: next }
    }))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-1">{today}</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Good day! 👋</h1>
        <p className="text-gray-500 italic text-sm">"{quote}"</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Completed', value: stats.completed, color: 'bg-indigo-50 text-indigo-600', icon: '✓' },
          { label: 'In Progress', value: stats.inProgress, color: 'bg-amber-50 text-amber-600', icon: '⟳' },
          { label: 'To Do', value: stats.todo, color: 'bg-slate-50 text-slate-500', icon: '○' },
          { label: 'High Priority', value: stats.high, color: 'bg-red-50 text-red-500', icon: '!' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg font-bold mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Analytics Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Completion Rate */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center">
            <p className="text-sm font-medium text-gray-500 mb-4">Completion Rate</p>
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#6366f1" strokeWidth="10"
                  strokeDasharray={`${completionRate * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-900">
                {completionRate}%
              </span>
            </div>
          </div>

          {/* Priority Split */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-3">Priority Split</p>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={priorityData} dataKey="value" cx="50%" cy="50%" outerRadius={55} innerRadius={30}>
                  {priorityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend iconSize={8} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Task Status */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-3">Task Status</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={weekData} barSize={10}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="done" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Tasks</h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/tasks')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors"
            >
              + New Task
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {tasks.slice(0, 5).map(task => (
            <div key={task.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
              <button
                onClick={() => toggleStatus(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  task.status === 'completed'
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : task.status === 'in-progress'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-gray-300 text-transparent'
                }`}
              >
                {task.status === 'completed' && <span className="text-xs">✓</span>}
                {task.status === 'in-progress' && <span className="text-xs">●</span>}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                  {task.title}
                </p>
                {task.due && <p className="text-xs text-gray-400 mt-0.5">Due {task.due}</p>}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                task.priority === 'high' ? 'bg-red-100 text-red-600' :
                task.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                'bg-green-100 text-green-600'
              }`}>
                {task.priority}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 hidden sm:block ${
                task.status === 'completed' ? 'bg-indigo-100 text-indigo-600' :
                task.status === 'in-progress' ? 'bg-amber-100 text-amber-600' :
                'bg-gray-100 text-gray-500'
              }`}>
                {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">New Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task title</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="What needs to be done?"
                  value={newTask.title}
                  onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newTask.priority}
                    onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newTask.status}
                    onChange={e => setNewTask(p => ({ ...p, status: e.target.value }))}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newTask.due}
                  onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

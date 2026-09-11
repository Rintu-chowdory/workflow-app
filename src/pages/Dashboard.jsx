import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { supabase } from '../lib/supabase'
import { useDark, dueInfo } from '../lib/useTheme'
import { toast } from '../lib/notify'

const QUOTES = [
  'The secret of getting ahead is getting started.',
  'Focus on being productive instead of busy.',
  'Small progress is still progress.',
  'Done is better than perfect.',
]

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', status: 'todo', due: '', category: 'Development' })
  const navigate = useNavigate()
  const dark = useDark()

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const quote = QUOTES[new Date().getDay() % QUOTES.length]

  async function fetchTasks() {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
    if (error) toast(`Could not load tasks: ${error.message}`)
    if (data) setTasks(data)
    setLoading(false)
  }

  useEffect(() => { fetchTasks() }, [])

  useEffect(() => {
    if (!showModal) return
    const onKey = e => { if (e.key === 'Escape') setShowModal(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showModal])

  const stats = {
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    high: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length,
  }

  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#22c55e' },
  ]

  /* Real activity: tasks created and completed over the last 7 days */
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), key: d.toDateString(), created: 0, done: 0 }
  })
  tasks.forEach(t => {
    const created = new Date(t.created_at)
    const createdSlot = weekData.find(w => w.key === new Date(created.getFullYear(), created.getMonth(), created.getDate()).toDateString())
    if (createdSlot) createdSlot.created += 1
    if (t.status === 'completed' && t.updated_at) {
      const updated = new Date(t.updated_at)
      const doneSlot = weekData.find(w => w.key === new Date(updated.getFullYear(), updated.getMonth(), updated.getDate()).toDateString())
      if (doneSlot) doneSlot.done += 1
    }
  })

  const completionRate = tasks.length ? Math.round((stats.completed / tasks.length) * 100) : 0
  const tickColor = dark ? '#94a3b8' : '#64748b'
  const tooltipStyle = dark
    ? { background: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#e5e7eb' }
    : { border: '1px solid #e2e8f0', borderRadius: 8 }
  const legendText = value => (
    <span style={{ color: dark ? '#94a3b8' : '#475569', fontSize: 12 }}>{value}</span>
  )

  async function handleAddTask(e) {
    e.preventDefault()
    if (!newTask.title.trim()) return
    const { error } = await supabase.from('tasks').insert([{ ...newTask, due: newTask.due || null }])
    if (error) return toast(`Save failed: ${error.message}`)
    toast('Task added ✓', false)
    setNewTask({ title: '', priority: 'medium', status: 'todo', due: '', category: 'Development' })
    setShowModal(false)
    fetchTasks()
  }

  async function toggleStatus(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const next = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'todo'
    const { error } = await supabase.from('tasks').update({ status: next }).eq('id', id)
    if (error) return toast(`Update failed: ${error.message}`)
    fetchTasks()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">{today}</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Good day! 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 italic text-sm">"{quote}"</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Completed', value: stats.completed, color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', icon: '✓' },
          { label: 'In Progress', value: stats.inProgress, color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400', icon: '⟳' },
          { label: 'To Do', value: stats.todo, color: 'bg-slate-100 dark:bg-slate-500/10 text-slate-500 dark:text-slate-400', icon: '○' },
          { label: 'High Priority', value: stats.high, color: 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400', icon: '!' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg font-bold mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Analytics Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Analytics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Completion Rate */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Completion Rate</p>
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke={dark ? '#1f2937' : '#e2e8f0'} strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#6366f1" strokeWidth="10"
                  strokeDasharray={`${completionRate * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-900 dark:text-gray-100">
                {completionRate}%
              </span>
            </div>
          </div>

          {/* Priority Split */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Priority Split</p>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={priorityData} dataKey="value" cx="50%" cy="50%" outerRadius={55} innerRadius={30}>
                  {priorityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [v, n]} />
                <Legend iconSize={8} iconType="circle" formatter={legendText} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Last 7 days */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Last 7 Days</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={weekData} barSize={10}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
                <YAxis hide allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="done" name="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Tasks</h2>
          <div className="flex gap-2">
            <button onClick={() => navigate('/tasks')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium">View all</button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors">+ New Task</button>
          </div>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {tasks.slice(0, 5).map(task => {
            const due = dueInfo(task.due)
            return (
              <div key={task.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <button
                  onClick={() => toggleStatus(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    task.status === 'completed' ? 'bg-indigo-600 border-indigo-600 text-white' :
                    task.status === 'in-progress' ? 'border-amber-400 text-amber-400' : 'border-gray-300 dark:border-gray-600 text-transparent'
                  }`}
                >
                  {task.status === 'completed' && <span className="text-xs">✓</span>}
                  {task.status === 'in-progress' && <span className="text-xs">●</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.status === 'completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>{task.title}</p>
                  {due && (
                    <p className={`text-xs mt-0.5 ${due.overdue && task.status !== 'completed'
                      ? 'text-red-500 dark:text-red-400 font-medium'
                      : due.today && task.status !== 'completed'
                        ? 'text-amber-500 dark:text-amber-400 font-medium'
                        : 'text-gray-400 dark:text-gray-500'}`}>
                      {due.overdue ? `Overdue · ${due.label}` : due.today ? 'Due today' : `Due ${due.label}`}
                    </p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                  task.priority === 'high' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
                  task.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                }`}>{task.priority}</span>
              </div>
            )
          })}
          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">No tasks yet — add one above!</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40" onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-5">New Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task title</label>
                <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="What needs to be done?" value={newTask.title}
                  onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} required autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newTask.status} onChange={e => setNewTask(p => ({ ...p, status: e.target.value }))}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due date</label>
                <input type="date" className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newTask.due} onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

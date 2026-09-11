import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { dueInfo } from '../lib/useTheme'
import { toast } from '../lib/notify'

const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done', archived: 'Archived' }

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [form, setForm] = useState({ title: '', priority: 'medium', status: 'todo', due: '', category: 'Development' })
  const [search, setSearch] = useState('')

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

  const filtered = tasks.filter(t => {
    const matchStatus = filter === 'all' || t.status === filter
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchPriority && matchSearch
  })

  function openAdd() {
    setEditTask(null)
    setForm({ title: '', priority: 'medium', status: 'todo', due: '', category: 'Development' })
    setShowModal(true)
  }

  function openEdit(task) {
    setEditTask(task)
    setForm({ title: task.title, priority: task.priority, status: task.status, due: task.due || '', category: task.category || 'Development' })
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    const payload = { ...form, due: form.due || null }
    const { error } = editTask
      ? await supabase.from('tasks').update(payload).eq('id', editTask.id)
      : await supabase.from('tasks').insert([payload])
    if (error) return toast(`Save failed: ${error.message}`)
    toast(editTask ? 'Task updated ✓' : 'Task added ✓', false)
    setShowModal(false)
    fetchTasks()
  }

  async function deleteTask(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) return toast(`Delete failed: ${error.message}`)
    fetchTasks()
  }

  async function toggleStatus(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const next = task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'todo'
    const { error } = await supabase.from('tasks').update({ status: next }).eq('id', id)
    if (error) return toast(`Update failed: ${error.message}`)
    fetchTasks()
  }

  const statusTabs = [
    { key: 'all', label: 'All', count: tasks.length },
    { key: 'todo', label: 'To Do', count: tasks.filter(t => t.status === 'todo').length },
    { key: 'in_progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length },
    { key: 'done', label: 'Completed', count: tasks.filter(t => t.status === 'done').length },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{tasks.length} total tasks</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
          className="border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
          <option value="all">All priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl overflow-x-auto">
        {statusTabs.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.key
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}>
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filter === tab.key
                ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map(task => {
              const due = dueInfo(task.due)
              return (
                <div key={task.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <button onClick={() => toggleStatus(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      task.status === 'done' ? 'bg-indigo-600 border-indigo-600 text-white' :
                      task.status === 'in_progress' ? 'border-amber-400' : 'border-gray-300 dark:border-gray-600'
                    }`}>
                    {task.status === 'done' && <span className="text-xs leading-none">✓</span>}
                    {task.status === 'in_progress' && <span className="w-2 h-2 bg-amber-400 rounded-full block" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>{task.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        task.priority === 'high' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
                        task.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                      }`}>{task.priority}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        task.status === 'done' ? 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                        task.status === 'in_progress' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>{STATUS_LABELS[task.status] || task.status}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                      {task.category && <span>{task.category}</span>}
                      {due && (
                        <span className={due.overdue && task.status !== 'done'
                          ? 'text-red-500 dark:text-red-400 font-medium'
                          : due.today && task.status !== 'done'
                            ? 'text-amber-500 dark:text-amber-400 font-medium'
                            : ''}>
                          {due.overdue ? `Overdue · ${due.label}` : due.today ? 'Due today' : `Due ${due.label}`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(task)} className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40" onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-5">{editTask ? 'Edit Task' : 'New Task'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Task title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    <option>Development</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due date</label>
                  <input type="date" className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.due} onChange={e => setForm(p => ({ ...p, due: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                  {editTask ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

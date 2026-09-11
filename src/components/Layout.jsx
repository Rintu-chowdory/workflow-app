import { useEffect, useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/tasks', label: 'Tasks', icon: '☑️' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('wf-theme', dark ? 'dark' : 'light') } catch (e) { /* ignore */ }
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', dark ? '#020617' : '#4f46e5')
  }, [dark])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-200 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">W</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Work Flow</span>
          </div>
          {/* Theme toggle */}
          <button
            onClick={() => setDark(d => !d)}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {dark ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM3 11.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm15.75 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM5.4 4.34a.75.75 0 011.06 0l1.06 1.06A.75.75 0 015.46 6.46L4.4 5.4a.75.75 0 010-1.06zM16.54 16.94a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM12 18.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.4 18.6a.75.75 0 010-1.06l1.06-1.06a.75.75 0 011.06 1.06L5.46 18.6a.75.75 0 01-1.06 0zM17.66 6.46a.75.75 0 010-1.06l1.06-1.06a.75.75 0 011.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM12 14.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-6 px-3">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer Links */}
        <div className="absolute bottom-20 left-0 right-0 px-3 border-t border-gray-100 dark:border-gray-800 py-3">
          <NavLink
            to="/datenschutz"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`
            }
          >
            🔒 Datenschutz
          </NavLink>
          <NavLink
            to="/impressum"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`
            }
          >
            ℹ️ Impressum
          </NavLink>
        </div>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
              R
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Rintu Chowdory</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">chowdorydevops@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center gap-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-gray-900 dark:text-gray-100">Work Flow</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

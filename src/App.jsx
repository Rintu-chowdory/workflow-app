import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Tasks from './pages/Tasks'
import Datenschutz from './pages/Datenschutz'
import Impressum from './pages/Impressum'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="datenschutz" element={<Datenschutz />} />
        <Route path="impressum" element={<Impressum />} />
      </Route>
    </Routes>
  )
}

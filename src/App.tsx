import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { publicRoutes } from './routes/index.ts'
import { Router } from './types/index.ts'
import './locales/vi.ts'
import 'react-toastify/dist/ReactToastify.css'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-confirm-alert/src/react-confirm-alert.css'
import 'react-lazy-load-image-component/src/effects/blur.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((route: Router) => {
          const Page = route.component
          return <Route key={route.path} path={route.path} element={<Page />} />
        })}
      </Routes>
    </BrowserRouter>
  )
}

export default App

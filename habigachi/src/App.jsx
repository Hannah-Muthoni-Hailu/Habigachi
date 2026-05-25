import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

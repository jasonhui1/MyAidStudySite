import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Inspiration } from './Pages/Inspirations'
import Breakdown from './Pages/Breakdown';

const App = () => {
    return (
        <Routes>
            <Route path='breakdown' element={<Breakdown/>} />
            <Route path='inspiration' element={<Inspiration/>} />
        </Routes>
    )
}

export default App

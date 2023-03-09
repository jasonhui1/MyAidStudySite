import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Inspiration } from './Pages/Inspirations'

const App = () => {
    return (
        <Routes>
            <Route path='inspiration' element={<Inspiration/>} />
        </Routes>
    )
}

export default App

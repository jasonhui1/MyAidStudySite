import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Inspiration } from './Pages/Inspirations'
import Breakdown from './Pages/Breakdown';
import Test from './Pages/Test';
import { InspirationCategory } from './Pages/Inspirations_category';
import AllBreakdown from './Pages/AllBreakdown';

const App = () => {
    return (
        <Routes>
            <Route path='breakdown' element={<AllBreakdown/>} />
            <Route path='breakdown/:page' element={<Breakdown/>} />
            <Route path='inspiration' element={<Inspiration/>} />
            <Route path='inspiration/:category' element={<InspirationCategory />} />
            <Route path='test' element={<Test/>} />

        </Routes>
    )
}

export default App

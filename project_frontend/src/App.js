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

            <Route path='/breakdown'>
                <Route index element={<AllBreakdown />} />
                <Route path=':page' element={<Breakdown />} />
            </Route>

            <Route path='/inspiration'>
                <Route index element={<Inspiration />} />
                <Route path=':category' element={<InspirationCategory />} />
            </Route>
            <Route path='test' element={<Test />} />

        </Routes>
    )
}

export default App

import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Inspiration } from './Pages/Inspirations'
import SingleBreakdown from './Pages/SingleBreakdown';
import Test from './Pages/Test';
import { InspirationCategory } from './Pages/Inspirations_category';
import AllBreakdown from './Pages/AllBreakdown';
import BreakdownCategory from './Pages/BreakdownCateory';

const App = () => {
    return (
        <Routes>

            <Route path='/breakdown'>
                <Route index element={<AllBreakdown />} />
                <Route path='category'>
                    <Route index element={<BreakdownCategory />} />
                    <Route path=':page' element={<SingleBreakdown />} />
                </Route>
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

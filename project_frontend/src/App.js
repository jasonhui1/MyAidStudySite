import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Inspiration } from './Pages/Inspirations'
import SingleBreakdown from './Pages/SingleBreakdown';
import Test from './Pages/Test';
import { InspirationCategory } from './Pages/Inspirations_category';
import AllBreakdown from './Pages/AllBreakdown';
import BreakdownCategory from './Pages/BreakdownCateory';
import Home from './Pages/Home';

const App = () => {
    return (
        <Routes>
            <Route path='/'>
                <Route index element={<Home/>}/>
                <Route path='/breakdown'>
                    <Route index element={<AllBreakdown />} />
                    <Route path=':category'>
                        <Route index element={<BreakdownCategory />} />
                    </Route>
                    <Route path='title/:page' element={<SingleBreakdown />} />
                </Route>

                <Route path='/inspiration'>
                    <Route index element={<Inspiration />} />
                    <Route path=':category' element={<InspirationCategory />} />
                </Route>
                <Route path='test' element={<Test />} />
            </Route>

        </Routes>
    )
}

export default App

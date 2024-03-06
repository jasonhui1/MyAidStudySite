import React from 'react'
import { CategoryData } from '../Types/InspirationData'
import { Link } from 'react-router-dom'

interface ArrayOf<T>{
    all_categories: T[],
    path: string
}

export default function Sidebar({all_categories, path} :ArrayOf<CategoryData>) {
    return (
        <nav className='flex flex-col h-screen top-0 gap-4 px-5 bg-slate-700 sticky '>
            <div>
                <h2 className=' text-gray-200 my-6'>Categories</h2>
            </div>

            <div className='flex flex-col gap-5 mx-auto'>
                {all_categories.map(({ word},i) => {
                    // const destination = '../' 
                    const destination = path +  word
                    return <Link to={destination} key={i} className=' text-gray-200'>{word}</Link>
                })}
            </div>
        </nav>
    )
}

import React from 'react'
import { Inspiration } from './Inspirations'
import { Link } from 'react-router-dom'

interface Pages {
    [key: string]: string;
}



export default function Home() {

    const pages: Pages = {
        'inspiration': '/inspiration',
        'breakdown': '/breakdown'
    };

    return (
        <div className='h-screen flex justify-around items-center'>
            {
                Object.keys(pages).map(key => {
                    return (
                        <Link to={pages[key]}>
                            <div className='w-96 h-96 rounded-full bg-primary-color hover:bg-primary-color-hover flex justify-center items-center text-4xl font-semibold capitalize'>
                                {key}
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}

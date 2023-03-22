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
        <div>
            {
                Object.keys(pages).map(key => {
                    return (
                        <Link to={pages[key]}>
                            <div className='w-24 h-24 rounded-full bg-pink-100'>
                                {key}
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}

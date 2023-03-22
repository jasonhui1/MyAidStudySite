import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CategoryData } from '../TypeScript/InspirationData';
import { getAllCategoryData } from '../FetchData/getdata';
import { client } from '../client';

interface Pages {
    [key: string]: string;
}



export default function Home() {

    const [allCategories, setAllCategories] = useState<CategoryData[]>([])
    const [hoveringIndex, setHoveringIndex] = useState<number>(-1)

    useEffect(() => {
        const categoryQuery = getAllCategoryData()
        client.fetch(categoryQuery).then((categoryData: CategoryData[]) => {
            setAllCategories(categoryData)
        });
    }, [])

    const pages: Pages = {
        'inspiration': '/inspiration',
        'breakdown': '/breakdown'
    };

    const hoveringPage = pages[Object.keys(pages)[hoveringIndex]]

    let timeoutId: NodeJS.Timeout;
    function ResetTimeout(f: () => void, delay: number) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            f()
        }, delay);
    }

    const onMouseOver = (index: number) => {
        ResetTimeout(() => setHoveringIndex(index), 300)
    }

    const onMouseLeave = () => {
        ResetTimeout(() => setHoveringIndex(-1), 300)
    }

    const pageClassName = 'w-96 h-96 rounded-full bg-primary-color center-flex text-4xl font-semibold capitalize'
    const activeClassName = 'relative bg-primary-color-hover ' + pageClassName

    return (
        <div className='h-screen flex justify-around items-center'>
            {
                Object.keys(pages).map((key, index) => {
                    return (
                        <Link key={index} to={pages[key]}>
                            <div className={index === hoveringIndex ? activeClassName : pageClassName} onMouseOver={() => onMouseOver(index)} onMouseLeave={() => onMouseLeave()}>
                                {key}

                                {/* Shows categories */}
                                {index === hoveringIndex &&
                                    allCategories.map(({ word }: CategoryData, i: number) => {
                                        const length = allCategories.length
                                        return (
                                            <Link to={hoveringPage + '/' + word}>
                                                <div
                                                    key={i}
                                                    className='absolute left-0  w-36 h-36 rounded-full text-lg center-flex bg-red-100 hover:bg-red-200 -translate-x-36'
                                                    style={
                                                        {
                                                            'rotate': `${360 / length * i}deg`,
                                                            'transformOrigin': '12rem 0',
                                                        }
                                                    }
                                                >
                                                    <p className='write-mode-lr'
                                                        style={
                                                            {
                                                                // Revert the orientation of text
                                                                'rotate': `-${360 / length * i}deg`,
                                                            }
                                                        }>{word}</p>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </Link>
                    )
                })
            }
        </div >
    )
}

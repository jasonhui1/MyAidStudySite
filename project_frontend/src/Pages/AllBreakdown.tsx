import React, { useState, useEffect, useRef } from 'react'
import { client, urlFor } from '../client';
import { PortableText, PortableTextReactComponents } from '@portabletext/react'
import { getBreakdownData, getBreakdownDataFromID, getAllCategoryData } from '../FetchData/getdata';
import { useParams, Link, useNavigate, useAsyncError } from 'react-router-dom'
import { BreakdownData } from '../TypeScript/BreakdownData';
import Sidebar from '../Components/Sidebar';
import { CategoryData, KeywordData } from '../TypeScript/InspirationData';

export default function AllBreakdown() {

    const [allCategories, setAllCategories] = useState<CategoryData[]>([])

    // const [breakdown, setbreakdown] = useState<BreakdownData[]>([])

    useEffect(() => {
        // client.fetch(getBreakdownData())
        //     .then((article: BreakdownData[]) => {
        //         setbreakdown(article)
        //     })

        const categoryQuery = getAllCategoryData()
        client.fetch(categoryQuery).then((categoryData: CategoryData[]) => {
            setAllCategories(categoryData)
        });

    }, [])

    return (
        <>
            <div className='flex gap-5'>
                <Sidebar all_categories={allCategories} path='./' />

                <div className='flex flex-1 flex-col p-8'>
                    <h1 className=' text-center '>All Breakdown</h1>
                    <hr></hr>

                    <div className='grid grid-cols-3 gap-8 items-center justify-items-center h-full'>

                        {allCategories.map(({ word }: CategoryData, i: number) => {
                            return (
                                <Link to={`./${word}`} key={i}>
                                    <div className='w-48 h-48 bg-orange-100 rounded-full flex justify-center items-center hover:bg-orange-200 hover:scale-125 duration-500 transition hover:animate-wiggle'>
                                        <h3>{word}</h3>
                                    </div>
                                </Link>
                            )
                        })}

                    </div>
                    {/* <div className='grid grid-cols-3 justify-center gap-10'>

                        {breakdown.map((props: BreakdownData) => {
                            return <BreakdownCard key={props._id} data={props} />
                        })}

                    </div> */}
                </div>
            </div>

        </>
    )
}



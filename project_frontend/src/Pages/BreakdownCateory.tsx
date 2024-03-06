import React, { useState, useEffect, useRef } from 'react'
import { client, urlFor } from '../client';
import { getBreakdownData, getAllCategoryData, getBreakdownDataFromCategory } from '../FetchData/getdata';
import { useParams, Link, useNavigate, useAsyncError } from 'react-router-dom'
import { BreakdownData, AllBreakdownDataFromCategory } from '../Types/BreakdownData';
import Sidebar from '../Components/Sidebar';
import { CategoryData, KeywordData } from '../Types/InspirationData';
import { BreakdownCard } from '../Components/BreakdownCard';

export default function BreakdownCategory() {

    const [breakdown, setbreakdown] = useState<BreakdownData[]>([])
    const [allCategories, setAllCategories] = useState<CategoryData[]>([])
    const { category } = useParams<string>();

    // Get all categories
    useEffect(() => {
        const categoryQuery = getAllCategoryData()
        client.fetch(categoryQuery).then((categoryData: CategoryData[]) => {
            setAllCategories(categoryData)
        });
    }, [])

    // Get breakdown datas
    useEffect(() => {
        if (category !== undefined) {
            client.fetch(getBreakdownDataFromCategory(category))
                .then(({ breakdown }: AllBreakdownDataFromCategory) => {
                    setbreakdown(breakdown)
                })
        }
    }, [category])

    return (
        <>
            <div className='flex gap-5'>
                <Sidebar all_categories={allCategories} path='../' />

                <div className='flex flex-1 flex-col p-8'>
                    <h1 className=' text-center '>{category}</h1>
                    <hr></hr>

                    <div className='grid grid-cols-3 gap-8  justify-items-center'>

                        {breakdown.length > 0 ?
                            breakdown.map((props: BreakdownData) => {
                                return <BreakdownCard key={props._id} data={props} additionalClassname='animate-fadeIn' />
                            }) :
                            <h3 className=' col-span-3'>No breakdown yet    </h3>}

                    </div>
                </div>
            </div>

        </>
    )
}


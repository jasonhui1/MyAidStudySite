import React, { useState, useEffect, useRef } from 'react'
import { client, urlFor } from '../client';
import { PortableText, PortableTextReactComponents } from '@portabletext/react'
import { getBreakdownData, getBreakdownDataFromID, getAllCategoryData } from '../FetchData/getdata';
import { useParams, Link, useNavigate, useAsyncError  } from 'react-router-dom'
import { BreakdownData } from '../TypeScript/BreakdownData';
import Sidebar from '../Components/Sidebar';
import { CategoryData, KeywordData } from '../TypeScript/InspirationData';

export default function AllBreakdown() {

    const [breakdown, setbreakdown] = useState<BreakdownData[]>([])
    const all_categories = useRef<CategoryData[]>([])

    useEffect(() => {
        client.fetch(getBreakdownData())
            .then((article: BreakdownData[]) => {
                console.log('article', article)
                setbreakdown(article)
            })

        const categoryQuery = getAllCategoryData()
        client.fetch(categoryQuery).then((categoryData: CategoryData[]) => {
            all_categories.current = categoryData
        });

    }, [])


    return (
        <>
            <div className='flex gap-5'>
                <Sidebar all_categories={all_categories.current} />
                <div className='flex flex-col'>
                    <h1 className=' text-center '>All Breakdown</h1>
                    <div className='grid grid-cols-3 justify-center gap-4'>

                        {breakdown.map((props: BreakdownData) => {
                            return <BreakdownCard key={props._id} {...props} />
                        })}

                    </div>
                </div>
            </div>

        </>
    )
}

export function BreakdownCard({ title, description, image, keywords }: BreakdownData) {

    const navigate = useNavigate()
    const handleClick = () => {
        navigate(`${title}`)
    }

    return (
        <div className='card shadow-lg p-4 cursor-pointer hover:bg-sky-100' onClick={handleClick}>
            <div className=' card-title p-2'> {title}</div>
            <div className=' card-body'>
                <h4> {description}</h4>
                {(image !== null)  &&
                    <img src={urlFor(image).width(300)
                        .fit('max')
                        .auto('format')
                        .url()}
                         className=' my-2'>

                    </img>
                }

                <h6 className=' font-bold my-1'> Keywords</h6>
                <ul> 
                    {keywords.map((word:string) => {
                        return <li>{word}</li>
                    })}
                </ul>

            </div>

        </div >
    )
}

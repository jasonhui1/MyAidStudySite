import React, { useState, useEffect, useRef } from 'react'
import { client, urlFor } from '../client';
import { PortableText, PortableTextReactComponents } from '@portabletext/react'
import { getBreakdownData, getBreakdownDataFromID, getAllCategoryData } from '../FetchData/getdata';
import { useParams, Link, useNavigate, useAsyncError } from 'react-router-dom'
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
                <Sidebar all_categories={all_categories.current} path='./' />

                <div className='flex flex-col p-8'>
                    <h1 className=' text-center '>All Breakdown</h1>
                    <hr></hr>
                    <div className='grid grid-cols-3 justify-center gap-10'>

                        {breakdown.map((props: BreakdownData) => {
                            return <BreakdownCard key={props._id} data={props} />
                        })}

                    </div>
                </div>
            </div>

        </>
    )
}


interface BreakdownCardProps {
    data: BreakdownData;
    additionalClassname?: string;
}

export function BreakdownCard({ data, additionalClassname = '' }: BreakdownCardProps) {

    const { title, description, image, keywords } = data;
    const navigate = useNavigate()
    const handleClick = () => {
        navigate(`${title}`)
    }

    return (
        <div className={'card shadow-lg cursor-pointer rounded-3xl  bg-orange-100 hover:bg-orange-200 hover:scale-105 duration-1000 delay-200' + additionalClassname} onClick={handleClick}>
            {(image !== null) &&
                <img src={urlFor(image)
                    .auto('format')
                    .url()}
                    alt={title}
                    className='bg-contain p-4  rounded-3xl hover:opacity-95 duration-1000 delay-200'>

                </img>
            }
            <div className=' card-body gap-3 '>
                <h2 className=' font-semibold'> {title}</h2>
                <h4> {description}</h4>
                <h6 className=' font-bold'> Keywords</h6>
                <ul>
                    {keywords.map((word: string, i: number) => {
                        return <li key={i}>{word}</li>
                    })}
                </ul>

            </div>

        </div >
    )
}

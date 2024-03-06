import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CategoryData } from '../Types/InspirationData';
import { getAllCategoryData, getBreakdownImageFirstX } from '../FetchData/getdata';
import { client, urlFor } from '../client';
import { BreakdownData } from '../Types/BreakdownData';

interface CategoryCircleProps {
    allCategories: CategoryData[];
    hoveringPage: string
}

function CategoryCircle({ allCategories, hoveringPage }: CategoryCircleProps) {
    return (
        <>
            {allCategories.map(({ word }: CategoryData, i: number) => {
                const length = allCategories.length
                return (
                    <Link to={hoveringPage + '/' + word}>
                        <div
                            key={i}
                            className='absolute left-0  w-36 h-36  rounded-full z-10 text-lg center-flex bg-red-100 hover:bg-red-200 -translate-x-36 animate-clipInLeft'
                            style={
                                {
                                    'rotate': `${360 / length * i}deg`,
                                    'transformOrigin': '12rem 0',
                                }
                            }
                        >
                            <p
                                style={
                                    {
                                        // Revert the orientation of text
                                        'rotate': `-${360 / length * i}deg`,
                                    }
                                }
                            >{word}</p>
                        </div>
                    </Link>
                )
            })}
        </>
    )
}

interface Pages {
    [key: string]: string;
}


export default function Home() {

    const [allCategories, setAllCategories] = useState<CategoryData[]>([])
    const [hoveringIndex, setHoveringIndex] = useState<number>(-1)
    const [images, setImages] = useState<BreakdownData[]>([])

    const pages: Pages = {
        'inspiration': '/inspiration',
        'breakdown': '/breakdown'
    };

    const hoveringPage = pages[Object.keys(pages)[hoveringIndex]]
    const galleyPhotoClassNames = ['right-12 top-12', 'right-3/4 top-16', 'left-12 bottom-12', 'right-18 bottom-1/4']

    useEffect(() => {
        const categoryQuery = getAllCategoryData()
        client.fetch(categoryQuery).then((categoryData: CategoryData[]) => {
            setAllCategories(categoryData)
        });

        const breakdownQuery = getBreakdownImageFirstX(4)
        client.fetch(breakdownQuery).then((imgs: BreakdownData[]) => {
            setImages(imgs)
        });
    }, [])

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
        ResetTimeout(() => setHoveringIndex(-1), 500)
    }

    const navigate = useNavigate()
    const pageClassName = 'w-96 h-96 rounded-full bg-primary-color center-flex text-4xl font-semibold capitalize z-10 '
    const activeClassName = 'relative bg-primary-color-hover ' + pageClassName

    return (
        <div className='h-screen  flex justify-around items-center z-10'>
            {
                Object.keys(pages).map((key, index) => {
                    return (
                        <Link key={index} to={pages[key]}>
                            <div className={index === hoveringIndex ? activeClassName : pageClassName} onMouseOver={() => onMouseOver(index)} onMouseLeave={() => onMouseLeave()}>
                                {key}
                                {/* Shows categories */}
                                {index === hoveringIndex &&
                                    <CategoryCircle allCategories={allCategories} hoveringPage={hoveringPage} />
                                }
                            </div>
                        </Link>
                    )
                })
            }

            {galleyPhotoClassNames.map((positionClassName, i) => {
                return (
                    <div className={'animate-galleryShiftUp absolute hover:cursor-pointer ' + positionClassName}>
                        {images.length > 0 &&
                        <img src={urlFor(images[i].image)
                            .auto('format')
                            .width(250)
                            .url()}
                            alt={images[i].title}
                            onClick={() => navigate(`breakdown/title/${images[i].title}`)}
                            className='rounded-3xl max-w-[20vw] hover:scale-110 duration-700'>
                        </img>
                        }
                    </div>
                )

            })}

        </div >
    )
}

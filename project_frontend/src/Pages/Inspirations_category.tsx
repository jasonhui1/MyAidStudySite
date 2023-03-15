// ToDO: optimise tweet/ youtube call
//  - by caching?

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { IoMdAdd, IoMdCloseCircle, IoMdSearch } from 'react-icons/io';
import { searchQueryThroughCategory, searchInspirationQuery, getKeywordData, getCategoryData, getArtistData } from '../FetchData/getdata';
import { client } from '../client';
import { CategoryData, InspirationData } from '../TypeScript/InspirationData';
import MasonryLayout from '../Components/MasonryLayout';
import CheckBox from '../Components/Checkbox';
import Sidebar from '../Components/Sidebar';


interface AllArtistsCheckBoxesProps {
    artists: string[],
    artistCheckState: boolean[],
    handleArtistCheckbox: (index: number) => void
}

export function AllArtistsCheckBoxes({ artists, handleArtistCheckbox, artistCheckState }: AllArtistsCheckBoxesProps): JSX.Element {
    return (
        <div className='grid grid-cols-3 lg:grid-cols-6 gap-4 outline p-4 '>
            {artists.map((name: string, i: number) => {
                return (
                    <CheckBox key={i} value={name} onChange={() => handleArtistCheckbox(i)} check={artistCheckState[i]} />
                )
            })}
        </div>
    )
}

interface AllKeywordsCheckBoxesProps {
    keywords: string[],
    keywordCheckState: boolean[],
    handleKeywordCheckbox: (index: number) => void
}

function AllKeywordsCheckBoxes({ keywords, keywordCheckState, handleKeywordCheckbox }: AllKeywordsCheckBoxesProps) {
    return (
        <>
            {keywords.length > 0 ?
                <div className='grid grid-cols-3 lg:grid-cols-6 gap-4 outline p-4 '>
                    {keywords.map((word: string, i: number) => {
                        return (
                            <CheckBox key={i} value={word} onChange={() => handleKeywordCheckbox(i)} check={keywordCheckState[i]} />
                        )
                    })}
                </div>
                : <h1> No Keywords found</h1>}
        </>

    )
}

export function InspirationCategory() {
    const { category } = useParams<string>();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [inspirationData, setInspirationData] = useState<InspirationData[]>([])
    const [keywordCheckState, setKeywordCheckState] = useState<boolean[]>([]);
    const [artistCheckState, setArtistCheckState] = useState<boolean[]>([]);


    let [all_keywords, all_categories, all_artists] = useInitialFetch(category, setInspirationData, setKeywordCheckState, setArtistCheckState)
    let [handleKeywordCheckbox, handleArtistCheckbox] = handleCheckboxesSetup(keywordCheckState, setKeywordCheckState, artistCheckState, setArtistCheckState)

    //Update Search
    useEffect(() => {
        console.log('querying')
        const selectedKeywords = all_keywords.filter((_: any, i: number) => keywordCheckState[i])
        const selectedArtists = all_artists.filter((_: any, i: number) => artistCheckState[i])

        if (category !== undefined) {
            const query = searchQueryThroughCategory(category, selectedKeywords, selectedArtists);

            console.log('query', query)
            client.fetch(query).then(({ inspirations }: QueryData) => {
                setInspirationData(inspirations)
            });
        }
    }, [searchTerm, keywordCheckState, artistCheckState]);


    return (
        <>
            {category !== undefined &&
                <>
                    <div className='flex gap-5'>

                        <Sidebar all_categories={all_categories} />
                        <div className=' container mx-auto'>
                            <h1 className='text-center capitalize'>{category}</h1>

                            <div className='flex flex-col gap-2'>

                                <AllArtistsCheckBoxes artists={all_artists} artistCheckState={artistCheckState} handleArtistCheckbox={handleArtistCheckbox} />
                                <AllKeywordsCheckBoxes keywords={all_keywords} keywordCheckState={keywordCheckState} handleKeywordCheckbox={handleKeywordCheckbox} />

                            </div>

                            {true &&
                                <MasonryLayout data={inspirationData} />
                            }

                        </div>
                    </div>
                </>
            }
        </>
    )
}

interface QueryData {
    inspirations: InspirationData[],
    all_keywords: string[]
}

function useInitialFetch(category: string | undefined,
    setInspirationData: React.Dispatch<React.SetStateAction<InspirationData[]>>,
    setKeywordCheckState: React.Dispatch<React.SetStateAction<boolean[]>>,
    setArtistCheckState: React.Dispatch<React.SetStateAction<boolean[]>>,
    keywordInitialFill: boolean = false,
):
    [
        string[],
        CategoryData[],
        string[],
    ] {

    let keywords = useRef<string[]>([])
    let categories = useRef<CategoryData[]>([])
    let artists = useRef<string[]>([])

    useEffect(() => {
        if (category !== undefined) {
            const query = searchQueryThroughCategory(category)
            client.fetch(query).then(({ inspirations, all_keywords }: QueryData) => {
                setInspirationData(inspirations)
                keywords.current = all_keywords
                setKeywordCheckState(new Array(all_keywords.length).fill(keywordInitialFill))
            });
        } else {
            console.log('category not found')
        }

        const artistQuery = getArtistData()
        client.fetch(artistQuery).then((artistData: string[]) => {
            artists.current = artistData
            setArtistCheckState(new Array(artistData.length).fill(false))
        });

        const categoryQuery = getCategoryData()
        client.fetch(categoryQuery).then((categoryData: CategoryData[]) => {
            categories.current = categoryData
        });

    }, [category]);

    return [keywords.current, categories.current, artists.current]
}

function handleCheckboxesSetup(
    keywordCheckState: boolean[],
    setKeywordCheckState: React.Dispatch<React.SetStateAction<boolean[]>>,
    artistCheckState: boolean[],
    setArtistCheckState: React.Dispatch<React.SetStateAction<boolean[]>>
): [(index: number) => void, (index: number) => void] {

    const handleKeywordCheckbox = ((index: number): void => {
        const updatedKeywordCheckState = keywordCheckState.map((check, i) =>
            i === index ? !check : check
        );

        setKeywordCheckState(updatedKeywordCheckState);
    })

    const handleArtistCheckbox = ((index: number): void => {
        //Maybe I want to select a range of all_artists later, currently the query only checks for AND
        const updatedArtistCheckState = artistCheckState.map((check, i) =>
            i === index ? !check : check
        );
        setArtistCheckState(updatedArtistCheckState);
    })

    return [handleKeywordCheckbox, handleArtistCheckbox]

}



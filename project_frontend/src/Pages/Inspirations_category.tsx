// ToDO: optimise tweet/ youtube call
//  - by caching?

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { IoMdAdd, IoMdCloseCircle, IoMdSearch } from 'react-icons/io';
import {
    searchQueryThroughCategory,
    getCategoryRelatedData,
    searchInspirationQuery,
    getAllKeywordData,
    getAllCategoryData,
    getAllArtistData,
    QueryData,
    CategoryRelatedData
} from '../FetchData/getdata';
import { client } from '../client';
import {
    CategoryData,
    InspirationData,
    KeywordData,
    ArtistData
} from '../TypeScript/InspirationData';
import MasonryLayout from '../Components/MasonryLayout';
import CheckBox from '../Components/Checkbox';
import Sidebar from '../Components/Sidebar';
import Search from '../Components/Search';


interface AllArtistsCheckBoxesProps {
    artists: ArtistData[],
    artistCheckState: boolean[],
    handleArtistCheckbox: (index: number) => void
}

export function AllArtistsCheckBoxes({ artists, handleArtistCheckbox, artistCheckState }: AllArtistsCheckBoxesProps): JSX.Element {
    return (
        <div className='grid grid-cols-3 lg:grid-cols-6 gap-4 outline p-4 '>
            {artists.map(({ name, count }: ArtistData, i: number) => {
                return (
                    <>
                        <div className='relative '>

                            <CheckBox key={i} value={name} onChange={() => handleArtistCheckbox(i)} check={artistCheckState[i]} after={count} className={`checkbox-count`} />
                            {/* <span className='absolute bottom-0 right-5 w-10 h-10 bg-white rounded-full flex justify-center items-center'>{count}</span> */}
                        </div>
                    </>
                )
            })}
        </div>
    )
}

interface AllKeywordsCheckBoxesProps {
    keywords: KeywordData[],
    keywordCheckState: boolean[],
    handleKeywordCheckbox: (index: number) => void
}

function AllKeywordsCheckBoxes({ keywords, keywordCheckState, handleKeywordCheckbox }: AllKeywordsCheckBoxesProps) {
    return (
        <>
            {keywords.length > 0 ?
                <div className='grid grid-cols-3 lg:grid-cols-6 gap-4 outline p-4 '>
                    {keywords.map(({ word, count }: KeywordData, i: number) => {
                        return (
                            <CheckBox key={i} value={word} onChange={() => handleKeywordCheckbox(i)} check={keywordCheckState[i]} after={count} className={`checkbox-count`}  />
                        )
                    })}
                </div>
                : <h1> No Keywords found</h1>}
        </>

    )
}

export function InspirationCategory() {
    const { category } = useParams<string>();
    const [searchTerm, setSearchTerm] = useState('');
    const [inspirationData, setInspirationData] = useState<InspirationData[]>([])
    const [keywordCheckState, setKeywordCheckState] = useState<boolean[]>([]);
    const [artistCheckState, setArtistCheckState] = useState<boolean[]>([]);
    const [openAdvSetting, setOpenAdvSetting] = useState(false)


    let [all_keywords, all_categories, all_artists] = useInitialFetch(category, setInspirationData, setKeywordCheckState, setArtistCheckState)
    const all_artists_name = all_artists.map(({ name }: ArtistData) => name)
    const all_keywords_word = all_keywords.map(({ word }: KeywordData) => word)

    let [handleKeywordCheckbox, handleArtistCheckbox] = handleCheckboxesSetup(keywordCheckState, setKeywordCheckState, artistCheckState, setArtistCheckState)


    //Update Search
    useEffect(() => {
        console.log('querying')
        const selectedKeywords = all_keywords_word.filter((_: any, i: number) => keywordCheckState[i])
        const selectedArtists = all_artists_name.filter((_: any, i: number) => artistCheckState[i])

        if (category !== undefined) {
            const query = searchQueryThroughCategory(category, searchTerm, selectedKeywords, selectedArtists);

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

                        <Sidebar all_categories={all_categories} path='../' />
                        <div className=' container mx-auto'>
                            <h1 className='text-center capitalize my-3'>{category}</h1>
                            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            <button className='btn btn-outline' onClick={() => setOpenAdvSetting(!openAdvSetting)}>open advance search</button>

                            {openAdvSetting &&
                                <div className='flex flex-col gap-2 my-2 animate-fadeIn'>
                                    <AllArtistsCheckBoxes artists={all_artists} artistCheckState={artistCheckState} handleArtistCheckbox={handleArtistCheckbox} />
                                    <AllKeywordsCheckBoxes keywords={all_keywords} keywordCheckState={keywordCheckState} handleKeywordCheckbox={handleKeywordCheckbox} />

                                </div>
                            }

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




function useInitialFetch(category: string | undefined,
    setInspirationData: React.Dispatch<React.SetStateAction<InspirationData[]>>,
    setKeywordCheckState: React.Dispatch<React.SetStateAction<boolean[]>>,
    setArtistCheckState: React.Dispatch<React.SetStateAction<boolean[]>>,
    keywordInitialFill: boolean = false,
):
    [
        KeywordData[],
        CategoryData[],
        ArtistData[],
    ] {

    let keywords = useRef<KeywordData[]>([])
    let categories = useRef<CategoryData[]>([])
    let artists = useRef<ArtistData[]>([])

    useEffect(() => {
        if (category !== undefined) {

            // Get all inspiration of the same category
            const query = searchQueryThroughCategory(category)
            client.fetch(query).then(({ inspirations }: QueryData) => {
                setInspirationData(inspirations)
            });

            //Get all keywords/ artists related to this category
            const categoryRelatedDataQuery = getCategoryRelatedData(category)
            client.fetch(categoryRelatedDataQuery).then(({ all_artists, all_keywords }: CategoryRelatedData) => {

                const sortedArtistArray = CountAndSortArray(all_artists)
                const artistObjectArray: ArtistData[] = sortedArtistArray.map(([name, count]) => {
                    return { name, count };
                });

                artists.current = artistObjectArray
                setArtistCheckState(new Array(artistObjectArray.length).fill(false))


                const sortedKeywordArray = CountAndSortArray(all_keywords)
                const keywordObjectArray: KeywordData[] = sortedKeywordArray.map(([word, count]) => {
                    return { word, count };
                });

                keywords.current = keywordObjectArray
                setKeywordCheckState(new Array(keywordObjectArray.length).fill(keywordInitialFill))
            });

        } else {
            console.log('category not found')
        }

        const categoryQuery = getAllCategoryData()
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


interface ArrayItemCount {
    [key: string]: number,
}

function CountAndSortArray(array: string[]) {
    const artistCount = array.reduce((acc: ArrayItemCount, curr: string) => {
        //If exist, +1, else set to 1
        acc[curr] = acc[curr] ? acc[curr] + 1 : 1;
        return acc;
    }, {});

    const sortedArray = Object.entries(artistCount).sort((a, b) => b[1] - a[1])
    return sortedArray

}
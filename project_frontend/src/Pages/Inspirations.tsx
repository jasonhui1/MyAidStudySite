// ToDO: optimise tweet/ youtube call
//  - by caching?

import React, { useState, useEffect, useMemo, useRef } from 'react'
// import { TwitterTimelineEmbed, TwitterVideoEmbed } from 'react-twitter-embed';
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import { IoMdAdd, IoMdCloseCircle, IoMdSearch } from 'react-icons/io';
import { searchInspirationQuery, getAllKeywordData, getAllCategoryData, getAllArtistData, searchQueryThroughCategory, QueryData } from '../FetchData/getdata';
import { client } from '../client';
import { InspirationCategory } from './Inspirations_category';
import MasonryLayout from '../Components/MasonryLayout';
import CheckBox from '../Components/Checkbox';
import { InspirationData, CategoryData, KeywordData, ArtistData } from '../TypeScript/InspirationData';
import Sidebar from '../Components/Sidebar';
import Search from '../Components/Search';
import AllKeywordsCheckBoxes from '../Components/Inspiration/AllKeywordsCheckBoxes';
import AllArtistsCheckBoxes from '../Components/Inspiration/AllArtistsCheckBoxes';
import { fetchArtistData, fetchCategoryData, fetchInspirationData } from '../FetchData/api';


export function Inspiration() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [inspirationData, setInspirationData] = useState<InspirationData[]>([])
    const [test, setTest] = useState<number>(0)
    const [openAdvSetting, setOpenAdvSetting] = useState(true)

    // Get initial data
    const [
        keywordCheckState, setKeywordCheckState,
        artistCheckState, setArtistCheckState,
        categoriesCheckState, setCategoryCheckState,
        all_keywords, all_categories, all_artists
    ] = useInitialFetch()

    //Update Search
    useEffect(() => {
        const updateInspriationData = async () => {
            const data = await fetchInspirationData('Shader', searchTerm, selectedKeywords, selectedArtists)
            console.log('fetch data :>> ', data);
            setInspirationData(data)
        }
        console.log('querying')
        const all_artists_name = all_artists.map(({ name }: ArtistData) => name)
        const selectedKeywords =
            all_keywords.flat().filter((_: any, i: number) => keywordCheckState.flat()[i])
                .map(({ word }: KeywordData) => word)

        const selectedArtists = all_artists_name.filter((_: any, i: number) => artistCheckState[i])
        updateInspriationData()

        // const query = searchInspirationQuery(searchTerm.toLowerCase(), keys, selectedKeywords, selectedArtists);

        // console.log('query', query)
        // client.fetch(query).then((data: InspirationData[]) => {
        //     setInspirationData(data)
        // });
    }, [searchTerm, keywordCheckState, artistCheckState]);

    // Check category if all sub keywords are checked
    useEffect(() => {
        const updatedCategoriesCheckState = keywordCheckState.map((array: boolean[]) => (array.every((isChecked) => isChecked)))
        setCategoryCheckState(updatedCategoriesCheckState)

    }, [keywordCheckState]);

    return (
        <>
            {/* <button className='btn' onClick={handleTest}>abc</button> */}
            <div className=''>
                <div className='flex gap-5'>

                    <Sidebar all_categories={all_categories} path='./' />
                    <div className='mt-4 container mx-auto'>
                        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                        <button className='btn btn-outline' onClick={() => setOpenAdvSetting(!openAdvSetting)}>open advance search</button>

                        {openAdvSetting &&
                            <div className='flex flex-col gap-2'>
                                <AllArtistsCheckBoxes artists={all_artists.map(({ name }) => name)} artistCheckState={artistCheckState} setArtistCheckState={setArtistCheckState} />
                                <AllKeywordsCheckBoxes all_categories={all_categories} keywordCheckState={keywordCheckState} categoriesCheckState={categoriesCheckState} setKeywordCheckState={setKeywordCheckState} setCategoryCheckState={setCategoryCheckState} />

                            </div>
                        }

                        {true &&
                            <MasonryLayout data={inspirationData} />
                        }

                    </div>

                </div>
            </div>
        </>
    )
}



function useInitialFetch():
    [boolean[][], React.Dispatch<React.SetStateAction<boolean[][]>>, boolean[], React.Dispatch<React.SetStateAction<boolean[]>>,
        boolean[], React.Dispatch<React.SetStateAction<boolean[]>>, KeywordData[][], CategoryData[], ArtistData[]
    ] {
    const [keywordCheckState, setKeywordCheckState] = useState<boolean[][]>([[]]);
    const [artistCheckState, setArtistCheckState] = useState<boolean[]>([]);
    const [categoriesCheckState, setCategoryCheckState] = useState<boolean[]>([]);

    let keywords = useRef<KeywordData[][]>([])
    let categories = useRef<CategoryData[]>([])
    let artists = useRef<ArtistData[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const [artistData, [categoryData, keywordsData]] = await Promise.all([
                fetchArtistData(),
                fetchCategoryData()
            ]);

            // Add the current word count
            artists.current = artistData.map(name => ({ name, count: 0 }))
            categories.current = categoryData
            keywords.current = keywordsData.map(row => row.map(word => ({ word, count: 0 })));

            setArtistCheckState(new Array(artistData.length).fill(false))
            setCategoryCheckState(new Array(categoryData.length).fill(false))

            //Create an empty 2d array (no keywords are currently checked)
            const two_d_array = new Array(categoryData.length).fill([]).map((_, i) => new Array(categoryData[i].keywords.length).fill(false))
            setKeywordCheckState(two_d_array)

        }
        fetchData();

    }, []);

    return [
        keywordCheckState, setKeywordCheckState,
        artistCheckState, setArtistCheckState,
        categoriesCheckState, setCategoryCheckState,
        keywords.current, categories.current, artists.current
    ]
}


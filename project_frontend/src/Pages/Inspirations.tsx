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
    const [initial, setInitial] = useState(true)

    // Get initial data
    const [
        keywordCheckState, setKeywordCheckState,
        artistCheckState, setArtistCheckState,
        categoriesCheckState, setCategoryCheckState,
        allKeywords, setAllKeywords,
        allCategories, setAllCategories,
        allArtists, setAllArtists
    ] = useInitialFetch()

    //Update Search
    useEffect(() => {
        const updateInspriationData = async () => {
            const data = await fetchInspirationData('shader', searchTerm, selectedKeywords, selectedArtists)
            if (initial) {
                if (allArtists.length !== 0) {
                    const count_artists = CountAndSortArray(data.map(({ artist }) => artist))
                    console.log('count_artists :>> ', count_artists);
                    console.log('allArtists :>> ', allArtists);

                    // Update filters count for artists
                    setAllArtists(prevArtists => {
                        return prevArtists.map(artist => {
                            const count = count_artists.find(([target]) => target === artist.name)?.[1] || 0;
                            return { ...artist, count };
                        });
                    });
                    setInitial(false)
                }
            }

            // Update filters count for keywords
            const stack_keywords: string[] = [];
            data.forEach(({ keywords }) => keywords.forEach(({ word }) => stack_keywords.push(word)));
            const count_keywords = CountAndSortArray(stack_keywords);

            setAllKeywords(prevKeywords => {
                return prevKeywords.map(row =>
                    row.map(keyword => {
                        const count = count_keywords.find(([target]) => target === keyword.word)?.[1] || 0;
                        return { ...keyword, count };
                    })
                );
            });

            console.log('fetched data :>> ', data);
            setInspirationData(data)
        }

        console.log('querying')
        const all_artists_name = allArtists.map(({ name }: ArtistData) => name)
        const selectedKeywords =
            allKeywords.flat().filter((_: any, i: number) => keywordCheckState.flat()[i])
                .map(({ word }: KeywordData) => word)

        const selectedArtists = all_artists_name.filter((_: any, i: number) => artistCheckState[i])
        updateInspriationData()

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

                    <Sidebar all_categories={allCategories} path='./' />
                    <div className='mt-4 container mx-auto'>
                        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                        <button className='btn btn-outline' onClick={() => setOpenAdvSetting(!openAdvSetting)}>open advance search</button>

                        {openAdvSetting &&
                            <div className='flex flex-col gap-2'>
                                <AllArtistsCheckBoxes artists={allArtists} artistCheckState={artistCheckState} setArtistCheckState={setArtistCheckState} />
                                <AllKeywordsCheckBoxes all_categories={allCategories} all_keywords={allKeywords} keywordCheckState={keywordCheckState} categoriesCheckState={categoriesCheckState} setKeywordCheckState={setKeywordCheckState} setCategoryCheckState={setCategoryCheckState} />

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

function findIndexes2D<T>(array: T[][], propName: keyof T, targetName: string) {
    const index = { row: -1, col: -1 };

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if (array[i][j][propName] === targetName) {
                index.row = i
                index.col = j
            }
        }
    }

    return index;
}


function useInitialFetch():
    [
        boolean[][], React.Dispatch<React.SetStateAction<boolean[][]>>,
        boolean[], React.Dispatch<React.SetStateAction<boolean[]>>,
        boolean[], React.Dispatch<React.SetStateAction<boolean[]>>,
        KeywordData[][], React.Dispatch<React.SetStateAction<KeywordData[][]>>,
        CategoryData[], React.Dispatch<React.SetStateAction<CategoryData[]>>,
        ArtistData[], React.Dispatch<React.SetStateAction<ArtistData[]>>,
    ] {
    const [keywordCheckState, setKeywordCheckState] = useState<boolean[][]>([[]]);
    const [artistCheckState, setArtistCheckState] = useState<boolean[]>([]);
    const [categoriesCheckState, setCategoryCheckState] = useState<boolean[]>([]);

    const [allKeywords, setAllKeywords] = useState<KeywordData[][]>([[]]);
    const [allCategories, setAllCategories] = useState<CategoryData[]>([]);
    const [allArtists, setAllArtists] = useState<ArtistData[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            const [artistData, [categoryData, keywordsData]] = await Promise.all([
                fetchArtistData(),
                fetchCategoryData()
            ]);

            // Add the current word count
            setAllArtists(artistData.map(name => ({ name, count: 0 })))
            setAllCategories(categoryData)
            setAllKeywords(keywordsData.map(row => row.map(word => ({ word, count: 0 }))))

            // Set checkboxes
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
        allKeywords, setAllKeywords,
        allCategories, setAllCategories,
        allArtists, setAllArtists
    ]
}


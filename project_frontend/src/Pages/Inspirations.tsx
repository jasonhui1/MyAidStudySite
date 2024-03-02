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
import { isEqual } from 'lodash'; // Import the isEqual function from lodash library


export type CheckboxState = {
    [category: string]: {
        [word: string]: {
            checked: boolean;
            count: number;
        };
    };
};

type searchProps = {
    searchTerm: string,
    keywords: string[]
    artists: string[]
}

export function Inspiration() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [inspirationData, setInspirationData] = useState<InspirationData[]>([])
    const [test, setTest] = useState<number>(0)

    const [keywordCheckState, setKeywordCheckState] = useState<CheckboxState>({});
    const [artistCheckState, setArtistCheckState] = useState<CheckboxState>({});
    // const [categoriesCheckState, setCategoryCheckState] = useState<boolean[]>([]);

    const [openAdvSetting, setOpenAdvSetting] = useState(true)
    const initialUpdateRef = useRef(true); // Use useRef for flag
    const lastUpdateRef = useRef<searchProps>(); // Use useRef for flag

    //Update Search
    useEffect(() => {
        const updateInspriationData = async () => {
            const data = await fetchInspirationData('VFX', searchTerm, selectedKeywords, selectedArtists)
            setInspirationData(data)
            console.log('data :>> ', data);

            if (initialUpdateRef.current) {
                initialUpdateRef.current = false;
                setArtistCheckState(prevState => {
                    let newState = {} as CheckboxState;  // Copy previous state
                    data.forEach(({ artist }) => {
                        const { name, category } = artist
                        const checked = prevState[category]?.[name]?.checked || false;
                        const prevCount = newState[category]?.[name]?.count || 0;

                        newState[category] = {
                            ...(newState[category] || {}),
                            [name]: {
                                checked: checked,
                                count: prevCount + 1
                            }
                        };
                    });
                    return newState; // Return the new state
                })
            };

            setKeywordCheckState(prevState => {
                let newState = {...prevState} as CheckboxState; // Copy previous state
                // for (const category in newState) {
                //     for (const word in newState[category]) {
                //         newState[category][word].count = 0;
                //     }
                // }

                data.forEach(({ keywords }) => {
                    keywords.forEach(({ word, category }) => {
                        const checked = prevState[category]?.[word]?.checked || false;
                        const prevCount = newState[category]?.[word]?.count || 0;

                        newState[category] = {
                            ...(newState[category] || {}),
                            [word]: {
                                checked: checked,
                                count: prevCount + 1
                            }
                        };
                    });
                });
                return newState; // Return the new state
            });
        }

        const selectedKeywords = getSelectedCheckbox(keywordCheckState)
        const selectedArtists = getSelectedCheckbox(artistCheckState)

        // Only update if search props changed, to prevernt infinite loop
        const currentSearchProps = { searchTerm, keywords: selectedKeywords, artists: selectedArtists }
        if (!lastUpdateRef.current || !isEqual(lastUpdateRef.current, currentSearchProps)) {
            console.log('querying')
            lastUpdateRef.current = currentSearchProps;
            updateInspriationData()
        }

    }, [searchTerm, keywordCheckState, artistCheckState]);

    return (
        <>
            {/* <button className='btn' onClick={handleTest}>abc</button> */}
            <div className=''>
                <div className='flex gap-5'>

                    {/* <Sidebar all_categories={allCategories} path='./' /> */}
                    <div className='mt-4 container mx-auto'>
                        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                        <button className='btn btn-outline' onClick={() => setOpenAdvSetting(!openAdvSetting)}>open advance search</button>

                        {openAdvSetting &&
                            <div className='flex flex-col gap-2'>
                                <AllArtistsCheckBoxes artistCheckState={artistCheckState} setArtistCheckState={setArtistCheckState} />
                                <AllKeywordsCheckBoxes keywordCheckState={keywordCheckState} setKeywordCheckState={setKeywordCheckState} />
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

const getSelectedCheckbox = (keywordCheckState: CheckboxState) => {
    // Loop through to filter checked
    return Object.entries(keywordCheckState)
        .flatMap(([_, words]) =>
            Object.entries(words)
                .filter(([_, { checked }]) => checked)
                .map(([word]) => word)
        );
};

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


// function useInitialFetch():
//     [
//         boolean[][], React.Dispatch<React.SetStateAction<boolean[][]>>,
//         boolean[], React.Dispatch<React.SetStateAction<boolean[]>>,
//         boolean[], React.Dispatch<React.SetStateAction<boolean[]>>,
//         KeywordData[][], React.Dispatch<React.SetStateAction<KeywordData[][]>>,
//         CategoryData[], React.Dispatch<React.SetStateAction<CategoryData[]>>,
//         ArtistData[], React.Dispatch<React.SetStateAction<ArtistData[]>>,
//     ] {
//     const [keywordCheckState, setKeywordCheckState] = useState<boolean[][]>([[]]);
//     const [artistCheckState, setArtistCheckState] = useState<boolean[]>([]);
//     const [categoriesCheckState, setCategoryCheckState] = useState<boolean[]>([]);

//     const [allKeywords, setAllKeywords] = useState<KeywordData[][]>([[]]);
//     const [allCategories, setAllCategories] = useState<CategoryData[]>([]);
//     const [allArtists, setAllArtists] = useState<ArtistData[]>([]);


//     useEffect(() => {
//         const fetchData = async () => {
//             const [artistData, [categoryData, keywordsData]] = await Promise.all([
//                 fetchArtistData(),
//                 fetchCategoryData()
//             ]);

//             // Add the current word count
//             setAllArtists(artistData.map(name => ({ name, count: 0 })))
//             setAllCategories(categoryData)
//             setAllKeywords(keywordsData.map(row => row.map(word => ({ word, count: 0 }))))

//             // Set checkboxes
//             setArtistCheckState(new Array(artistData.length).fill(false))
//             setCategoryCheckState(new Array(categoryData.length).fill(false))

//             //Create an empty 2d array (no keywords are currently checked)
//             const two_d_array = new Array(categoryData.length).fill([]).map((_, i) => new Array(categoryData[i].keywords.length).fill(false))
//             setKeywordCheckState(two_d_array)

//         }
//         fetchData();

//     }, []);

//     return [
//         keywordCheckState, setKeywordCheckState,
//         artistCheckState, setArtistCheckState,
//         categoriesCheckState, setCategoryCheckState,
//         allKeywords, setAllKeywords,
//         allCategories, setAllCategories,
//         allArtists, setAllArtists
//     ]
// }


// ToDO: optimise tweet/ youtube call
//  - by caching?

import React, { useState, useEffect, useMemo, useRef } from 'react'
// import { TwitterTimelineEmbed, TwitterVideoEmbed } from 'react-twitter-embed';
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import { IoMdAdd, IoMdCloseCircle, IoMdSearch } from 'react-icons/io';
import { searchInspirationQuery, getAllKeywordData, getAllCategoryData, getAllArtistData } from '../FetchData/getdata';
import { client } from '../client';
import { InspirationCategory } from './Inspirations_category';
import MasonryLayout from '../Components/MasonryLayout';
import CheckBox from '../Components/Checkbox';
import { InspirationData, CategoryData } from '../TypeScript/InspirationData';
import Sidebar from '../Components/Sidebar';
import Search from '../Components/Search';


interface AllArtistsCheckBoxesProps {
    artists: string[],
    artistCheckState: boolean[],
    setArtistCheckState: React.Dispatch<React.SetStateAction<boolean[]>>
}

function AllArtistsCheckBoxes({ artists, artistCheckState, setArtistCheckState }: AllArtistsCheckBoxesProps): JSX.Element {

    const handleArtistCheckbox = ((index: number): void => {
        //Maybe I want to select a range of all_artists later, currently the query only checks for AND
        const updatedArtistCheckState = artistCheckState.map((check, i) =>
            i === index ? !check : check
        );
        setArtistCheckState(updatedArtistCheckState);
    })


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
    all_categories: CategoryData[],
    keywordCheckState: boolean[][],
    categoriesCheckState: boolean[],
    
    setKeywordCheckState: React.Dispatch<React.SetStateAction<boolean[][]>>
    setCategoryCheckState: React.Dispatch<React.SetStateAction<boolean[]>>
    
}

function AllKeywordsCheckBoxes({ all_categories, keywordCheckState, categoriesCheckState, setKeywordCheckState, setCategoryCheckState }: AllKeywordsCheckBoxesProps) {

    const handleCategoryCheckbox = ((index: number): void => {
        const updatedCategoriesCheckState = categoriesCheckState.map((check, i) =>
            i === index ? !check : check
        );
        const isChecked = updatedCategoriesCheckState[index]
        setCategoryCheckState(updatedCategoriesCheckState)

        //Checks/ unchecks all related keywords
        const updatedKeywordCheckState = keywordCheckState.map((row, i) => {
            if (!(i === index)) return row

            return row.map((_) => isChecked)
        });
        setKeywordCheckState(updatedKeywordCheckState);

    })

    const handleKeywordCheckbox = ((i: number, j: number): void => {
        const updatedKeywordCheckState = keywordCheckState.map((row, current_i) => {
            if (!(current_i === i)) return row
            return row.map((cell, current_j) => (j === current_j ? !cell : cell))
        });

        setKeywordCheckState(updatedKeywordCheckState);
    })
    return (
        <div className='grid grid-cols-3 justify-start gap-4 outline p-2 '>
            {(
                all_categories.map(({ word, keywords }: CategoryData, i: number) => {
                    return (
                        <>
                            <div>
                                <h3 className=' font-bold'>{word}</h3>
                                <CheckBox value={word} onChange={() => handleCategoryCheckbox(i)} check={categoriesCheckState[i]} />
                                <hr className=' bg-black' />
                                <div className='grid grid-cols-2 gap-4 shadow-md p-4 '>
                                    {keywords.map((keyword, j) => {
                                        return <CheckBox value={keyword} onChange={() => handleKeywordCheckbox(i, j)} check={keywordCheckState[i][j]} />
                                    })}
                                </div>
                            </div>
                        </>
                    )
                }))}
        </div>

    )
}

export function Inspiration() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [keys, setKeys] = useState<string[]>(['title'])
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
        console.log('querying')
        const selectedKeywords = all_keywords.flat().filter((_: any, i: number) => keywordCheckState.flat()[i])
        const selectedArtists = all_artists.filter((_: any, i: number) => artistCheckState[i])

        const query = searchInspirationQuery(searchTerm.toLowerCase(), keys, selectedKeywords, selectedArtists);

        console.log('query', query)
        client.fetch(query).then((data: InspirationData[]) => {
            setInspirationData(data)
        });
    }, [searchTerm, keys, keywordCheckState, artistCheckState]);


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

                        {/* <div className='flex gap-2 mb-2'>
                            <button className=' btn rounded-lg' onClick={() => handleAddClick('title')}> Title </button>
                            <button className=' btn rounded-lg' onClick={() => handleAddClick('artist')}> Artist </button>
                        </div> */}

                        <button className='btn btn-outline' onClick={() => setOpenAdvSetting(!openAdvSetting)}>open advance search</button>

                        {openAdvSetting &&
                            <div className='flex flex-col gap-2'>

                                <AllArtistsCheckBoxes artists={all_artists} artistCheckState={artistCheckState} setArtistCheckState={setArtistCheckState} />
                                <AllKeywordsCheckBoxes all_categories={all_categories} keywordCheckState={keywordCheckState} categoriesCheckState={categoriesCheckState}  setKeywordCheckState={setKeywordCheckState}  setCategoryCheckState={setCategoryCheckState} />

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
        boolean[], React.Dispatch<React.SetStateAction<boolean[]>>, string[][], CategoryData[], string[]
    ] {
    const [keywordCheckState, setKeywordCheckState] = useState<boolean[][]>([[]]);
    const [artistCheckState, setArtistCheckState] = useState<boolean[]>([]);
    const [categoriesCheckState, setCategoryCheckState] = useState<boolean[]>([]);

    let keywords = useRef<string[][]>([])
    let categories = useRef<CategoryData[]>([]);
    let artists = useRef<string[]>([])

    useEffect(() => {
        const artistQuery = getAllArtistData()
        client.fetch(artistQuery).then((artistData: string[]) => {
            artists.current = artistData
            setArtistCheckState(new Array(artistData.length).fill(false))
        });

        const categoryQuery = getAllCategoryData()
        client.fetch(categoryQuery).then((categoryData: CategoryData[]) => {
            categories.current = categoryData

            setCategoryCheckState(new Array(categoryData.length).fill(false))

            keywords.current = categoryData.map((row) => (row['keywords']))
            const two_d_array = new Array(categoryData.length).fill([]).map((row, i) => new Array(categoryData[i].keywords.length).fill(false))
            setKeywordCheckState(two_d_array)
        });

    }, []);

    return [keywordCheckState, setKeywordCheckState, artistCheckState, setArtistCheckState, categoriesCheckState, setCategoryCheckState, keywords.current, categories.current, artists.current]
}

function handleKeys(keys: string[], setKeys: React.Dispatch<React.SetStateAction<string[]>>) {

    const handleAddClick = ((newKey: string) => {
        if (!keys.includes(newKey)) {
            setKeys([...keys, newKey])
        }
    })

    const handleRemoveClick = ((newKey: string) => {
        setKeys(keys.filter((key) => {
            return !(key === newKey)
        }))
    })

    return [handleAddClick, handleRemoveClick]
}

function handleCheckboxes(
    keywordCheckState: boolean[][],
    setKeywordCheckState: React.Dispatch<React.SetStateAction<boolean[][]>>,
    categoriesCheckState: boolean[],
    setCategoryCheckState: React.Dispatch<React.SetStateAction<boolean[]>>,
    artistCheckState: boolean[],
    setArtistCheckState: React.Dispatch<React.SetStateAction<boolean[]>>
): [(index: number) => void, (i: number, j: number) => void, (index: number) => void] {

    const handleCategoryCheckbox = ((index: number): void => {
        const updatedCategoriesCheckState = categoriesCheckState.map((check, i) =>
            i === index ? !check : check
        );
        const isChecked = updatedCategoriesCheckState[index]
        setCategoryCheckState(updatedCategoriesCheckState)

        //Checks/ unchecks all related keywords
        const updatedKeywordCheckState = keywordCheckState.map((row, i) => {
            if (!(i === index)) return row

            return row.map((_) => isChecked)
        });
        setKeywordCheckState(updatedKeywordCheckState);

    })

    const handleKeywordCheckbox = ((i: number, j: number): void => {
        const updatedKeywordCheckState = keywordCheckState.map((row, current_i) => {
            if (!(current_i === i)) return row
            return row.map((cell, current_j) => (j === current_j ? !cell : cell))
        });

        setKeywordCheckState(updatedKeywordCheckState);
    })

    const handleArtistCheckbox = ((index: number): void => {
        //Maybe I want to select a range of all_artists later, currently the query only checks for AND
        const updatedArtistCheckState = artistCheckState.map((check, i) =>
            i === index ? !check : check
        );
        setArtistCheckState(updatedArtistCheckState);
    })

    return [handleCategoryCheckbox, handleKeywordCheckbox, handleArtistCheckbox]

}


// function flattenArray(array, value) {

//     const flatten_array = array.map((row, i) => {
//         // row[value].map((cell, j) => {
//         //     console.log(cell)
//         //     return cell
//         // })
//         return row[value]
//     })

//     return flatten_array.flat()
// }
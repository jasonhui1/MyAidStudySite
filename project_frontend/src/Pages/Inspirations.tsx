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
import { AdvancedSearch } from '../Components/AdvanceSearch';


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

    const initialUpdateRef = useRef(true); // Use useRef for flag
    const lastUpdateRef = useRef<searchProps>(); // Use useRef for flag

    //Update Search
    useEffect(() => {
        const updateInspriationData = async () => {
            const data = await fetchInspirationData(searchTerm, selectedKeywords, selectedArtists)
            setInspirationData(data)

            if (initialUpdateRef.current) {
                initialUpdateRef.current = false;
                setArtistCheckState(prevState => updateArtistCheckState(prevState, data));
            }

            setKeywordCheckState(prevState => updateKeywordCheckState(prevState, data));
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
        <div className=''>
            <div className='flex gap-5'>

                {/* <Sidebar all_categories={allCategories} path='./' /> */}
                <div className='mt-4 container mx-auto'>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <AdvancedSearch>
                        <AllKeywordsCheckBoxes keywordCheckState={keywordCheckState} setKeywordCheckState={setKeywordCheckState} />
                        <AllArtistsCheckBoxes artistCheckState={artistCheckState} setArtistCheckState={setArtistCheckState} />
                    </AdvancedSearch>

                    {true &&
                        <MasonryLayout data={inspirationData} />
                    }

                </div>

            </div>
        </div>
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

const updateArtistCheckState = (prevState: CheckboxState, data: InspirationData[]) => {
    let newState = {} as CheckboxState;
    data.forEach(({ artist }) => {
        const { name, category } = artist;
        const checked = prevState[category]?.[name]?.checked || false;
        const prevCount = newState[category]?.[name]?.count || 0;

        newState[category] = {
            ...(newState[category] || {}),
            [name]: {
                checked,
                count: prevCount + 1,
            },
        };
    });
    return newState;
};

const updateKeywordCheckState = (prevState: CheckboxState, data: InspirationData[]) => {
    let newState = { ...prevState } as CheckboxState;
    for (const category in newState) {
        for (const word in newState[category]) {
            newState[category][word].count = 0;
        }
    }

    data.forEach(({ keywords }) => {
        keywords.forEach(({ word, category }) => {
            const checked = prevState[category]?.[word]?.checked || false;
            const prevCount = newState[category]?.[word]?.count || 0;

            newState[category] = {
                ...(newState[category] || {}),
                [word]: {
                    checked,
                    count: prevCount + 1,
                },
            };
        });
    });
    return newState;
};
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
import { InspirationData, CategoryData, KeywordData, ArtistData } from '../Types/InspirationData';
import Sidebar from '../Components/Sidebar';
import Search from '../Components/Search';
import AllKeywordsCheckBoxes from '../Components/Inspiration/AllKeywordsCheckBoxes';
import AllArtistsCheckBoxes from '../Components/Inspiration/AllArtistsCheckBoxes';
import { fetchArtistData, fetchCategoryData, fetchInspirationData } from '../FetchData/api';
import { isEqual } from 'lodash'; // Import the isEqual function from lodash library
import { AdvancedSearch } from '../Components/AdvanceSearch';
import { useFetchInspirationData } from '../Hooks/UseFetchInspirationData';
import { getSelectedItems, updateCheckboxState } from '../Utils/checkboxUtils';


export type CheckboxState = {
    [category: string]: {
        [word: string]: {
            checked: boolean;
            count: number;
        };
    };
};


export function Inspiration() {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [keywordCheckState, setKeywordCheckState] = useState<CheckboxState>({});
    const [artistCheckState, setArtistCheckState] = useState<CheckboxState>({});

    const selectedKeywords = useMemo(() => getSelectedItems(keywordCheckState), [keywordCheckState]);
    const selectedArtists = useMemo(() => getSelectedItems(artistCheckState), [artistCheckState]);

    const { inspirationData, isLoading, error } = useFetchInspirationData({
        searchTerm,
        keywords: selectedKeywords,
        artists: selectedArtists,
    });

    const initialUpdateRef = useRef(true); // Use useRef for flag

    //Update checkboxes values
    useEffect(() => {
        if (initialUpdateRef.current && inspirationData.length > 0) {
            initialUpdateRef.current = false;
            setArtistCheckState((prevState) => updateCheckboxState(prevState, inspirationData, 'artist'));
        }

        setKeywordCheckState((prevState) => updateCheckboxState(prevState, inspirationData, 'keyword'));
    }, [inspirationData]);

    return (
        <div className=''>
            <div className='flex gap-5'>

                {/* <Sidebar all_categories={allCategories} path='./' /> */}
                <div className='mt-4 container mx-auto'>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <AdvancedSearch>
                        <AllArtistsCheckBoxes artistCheckState={artistCheckState} setArtistCheckState={setArtistCheckState} />
                        <AllKeywordsCheckBoxes keywordCheckState={keywordCheckState} setKeywordCheckState={setKeywordCheckState} />
                    </AdvancedSearch>

                    {true &&
                        <MasonryLayout data={inspirationData} />
                    }

                </div>

            </div>
        </div>
    )
}


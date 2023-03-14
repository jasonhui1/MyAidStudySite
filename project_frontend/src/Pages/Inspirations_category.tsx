// ToDO: optimise tweet/ youtube call
//  - by caching?

import React, { useState, useEffect, useMemo, useRef } from 'react'
// import { TwitterTimelineEmbed, TwitterVideoEmbed } from 'react-twitter-embed';
import Masonry from 'react-masonry-css';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import TwitterVideoEmbed from '../Components/TwitterVideoEmbed';
import { inspiration_data } from '../Data/inspiration_data';
import { IoMdAdd, IoMdCloseCircle, IoMdSearch } from 'react-icons/io';
import { searchQueryThroughCategory, searchInspirationQuery, getKeywordData, getCategoryData, getArtistData } from '../FetchData/getdata';
import { client } from '../client';

const breakpointColumnsObj = {
    default: 3,
    3000: 3,
    2200: 3,
    1500: 2,
    800: 1,
};

interface EmbedUrl {
    src: string;
}

function YoutubeEmbed({ src }: EmbedUrl): JSX.Element {
    return (
        <iframe
            className='w-full aspect-video'
            src={src}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen>
        </iframe>
    )
}


interface EmbedProp {
    _id: string;
    title: string;
    artist: string;
    keywords: Array<{
        word: string
    }>
    embedURL: string
}

// const MemoizedMyEmbed = React.memo(MyEmbed);
function MyEmbed({ _id, title = '', artist, keywords, embedURL }: EmbedProp): JSX.Element {

    let embedBlock;
    //Turn {id, name} to only name
    let keywordList = keywords.map(keyword => keyword.word);

    if (embedURL.includes('twitter')) {
        const postId = embedURL.split('/').pop()
        if (postId !== undefined) {
            embedBlock = <TwitterVideoEmbed key={postId} id={postId} className='w-full mx-auto' />
        }

    } else if (embedURL.includes('youtube')) {
        const postId = embedURL.split('?v=').pop()?.split('&')[0]
        if (postId !== undefined) {
            const URL = 'https://www.youtube.com/embed/' + postId
            embedBlock = <YoutubeEmbed key={postId} src={URL} />
        }
    }

    return (
        <>
            <div className='flex flex-col  card justify-center items-center rounded-lg outline shadow-lg gap-3 mb-4 p-4'>
                <h1>{title}</h1>
                <h4 className=''>Keywords:
                    <span className='font-bold'>{keywordList.join(', ')}

                    </span>
                </h4>
                {embedBlock}
            </div>
        </>
    )
}

interface CheckBoxProp {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    check: boolean;

}

function CheckBox({ value, onChange, check = false }: CheckBoxProp): JSX.Element {

    return (
        <div>
            <label>
                <input type="checkbox" name='keyword' value={value} onChange={onChange} checked={check} /> {value}
            </label>
        </div>
    )
}


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

    const [inspirationData, keywordCheckState, artistCheckState, setInspirationData, setKeywordCheckState, setArtistCheckState, all_keywords, all_artists] = useInitialFetch(category)
    const [handleKeywordCheckbox, handleArtistCheckbox] = handleCheckboxesSetup(keywordCheckState, setKeywordCheckState, artistCheckState, setArtistCheckState)

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
                    <div className=' container mx-auto'>
                        <h1 className='text-center capitalize'>{category}</h1>

                        <div className='flex flex-col gap-2'>

                            <AllArtistsCheckBoxes artists={all_artists} artistCheckState={artistCheckState} handleArtistCheckbox={handleArtistCheckbox} />
                            <AllKeywordsCheckBoxes keywords={all_keywords} keywordCheckState={keywordCheckState} handleKeywordCheckbox={handleKeywordCheckbox} />

                        </div>

                        {true &&
                            <Masonry className="p-4 flex animate-slide-fwd gap-4" breakpointCols={breakpointColumnsObj}>
                                {inspirationData.map((data) => {
                                    return <MyEmbed key={data._id} {...data} />
                                })}

                            </Masonry>}

                    </div>
                </>
            }
        </>
    )
}
export interface InspirationData {
    _id: string,
    title: string;
    artist: string;
    keywords: Array<{
        word: string
    }>
    embedURL: string
}

interface QueryData {
    inspirations: InspirationData[],
    all_keywords: string[]
}

function useInitialFetch(category: string | undefined): [
    InspirationData[],
    boolean[],
    boolean[],
    React.Dispatch<React.SetStateAction<InspirationData[]>>,
    React.Dispatch<React.SetStateAction<boolean[]>>,
    React.Dispatch<React.SetStateAction<boolean[]>>,
    string[],
    string[],
] {

    const [inspirationData, setInspirationData] = useState<InspirationData[]>([])
    const [keywordCheckState, setKeywordCheckState] = useState<boolean[]>([]);
    const [artistCheckState, setArtistCheckState] = useState<boolean[]>([]);

    let keywords = useRef<string[]>([])
    let artists = useRef<string[]>([])
    let ids = useRef<string[]>([])

    useEffect(() => {
        if (category !== undefined) {
            const query = searchQueryThroughCategory(category)
            client.fetch(query).then(({ inspirations, all_keywords }: QueryData) => {
                setInspirationData(inspirations)
                keywords.current = all_keywords
                setKeywordCheckState(new Array(all_keywords.length).fill(false))
            });
        } else {
            console.log('category not found')
        }

        const artistQuery = getArtistData()
        client.fetch(artistQuery).then((artistData: string[]) => {
            artists.current = artistData
            setArtistCheckState(new Array(artistData.length).fill(false))
        });
    }, []);

    return [inspirationData, keywordCheckState, artistCheckState, setInspirationData, setKeywordCheckState, setArtistCheckState, keywords.current, artists.current]
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



// ToDO: optimise tweet/ youtube call
//  - by caching?

import React, { useState, useEffect, useMemo, useRef } from 'react'
// import { TwitterTimelineEmbed, TwitterVideoEmbed } from 'react-twitter-embed';
import Masonry from 'react-masonry-css';
import TwitterVideoEmbed from '../Components/TwitterVideoEmbed';
import { inspiration_data } from '../Data/inspiration_data';
import { IoMdAdd, IoMdCloseCircle, IoMdSearch } from 'react-icons/io';
import { searchInspirationQuery, getKeywordData, getCategoryData, getArtistData } from '../FetchData/getdata';
import { client } from '../client';

const breakpointColumnsObj = {
    default: 3,
    3000: 3,
    2200: 3,
    1500: 2,
    800: 1,
};

function YoutubeEmbed({ src }) {
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

function Card({ className, children }) {
    const additionalClassName = (className !== undefined ? className : '')
    const DivClassName = 'flex flex-col  card justify-center items-center rounded-lg outline shadow-lg gap-3 mb-4 p-4' + ' ' + additionalClassName

    return (
        <div className={DivClassName}>
            {children}
        </div>
    )
}

// const MemoizedMyEmbed = React.memo(MyEmbed);
function MyEmbed({ _id, title = '', artist, keywords, embedURL }) {

    let embedBlock;
    //Turn {id, name} to only name
    let keywordList = keywords.map(keyword => keyword.word);

    if (embedURL.includes('twitter')) {
        const postId = embedURL.split('/').pop()
        embedBlock = <TwitterVideoEmbed key={postId} id={postId} className='w-full mx-auto' />

    } else if (embedURL.includes('youtube')) {
        const postId = embedURL.split('?v=').pop().split('&')[0]
        const URL = 'https://www.youtube.com/embed/' + postId
        embedBlock = <YoutubeEmbed key={postId} src={URL} />
    }

    return (
        <>
            <Card className=''>
                <h1>{title}</h1>
                <h4 className=''>Keywords:
                    <span className='font-bold'>{keywordList.join(', ')}

                    </span>
                </h4>
                {embedBlock}
            </Card>
        </>
    )
}

function CheckBox({ value, onChange }) {
    return (
        <div>
            <label>
                <input type="checkbox" name='keyword' value={value} onChange={onChange} /> {value}
            </label>
        </div>
    )
}

function Radio({ value, onChange }) {
    return (
        <label>
            <input type="radio" name="artist_name" value={value} onChange={onChange} /> {value}
        </label>
    )
}

export function Inspiration() {
    const [searchTerm, setSearchTerm] = useState('');
    const [keys, setKeys] = useState(['title'])
    const [receive_data, setReceive_data] = useState([])
    const [test, setTest] = useState(0)

    const [selectedKeywords, setSelectedKeywords, selectedArtists, setSelectedArtists, categories, artists] = useInitialFetch()
    // Get inspiration data


    useEffect(() => {
        const query = searchInspirationQuery(searchTerm.toLowerCase(), keys, selectedKeywords, selectedArtists);
        console.log('querying')
        console.log('query', query)
        // console.log('selectedArtists', selectedArtists)
        // console.log('selectedKeywords', selectedKeywords)
        client.fetch(query).then((data) => {
            setReceive_data(data)
        });
    }, [searchTerm, keys, selectedKeywords, selectedArtists]);


    const handleAddClick = ((newKey) => {
        if (!keys.includes(newKey)) {
            setKeys([...keys, newKey])
        }
    })

    const handleRemoveClick = ((newKey) => {
        setKeys(keys.filter((key) => {
            return !(key === newKey)
        }))
    })

    const handleKeywordCheckbox = ((word) => {
        if (selectedKeywords.includes(word)){
            setSelectedKeywords(selectedKeywords.filter((keyword)=>keyword===word))
        } else {
            setSelectedKeywords([...selectedKeywords, word])
        }
    })

    const handleArtistCheckbox = ((name) => {
        setSelectedArtists([name])
        // if (selectedArtists.includes(name)){
        //     setSelectedArtists(selectedArtists.filter((artist_name)=>artist_name===name))
        // } else {
        //     setSelectedArtists([...selectedArtists, name])
        // }
    })

    // const handleTest = (() => {
    //     console.log('test', test)
    //     setTest(test => test + 1);
    // })

    // console.log('rending')

    return (
        <>
            {/* <button onClick={handleTest}>abc</button> */}
            <div className=' container mx-auto'>
                <div className="mt-4 mb-2 flex gap-2 items-center w-full px-2 rounded-md bg-white border-none outline focus-within:shadow-sm">
                    <IoMdSearch fontSize={21} className="ml-1" />

                    {/* Searching keys buttons */}
                    {/* TODO use icon x */}
                    {keys.map((key,) =>
                        (<button className=' btn rounded-lg btn-outline my-2 ' onClick={() => handleRemoveClick(key)}> X {key}</button>)
                    )}

                    {/* Search bar */}
                    <input
                        type="text"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Simulation"
                        value={searchTerm}
                        className="p-2 w-full bg-white outline-none"
                    />
                </div>

                <div className='flex gap-2 mb-2'>
                    {/* Handle add button */}
                    {/* TODO: - use a loop */}
                    <button className=' btn rounded-lg' onClick={() => handleAddClick('title')}> Title </button>
                    {/* <button className=' btn rounded-lg' onClick={() => handleAddClick('all_categories')}> Categories </button> */}
                    <button className=' btn rounded-lg' onClick={() => handleAddClick('artist')}> Artist </button>
                    {/* <button className=' btn rounded-lg'> Keywords </button> */}

                </div>

                Advance Setting
                <div className='grid grid-cols-3 lg:grid-cols-6 gap-4 outline p-4 '>
                    {artists.map((name, i) => {
                        return (
                            <Radio value={name} onChange={() => handleArtistCheckbox(name)}></Radio>
                        )
                    })}
                </div>

                <div className='grid grid-cols-3 justify-start gap-4 outline p-2 '>
                    {(
                        categories.map(({ word, keywords }, i) => {
                            return (
                                <>
                                    <div>
                                        <h3 className=' font-bold'>{word}</h3>
                                        <hr className=' bg-black' />
                                        <div className='grid grid-cols-2 gap-4 shadow-md p-4 '>
                                            {keywords.map((keyword, j) => {
                                                return <CheckBox value={keyword} onChange={() => handleKeywordCheckbox(keyword)} />
                                            })}
                                        </div>
                                    </div>
                                </>
                            )
                        }))}
                </div>

                {true &&
                    <Masonry className="p-4 flex animate-slide-fwd gap-4" breakpointCols={breakpointColumnsObj}>
                        {receive_data.map((data) => {
                            return <MyEmbed key={data._id} {...data} />
                        })}

                    </Masonry>}

                {/* <TwitterTimelineEmbed
                sourceType="url"
                url="https://twitter.com/cmzw_"
                tweetLimit="3"
                options={{ height: 800, width: 600 }}
            /> */}
            </div>
        </>
    )
}

function useInitialFetch() {

    const [selectedKeywords, setSelectedKeywords] = useState([])
    const [selectedArtists, setSelectedArtists] = useState([])

    let categories = useRef([]);
    let artists = useRef([])

    useEffect(() => {

        const artistQuery = getArtistData()
        client.fetch(artistQuery).then((artistData) => {
            artists.current = artistData
        });

        const categoryQuery = getCategoryData()
        client.fetch(categoryQuery).then((categoryData) => {
            categories.current = categoryData

        });

    }, []);

    return [selectedKeywords, setSelectedKeywords, selectedArtists, setSelectedArtists, categories.current, artists.current]
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
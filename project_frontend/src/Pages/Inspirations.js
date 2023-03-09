import React, { useState, useEffect, useMemo } from 'react'
// import { TwitterTimelineEmbed, TwitterVideoEmbed } from 'react-twitter-embed';
import Masonry from 'react-masonry-css';
import TwitterVideoEmbed from '../Components/TwitterVideoEmbed';
import { inspiration_data } from '../Data/inspiration_data';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { searchQuery } from '../CMS/getdata';
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

function CardTitle({ className, title }) {
    const additionalClassName = (className !== undefined ? className : '')
    const ClassName = ' font-bold text-4xl card' + ' ' + additionalClassName

    return (
        <h1 className={ClassName}> {title} </h1>
    )
}


// const MemoizedMyEmbed = React.memo(MyEmbed);

function MyEmbed({ _id, title = '', artist, keywords, embedURL}) {

    let embedBlock;
    //Turn {id, name} to only name
    let keywordList = keywords.map(keyword => keyword.word);

    if (embedURL.includes('twitter')) {
        const postId = embedURL.split('/').pop()
        embedBlock = <TwitterVideoEmbed key={postId} id={postId} className='w-full mx-auto' />
        
    } else if (embedURL.includes('youtube')) {
        const postId = embedURL.split('?v=').pop().split('&')[0]
        const URL = 'https://www.youtube.com/embed/' + postId
        embedBlock = <YoutubeEmbed src={URL} />
    }

    return (
        <>
            <Card className=''>
                <CardTitle title={title} />
                <h3 className=''>Keywords:
                    <span className='font-bold'>{keywordList.join(', ')}

                    </span>
                </h3>
                {embedBlock}
            </Card>
        </>
    )
}



export function Inspiration() {
    const [searchTerm, setSearchTerm] = useState('');
    const [keys, setKeys] = useState(['title'])
    const [receive_data, setReceive_data] = useState([])

    useEffect(() => {
        const query = searchQuery(searchTerm.toLowerCase(), keys);
        client.fetch(query).then((data) => {
            setReceive_data(data)
        });
        console.log('querying')
    }, [searchTerm, keys] );


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

    return (
        <>
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
                    <button className=' btn rounded-lg' onClick={() => handleAddClick('categories')}> Categories </button>
                    <button className=' btn rounded-lg' onClick={() => handleAddClick('artist')}> Artist </button>
                    {/* <button className=' btn rounded-lg'> Keywords </button> */}

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

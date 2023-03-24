import React from 'react'
import TwitterVideoEmbed from '../Components/TwitterVideoEmbed';

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

type media = 'Youtube' | 'Twitter'

export default function InspirationEmbed({ _id, title = '', artist, keywords, embedURL }: EmbedProp): JSX.Element {

    let embedBlock;
    //Turn {id, name} to only name
    let keywordList = keywords.map(keyword => keyword.word);


    let embed: media;
    let postId: string | undefined;


    if (embedURL.includes('twitter')) {
        embed = 'Twitter'
        postId = embedURL.split('/').pop()

    } else {
        embed = 'Youtube'
        postId = embedURL.split('?v=').pop()?.split('&')[0]
    }

    return (
        <>
            <div className='flex flex-col card justify-center items-center outline outline-1 outline-orange-300 bg-orange-50 shadow-lg gap-3 mb-4 p-4'>
                <h2>{title}</h2>
                <h4 className=''>Keywords:
                    <span className='font-bold'>{keywordList.join(', ')}

                    </span>
                </h4>
                {postId !== undefined && ((embed === 'Youtube') ? (
                    <YoutubeEmbed key={postId} src={'https://www.youtube.com/embed/' + postId} />
                ) : (
                    <TwitterVideoEmbed key={postId} id={postId} className='w-full mx-auto' />
                ))}

            </div>
        </>
    )
}

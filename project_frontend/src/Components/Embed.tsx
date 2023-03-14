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

export default  function InspirationEmbed({ _id, title = '', artist, keywords, embedURL }: EmbedProp): JSX.Element {

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

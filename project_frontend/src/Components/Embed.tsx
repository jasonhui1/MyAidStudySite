import React, { Suspense, lazy } from 'react'
import TwitterVideoEmbed from './TwitterVideoEmbed';
import YoutubeEmbed from './YoutubeEmbed';

type media = 'Youtube' | 'Twitter'


interface EmbedProp {
    _id: string;
    title: string;
    artist: string;
    keywords: Array<{
        word: string
    }>
    embedURL: string
}
export default function InspirationEmbed({ _id, title = '', artist, keywords, embedURL }: EmbedProp): JSX.Element {

    let keywordList = keywords.map(keyword => keyword.word);

    let embed: media;
    let postId: string | null;

    if (embedURL.includes('twitter')) {
        embed = 'Twitter'
        postId = getTweetIdFromUrl(embedURL)

    } else {
        embed = 'Youtube'
        postId = getYoutubeIdFromUrl(embedURL)
    }

    return (
        <>
            <div className='flex flex-col card justify-center items-center outline outline-1 outline-orange-300 bg-orange-50 shadow-lg gap-3 mb-4 p-4'>
                <h2>{title}</h2>
                <h4 className=''>Keywords:
                    <span className='font-bold'>{keywordList.join(', ')}

                    </span>
                </h4>
                {postId && ((embed === 'Youtube') ? (
                        <YoutubeEmbed key={postId} src={'https://www.youtube.com/embed/' + postId} />
                ) : (
                    <Suspense fallback={<div>Loading YouTube video...</div>}>
                        <TwitterVideoEmbed key={postId} id={postId} className='w-full mx-auto' />
                    </Suspense>
                ))}

            </div>
        </>
    )
}

function getTweetIdFromUrl(url: string) {
    const regex = /\/status\/(\d+)/;
    const match = url.match(regex);
    if (match && match.length > 1) {
        return match[1];
    }
    return null;
}

function getYoutubeIdFromUrl(url: string) {
    return url.split('?v=').pop()?.split('&')[0] || null;
}



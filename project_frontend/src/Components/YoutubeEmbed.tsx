import React from 'react'

interface EmbedUrl {
    src: string;
}

export default function YoutubeEmbed({ src }: EmbedUrl) {
    return (
        <iframe
            className='w-full aspect-video'
            src={src}
            title="YouTube video player"
            // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen>
        </iframe>
    )
}

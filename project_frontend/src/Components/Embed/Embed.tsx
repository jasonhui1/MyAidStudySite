import React from 'react'
import EmbedRenderer from './EmbedRenderer';


interface InspirationEmbedProps {
    _id: string;
    title: string;
    keywords: Array<{
        word: string
    }>
    embedURL: string
}
export default function InspirationEmbed({ _id, title = '', keywords, embedURL }: InspirationEmbedProps): JSX.Element {

    let keywordList = keywords.map(keyword => keyword.word);
    return (
        <>
            <div className='flex flex-col card justify-center items-center outline outline-1 outline-orange-300 bg-orange-50 shadow-lg gap-3 mb-4 p-4'>
                <h2>{title}</h2>
                <h4 className=''>Keywords:
                    <span className='font-bold'>{keywordList.join(', ')}

                    </span>
                </h4>
                <EmbedRenderer embedURL={embedURL} />

            </div>
        </>
    )
}

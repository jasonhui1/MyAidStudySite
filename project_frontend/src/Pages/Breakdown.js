import React, { useState, useEffect } from 'react'
import { client, urlFor } from '../client';
import { PortableText } from '@portabletext/react'
import { getBreakdownData } from '../FetchData/getdata';
// import {getImageDimensions} from '@sanity/asset-utils'

export default function Breakdown() {

    const [portableText, setPortableText] = useState()

    useEffect(() => {
        client.fetch(getBreakdownData())
            .then(article => {
                setPortableText(
                    <PortableText value={article.content} components={components} />,
                )
            })

    }, [])

    return (
        <>
            <div>Breakdown</div>
            <div className='portableText'>{portableText}</div>

        </>
    )
}

const SampleVideoComponent = ({ value}) => {
    const [_file, id, extension] = value.asset._ref.split('-');
    const PROJECT_ID= client.config().projectId
    const DATASET = client.config().dataset

    const url = `https://cdn.sanity.io/files/${PROJECT_ID}/${DATASET}/${id}.${extension}`

    return (
        <video controls>
            <source src={url} type="video/mp4"/>
        </video>
    )

}


const SampleImageComponent = ({ value, isInline }) => {
    // console.log('value', value)
    return (
        <img
            src={urlFor(value)
                .width(isInline ? 100 : 800)
                .fit('max')
                .auto('format')
                .url()}
            alt={value.alt || ' '}
            loading="lazy"
        />
    )
}

const components = {
    list: {
        // Ex. 1: customizing common list types
        bullet: ({children}) => <ul className="mt-xl">{children}</ul>,
        number: ({children}) => <ol className="mt-lg">{children}</ol>,
    
        // Ex. 2: rendering custom lists
        checkmarks: ({children}) => <ol className="m-auto text-lg">{children}</ol>,
      },
    listItem: {
        bullet: ({ children }) => <li>{children}</li>,
        number: ({ children }) => <li>{children}</li>,
        checkmarks: ({ children }) => <li>✅ {children}</li>,

    },
    types: {
        image: SampleImageComponent,
        file: SampleVideoComponent,
        code: props => (
            <pre data-language={props.node.language}>
                <code>{props.node.code}</code>
            </pre>
        )
    },

}

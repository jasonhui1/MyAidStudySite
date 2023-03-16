import React, { useState, useEffect } from 'react'
import { client, urlFor } from '../client';
import { PortableText, PortableTextReactComponents } from '@portabletext/react'
import { getBreakdownData, getBreakdownDataFromID } from '../FetchData/getdata';
import { useParams, Link } from 'react-router-dom'
// import {getImageDimensions} from '@sanity/asset-utils'

interface Article {
    /**
     * content of the block.
     */
    title: string,
    content: any;
}



export default function Breakdown() {

    const [portableText, setPortableText] = useState<JSX.Element>()
    const { page } = useParams<string>();

    useEffect(() => {
        if (page !== undefined) {
            client.fetch(getBreakdownData(page))
                .then((article: Article) => {
                    setPortableText(
                        <PortableText value={article.content} components={components} />,
                    )
                })
        }

    }, [])

    return (
        <>
            <div className=' flex flex-col justify-center items-center'>

                <h1>Breakdown</h1>
                <div className='portableText'>{portableText}</div>
            </div>

        </>
    )
}

interface FileTypesComponent {
    value: {
        asset: {
            _ref: string;
        };
        alt: string;
    };
    isInline: boolean
}

const SampleVideoComponent = ({ value }: FileTypesComponent): JSX.Element => {
    const [_file, id, extension] = value.asset._ref.split('-');
    const PROJECT_ID = client.config().projectId
    const DATASET = client.config().dataset

    const url = `https://cdn.sanity.io/files/${PROJECT_ID}/${DATASET}/${id}.${extension}`

    return (
        <video controls>
            <source src={url} type="video/mp4" />
        </video>
    )

}


const SampleImageComponent = ({ value, isInline }: FileTypesComponent): JSX.Element => {
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

// interface Text {
//     text: string
// }


// interface TextComponent {
//     value?: {
//         children: Text[]
//     };
// }

const Convert_text = ({ value }: any): JSX.Element => {
    let tag = 'p'
    let content: string | null = ''

    if (value !== undefined) {
        const line = value.children[0].text
        content = line

        if (line.startsWith('#')) {
            const level = line.indexOf(' '); // Get the level of the heading
            tag = 'h' + level; // Create the heading tag
            content = line.slice(level + 1); // Get the text of the heading
        }

        if (line === '---') {
            tag = 'hr'
            content = null
        }
    }

    return (
        React.createElement(tag, null, content)
        // {html}
    )
}


interface InternalLinkComponent {

    // {_key: '6940a20b3fd2', _type: 'internalLink', reference: {…}}
    // markKey"6940a20b3fd2"
    // markType"internalLink"

    value?: {
        reference: {
            _ref: string;
        };
    };
    children: React.ReactNode,
}

// const SampleInternalLinkComponent = ({value}: InternalLinkComponent) => {
const SampleInternalLinkComponent = ({ value, children }: InternalLinkComponent): JSX.Element => {
    const refId = value?.reference._ref
    const [title, setTitle] = useState('second')
    if (refId !== undefined) {
        const query = getBreakdownDataFromID(refId)
        client.fetch(query)
            .then((article: Article) => {
                setTitle(article.title)
            })
    }

    console.log('title', title)

    return (
        React.createElement(Link, { to: `/breakdown/${title}` }, children)
    )
}

const components: Partial<PortableTextReactComponents> = {
    marks: {
        // Ex. 1: custom renderer for the em / italics decorator
        em: ({ children }) => <em className="text-gray-600 font-semibold">{children}</em>,
        internalLink: SampleInternalLinkComponent,
    },
    list: {
        // Ex. 1: customizing common list types
        bullet: ({ children }) => <ul className="mt-xl">{children}</ul>,
        number: ({ children }) => <ol className="mt-lg">{children}</ol>,

        // Ex. 2: rendering custom lists
        checkmarks: ({ children }) => <ol className="m-auto text-lg">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }) => <li>{children}</li>,
        number: ({ children }) => <li>{children}</li>,
        checkmarks: ({ children }) => <li>✅ {children}</li>,

    },
    types: {
        image: SampleImageComponent,
        file: SampleVideoComponent,
        // code: props => (
        //     <pre data-language={props.node.language}>
        //         <code>{props.node.code}</code>
        //     </pre>
        // )
    },
    block: {
        normal: Convert_text,

    }


}


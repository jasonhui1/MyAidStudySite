import React, { useState, useEffect } from 'react'
import { client, urlFor } from '../client';
import { PortableText } from '@portabletext/react'
import { getBreakdownData } from '../CMS/getdata';
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
            {portableText}

        </>
    )
}


const SampleImageComponent = ({value, isInline}) => {
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
    listItem: {
        // Ex. 1: customizing common list types
        bullet: ({ children }) => <li style={{ listStyleType: 'disclosure-closed' }}>{children}</li>,
        number: ({ children }) => <ol className="mt-lg">{children}</ol>,
        checkmarks: ({ children }) => <li>✅ {children}</li>,

    },
    types: {
        image: SampleImageComponent,
        code: props => (
            <pre data-language={props.node.language}>
                <code>{props.node.code}</code>
            </pre>
            )
      },

}

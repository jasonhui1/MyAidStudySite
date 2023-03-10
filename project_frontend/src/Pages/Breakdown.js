import React, { useState, useEffect } from 'react'
import { client } from '../client';
import { PortableText } from '@portabletext/react'
import { getBreakdownData } from '../CMS/getdata';


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

// const components = {
//     types: {
//       code: props => (
//         <pre data-language={props.node.language}>
//           <code>{props.node.code}</code>
//         </pre>
//       )
//     }
//   }


const components = {
    listItem: {
        // Ex. 1: customizing common list types
        bullet: ({ children }) => <li style={{ listStyleType: 'disclosure-closed' }}>{children}</li>,

        // Ex. 2: rendering custom list items
        checkmarks: ({ children }) => <li>✅ {children}</li>,
    },
}




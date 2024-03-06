import React from 'react'
import Masonry from 'react-masonry-css';

import InspirationEmbed from './Embed/Embed';
import { InspirationData } from '../Types/InspirationData';

const breakpointColumnsObj = {
    default: 3,
    3000: 3,
    2200: 3,
    1500: 2,
    800: 1,
};

interface InspirationDataArray {
    data: InspirationData[]
}


export default function MasonryLayout({data} :InspirationDataArray) {

    return (
        <Masonry className="p-4 flex animate-slide-fwd gap-4" breakpointCols={breakpointColumnsObj}>
            {data.map((item) => {
                return <InspirationEmbed key={item._id} {...item} />
            })}

        </Masonry>

  )
}

// import React from 'react'
// import Masonry from 'react-masonry-css';

// import InspirationEmbed from './Embed/Embed';
// import { InspirationData } from '../Types/InspirationData';

// const breakpointColumnsObj = {
//     default: 3,
//     3000: 3,
//     2200: 3,
//     1500: 2,
//     800: 1,
// };

// interface InspirationDataArray {
//     data: InspirationData[]
// }


// export default function MasonryLayout({data} :InspirationDataArray) {

//     return (
//         <Masonry className="p-4 flex animate-slide-fwd gap-4" breakpointCols={breakpointColumnsObj}>
//             {data.map((item) => {
//                 return <InspirationEmbed key={item._id} {...item} />

//             })}

//         </Masonry>

//   )
// }
import React from 'react';
import { AutoSizer, Grid } from 'react-virtualized';
import InspirationEmbed from './Embed/Embed';
import { InspirationData } from '../Types/InspirationData';

interface InspirationDataArray {
  data: InspirationData[];
}

const cellRenderer = ({ columnIndex, key, rowIndex, style }: any, data: InspirationData[]) => {
  const item = data[rowIndex * 3 + columnIndex];
  if(!item ) return
  return item ? <div key={key} style={style}><InspirationEmbed {...item} /></div> : null;
};

export default function MasonryLayout({ data }: InspirationDataArray) {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <Grid
          cellRenderer={(props) => cellRenderer(props, data)}
          columnCount={3}
          columnWidth={width / 3 }
          height={500}
          rowCount={Math.ceil(data.length / 3)}
          rowHeight={750}
          width={width}
          overscanRowCount={3}
          useDynamicRowHeight={true}
          overscanIndicesGetter={overscanIndicesGetter}
        />
      )}
    </AutoSizer>
  );
}

function overscanIndicesGetter({
  direction, // One of "horizontal" or "vertical"
  cellCount, // Number of rows or columns in the current axis
  scrollDirection, // 1 (forwards) or -1 (backwards)
  overscanCellsCount, // Maximum number of cells to over-render in either direction
  startIndex, // Begin of range of visible cells
  stopIndex, // End of range of visible cells
}:any) {
  return {
    overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
    overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount),
  };
}
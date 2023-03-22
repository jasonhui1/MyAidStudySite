import { InspirationData } from './InspirationData';
import { SanityFileTypes } from './SanityFileTypes';


export interface BreakdownData {
    _id?: string,
    description?: string,
    image?: SanityFileTypes,
    keywords?: string[],
    inspiration_data?: InspirationData[]
    title?: string,

    /**
     * content of the block.
     */
    content?: any;
}


export interface AllBreakdownDataFromCategory {
    breakdown: BreakdownData[],
}

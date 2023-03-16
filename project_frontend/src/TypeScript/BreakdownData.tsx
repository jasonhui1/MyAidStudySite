import { inspiration_data } from '../Data/inspiration_data';
import { InspirationData, KeywordData } from './InspirationData';
import { SanityFileTypes } from './SanityFileTypes';


export interface BreakdownData {
    _id: string,
    description: string,
    image?: SanityFileTypes,
    keywords: string[],
    inspiration_data?: InspirationData[]
    title: string,

    /**
     * content of the block.
     */
    content: any;
}

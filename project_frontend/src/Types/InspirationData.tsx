export interface InspirationData {
    _id: string,
    title: string;
    artist: {
        name:string
        category:string
    }
    keywords: {
        word: string
        category:string
    }[]
    embedURL: string
}


export interface CategoryData {
    word: string
    keywords: Array<string>
}

export interface ArtistData{
    name: string,
    count: number,
}

export interface KeywordData{
    word: string,
    count: number,
}
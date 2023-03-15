export interface InspirationData {
    _id: string,
    title: string;
    artist: string;
    keywords: Array<{
        word: string
    }>
    embedURL: string
}


export interface CategoryData {
    word: string
    keywords: Array<string>
}
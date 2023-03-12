export function getBreakdownData() {
    const query = `*[_type == "breakdown" && title match 'shield'][0]`
    return query
} 

export function getKeywordData() {
    const query = `*[_type == "keyword"] {word}`
    return query
} 

export const searchInspirationQuery = (searchTerm, keys, keywords=[]) => {

    if (keys.length === 0) {
        keys = ['title']
    }

    // Search through all words with space between them
    const searchArray = searchTerm.split(' ').filter(i => i)

    let filter = []
    filter.push(`_type=='inspiration'`)

    if (keywords.length > 0){
        const filterKeyword = keywords.map(keyword => `keywords[]->word match '${keyword}'`).join('&&')
        filter.push(filterKeyword)
    }
    
    if (searchArray.length > 0) {
        const filterRestOfKeys = searchArray?.map(item => `([${keys}] match '*${item}*' || keywords[]->word match '*${item}*')`).join('&&')
        filter.push(filterRestOfKeys)
    }

    const combinedFilters = filter.join('&&')
    
    const query= `*[${combinedFilters}] { 
        _id,
        title,
        artist,
        category,
        embedURL,
        keywords[]->{_id, word}
        
    }`
    return query

    //Score system, not the best because sanity cant calculate score when matching with array(keywords)
    // *[_type=='inspiration'] | score(artist match "*late*" || title match '*volume*')    {
    //     keywords[]->{word},
    //        'keywordMatch': keywords[]->word match '*VFX*',
    //         title,
    //         artist,
    //         _score,
    //   } | order(keywordMatch desc) | order(_score desc) 
    //   [ (_score > 0 || keywordMatch)]
};

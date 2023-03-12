export function getBreakdownData() {
    const query = `*[_type == "breakdown" && title match 'shield'][0]`
    return query
}

export function getKeywordData() {
    const query = `*[_type == "keyword"] {word}`
    return query
}



//keys = [title, artist...] related to the post
//keywords = keywords of the post

export const searchInspirationQuery = (searchTerm, keys, keywords = []) => {

    // Search through all words with space between them
    const searchArray = searchTerm.split(' ').filter(i => i)

    let filter = []
    //initial
    filter.push(`_type=='inspiration'`)

    //Match checked keywords
    if (keywords.length > 0) {
        filter.push(`references(^._id)`)

        const filterKeyword = keywords.map(keyword => `keywords[]->word match '${keyword}'`).join('&&')
        filter.push(filterKeyword)
    }

    //Match search words
    if (searchArray.length > 0) {
        const filterRestOfKeys = searchArray?.map(item => `([${keys}] match '*${item}*' || keywords[]->word match '*${item}*')`).join('&&')
        filter.push(filterRestOfKeys)
    }

    const combinedFilters = filter.join('&&')

    const inspirationQuery = `*[${combinedFilters}] { 
        _id,
        title,
        artist,
        embedURL,
        keywords[]->{_id, word}
        
    }`;

    if (keywords.length === 0) {
        return inspirationQuery 

    } else {
        //only check first keyword to avoid returning the same post
        const query = `*[_type=="keyword" && lower(word) == lower('${keywords[0]}')] {
            'inspiration': ${inspirationQuery}
        }[0]['inspiration']`
        return query
    }

    //Score system, not the best because sanity cant calculate score when matching with array(keywords)
    // *[_type=='inspiration'] | score(artist match "*late*" || title match '*volume*')    {
    //     keywords[]->{word},
    //        'keywordMatch': keywords[]->word match '*VFX*',
    //         title,
    //         artist,
    //         _score,
    //   } | order(keywordMatch desc) | order(_score desc) 
    //   [ (_score > 0 || keywordMatch)]
}

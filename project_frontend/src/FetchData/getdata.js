export function getBreakdownData() {
    const query = `*[_type == "breakdown" && title match 'shield'][0]`
    return query
}

export function getKeywordData() {
    const query = `*[_type == "keyword"] {word}['word']`
    return query
}

export function getCategoryData() {
    const query = `*[_type == "category"] {word}['word']`
    return query
}

export function getArtistData() {
    const query = `*[_type == "artist"] {name} ['name']`
    return query
}


function arrayMapping(original_array, mapping){
    return original_array.map((item) =>{
        if (mapping[item]) return mapping[item]
        return item
    })
}

//normalkeys = [title, artist...] related to the post
//keywords = keywords of the post

export const searchInspirationQuery = (searchTerm, normalkeys, keywords = [], artists=[]) => {

    const mapping = {
        'artist': 'artist->name'
    }

    normalkeys = arrayMapping(normalkeys, mapping)

    // Search through all words with space between them
    const searchArray = searchTerm.split(' ').filter(i => i)

    let filter = []
    //initial
    filter.push(`_type=='inspiration'`)

    //Match checked keywords, check for exact '_', instead of '*_*'
    if (keywords.length > 0) {
        filter.push(`references(^._id)`)

        const filterKeyword = keywords.map(keyword => `keywords[]->word match '${keyword}'`).join('&&')
        filter.push(filterKeyword)
    }

    //Match search words, keywords[]->word is in a different space because its an array (thats how GROQ works, deal with it)
    if (searchArray.length > 0) {
        const filterRestOfKeys = searchArray?.map(item => `([${normalkeys}] match '*${item}*' || keywords[]->word match '*${item}*')`).join('&&')
        filter.push(filterRestOfKeys)
    }

    if (artists.length > 0) {
        const filterArtist = artists.map(name => `artist->name match '${name}'`).join('&&')
        filter.push(filterArtist)
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

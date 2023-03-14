export function getBreakdownData(): string {
    const query = `*[_type == "breakdown" && title match 'shield'][0]`
    return query
}

export function getKeywordData(): string {
    const query = `*[_type == "keyword"] {word}['word']`
    return query
}

export function getCategoryData(word: string = ''): string {

    let filter = [`_type == "category"`]
    if (word !== '') {
        filter.push(`word == '${word}'`)
    }
    const combinedFilter = filter.join('&&')

    const query = `*[${combinedFilter}]{
         word,
        'keywords': *[_type=='keyword' && references(^._id) ].word,
    }`
    return query
}

export function getArtistData(): string {
    const query = `*[_type == "artist"] {name} ['name']`
    return query
}


export function searchQueryThroughCategory(
    category: string,
    keywords: string[] = [],
    artists: string[] = []): string {

    let filter = []
    //initial
    filter.push(`_type=='inspiration'`)
    filter.push(`^.u_id match _id`)

    if (keywords.length > 0) {
        let filterKeyword = keywords.map(keyword => `keywords[]->word match '${keyword}'`).join('||')
        filterKeyword = `(${filterKeyword})`

        filter.push(filterKeyword)
    }

    if (artists.length > 0) {
        let filterArtist = artists.map(name => `artist->name match '${name}'`).join('||')
        filterArtist = `(${filterArtist})`
        filter.push(filterArtist)
    }

    const combinedFilters = filter.join('&&')

    const query = `*[_type=="category" && word match '${category}'] {
  
        'keywords': *[_type=='keyword' && references(^._id)]{
          'inspiration' : *[_type=='inspiration' && references(^._id)]{_id},
          'keyword': word
        },
        
      }[0] 
      {
        'u_id': array::unique(keywords[].inspiration[]._id),
        'all_keywords': keywords[].keyword
        
      }
      {
        'inspirations':*[${combinedFilters}] {
          _id,
          title, 
          'artist': artist->{name}.name,
          embedURL,
          keywords[]->{_id, word}
        } , 
        all_keywords
    }`
    return query
}

// export function searchQueryThroughIds(
//     ids: string[],
//     keywords: string[] = [],
//     artists: string[] = []): string {

//     let filter = []
//     //initial
//     filter.push(`_type=='inspiration'`)

//     if (ids.length > 0) {
//         const id_query = ids.map((id) => `'${id}'`).join(',')
//         filter.push(`[${id_query}] match _id`)
//     }

//     if (keywords.length > 0) {
//         let filterKeyword = keywords.map(keyword => `keywords[]->word match '${keyword}'`).join('||')
//         filterKeyword = `(${filterKeyword})`

//         filter.push(filterKeyword)
//     }

//     if (artists.length > 0) {
//         let filterArtist = artists.map(name => `artist->name match '${name}'`).join('||')
//         filterArtist = `(${filterArtist})`
//         filter.push(filterArtist)
//     }

//     const combinedFilters = filter.join('&&')

//     const query = `
//     *[${combinedFilters}] {
//           _id,
//           title, 
//           'artist': artist->{name}.name,
//           embedURL,
//           keywords[]->{_id, word}
//     }`
//     return query
// }

//normalkeys = [title, artist...] related to the post
//keywords = keywords of the post

export const searchInspirationQuery = (searchTerm: string, normalkeys: string[], keywords: string[] = [], artists: string[] = [], category: string = ''): string => {

    const mapping = {
        'artist': 'artist->name'
    }

    normalkeys = arrayMapping(normalkeys, mapping)

    // Search through all words with space between them
    let searchArray = searchTerm.split(' ').filter(i => i)

    let filter = []
    //initial
    filter.push(`_type=='inspiration'`)

    //Match checked keywords, check for exact '_', instead of '*_*'
    if (keywords.length > 0) {
        let filterKeyword = keywords.map(keyword => `keywords[]->word match '${keyword}'`).join('||')
        filterKeyword = `(${filterKeyword})`

        filter.push(filterKeyword)
    }

    //Match search words, keywords[]->word is in a different space because its an array (thats how GROQ works, deal with it)
    if (searchArray.length > 0) {
        let filterRestOfKeys = searchArray?.map(item => `([${normalkeys}] match '*${item}*' || keywords[]->word match '*${item}*')`).join('&&')
        filterRestOfKeys = `(${filterRestOfKeys})`
        filter.push(filterRestOfKeys)
    }

    if (artists.length > 0) {
        let filterArtist = artists.map(name => `artist->name match '${name}'`).join('||')
        filterArtist = `(${filterArtist})`
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

    // if (keywords.length === 0) {
    return inspirationQuery

    // } else {
    //     //only check first keyword to avoid returning the same post
    //     const query = `*[_type=="keyword" && lower(word) == lower('${keywords[0]}')] {
    //         'inspiration': ${inspirationQuery}
    //     }[0]['inspiration']`
    //     return query
    // }

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


interface Mapping {
    [key: string]: string
}

function arrayMapping(original_array: string[], mapping: Mapping): string[] {
    return original_array.map((item: string) => {
        if (mapping[item]) return mapping[item]
        return item
    })
}
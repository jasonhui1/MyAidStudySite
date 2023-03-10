export const searchQuery = (searchTerm, keys) => {

    if (keys.length === 0) {
        keys = ['title']
    }

    // Search through all words with space between them
    const searchArray = searchTerm.split(' ').filter(i => i)
    let allmap = searchArray?.map(searchArray => `([${keys}] match '*${searchArray}*' || keywords[]->word match '*${searchArray}*')`).join('&&')

    let query;

    if (searchArray.length === 0){
        query = `*[_type=='inspiration']`
    } else {
        query = `*[_type=='inspiration' && ${allmap}]`
    }

    query += `{ 
        _id,
          title,
          artist,
          category,
          embedURL,
          keywords[]->{_id, word}
          
      }`

      console.log('query', query)
    return query

    //Score system, not the best because sanity cant calculate score when matching with array
    // *[_type=='inspiration'] | score(artist match "*late*" || title match '*volume*')    {
    //     keywords[]->{word},
    //        'keywordMatch': keywords[]->word match '*VFX*',
    //         title,
    //         artist,
    //         _score,
    //   } | order(keywordMatch desc) | order(_score desc) 
    //   [ (_score > 0 || keywordMatch)]
};
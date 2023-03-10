export const searchQuery = (searchTerm, keys) => {

    if (keys.length===0){
        keys=['title']
    }    

    // Search through all words with space between them
    const searchArray = searchTerm.split(' ')
    // const keywordmap = searchArray.map(searchArray => `'${searchArray}' in keywords[]->word`).join('||')
    // const keymap = searchArray.map(searchArray => ` ${searchKeyWord}`).join('&&')
    // const allmap = searchArray.map(searchArray => `[${keys}] match '*${searchArray}*' || ${keywordmap}`).join('&&')
    const allmap = searchArray.map(searchArray => `[${keys}] match '*${searchArray}*' || keywords[]->word match '*${searchArray}*'`).join('&&')

    const query = `*[_type=='inspiration' && (${allmap} )]{
        _id,
          title,
          artist,
          category,
          embedURL,
          keywords[]->{_id, word}
          
      }`
    return query
};
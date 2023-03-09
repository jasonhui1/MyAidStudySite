export const searchQuery = (searchTerm, keys) => {

    if (keys.length===0){
        keys=['title']
    }    
    const query = `*[_type=='inspiration' && [${keys}] match '*${searchTerm}*']{
        _id,
          title,
          artist,
          category,
          embed,
          keywords[]->{_id, word}
          
      }`
    return query
};
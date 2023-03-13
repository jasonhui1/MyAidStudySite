export default {
    name: 'inspiration',
    title: 'Inspiration',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string'
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 200, // will be ignored if slugify is set
                slugify: (input:any) => input
                                     .toLowerCase()
                                     .replace(/\s+/g, '-')
                                     .slice(0, 200)
              }
        },
        // {
        //     name: 'artist',
        //     title: 'Artist ',
        //     type: 'string'
        // },
        {
            name: 'artist',
            title: 'Artist ',
            type: 'reference',
            to: [{type:'artist'}]
        },

        // {
        //     name: 'category',
        //     title: 'Category ',
        //     type: 'string'
        // },
        {
            name: 'keywords',
            title: 'Keywords',
            type: 'array',
            of: [{
                type: 'useKeyword'
            }],
        },
        {
            name: 'embedURL',
            title: 'EmbedURL',
            type: 'url',
        },
    ]
}

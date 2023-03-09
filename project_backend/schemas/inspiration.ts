export default {
    name: 'inspriation',
    title: 'Inspriation',
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
        {
            name: 'artist',
            title: 'Artist ',
            type: 'string'
        },
        {
            name: 'category',
            title: 'Category ',
            type: 'string'
        },
        {
            name: 'keywords',
            title: 'Keywords',
            type: 'array',
            of: [{
                type: 'string'
            }],
        },
        {
            name: 'embed',
            title: 'Embed',
            type: 'object',
            fields: [
                {
                    name: 'type', title: 'Type', type: 'string', initialValue: 'twitter',options: {
                        list: [
                            { title: 'Twitter', value: 'twitter' },
                            { title: 'Youtube', value: 'youtube' }
                        ], // <-- predefined values},
                    }
                },
                { name: 'postId', title: 'Post_Id', type: 'string' },
                { name: 'youtubeSrc', title: 'Youtube_src', type: 'url' }
            ],
        },
    ]
}

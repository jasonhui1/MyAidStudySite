export default{
    name:'artist',
    title: 'Artist',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'name',
            type: 'string'
        },
        { 
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{type:'artist_category'}]
        }
    ]
}
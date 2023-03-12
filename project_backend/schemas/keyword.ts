export default{
    name:'keyword',
    title: 'Keyword',
    type: 'document',
    fields: [
        {
            name: 'word',
            title: 'Word',
            type: 'string'
        },
        { 
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{type:'category'}]
        }
    ]
}
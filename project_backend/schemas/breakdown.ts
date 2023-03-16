export default {
    name: 'breakdown',
    title: 'Breakdown',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string'
        },
        {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [
                {
                    type: 'block',
                    marks: {
                        annotations: [
                          {
                            name: 'internalLink',
                            title: 'Internal link',
                            type: 'object',
                            fields: [
                              {
                                name: 'reference',
                                type: 'reference',
                                title: 'Reference',
                                to: [
                                  { type: 'breakdown' },
                                  // other types you may want to link to
                                ]
                              }
                            ]
                          }
                        ]
                    }
                    
                },
                {
                    type: 'image'
                },
                {
                    type: 'file',
                    storeOriginalFilename: true
                }
            ],
 
        },

            
    ]
}

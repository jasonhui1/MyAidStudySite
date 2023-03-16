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
      name: 'description',
      title: 'Description',
      type: 'string'
    },
    {
      name: 'image',
      title: 'Image ',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'keyword' }]
      }],
    },
    {
      name: 'inspirations',
      title: 'Inspirations',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'inspiration' }]
      }],
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

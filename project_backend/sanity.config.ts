import {defineConfig, isDev} from 'sanity'
import {visionTool} from '@sanity/vision'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'
import {getStartedPlugin} from './plugins/sanity-plugin-tutorial'
import { contentGraphView } from "sanity-plugin-graph-view";

const devOnlyPlugins = [getStartedPlugin()]

export default defineConfig({
  name: 'default',
  title: 'AidStudySite',

  projectId: 'ay3qrpou',
  dataset: 'production',

  plugins: [contentGraphView({}), deskTool(), visionTool(), ...(isDev ? devOnlyPlugins : [])],
  schema: {
    types: schemaTypes,
  },
})


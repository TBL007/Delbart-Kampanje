import { type SchemaTypeDefinition } from 'sanity'
import Innlegg from './Innlegg'
import Quiz from './Quiz'
import undersøkelse from './undersøkelse'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [Innlegg, Quiz, undersøkelse],
}

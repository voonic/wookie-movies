export default interface Movie {
  backdrop: string,
  cast: Array<string>,
  classification: string,
  director: string | Array<string>,
  genres: Array<string>,
  id: string,
  imdb_rating: number,
  imdb_rating_precision?: string,
  length: string,
  overview: string,
  poster: string,
  released_on: string,
  slug: string,
  title: string,
};

/**
 * This schema represents collection for the realm
 */
export const MovieSchema = {
  name: 'movies',
  properties: {
    id: 'string',
    backdrop: 'string',
    cast: 'string[]',
    classification: 'string',
    director: 'string[]',
    genres: 'string[]',
    imdb_rating: 'double',
    imdb_rating_precision: 'string',
    length: 'string',
    overview: 'string',
    poster: 'string',
    released_on: 'string',
    slug: 'string',
    title: 'string',
  },
  primaryKey: 'id',
};
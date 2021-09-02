import Movie from "../Movie";

export default interface Favorite {
  id: string,
  movie: Movie,
};

/**
 * This schema represents the collection in realm db for favorites
 */
export const FavoriteSchema = {
  name: 'favorites',
  properties: {
    id: 'string',
    movie: 'movies',
  },
  primaryKey: 'id',
} 
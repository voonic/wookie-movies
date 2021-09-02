import Realm, {Collection, CollectionChangeSet} from 'realm';
import Movie from "../../Models/Movie";
import DBProvider from '../../Utils/Databases/Provider';
import Favorite, {FavoriteSchema} from "../../Models/Favorite";

export default class FavoriteService {
  _changeCallBack: Function | undefined;
  _favorites: Realm.Results<Favorite>;

  constructor() {
    this._favorites = this.getRealm().objects<Favorite>(FavoriteSchema.name);
  }

  private getRealm = () => {
    return DBProvider.get();
  };

  /**
   * Fetches the list of movies that are users favorites.
   * @returns Array<Movie>
   */
  fetchFavorites = () : Array<Movie> => {
    try {
      let res = this._favorites;
      let movies: Array<Movie> = [];
      res.forEach((r) => {
        movies.push(r.movie);
      });
      return movies;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  /**
   * Sets the favorite in the DB, toggles when already favorite
   * @returns 
   */
  toggleFavorite = (movie: Movie, favorite: boolean) : void => {
    try {
      let realm = this.getRealm();
      realm.write(() => {
        if (favorite) {
          realm.create<Favorite>(FavoriteSchema.name, {id: movie.id, movie: movie}, Realm.UpdateMode.All);
        } else {
          let dbFavorite = realm.objectForPrimaryKey<Favorite>(FavoriteSchema.name, movie.id);
          if (dbFavorite) {
            realm.delete(dbFavorite);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Checks whether a movie is favorite or not
   * @param movieId String
   * @returns 
   */
  isFavorite = (movieId: string): boolean => {
    try {
      let realm = this.getRealm();
      const movie = realm.objectForPrimaryKey<Favorite>(FavoriteSchema.name, movieId);
      if (movie) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  private onChange = (favorites: Collection<Favorite>, changes: CollectionChangeSet) => {
    let movies: Array<Movie> = this.fetchFavorites();
    if (this._changeCallBack) {
      this._changeCallBack(movies);
    }
  };

  /**
   * Subscribe for the changes in the Favorites database
   */
  subscribe = (onChangeCallback: Function): void => {
    try {
      this._changeCallBack = onChangeCallback;
      this._favorites.addListener(this.onChange);
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  unsubscribe = (): void => {
    this._changeCallBack = undefined;
    this._favorites?.removeListener(this.onChange);
  };
}
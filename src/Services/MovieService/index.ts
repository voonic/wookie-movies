import Realm from 'realm';
import NetInfo from "@react-native-community/netinfo";
import Genre from "../../Models/Genre";
import Movie, {MovieSchema} from "../../Models/Movie";
import Request from "../../Utils/Request";
import DBProvider from '../../Utils/Databases/Provider';

const Movie_URLs = {
  list: 'https://wookie.codesubmit.io/movies',
  search: 'https://wookie.codesubmit.io/movies',
}

export default class MovieService {
  request: Request | undefined;

  constructor() {}

  private getRealm = () => {
    return DBProvider.get();
  };

  /**
   * Saves the downloaded movies into the realm database.
   * @param movies 
   */
  private saveDataToDB = async (movies: Array<Movie>): Promise<void> => {
    let realm = this.getRealm();
    try {
      realm.write(() => {
        movies.forEach((movie: Movie) => {
          // realm does not support multiple types like typescript
          // so convert it to array and save it
          if (typeof movie.director === 'string') {
            movie.director = [movie.director];
          }
          realm.create(MovieSchema.name, movie, Realm.UpdateMode.All);
        }); 
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * When device is online, it fetches from online else fetches from db.
   */
  private fetchMovies = async (URL: string): Promise<Array<Movie>> => {
    let netState = await NetInfo.fetch();
    if (netState.isConnected) {
      this.request = new Request({
        url: URL,
      });
      let res =  await this.request.fetchJson();
      let movies: Array<Movie> = res.movies;
      movies.forEach((movie: Movie) => {
        //convert rating on 5 scale
        movie.imdb_rating = (movie.imdb_rating / 2);
        movie.imdb_rating_precision = movie.imdb_rating.toFixed(1);
      });
      //Insert these movies to the local db as well
      this.saveDataToDB(movies);
      return movies;
    } else {
      //Fetch it from the local db
      let movies: Array<Movie> = this.getRealm().objects(MovieSchema.name).toJSON();
      return movies;
    }
  };

  /**
   * Fetches all the movies available, since we have less number of movies
   * pagination is not necessary. Formats the input and converts it into genre wise movies.
   */
  fetchAll = async () : Promise<Array<Genre>> => {
    let movies: Array<Movie> = await this.fetchMovies(Movie_URLs.list);
    let mapGenre = new Map<string, Genre>();
    movies.forEach((movie: Movie) => {
      let genreNames: Array<string> = movie.genres;
      genreNames.forEach((genreName: string) => {
        if (!mapGenre.get(genreName)) {
          mapGenre.set(genreName, {name: genreName, movies: new Array<Movie>()});
        }
        mapGenre.get(genreName)?.movies.push(movie);
      });
    });
    let formattedResult: Array<Genre> = [];
    mapGenre.forEach((value: Genre) => {
      formattedResult.push(value);
    });
    return formattedResult;
  };

  /**
   * Return the movie object by id
   * @param movieId String
   * @returns Movie
   */
  getMovieById = (movieId: string): Movie => {
    try {
      let realm = this.getRealm();
      const movie: Movie = realm.objectForPrimaryKey(MovieSchema.name, movieId)?.toJSON();
      return movie;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  /**
   * Searches the movie online and returns the list of movies found.
   * @param term string
   */
  search = async (term: string): Promise<Array<Movie>> => {
    let URL = `${Movie_URLs.search}?q=${term}`;
    let movies: Array<Movie> = await this.fetchMovies(URL);
    return movies;
  };

  /**
   * ABorts the movies fetch request
   */
  abort = () => {
    this.request?.cancel();
  };
}
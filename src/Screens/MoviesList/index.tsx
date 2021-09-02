/**
 * @author Saket Kumar
 * Movies List Screen, shows list of movies, organized by genre.
 */
import * as React from 'react';
import {View, FlatList} from 'native-base';
import Container from '../../Components/Container';
import MovieService from '../../Services/MovieService';
import Genre from '../../Models/Genre';
import GenreMoviesList from '../../Components/GenreMoviesList';

interface State {
  loading: boolean,
  error: boolean,
  movies: Array<Genre>;
}

export default class MoviesList extends React.Component<any, State> {
  movieService: MovieService = new MovieService();
  state: State = {
    loading: false,
    error: false,
    movies: [],
  };

  componentDidMount() {
    this.refreshList();
  }

  componentWillUnmount() {
    this.movieService.abort();
  }

  refreshList = () => {
    this.setState({loading: true});
    this.movieService.fetchAll().then((movies) => {
      this.setState({movies, loading: false, error: false});
    }).catch((error) => {
      if (!error.cancelled) {
        this.setState({error: true, loading: false});
      }
    });
  };

  renderItem = ({ item }: { item: Genre }) => {
    return <GenreMoviesList genre={item} />
  };

  itemSeparatorComponent = () => {
    return <View mb={3} />
  };

  render(){
    let {movies, loading} = this.state;
    return (
      <Container avoidScrollView={true}>
        <FlatList
          data={movies}
          px={5}
          renderItem={this.renderItem}
          keyExtractor={(item: Genre) => item.name}
          ItemSeparatorComponent={this.itemSeparatorComponent}
          refreshing={loading}
          onRefresh={this.refreshList}
        />
      </Container>
    );
  }
}

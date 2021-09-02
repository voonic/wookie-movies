/**
 * @author Saket Kumar
 * Search Screen, shows list of movies, organized by genre
 */
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {View, FlatList, Text, Input, Spinner} from 'native-base';
import LottieView from 'lottie-react-native';
import Container from '../../Components/Container';
import Movie from '../../Models/Movie';
import MovieTile from '../../Components/MovieTile';
import {t} from '../../Locales';
import {Colors} from '../../Assets/Colors';
import MovieService from '../../Services/MovieService';

interface State {
  loading: boolean,
  term: string | undefined,
  movies: Array<Movie>;
}

export default class MoviesSearch extends React.Component<any, State> {
  movieService: MovieService = new MovieService();
  dwellTimer: any;
  state: State = {
    loading: false,
    movies: [],
    term: undefined,
  };

  componentDidMount() {
    this.refreshList();
  }

  componentWillUnmount() {
    this.movieService.abort();
    this.clearDwellTimer();
  }

  refreshList = () => {
    this.clearDwellTimer();
    this.dwellTimer = setTimeout(() => {
      let {term} = this.state;
      if (term) {
        this.setState({loading: true});
        this.movieService.search(term).then((movies: Array<Movie>) => {
          this.setState({movies, loading: false});
        });
      }
    }, 300);
  };

  clearDwellTimer = () => {
    if (this.dwellTimer) {
      clearTimeout(this.dwellTimer);
    }
  }

  updateTerm = (term: string) => {
    this.setState({term});
    this.refreshList();
  };

  renderItem = ({ item }: { item: Movie }) => {
    return( 
      <View flex={0.48}>
        <MovieTile
          id={item.id}
          source={item.poster}
          name={item.title}
          rating={item.imdb_rating_precision}
          movie={item}
        />
      </View>
    );
  };

  renderEmpty = () => {
    let {loading} = this.state;
    if (!loading) {
      return (
        <View flexGrow={1} flex={1} justifyContent="center" alignItems="center">
          <LottieView
            source={require('../../Assets/Animations/emptybox.json')}
            style={styles.lottie}
            resizeMode="contain"
            autoPlay
            loop
          />
          <Text color={Colors.LIGHT} fontSize={18} fontWeight="bold">{t('no_movies_found')}</Text>
        </View>
      );
    } else {
      return (
        <View flexGrow={1} flex={1} justifyContent="center" alignItems="center">
          <Spinner color={Colors.WARNING} />
        </View>
      );
    }
  }

  itemSeparatorComponent = () => {
    return <View mb={2} />
  };

  render(){
    let {movies, loading, term} = this.state;
    return (
      <Container title={t('search')} avoidScrollView={true}>
        <View px={5} py={3}>
          <Input
            variant="rounded"
            placeholder={t('search')}
            value={term}
            autoCapitalize="none"
            onChangeText={this.updateTerm}
          />
        </View>
        <FlatList
          data={movies}
          px={5}
          numColumns={2}
          keyExtractor={(item: Movie) => item.id}
          renderItem={this.renderItem}
          ListEmptyComponent={this.renderEmpty}
          ItemSeparatorComponent={this.itemSeparatorComponent}
          contentContainerStyle={styles.flexGrow1}
          columnWrapperStyle={styles.js}
          refreshing={loading}
          onRefresh={this.refreshList}
        />
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 200,
  },
  flexGrow1: {
    flexGrow: 1,
  },
  js: {
    justifyContent: 'space-between',
  },
});

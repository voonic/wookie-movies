/**
 * @author Saket Kumar
 * Favorites Movies List Screen, shows list of movies loved by user.
 */
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {View, FlatList, Text} from 'native-base';
import LottieView from 'lottie-react-native';
import Container from '../../Components/Container';
import Movie from '../../Models/Movie';
import MovieTile from '../../Components/MovieTile';
import {t} from '../../Locales';
import {Colors} from '../../Assets/Colors';
import FavoriteService from '../../Services/FavoriteService';

interface State {
  loading: boolean,
  movies: Array<Movie>;
}

export default class Favorites extends React.Component<any, State> {
  favoriteService: FavoriteService = new FavoriteService();
  state: State = {
    loading: false,
    movies: [],
  };

  componentDidMount() {
    this.refreshList();
    this.favoriteService.subscribe((movies: Array<Movie>) => {
      this.setState({movies});
    });
  }

  componentWillUnmount() {
    this.favoriteService.unsubscribe();
  }

  refreshList = () => {
    this.setState({loading: true});
    let movies = this.favoriteService.fetchFavorites();
    this.setState({movies, loading: false});
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
          <Text color={Colors.LIGHT} fontSize={18} fontWeight="bold">{t('nothing_here')}</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  itemSeparatorComponent = () => {
    return <View mb={2} />
  };

  render(){
    let {movies, loading} = this.state;
    return (
      <Container title={t('favorites')} avoidScrollView={true}>
        <FlatList
          data={movies}
          px={5}
          numColumns={2}
          renderItem={this.renderItem}
          keyExtractor={(item: Movie) => item.id}
          ListEmptyComponent={this.renderEmpty}
          contentContainerStyle={styles.flexGrow1}
          columnWrapperStyle={styles.js}
          ItemSeparatorComponent={this.itemSeparatorComponent}
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
 
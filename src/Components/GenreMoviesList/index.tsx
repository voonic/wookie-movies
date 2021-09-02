import * as React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {View, Text} from 'native-base';
import Genre from '../../Models/Genre';
import Movie from '../../Models/Movie';
import MovieTile from '../MovieTile';

interface Props {
  genre: Genre,
}

class GenreMoviesList extends React.PureComponent<Props> {
  renderItem = ({ item }: { item: Movie }) => {
    return( 
      <View style={styles.tile}>
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

  itemSeparatorComponent = () => {
    return <View style={styles.me5} />
  };

  render() {
    let {genre} = this.props;
    return (
      <View>
        <Text style={styles.genreTitle}>{genre.name}</Text>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={genre.movies}
          renderItem={this.renderItem}
          keyExtractor={(item: Movie) => item.id}
          ItemSeparatorComponent={this.itemSeparatorComponent}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  genreTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  me5: {
    marginEnd: 5,
  },
  tile: {
    width: 120,
  },
});

export default GenreMoviesList;

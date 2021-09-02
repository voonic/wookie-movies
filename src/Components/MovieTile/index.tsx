import * as React from 'react';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import {navigationRef} from '../../Utils/RootNavigation';
import {Text, View} from 'native-base';
import {Colors} from '../../Assets/Colors';
import TintedImage from '../TintedImage';
import Movie from '../../Models/Movie';

interface Props {
  source: string,
  id: string,
  rating?: number | string,
  name?: string,
  movie?: Movie, //can be used to navigate with the movie object itself
  disabled?: boolean, //if you wanna to disable the navigation to movie details page,
  borderColor?: string,
  tintColor?: string,
}

class MovieTile extends React.PureComponent<Props> {

  onPress = () => {
    let {id, movie} = this.props;
    navigationRef.navigate('MovieDetails', {movie, id});
  };

  render() {
    let {source, rating, name, disabled, borderColor, tintColor} = this.props;
    let borderStyle: {
      [key: string]: any  
    } = {};
    if (borderColor) {
      borderStyle.borderColor = borderColor;
      borderStyle.borderWidth = 3;
    }
    return (
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={disabled ? 1 : 0.5}
        onPress={this.onPress}
      >
        <View style={{...styles.tile, ...borderStyle}}>
          <View style={styles.absolute}>
            <TintedImage source={source} tintColor={tintColor} />
          </View>
          <View style={styles.ratingcon}>
            {!!rating && (
              <View style={styles.ratingbox}>
                <Text style={styles.rating}>{rating}</Text>
                <Image source={require('../../Assets/Images/star.png')} style={styles.star} resizeMode="contain" />
              </View>
            )}
          </View>
        </View>
        {!!name && (
          <View style={styles.namebox}>
            <Text style={styles.name} noOfLines={2}>{name}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  tile: {
    display: 'flex',
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  namebox: { 
    marginVertical: 5,
  },
  name: { 
    fontSize: 14,
    color: Colors.SECODARY,
    marginEnd: 5,
  },
  ratingcon: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  ratingbox: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  star: {
    width: 16,
    height: 16,
  },
  rating: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Colors.WHITE,
    marginHorizontal: 5,
  },
  absolute: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default MovieTile;

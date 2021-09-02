/**
 * @author Saket Kumar
 * MovieDetails Screen, shows the individual movie details
 */
import * as React from 'react';
import {StyleSheet, Dimensions, TouchableOpacity, Animated} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Spinner, View, Flex, Text, Badge, Box, StatusBar, ScrollView} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';
import {t} from '../../Locales';
import Movie from '../../Models/Movie';
import TintedImage from '../../Components/TintedImage';
import {HomeStackParamList} from '../../Utils/RootNavigation';
import {Colors} from '../../Assets/Colors';
import MovieTile from '../../Components/MovieTile';
import MovieService from '../../Services/MovieService';
import FavoriteService from '../../Services/FavoriteService';

const HEIGHT_16_10 = Dimensions.get('window').width / (16/10);

type movieDetailsScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'MovieDetails'
>;
type movieDetailsScreenRouteProp = RouteProp<HomeStackParamList, 'MovieDetails'>;


interface Props {
  id: string,
  navigation: movieDetailsScreenNavigationProp,
  route: movieDetailsScreenRouteProp,
};

interface State {
  loading: boolean,
  id: string,
  movie?: Movie,
  favorite: boolean,
}

export default class MovieDetails extends React.Component<Props, State> {
  //Calculate backdrop height in 16:10 ratio but no more than 250 dp,
  extraHeightAddedByTile: number = 80;
  maxHeight: number = (HEIGHT_16_10 > 250 ? 250 : HEIGHT_16_10) + this.extraHeightAddedByTile;
  minHeight: number = 170 + this.extraHeightAddedByTile;
  scrollY = new Animated.Value(0);
  movieService: MovieService = new MovieService();
  favoriteService: FavoriteService = new FavoriteService();
  headerHeight = this.scrollY.interpolate(
    {
      inputRange: [0, (this.maxHeight - this.minHeight)],
      outputRange: [this.maxHeight, this.minHeight],
      extrapolate: 'clamp',
    });
  state = {
    loading: this.props.route.params.movie ? false : true,
    id: this.props.route.params.id,
    movie: this.props.route.params.movie,
    favorite: false,
  };


  async componentDidMount() {
    let {movie, id} = this.state;
    if (!movie) {
      //Fetch the individual movie object by id from the db and save it in the state;
      movie = this.movieService.getMovieById(id);
      this.setState({movie});
    }
    let favorite = this.favoriteService.isFavorite(id);
    this.setState({favorite});
  }

  goBack = () => {
    let {navigation} = this.props;
    navigation.goBack();
  };

  toggleFavorite = () => {
    let {favorite, movie} = this.state;
    favorite = !favorite;
    if (movie) {
      this.favoriteService.toggleFavorite(movie, favorite);
      this.setState({favorite});
    }
  };

  getYear = (date: string) : number => {
    return new Date(date).getFullYear();
  };

  renderDirector = (director: string | Array<string>): React.ReactNode => {
    if (typeof director === 'string') {
      return <Text>{director}</Text>;
    } else {
      return director.map((d, i) => <Text key={i}>{d}</Text>);
    }
  };

  renderCast = (cast: Array<string>): React.ReactNode => {
    return cast.map((c, i) => (
      <Badge mx={1} borderRadius={5} padding={1} colorScheme="dark" key={i}>
        {c}
      </Badge>
    ));
  };

  render(){
    let {loading, movie, favorite} = this.state;
    if (loading) {
      return (
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Spinner color={Colors.WARNING} />
        </Flex>
      );
    }
    let heartStyle = {color: Colors.LIGHT}
    if (favorite) {
      heartStyle = {color: Colors.DANGER}
    }
    if (movie) {
      return (
        <>
          <StatusBar
            backgroundColor="transparent"
            barStyle="light-content"
            translucent={true}
          />
          <ScrollView
            px={5}
            scrollEventThrottle={16}
            contentContainerStyle={{paddingTop: this.maxHeight}}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
              {useNativeDriver: false},
            )}  
          >
            <Flex direction="row" my="2" borderRadius={5} backgroundColor={Colors.WARNINGLIGHT}>
              <Flex px={2} py={2}>
                <Text fontWeight={700} pb={1}>{t('year')}</Text>
                <Text>{this.getYear(movie.released_on)}</Text>
              </Flex>
              <Flex px={2} py={2}>
                <Text fontWeight={700} pb={1}>{t('length')}</Text>
                <Text>{movie.length}</Text>
              </Flex>
              <Flex flex={1} px={2} py={2}>
                <Text fontWeight={700} pb={1}>{t('director')}</Text>
                <View>
                  {this.renderDirector(movie.director)}
                </View>
              </Flex>
            </Flex>
            <Flex mt="3">
              <Text fontWeight={700}>{t('cast')}</Text>
              <Flex mt={2} direction="row" wrap="wrap">
                {this.renderCast(movie.cast)}
              </Flex>
            </Flex>
            <Flex mt="4">
              <Text fontWeight={700}>{t('overview')}</Text>
              <Text mt={2}>
                {movie.overview}
              </Text>
            </Flex>
          </ScrollView>
          <Animated.View style={{...styles.backdropImage, height: this.headerHeight}}>
            <TintedImage source={movie.backdrop} />
            <Flex px={5} direction="row" style={{marginTop: -this.extraHeightAddedByTile}}>
              <Flex style={styles.tile}>
                <MovieTile
                  id={movie.id}
                  source={movie.poster}
                  borderColor={Colors.WHITE}
                  tintColor="transparent"
                  disabled={true}
                />
              </Flex>
              <Flex direction="column" flex={1}>
                <Flex px={5} flex={1} mb={2} justifyContent="flex-end">
                  <Text style={styles.title} noOfLines={2}>
                    {movie.title} ({movie.classification})
                  </Text>
                </Flex>
                <Flex pl={5} direction="row" flex={1} pt={2} backgroundColor="white">
                  <Flex flex={1}>
                    <Flex style={styles.starwidth}>
                      <StarRating
                        disabled={true}
                        emptyStar={require('../../Assets/Images/stargray.png')}
                        fullStar={require('../../Assets/Images/star.png')}
                        halfStar={require('../../Assets/Images/starhalf.png')}
                        iconSet={'Ionicons'}
                        rating={movie.imdb_rating}
                        maxStars={5}
                        starSize={20}
                      />
                    </Flex>
                    <Text style={styles.rating}>
                      {t('imdb_rating')}: {movie.imdb_rating_precision}
                    </Text>
                  </Flex>
                  <Flex>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={this.toggleFavorite}
                    >
                      <Icon name="heart" style={[styles.heart, heartStyle]} />
                    </TouchableOpacity>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Animated.View>
          <View px={5} style={styles.absolute}>
            <Box safeAreaTop />
            <TouchableOpacity activeOpacity={0.5} style={styles.iconCon} onPress={this.goBack}>
              <Icon name="arrow-left" style={styles.backIcon} />
            </TouchableOpacity>
          </View>
        </>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  backdropImage: {
    position: 'absolute',
    width: '100%',
  },
  title: {
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
    minHeight: 50,
  },
  starwidth: {
    width: 120,
  },
  tile: {
    width: 120,
  },
  rating: {
    marginTop: 5,
    fontSize: 16,
  },
  absolute: {
    position: 'absolute',
  },
  iconCon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WARNING,
  },
  backIcon: {
    fontSize: 18,
    color: Colors.BLACK,
  },
  heart: {
    fontSize: 30,
  },
});
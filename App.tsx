/**
 * @author Saket Kumar
 * Main app screen, responsible for app initialisation and navigation.
 */
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import RNBootSplash from "react-native-bootsplash";
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {setLocale, t} from './src/Locales';
import MoviesListScreen from './src/Screens/MoviesList';
import MoviesSearchScreen from './src/Screens/MoviesSearch';
import MovieDetailsScreen from './src/Screens/MovieDetails';
import Favorites from './src/Screens/Favorites';
import {HomeStackParamList, navigationRef} from './src/Utils/RootNavigation';
import {Colors} from './src/Assets/Colors';
import DBProvider from './src/Utils/Databases/Provider';

setLocale('en');
const Stack = createStackNavigator<HomeStackParamList>();
const Tab = createMaterialBottomTabNavigator();
const ScreenOptions = {
  gestureEnabled: false,
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

interface State {
  loading: boolean,
}

export default class App extends React.Component<any, State> {
  state = {
    loading: true,
  }
  componentDidMount() {
    DBProvider.init().then(() => {
      this.setState({loading: false});
    }).catch((error) => {
      console.error(error);
    });
  }

  componentWillUnmount() {
    DBProvider.close();
  }

  navReady = () => {
    RNBootSplash.hide({fade: true});
  };

  renderHomeTabs = () => {
    return (
      <Tab.Navigator
        initialRouteName="MoviesList"
        barStyle={styles.tabStyle}
        >
        <Tab.Screen
          name="MoviesList"
          options={{
            title: t('movies'),
            tabBarIcon: ({color}) => (
              <Icon name="home" color={color} size={18} />
            ),
          }}
          component={MoviesListScreen}
        />
        <Tab.Screen
          name="MoviesSearch"
          options={{
            title: t('search'),
            tabBarIcon: ({color}) => (
              <Icon name="search" color={color} size={18} />
            ),
          }}
          component={MoviesSearchScreen}
        />
        <Tab.Screen
          name="Favorites"
          options={{
            title: t("favorites"),
            tabBarIcon: ({color}) => (
              <Icon name="heart" color={color} size={18} />
            ),
          }}
          component={Favorites}
        />
      </Tab.Navigator>
    );
  };

  render() {
    let {loading} = this.state;
    if (loading) {
      return null;
    }
    return (
      <NativeBaseProvider>
        <NavigationContainer ref={navigationRef} theme={NavigationTheme} onReady={this.navReady}>
          <Stack.Navigator
            screenOptions={ScreenOptions}
            initialRouteName="Home">
            <Stack.Screen name="Home" component={this.renderHomeTabs} />
            <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    );
  }
}

const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: Colors.WARNING,
    overflow: 'hidden',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    shadowOpacity: 0,
    shadowRadius:0,
    elevation: 0,
    paddingVertical: 5,
  },
  flexFill: {
    flex: 1,
  },
  jcac: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
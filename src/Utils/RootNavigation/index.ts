/**
 * A root navigation component that can be used to navigate when
 * deep nesting of navigation object is not possible.
 */
import {createNavigationContainerRef } from '@react-navigation/native';
import Movie from '../../Models/Movie';

export type HomeStackParamList = {
  Home: undefined,
  MovieDetails: {movie?: Movie, id: string};
};

export const navigationRef = createNavigationContainerRef<HomeStackParamList>();
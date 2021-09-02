import * as React from 'react';
import {StyleSheet} from 'react-native';
import {View, ScrollView} from 'native-base';
import Header from '../Header';

interface Props {
  title?: string,
  avoidHeader?: boolean;
  statusBarTheme?: 'light-content' | 'dark-content';
  avoidScrollView?: boolean;
  contentContainerStyle?: object;
  children: JSX.Element | JSX.Element[] | string | any;
}

class Container extends React.PureComponent<Props> {
  render() {
    let {
      avoidHeader,
      avoidScrollView,
      contentContainerStyle = {},
      children,
      statusBarTheme,
      title,
    } = this.props;
    return (
      <View style={styles.flexFill}>
        <Header title={title} avoidHeader={avoidHeader} statusBarTheme={statusBarTheme}/>
        {!avoidScrollView && (
          <ScrollView px={5} contentContainerStyle={{...styles.container, ...contentContainerStyle}}>
            {children}
          </ScrollView>
        )}
        {avoidScrollView && children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexFill: {
    display: 'flex',
    flex: 1,
  },
  container: {
    display: 'flex',
    flexGrow: 1,
  }
});

export default Container;

import * as React from 'react';
import {StyleSheet} from 'react-native';
import {t} from '../../Locales';
import {Box, StatusBar, HStack, Text, View} from 'native-base';
import {Colors} from '../../Assets/Colors';

interface Props {
  avoidHeader?: boolean;
  title?: string;
  tagline?: string;
  statusBarTheme?: 'light-content' | 'dark-content';
}

class Header extends React.PureComponent<Props> {
  render() {
    let {
      title = 'Wookie',
      tagline = t('movies'),
      avoidHeader,
      statusBarTheme = 'dark-content'
    } = this.props;
    return (
      <>
        <StatusBar
          backgroundColor="transparent"
          barStyle={statusBarTheme}
          translucent={true}
        />
        {!avoidHeader && (
          <>
            <Box safeAreaTop backgroundColor="white" />
            <HStack
              bg="white"
              px={5}
              py={3}
              justifyContent="space-between"
              alignItems="center">
              <View>
                <Text style={styles.heading}>{title}</Text>
                <Text style={styles.black}>{tagline}</Text>
              </View>
            </HStack>
          </>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  black: {
    color: Colors.SECODARY,
  },
});

export default Header;

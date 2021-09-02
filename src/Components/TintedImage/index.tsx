import * as React from 'react';
import {StyleSheet} from 'react-native';
import FastImage, { ResizeMode } from 'react-native-fast-image'
import {Spinner, View} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Assets/Colors';

interface Props {
  source: string,
  tintColor?: string,
  resizeMode?: ResizeMode;
  style?:  Object ;
  imageStyle?: Object;
}

interface State {
  loading: boolean,
}

class TintedImage extends React.PureComponent<Props, State> {
  state = {loading: true};

  onLoadEnd = () => {
    this.setState({loading: false});
  };

  render() {
    let {loading} = this.state;
    let {source, resizeMode = 'cover', style = {}, imageStyle = {}, tintColor = '#000000CC'} = this.props;
    return (
      <View style={{...styles.container, ...style}}>
        <FastImage
          source={{uri: source}}
          resizeMode={resizeMode}
          style={{...styles.flexFill, ...imageStyle}}
          onLoadEnd={this.onLoadEnd}
        />
        {loading && (
          <View style={[styles.spinner]}>
            <Spinner color={Colors.LIGHT} size="small"/>
          </View>
        )}
        <LinearGradient colors={['transparent', 'transparent', tintColor]} style={styles.linearGradient} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  flexFill: {
    flex: 1,
  },
  spinner: {
    display: 'flex',
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default TintedImage;

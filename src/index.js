import { Animated, Easing } from 'react-native';
import { createAppContainer, createStackNavigator } from "react-navigation";
import MainScreen from './components/Main';
import ListadoSitiosScreen from './components/ListadoSitios';
import { Colors } from 'react-native-paper';

export default createAppContainer(createStackNavigator(
  {
    Main: {
      screen: MainScreen,
      navigationOptions: {
        header: null,
      },
    },
    Listado: {
      screen: ListadoSitiosScreen,
      navigationOptions: {
        title: 'Listado',
        headerPressColorAndroid: Colors.blue300,        
      }
    },
  },
  {
    initialRouteName: 'Main',    
    mode: 'card',
    transparentCard: true,
    defaultNavigationOptions: {
      gesturesEnabled: true,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - .7, index, index + .7],
          outputRange: [.3, 1, .3],
        });

        return { opacity, transform: [{ translateY }] };
      },
      containerStyle: {
        backgroundColor: 'transparent',
      }, 
    }),
  }
))
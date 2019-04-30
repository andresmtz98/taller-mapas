import { Animated, Easing } from 'react-native';
import { createAppContainer, createStackNavigator } from "react-navigation";
import MainScreen from './Main';

export default createAppContainer(createStackNavigator(
  {
    Main: MainScreen,
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
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
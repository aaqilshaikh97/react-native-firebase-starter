import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}

export default MyDrawer;

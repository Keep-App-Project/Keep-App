import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PantryStack from './PantryStack';
import ListsStack from './ListsStack';
import RecipesStack from './RecipesStack';
import ReportsStack from './ReportsStack';
import AccountStack from './AccountStack';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Pantry: { active: 'basket', inactive: 'basket-outline' },
  Lists: { active: 'list', inactive: 'list-outline' },
  Recipes: { active: 'restaurant', inactive: 'restaurant-outline' },
  Reports: { active: 'bar-chart', inactive: 'bar-chart-outline' },
  Account: { active: 'person', inactive: 'person-outline' },
};

function renderTabIcon(routeName) {
  return ({ focused, color }) => {
    const iconSet = TAB_ICONS[routeName];
    const name = focused ? iconSet.active : iconSet.inactive;
    return <Ionicons name={name} size={22} color={color} />;
  };
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.65)',
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          borderRadius: 30,
          marginHorizontal: 16,
          marginBottom: 16,
          height: 62,
          position: 'absolute',
          elevation: 6,
        },
        tabBarShowLabel: false,
        tabBarIcon: renderTabIcon(route.name),
      })}
    >
      <Tab.Screen name="Pantry" component={PantryStack} />
      <Tab.Screen name="Lists" component={ListsStack} />
      <Tab.Screen name="Recipes" component={RecipesStack} />
      <Tab.Screen name="Reports" component={ReportsStack} />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
}

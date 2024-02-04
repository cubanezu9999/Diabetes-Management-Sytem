import { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "./screens/Welcome";
import Form from "./screens/Form";
import Dashboard from "./screens/Dashboard";
import Statistics from "./screens/Statistics";
import Settings from "./screens/Settings";

const Home = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ title: "Welcome" }}
      />
      <Stack.Screen
        name="Form"
        component={Form}
        options={{ title: "Initial Setup" }}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: "Real-Time Values" }}
      />
      <Stack.Screen
        name="Statistics"
        component={Statistics}
        options={{ title: "Statistics" }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ title: "Settings" }}
      />
    </Stack.Navigator>
  );
};

export default Home;

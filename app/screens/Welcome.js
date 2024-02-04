import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Welcome = ({ navigation }) => {
  useEffect(() => {
    nav();
  }, []);
  const nav = async () => {
    const value = await AsyncStorage.getItem("fullname");

    if (!value) {
      navigation.navigate("Welcome");
    } else {
      navigation.navigate("Dashboard");
    }
  };

  return (
    <View
      style={{
        resizeMode: "cover",
        backgroundColor: "blue",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text style={{ color: "cyan", marginBottom: 30, fontSize: 25 }}>
        Welcome To
      </Text>
      <Text
        style={{
          color: "cyan",
          marginLeft: 30,
          marginBottom: 30,
          fontSize: 50,
          fontWeight: "bold",
        }}>
        Diabetes Management System
      </Text>

      <View
        style={{
          width: 200,
          borderRadius: 50,
          margin: 10,
          overflow: "hidden",
        }}>
        <Button title="Next" onPress={() => navigation.navigate("Form")} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({});
export default Welcome;

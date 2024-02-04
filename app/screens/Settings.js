import {
  View,
  Text,
  Dimensions,
  TextInput,
  StyleSheet,
  Button,
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";

const Settings = ({ navigation }) => {
  const [emergency_contact, setEmergencyContact] = React.useState("");
  const [telNumber, setTelNumber] = React.useState("");
  const [emergency_email, setEmergencyEmail] = React.useState("");
  const [isChecked, setIsChecked] = React.useState("");
  const [emergencycontact, onChangeemergencycontact] = React.useState("");
  const [phonenumber, onChangephonenumber] = React.useState("");
  const [emergencyemail, onChangeemergencyemail] = React.useState("");
  const [alert, setAlert] = React.useState("");
  const [checked, setChecked] = React.useState("");

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  React.useEffect(() => {
    getData();
  }, []);
  async function getData() {
    const fullname = await AsyncStorage.getItem("fullname");
    const emergency_contact = await AsyncStorage.getItem("emergency_contact");
    const tel_number = await AsyncStorage.getItem("phone_number");
    const emergency_email = await AsyncStorage.getItem("emergency_email");
    const checked = await AsyncStorage.getItem("sendEmail");

    setEmergencyContact(emergency_contact);
    setTelNumber(tel_number);
    setEmergencyEmail(emergency_email);
    setIsChecked(checked);
  }
  const handleInput = () => {
    setStringValue();
  };
  const setStringValue = async () => {
    if (!isChecked) {
      await AsyncStorage.setItem("sendEmail", "false");
    } else {
      await AsyncStorage.setItem("sendEmail", "true");
    }
    if (!emergencycontact) {
      setAlert("Please fill the Emergency Contact field");
    } else if (!phonenumber || !phonenumber.match("[0-9]{11}")) {
      setAlert("Please fill the emergency Phone Number field");
    } else if (!emergencyemail) {
      setAlert("Please fill the Emergency Email field");
    } else {
      try {
        await AsyncStorage.setItem("emergency_contact", emergencycontact);
        await AsyncStorage.setItem("phone_number", phonenumber);
        await AsyncStorage.setItem("emergency_email", emergencyemail);
        navigation.navigate("Dashboard");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <View
      style={{
        hight: windowHeight,
        width: windowWidth,
        resizeMode: "cover",
        backgroundColor: "blue",
        flex: 1,
        justifyContent: "top",
        alignItems: "center",
      }}>
      <Text
        style={{
          paddingTop: 20,
          fontFamily: "Sans-Serif",
          fontSize: 25,
          color: "cyan",
          margin: 20,
        }}>
        Settings
      </Text>

      <Text
        style={{
          paddingTop: 20,
          fontFamily: "Sans-Serif",
          fontSize: 15,
          color: "cyan",
        }}>
        Emergency Contact: {emergency_contact}
      </Text>
      <Text
        style={{
          paddingTop: 20,
          fontFamily: "Sans-Serif",
          fontSize: 15,
          color: "cyan",
        }}>
        Emergency Phone Number: {telNumber}
      </Text>
      <Text
        style={{
          paddingTop: 20,
          fontFamily: "Sans-Serif",
          fontSize: 15,
          color: "cyan",
        }}>
        Emergency Email: {emergency_email}
      </Text>
      <Text
        style={{
          paddingTop: 20,
          fontFamily: "Sans-Serif",
          fontSize: 15,
          color: "cyan",
        }}>
        Send Emergency Email:{isChecked}
      </Text>
      <Text
        style={{
          paddingTop: 20,
          fontFamily: "Sans-Serif",
          fontSize: 20,
          color: "cyan",
          marginTop: 20,
        }}>
        Change Information
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={(newText) => onChangeemergencycontact(newText)}
        value={emergencycontact}
        placeholder="Emergency Contact Full Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={(number) => onChangephonenumber(number)}
        value={phonenumber}
        placeholder="Emergency Contact Phone Number"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        onChangeText={(newText) => onChangeemergencyemail(newText)}
        value={emergencyemail}
        placeholder="Emergency Contact Email"
      />
      <Text
        style={{
          paddingTop: 20,
          fontFamily: "Sans-Serif",
          fontSize: 15,
          color: "cyan",
        }}>
        Send Emergency Email?
      </Text>
      <Checkbox
        style={styles.checkbox}
        value={checked}
        onValueChange={setChecked}
        color={checked ? "#4630EB" : undefined}
      />
      <View>
        <Text style={styles.alert}>{alert}</Text>
      </View>

      <View
        style={{
          width: 200,
          borderRadius: 50,
          margin: 10,
          overflow: "hidden",
        }}>
        <Button title={"Submit"} onPress={handleInput}></Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    height: 35,
    width: 300,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "cyan",
    padding: 10,
    color: "cyan",
  },
  alert: {
    fontSize: 25,
    color: "cyan",
    margin: 20,
  },
  checkbox: {
    margin: 8,
    borderColor: "cyan",
  },
});
export default Settings;

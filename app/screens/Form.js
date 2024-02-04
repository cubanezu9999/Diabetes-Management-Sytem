import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";

const Form = ({ navigation }) => {
  const [fullname, onChangefullname] = React.useState("");
  const [emergencycontact, onChangeemergencycontact] = React.useState("");
  const [phonenumber, onChangephonenumber] = React.useState("");
  const [emergencyemail, onChangeemergencyemail] = React.useState("");
  const [alert, setAlert] = React.useState("");
  const [isChecked, setChecked] = React.useState(false);

  const handleInput = () => {
    setStringValue();
  };

  const setStringValue = async () => {
    if (!isChecked) {
      await AsyncStorage.setItem("sendEmail", "false");
    } else {
      await AsyncStorage.setItem("sendEmail", "true");
    }
    if (!fullname) {
      setAlert("Please fill the Full Name field");
    } else if (!emergencycontact) {
      setAlert("Please fill the Emergency Contact field");
    } else if (!phonenumber || !phonenumber.match("[0-9]{11}")) {
      setAlert("Please fill the emergency Phone Number field");
    } else if (!emergencyemail) {
      setAlert("Please fill the Emergency Email field");
    } else {
      try {
        await AsyncStorage.setItem("fullname", fullname);
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
        resizeMode: "cover",
        backgroundColor: "blue",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text style={styles.alert}>Let the App know you</Text>
      <TextInput
        style={styles.input}
        onChangeText={(newText) => onChangefullname(newText)}
        value={fullname}
        placeholder="Full Name"
      />
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
      <Text style={styles.alert}>Send Emergency Email?</Text>
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        onValueChange={setChecked}
        color={isChecked ? "#4630EB" : undefined}
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
export default Form;

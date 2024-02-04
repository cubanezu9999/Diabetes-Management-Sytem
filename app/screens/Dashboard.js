import { StyleSheet, Text, View, Button, Dimensions } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { sendGridEmail } from "react-native-sendgrid";

const Dashboard = ({ navigation }) => {
  const [lastRecord, setLastRecord] = React.useState(0);
  const [timeAgo, setTimeAgo] = React.useState("");
  const [fullname, setFullName] = React.useState("");
  const [sendemail, setSendEmail] = React.useState(false);
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  React.useEffect(() => {
    refresh_token();
    getName();
  }, []);
  async function getName() {
    let nam = await AsyncStorage.getItem("fullname");
    let email = await AsyncStorage.getItem("sendEmail");
    console.log(email);
    if (email === "true") {
      setSendEmail(true);
    }
    setFullName(nam);
  }

  const refresh_token = () => {
    const formData = {
      grant_type: "refresh_token",
      refresh_token: "a0f1a3ee0d323247054af12c7d6f21b7",
      client_id: "sTerq36XSKAk21RCp40FU0NSXhyKAHIo",
      client_secret: "tcl17pxWzUhdVuuM",
    };

    fetch(`https://sandbox-api.dexcom.com/v2/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData).toString(),
    })
      .then((res) => res.json())
      .then((json) => {
        const token = json.access_token;

        AsyncStorage.setItem("token", token);
        fetch(
          `https://sandbox-api.dexcom.com/v3/users/self/egvs?startDate=${moment()
            .subtract(24, "h")
            .format("YYYY-MM-DDThh:mm:ss")}&endDate=${moment().format(
            "YYYY-MM-DDThh:mm:ss"
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((res) => res.json())
          .then((json) => {
            setTimeAgo(
              moment(json.records[0].systemTime).toNow(true).toString()
            );
            setLastRecord(json.records[0].value);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  let colorvar = "";
  if (lastRecord < 70 && lastRecord > 1) {
    if (sendemail === true) {
      sendEmail();
    }
    colorvar = "rgb(255, 166, 77)";
  } else if (lastRecord > 50 && lastRecord < 125) {
    colorvar = "cyan";
  } else {
    colorvar = "rgb(255, 77, 77)";
    if (sendemail === true) {
      sendEmail();
    }
  }

  async function sendEmail() {
    let nam = await AsyncStorage.getItem("fullname");
    let email = await AsyncStorage.getItem("emergency_email");
    let emergency_contact = await AsyncStorage.getItem("emergency_contact");

    const SENDGRIDAPIKEY =
      "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";
    const FROMEMAIL = "managementsystemdiabetes@gmail.com";
    const TOMEMAIL = email;
    const SUBJECT = `Alert about ${nam} glucose level`;
    const BODY = `${emergency_contact},the glucose level of ${nam} is ${lastRecord}.Take appropriate measures`;
    sendGridEmail(SENDGRIDAPIKEY, TOMEMAIL, FROMEMAIL, SUBJECT, BODY)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function getStatistics() {
    navigation.navigate("Statistics");
  }
  function getSettings() {
    navigation.navigate("Settings");
  }
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
      <View
        style={{
          width: 200,
          borderRadius: 50,
          margin: 10,
          overflow: "hidden",
        }}>
        <Button title="Settings" onPress={getSettings}></Button>
      </View>
      <Text
        style={{
          paddingTop: 20,
          fontFamily: "Sans-Serif",
          fontSize: 25,
          color: "cyan",
          margin: 20,
        }}>
        {fullname}
      </Text>
      <Text
        style={{
          marginTop: 30,
          fontFamily: "Sans-Serif",
          fontSize: 25,
          color: "cyan",
          margin: 20,
        }}>
        Your Last Reading Is:
      </Text>
      <Text
        style={{
          fontFamily: "Sans-Serif",
          fontSize: 100,
          color: colorvar,
          margin: 30,
        }}>
        {lastRecord}
        <Text
          style={{
            fontFamily: "Sans-Serif",
            fontSize: 25,
            color: "cyan",
            margin: 20,
          }}>
          mg/dL
        </Text>
      </Text>
      <Text
        style={{
          fontFamily: "Sans-Serif",
          fontSize: 20,
          color: "cyan",
          margin: 20,
        }}>
        Almost {timeAgo} ago
      </Text>
      <View
        style={{
          width: 200,
          borderRadius: 50,
          margin: 10,
          overflow: "hidden",
        }}>
        <Button title={"Refresh"} onPress={refresh_token}></Button>
      </View>
      <View
        style={{
          width: 200,
          borderRadius: 50,
          margin: 50,
          overflow: "hidden",
        }}>
        <Button title={"See Statistics"} onPress={getStatistics}></Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({});
export default Dashboard;

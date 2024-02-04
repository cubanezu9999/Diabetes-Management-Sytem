import {
  Text,
  View,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Button,
} from "react-native";
import React from "react";
import { SelectList } from "react-native-dropdown-select-list";
import "../../assets/down-chevron-svgrepo-com.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { LineChart, BarChart } from "react-native-gifted-charts";

const Statistics = ({ navigation }) => {
  const [selected, setSelected] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [dataDisplay, setDataDisplay] = React.useState([]);
  const [maxValue, setMaxValue] = React.useState(0);
  const [weekBarChart, setWeekBarChart] = React.useState(false);
  const [monthBarChart, setMonthBarChart] = React.useState(false);
  const [lastValues, setLastValues] = React.useState(false);

  const data = [
    { key: "0", value: "Last 10 Values" },
    { key: "1", value: "24 hours" },
    { key: "2", value: "Last 7 days" },
    { key: "3", value: "Last Month" },
  ];
  const windowWidth = Dimensions.get("window").width;

  const query = new URLSearchParams({
    startDate: moment().subtract(24, "h").format("YYYY-MM-DDThh:mm:ss"),
    endDate: moment().format("YYYY-MM-DDThh:mm:ss"),
  }).toString();
  async function getegv() {
    const token = await AsyncStorage.getItem("token");
    try {
      const resp = await fetch(
        `https://sandbox-api.dexcom.com/v3/users/self/egvs?${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await resp.text();

      const val = [];
      let ho = [];

      JSON.parse(data).records.forEach((el) => {
        let obj = { value: el.value, time: moment(el.systemTime).hour() };
        val.push(obj);
      });
      val.forEach((element) => {
        ho.push(element.time);
      });

      let ho1 = new Set(ho);
      let ho2 = Array.from(ho1);

      let avg = [];

      ho1.forEach((el) => {
        let val1 = val.filter((elm) => elm.time === el);

        let average =
          val1.reduce((total, value) => total + value.value, 0) / val1.length;
        avg.push(Math.round(average));
      });

      setMaxValue(Math.max(...avg) + 50);

      let dataToDisplay = ho2.map((time, index) => {
        return {
          time: time,
          value: avg[index],
          dataPointText: avg[index].toString(),
        };
      });
      setDataDisplay(dataToDisplay);

      setWeekBarChart(false);
      setMonthBarChart(false);
      setLastValues(false);
      setVisible(true);
    } catch (err) {
      console.log(err);
    }
  }

  const weekQuery = new URLSearchParams({
    startDate: moment().subtract(7, "d").format("YYYY-MM-DDThh:mm:ss"),
    endDate: moment().format("YYYY-MM-DDThh:mm:ss"),
  }).toString();

  async function getWeek() {
    const token = await AsyncStorage.getItem("token");
    try {
      const resp = await fetch(
        `https://sandbox-api.dexcom.com/v3/users/self/egvs?${weekQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const valu = [];
      let hou = [];
      const data = await resp.text();
      JSON.parse(data).records.forEach((el) => {
        let obj = { value: el.value, time: moment(el.systemTime).day() };
        valu.push(obj);
      });
      valu.forEach((element) => {
        hou.push(element.time);
      });
      hou = [...new Set([...hou])];

      let avg1 = [];
      hou.forEach((el) => {
        let valu1 = valu.filter((elm) => elm.time === el);

        let average =
          valu1.reduce((total, value) => total + value.value, 0) / valu1.length;
        avg1.push(Math.round(average));
      });

      let dataToDisplay1 = hou.map((time, index) => {
        return {
          time: moment().day(time).format("dddd"),
          value: avg1[index],
          dataPointText: avg1[index].toString(),
          label: moment().day(time).format("dddd").toString(),
        };
      });

      setDataDisplay(dataToDisplay1);
      setVisible(false);

      setMonthBarChart(false);
      setLastValues(false);
      setWeekBarChart(true);
    } catch (error) {
      console.log(error);
    }
  }
  const monthQuery = new URLSearchParams({
    startDate: moment().subtract(30, "d").format("YYYY-MM-DDThh:mm:ss"),
    endDate: moment().format("YYYY-MM-DDThh:mm:ss"),
  }).toString();
  async function getMonth() {
    const token = await AsyncStorage.getItem("token");
    try {
      const resp = await fetch(
        `https://sandbox-api.dexcom.com/v3/users/self/egvs?${monthQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await resp.text();
      const value = [];
      let mon = [];

      JSON.parse(data).records.forEach((el) => {
        let obj = { value: el.value, time: moment(el.systemTime).week() };
        value.push(obj);
      });
      value.forEach((element) => {
        mon.push(element.time);
      });
      mon = [...new Set([...mon])];

      let month = [];
      mon.forEach((el) => {
        let valu2 = value.filter((elm) => elm.time === el);

        let average =
          valu2.reduce((total, value) => total + value.value, 0) / valu2.length;
        month.push(Math.round(average));
      });

      let dataToDisplay2 = mon.map((time, index) => {
        return {
          time: moment().week(time).format("ww"),
          value: month[index],
          dataPointText: month[index].toString(),
          label: moment().week(time).format("ww").toString(),
        };
      });

      setDataDisplay(dataToDisplay2);
      setVisible(false);
      setWeekBarChart(false);

      setLastValues(false);
      setMonthBarChart(true);
    } catch (error) {
      console.log(error);
    }
  }
  const queryLast = new URLSearchParams({
    startDate: moment().subtract(24, "h").format("YYYY-MM-DDThh:mm:ss"),
    endDate: moment().format("YYYY-MM-DDThh:mm:ss"),
  }).toString();

  async function getLastValues() {
    const token = await AsyncStorage.getItem("token");
    try {
      const resp = await fetch(
        `https://sandbox-api.dexcom.com/v3/users/self/egvs?${queryLast}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let ho = [];
      const data = await resp.text();
      let data1 = JSON.parse(data).records.slice(0, 10);
      let max = [];
      data1.forEach((elm) => {
        max.push(elm.value);
      });

      setMaxValue(Math.max(...max) + 20);
      data1.forEach((el) => {
        let obj = {
          value: el.value,
          time: moment(el.displayTime).format("HH:mm"),
          dataPointText: String(el.value),
          label: String(moment(el.displayTime).format("HH:mm")),
        };
        ho.push(obj);
      });

      setDataDisplay(ho);

      setVisible(false);
      setWeekBarChart(false);
      setMonthBarChart(false);
      setLastValues(true);
    } catch (error) {
      console.log(error);
    }
  }

  function getSelected(selected) {
    switch (selected) {
      case "Last 10 Values":
        getLastValues();
        break;
      case "24 hours":
        getegv();

        break;
      case "Last 7 days":
        getWeek();
        break;
      case "Last Month":
        getMonth();
        break;
      default:
    }
  }
  function getSettings() {
    navigation.navigate("Settings");
  }
  return (
    <SafeAreaView
      style={{
        resizeMode: "cover",
        backgroundColor: "blue",
        flex: 1,
        justifyContent: "top",
        alignItems: "center",
        width: windowWidth,
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
      <ScrollView>
        <Text
          style={{
            marginTop: 150,
            fontFamily: "Sans-Serif",
            fontSize: 25,
            color: "cyan",
            margin: 40,
          }}>
          Statistics
        </Text>

        <View
          style={{
            color: "cyan",
            marginLeft: 40,
          }}>
          <SelectList
            searchPlaceholder="Select"
            boxStyles={{
              borderColor: "cyan",
              width: 300,
            }}
            inputStyles={{ fontSize: 20, color: "cyan" }}
            dropdownStyles={{ borderColor: "cyan" }}
            dropdownTextStyles={{ fontSize: 20, color: "cyan" }}
            label="Select time"
            setSelected={(val) => setSelected(val)}
            data={data}
            save="value"
            onSelect={() => getSelected(selected)}
          />
        </View>
        <View
          style={{
            marginTop: 30,
          }}>
          {visible && (
            <LineChart
              data={dataDisplay}
              adjustToWidth={true}
              maxValue={maxValue + 20}
              color="cyan"
              yAxisColor="cyan"
              xAxisColor="cyan"
              dataPointsColor={"red"}
              dataPointText={dataDisplay.value}
              textColor1="cyan"
              textShiftY={-9}
              textShiftX={-6}
              textFontSize={7}
              curved={true}
              width={windowWidth - 60}
              showYAxisIndices={true}
              yAxisIndicesColor="red"
              yAxisTextStyle={{ color: "cyan" }}
              hideRules={true}
              spacing={14}
            />
          )}
        </View>
        <View
          style={{
            marginTop: 30,
          }}>
          {lastValues && (
            <LineChart
              maxValue={maxValue}
              data={dataDisplay}
              adjustToWidth={true}
              color="cyan"
              yAxisColor="cyan"
              xAxisColor="cyan"
              dataPointsColor={"red"}
              textColor1="cyan"
              textShiftY={-5}
              textShiftX={-5}
              textFontSize={7}
              curved={true}
              width={windowWidth - 40}
              showYAxisIndices={true}
              yAxisIndicesColor="red"
              yAxisTextStyle={{ color: "cyan" }}
              hideRules={true}
              showVerticalLines={true}
              verticalLinesUptoDataPoint={true}
              showXAxisIndices={true}
              xAxisIndicesColor="red"
              xAxisLabelTextStyle={{ color: "cyan", fontSize: 8 }}
              rotateLabel={true}
              spacing={35}
            />
          )}
        </View>
        <View
          style={{
            marginTop: 30,
            width: windowWidth - 10,
          }}>
          {weekBarChart && (
            <BarChart
              data={dataDisplay}
              color="cyan"
              yAxisColor="cyan"
              xAxisColor="cyan"
              yAxisTextStyle={{ color: "cyan" }}
              hideRules={true}
              xAxisLabelTextStyle={{ fontSize: 8, color: "cyan" }}
              frontColor={"cyan"}
              cappedBars
              capColor="red"
              capThickness={3}
              isAnimated
              animationDuration={2000}
            />
          )}
        </View>
        <View
          style={{
            marginTop: 30,
            width: windowWidth - 10,
          }}>
          {monthBarChart && (
            <BarChart
              data={dataDisplay}
              color="cyan"
              yAxisColor="cyan"
              xAxisColor="cyan"
              yAxisTextStyle={{ color: "cyan" }}
              hideRules={true}
              xAxisLabelTextStyle={{ fontSize: 8, color: "cyan" }}
              frontColor={"cyan"}
              cappedBars
              capColor="red"
              capThickness={3}
              isAnimated
              animationDuration={2000}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Statistics;

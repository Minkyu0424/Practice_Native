import { StatusBar } from "expo-status-bar";
import { StyleSheet, Dimensions, Text, View, ScrollView } from "react-native";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>Yatap</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.weather}
      >
        <View style={styles.day}>
          <Text style={styles.temp}>13</Text>
          <Text style={styles.des}>Cloudy</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>13</Text>
          <Text style={styles.des}>Cloudy</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>13</Text>
          <Text style={styles.des}>Cloudy</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>13</Text>
          <Text style={styles.des}>Cloudy</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#c08552" },
  city: {
    flex: 1,
    backgroundColor: "#dab49d",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 58,
    fontWeight: "bold",
  },
  weather: {
    backgroundColor: "#c08552",
  },
  day: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 178,
  },
  des: {
    marginTop: -30,
    fontSize: 52,
  },
});

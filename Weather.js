import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
import { API_KEY } from "@env";

export default function Weather() {
  const [city, setCity] = useState("...Loading");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync();

    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    setCity(location[0].city);

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );

    const json = await res.json();
    setDays(
      json.list.filter((weather) => {
        if (weather.dt_txt.includes("00:00:00")) {
          return weather;
        }
      })
    );
  };
  const icons = {
    Clear: "day-sunny",
    Clouds: "cloudy",
    Rain: "rain",
    Atmosphere: "cloudy-gusts",
    Snow: "snow",
    Drizzle: "day-rain",
    Thunderstorm: "lightning",
  };
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={72}
                  color="#fefae0"
                />
              </View>
              <Text style={styles.des}>{day.weather[0].main}</Text>
              <Text style={styles.t}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#c08552" },
  city: {
    flex: 0.8,
    backgroundColor: "#bc6c25",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 72,
    fontWeight: "600",
    color: "#fefae0",
  },
  weather: {
    backgroundColor: "#dda15e",
  },
  day: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 30,
  },
  temp: {
    marginTop: 40,
    fontWeight: "600",
    fontSize: 100,
    color: "#fefae0",
  },
  des: {
    marginTop: -20,
    fontSize: 28,
    color: "#fefae0",
  },
  t:{
    marginTop: -5,
    fontSize: 28,
    color: "#fefae0",
  }
});

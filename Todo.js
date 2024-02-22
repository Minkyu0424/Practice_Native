import {
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./color";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";

export default function Todo() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (e) => setText(e);

  useEffect(() => {
    loadToDos();
    loadHeader();
  }, []);

  useEffect(() => {
    saveHeader(working);
  }, [working]); //현재 상태를 기억

  const saveHeader = async (working) => {
    const hText = working ? "true" : "false";
    await AsyncStorage.setItem("isWorking", hText);
  };

  const loadHeader = async () => {
    try {
      const h = await AsyncStorage.getItem("isWorking");
      return h === "false" ? setWorking(false) : setWorking(true);
    } catch (error) {
      console.log(error);
    }
  };

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      return s != null ? setToDos(JSON.parse(s)) : null;
    } catch (error) {
      console.log(error);
    }
    toDos;
  };
  const deleteTodo = async (id) => {
    Alert.alert("해당 ToDo를 삭제합니다.", "정말 삭제하겠습니까?", [
      { text: "아니요" },
      {
        text: "네",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[id];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.grey : "white" }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        style={styles.input}
        placeholder={working ? "할 일을 추가" : "여행 갈 곳 입력"}
        onChangeText={onChangeText}
        value={text}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Text>
                  <Fontisto name="trash" size={18} color={"black"} />
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 44,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginVertical: 30,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
    color: "white",
    justifyContent: "space-between",
  },
  toDoText: {
    fontSize: 20,
    color: "white",
    fontWeight: "500",
  },
});

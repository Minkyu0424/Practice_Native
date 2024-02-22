import {
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { theme } from "./color";
import { useEffect, useState } from "react";
import { Fontisto } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";

export default function Todo() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [editText, setEditText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (e) => setText(e);
  const onChangeEditText = (e) => setEditText(e);

  useEffect(() => {
    setIsLoading(true);
    loadToDos().then(() => {
      setIsLoading(false);
    });
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
    const h = await AsyncStorage.getItem("isWorking");
    return h === "false" ? setWorking(false) : setWorking(true);
  };

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    return s != null ? setToDos(JSON.parse(s)) : null;
  };

  const openEdit = (prevToDos) => {
    setIsEditing(true);
    setEditText(prevToDos);
  };

  const checkToDo = async (id) => {
    const isChecked = toDos[id].checked === "false" ? "true" : "false";
    const checkedToDos = {
      ...toDos,
      [id]: { ...toDos[id], checked: isChecked },
    };
    setToDos(checkedToDos);
    saveToDos(checkedToDos);
  };

  const deleteToDo = async (id) => {
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

  const editToDos = async (id) => {
    const editedToDos = {
      ...toDos,
      [id]: { ...toDos[id], text: editText },
    };
    setToDos(editedToDos);
    saveToDos(editedToDos);
    setIsEditing(false);
  };

  const addToDo = async () => {
    if (text === "") return;
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, checked: "false" },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  return isLoading ? (
    <View>
      <Text>로딩중이야</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.grey : "white" }}
          >
            Week
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        style={styles.input}
        placeholder={working ? "오늘 ToDo 추가" : "주간 ToDo 추가"}
        onChangeText={onChangeText}
        value={text}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <TouchableOpacity
              style={styles.toDo}
              key={key}
              onPress={() => openEdit(toDos[key].text)}
            >
              <Text
                style={{
                  ...styles.toDoText,
                  color: toDos[key].checked === "true" ? "#ffc94f" : "white",
                  textDecorationLine:
                    toDos[key].checked === "true" ? "line-through" : null,
                }}
              >
                {toDos[key].text}
              </Text>
              <View style={styles.checkBox}>
                <BouncyCheckbox
                  onPress={() => checkToDo(key)}
                  size={24}
                  isChecked={toDos[key].checked === "true" ? true : false}
                  fillColor="#ffc94f"
                  unfillColor="white"
                  innerIconStyle={{ borderWidth: 4 }}
                />
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Text>
                    <Fontisto name="trash" size={18} color={"white"} />
                  </Text>
                </TouchableOpacity>
              </View>
              <Modal visible={isEditing} animationType="slide">
                <View style={styles.modalContainer}>
                  <Text style={styles.editText}>다음과 같이 수정</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editText}
                    onChangeText={onChangeEditText}
                  />
                  <View style={styles.btnBox}>
                    <TouchableOpacity onPress={() => editToDos(key)}>
                      <Text style={styles.saveBtn}>저장</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsEditing(false)}>
                      <Text style={styles.cancelBtn}>취소</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </TouchableOpacity>
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
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 16,
    color: "white",
    justifyContent: "space-between",
  },
  toDoText: {
    width: "85%",
    fontSize: 20,
    fontWeight: "500",
  },
  checkBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  editInput: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: "85%",
  },
  saveBtn: {
    backgroundColor: "#ffc94f",
    fontSize: 24,
    color: "white",
    padding: 10,
    borderRadius: 10,
  },
  cancelBtn: {
    backgroundColor: "grey",
    fontSize: 24,
    color: "white",
    padding: 10,
    borderRadius: 10,
  },
  editText: {
    color: "white",
    padding: 20,
    fontSize: 28,
  },
  btnBox: {
    flexDirection: "row",
    columnGap: 20,
  },
});

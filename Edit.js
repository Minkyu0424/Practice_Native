import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { theme } from './color';

export default function TodoItem({ id, text: initialText, checked, updateTodo, deleteTodo }) {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateTodo(id, text);
    setIsEditing(false);
  };

  return (
    <View style={styles.toDo}>
      <TouchableOpacity onPress={() => setIsEditing(true)}>
        <Text
          style={{
            ...styles.toDoText,
            color: checked ? '#ffc94f' : 'white',
            textDecorationLine: checked ? 'line-through' : 'none',
          }}>
          {text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteTodo(id)}>
        <Text style={styles.deleteIcon}>Delete</Text>
      </TouchableOpacity>

      <Modal visible={isEditing} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = {
  toDo: {
    backgroundColor: theme.grey,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 16,
    color: 'white',
    justifyContent: 'space-between',
  },
  toDoText: {
    width: '85%',
    fontSize: 20,
    fontWeight: '500',
  },
  deleteIcon: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
  },
  saveButton: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    borderRadius: 8,
  },
};
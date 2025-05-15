import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TodoItem from './components/TodoItem'

type Todo = {
  text: string
  done: boolean
}

const STORAGE_KEY = '@todos'

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [deleteMode, setDeleteMode] = useState(false)

  useEffect(() => {
    loadTodos()
  }, [])

  useEffect(() => {
    saveTodos()
  }, [todos])

  const loadTodos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
      if (jsonValue !== null) {
        setTodos(JSON.parse(jsonValue))
      } else {
        setTodos([
          { text: 'list 1', done: false },
          { text: 'list 2', done: false },
          { text: 'list 3', done: false },
        ])
      }
    } catch (e) {
      console.error('Error: ', e)
    }
  }

  const saveTodos = async () => {
    try {
      const jsonValue = JSON.stringify(todos)
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
    } catch (e) {
      console.error('Error: ', e)
    }
  }

  const addTodo = () => {
    if (input.trim()) {
      setTodos(prev => [...prev, { text: input.trim(), done: false }])
      setInput('')
    }
  }

  const toggleTodo = (index: number) => {
    if (deleteMode) {
      Alert.alert('ยืนยันการลบ', '', [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบ',
          style: 'destructive',
          onPress: () => deleteTodo(index),
        },
      ])
    } else {
      setTodos(prev =>
        prev.map((todo, i) =>
          i === index ? { ...todo, done: !todo.done } : todo
        )
      )
    }
  }

  const deleteTodo = (index: number) => {
    setTodos(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="เพิ่มรายการ To-Do..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />
        <Pressable style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>เพิ่ม</Text>
        </Pressable>
      </View>

      <View style={styles.switchContainer}>
        <Text style={{ marginRight: 10 }}>โหมดลบ</Text>
        <Switch value={deleteMode} onValueChange={setDeleteMode} />
      </View>

      <FlatList
        data={todos}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TodoItem
            text={item.text}
            done={item.done}
            onPress={() => toggleTodo(index)}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50, flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})

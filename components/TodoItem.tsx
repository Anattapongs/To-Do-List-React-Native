import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

type TodoItemProps = {
  text: string
  done: boolean
  onPress: () => void
}

const TodoItem = ({ text, done, onPress }: TodoItemProps) => {
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.item, done && styles.doneItem]}>
        <Text style={[styles.text, done && styles.doneText]}>
          {done ? '✅ ' : '⭕️ '} {text}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  doneItem: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  text: {
    fontSize: 16,
  },
  doneText: {
    color: '#6c757d'
  },
})

export default TodoItem

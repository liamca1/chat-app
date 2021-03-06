import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, TouchableOpacity, ImageBackground } from 'react-native';
import BackgroundImage from 'chat-app/assets/img/chat-app-bg.jpeg';
{/* Background colours for the chatscreen (Constants) */}
const colors = {
  black: "#090C08",
  purple: "#474056",
  grey: "#8A95A5",
  green: "#B9C6AE",
};

export default function Start(props) {
  let [name, setName] = useState();
  let [color, setColor] = useState();

  return (
    <View style={styles.container}>
      <ImageBackground
      source={BackgroundImage}
      resizeMode='cover'
      style={styles.image}
      >
        <View style={styles.titleBox}>
          <Text style={styles.title}>Conversations</Text>
        </View>
        {/* Input box to set user name passed to chat screen */}
        <View style={styles.box1}>
          <View style={styles.inputBox}>
            <TextInput
              onChangeText={(name) => setName(name)}
              value={name}
              style={styles.input}
              placeholder='Your name...'
            />
            </View>

        {/* Allow user to choose a background color for the chat screen */}
        <Text style={styles.text}>Choose Background Color:</Text>
        <View style={styles.colorContainer}>
          <TouchableOpacity
            style={[{ backgroundColor: colors.black }, styles.colorbutton]}
            onPress={() => setColor(colors.black)}
          />
          <TouchableOpacity
            style={[{ backgroundColor: colors.purple }, styles.colorbutton]}
            onPress={() => setColor(colors.purple)}
          />
          <TouchableOpacity
            style={[{ backgroundColor: colors.grey }, styles.colorbutton]}
            onPress={() => setColor(colors.grey)}
          />
          <TouchableOpacity
            style={[{ backgroundColor: colors.green }, styles.colorbutton]}
            onPress={() => setColor(colors.green)}
          />
        </View>

        {/* Open chatroom, passing user name and background color as props */}
        <Pressable
          onPress={() => props.navigation.navigate('Chat', { name: name, color: color })}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? '#585563'
                : '#757083'
            },
            styles.button
          ]}
        >
          <Text style={styles.buttontext}>Start Chatting</Text>
        </Pressable>
        </View>
      </ImageBackground>
    </View>
    
  )
 }

 const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#ffffff',
  },

  box1: {
    backgroundColor: "#FFFFFF",
    height: "46%",
    width: "88%",
    justifyContent: "space-around",
    alignItems: "center",
  },

  input: {
    height: 60,
    width: '88%',
    fontSize: 16,
    fontWeight: '600',
    color: '#757083',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    alignItems: "center"
  },

  text: {
    color: '#757083',
    fontSize: 16,
    fontWeight: '300',
  },

  colorContainer: {
    width: '88%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  colorbutton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  button: {
    height: 50,
    width: '88%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttontext: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  }
});
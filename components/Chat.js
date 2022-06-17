import React, { Component } from 'react';
import { View, Text, Platform, KeyboardAvoidingView, StyleSheet } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
const firebase = require('firebase');
require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDwN5LbUbk-okNSOglccAkDHj3y0kSK_Rc",
  authDomain: "chat-app-34b87.firebaseapp.com",
  projectId: "chat-app-34b87",
  storageBucket: "chat-app-34b87.appspot.com",
  messagingSenderId: "47713140270",
  appId: "1:47713140270:web:5fad0a12bd064b08b369bf",
  measurementId: "G-2HKP3T6D8C"
};
// Chat component
class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      isConnected: false,
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Create a reference to the firestore messages collection
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.referenceMessagesUser= null;
  }

  // Create preloaded message. Then add system message
  componentDidMount() {
    let {name} = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    this.referenceChatMessages = firebase.firestore().collection("messages");
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
      } else {
        console.log('offline');
      }

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
      });
      this.referenceMessagesUser = firebase
        .firestore()
        .collection("messages")
        .where("uid", "==", this.state.uid);

        this.saveMessages();
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  });
}

// Save messages to the users local storage

async getMessages() {
  let messages = '';
  try {
    messages = await AsyncStorage.getItem('messages') || [];
    this.setState({
      messages: JSON.parse(messages)
    });
  } catch (error) {
    console.log(error.messages);
  }
};
async saveMessages() {
  try {
    await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
  } catch (error) {
    console.log(error.messages);
  }
}
async deleteMessages() {
  try {
    await AsyncStorage.removeItem('messages');
    this.setState({
      messages: []
    })
  } catch (error) {
    console.log(error.messages);
  }
}

  componentWillUnmount() {
    this.authUnsubscribe();
  }

  // Save messages to the cloud storage

  addMessages() {
    const messages = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: messages._id,
      text: messages.text || "",
      createdAt: messages.createdAt,
      user: messages.user,
    });
  }
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
      this.saveMessages();
    });
  }

// Disable sending messages when user is offline
renderInputToolbar(props) {
  if (this.state.isConnected == false) {
  } else {
    return(
      <InputToolbar
      {...props}
      />
    );
  }
}

  // Background colors for the chat text to the different chat users (props not currently functioning)
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#180A0A",
          }
        }}
      />
    )
  }
  render() {
    let { color, name } = this.props.route.params;
    return (
      <View style={[{ backgroundColor: color }, styles.container]}>
        <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
        messages={this.state.messages}
        renderInputToolbar={this.renderInputToolbar.bind(this)}
        onSend={(messages) => this.onSend(messages)}
        user={{
          _id: this.state.user._id,
          name: name,
            avatar: this.state.user.avatar
        }}
      />
      {Platform.OS === "android" ? ( <KeyboardAvoidingView behavior="height" /> ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
export default Chat;
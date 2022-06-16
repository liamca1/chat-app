import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import "firebase/firestore";
const firebase = require('firebase');
require('firebase/firestore');

// Chat component
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      }
    };

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

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Create a reference to the firestore messages collection
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Go through documents
    querySnapshot.forEach((doc) => {
      // Get data from query
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
    });

    this.setState({
      messages: messages,
    });
  };
  // Add new message
  addMessage() {
    const messages = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: messages._id,
      text: messages.text,
      createdAt: messages.createdAt,
      user: this.state.user,
    });
  }

  // Functionality of sending messages
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
  }

  // Create preloaded message. Then add system message
  componentDidMount() {
    let name = this.props.route.params.name;
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
        },
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
        this.referenceUser = firebase
        .firestore()
        .collection("messages")
        .where("uid", "==", this.state.uid);
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }
  // Background colors for the chat text to the different chat users (props not currently functioning)
  renderBubble(props) {
    const { bgColor } = this.props.route.params;
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#180A0A",
          },
        }}
      />
    );
  }
  render() {
    // Allow user to add their name
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    const { bgColor } = this.props.route.params;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: bgColor,
        }}
      >
        <Text>Welcome to Happy Chat!</Text>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
            name: this.state.name,
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
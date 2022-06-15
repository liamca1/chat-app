import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

//chat component
export default class Chat extends React.Component {
    constructor() {
      super();
      this.state = {
        messages: [],
      };
    }

    //prop name
  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    this.setState({
      messages: [
        {
          _id: 1,
          text: `Hello ${name}`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: `${name} has now entered the chat, welcome!`,
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

    //bubble color
    renderBubble(props) {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: "#000",
              },
            }}
            textProps={{
              style: {
                color: props.position === 'left' ? '#000' : '#fff',
              },
            }}
          />
        );
      }

        //send new messages
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }
  render() {
    let { bg } = this.props.route.params;
    return (
        <View style={{ flex: 1, backgroundColor: bg }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/**to fix keyboard issue on old models of android */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
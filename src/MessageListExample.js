import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';

import {FlatList} from 'react-native-bidirectional-infinite-scroll';
import {MessageBubble} from './MessageBubble';
import {queryMoreMessages} from './utils';

const BiFlatList = Animated.createAnimatedComponent(FlatList);

export const MessageListExample = () => {
  const listRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const scrolled = useRef(false);
  const shouldBeFadeIn = useRef(false);
  const opacity = useRef(new Animated.Value(0));
  useEffect(() => {
    const initChat = async () => {
      const initialMessages = await queryMoreMessages(100);
      if (!initialMessages) return;

      setMessages(initialMessages);
    };

    initChat();
  }, []);

  const triggerFadeIn = () => {
    setTimeout(() => {
      if (shouldBeFadeIn.current) {
        Animated.timing(opacity.current, {
          toValue: 1,
          easing: Easing.inOut(Easing.ease),
          duration: 100,
          useNativeDriver: true,
        }).start(() => {
          scrolled.current = true;
        });
      }
    }, 0);
  };

  const scrollToItem = () => {
    shouldBeFadeIn.current = true;
    listRef.current.scrollToIndex({animated: false, index: 49});
    triggerFadeIn();
  };

  useEffect(() => {
    if (listRef.current) {
      if (messages.length && !scrolled.current) {
        scrollToItem();
      }
    }
  }, [messages]);

  const loadMoreOlderMessages = async () => {
    const newMessages = await queryMoreMessages(10);
    setMessages(m => {
      return newMessages.concat(m);
    });
  };

  const loadMoreRecentMessages = async n => {
    const newMessages = await queryMoreMessages(typeof n === 'number' ? n : 10);
    setMessages(m => {
      return m.concat(newMessages);
    });
  };

  if (!messages.length) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat between two users</Text>
        <TouchableOpacity onPress={() => loadMoreRecentMessages(10)}>
          <Text style={styles.headerTitle}>Send long message</Text>
        </TouchableOpacity>
      </View>
      <BiFlatList
        style={{opacity: opacity.current}}
        ref={listRef}
        data={messages}
        onStartReached={loadMoreOlderMessages}
        onEndReached={loadMoreRecentMessages}
        onScrollToIndexFailed={e => {
          shouldBeFadeIn.current = false;
          const offset = e.averageItemLength * e.index;
          listRef.current.scrollToOffset({offset, animated: false});
          setTimeout(() => {
            scrollToItem();
          }, 50);
        }}
        renderItem={MessageBubble}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#BEBEBE',
    borderBottomWidth: 1,
  },
  headerTitle: {fontSize: 20, fontWeight: 'bold'},
  safeArea: {
    flex: 1,
  },
});

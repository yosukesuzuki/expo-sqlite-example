import React, { useState } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function SavedScreen() {
  return <View style={styles.container}></View>;
}

SavedScreen.navigationOptions = {
  title: "Saved"
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rowFrontContainer: {
    alignItems: "flex-start",
    padding: 2,
    paddingLeft: 10,
    backgroundColor: "#FFF",
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    justifyContent: "center"
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#EC7063",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: 5,
    paddingRight: 10
  },
  wordTitleContainer: {
    flexDirection: "row"
  },
  wordTitle: {
    fontWeight: "bold",
    fontSize: 20
  },
  wordMeanContainer: {
    justifyContent: "flex-start",
    height: 50
  },
  wordFreq: {
    opacity: 0.5,
    fontSize: 14
  }
});

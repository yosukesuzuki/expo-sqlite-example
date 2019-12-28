import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Button } from "react-native-elements";
import { Updates } from "expo";

export default function SettingsScreen() {
  return <View style={styles.container}></View>;
}

SettingsScreen.navigationOptions = {
  title: "Settings"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  subcontainer: {
    alignItems: "center",
    padding: 2,
    paddingLeft: 10,
    backgroundColor: "#FFF",
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    justifyContent: "center",
    flexDirection: "row"
  },
  appleButtonContainer: {
    height: 100,
    justifyContent: "center",
    width: "100%"
  }
});

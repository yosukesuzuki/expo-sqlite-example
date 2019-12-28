// import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  InteractionManager,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import * as Speech from "expo-speech";
import * as Query from "../api/Query";
import { nextKeysMap, nextKeysDefault } from "../api/NextKeyMap";

const db = SQLite.openDatabase("sqlite3.db");

export default function HomeScreen(props) {
  const [keyInput, setKeyInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);
  const [nextKeys, setNextKeys] = useState(nextKeysDefault);
  autoSaveToHistory = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    InteractionManager.runAfterInteractions(() => {
      const timeoutId = setTimeout(() => {
        setKeyInput("");
        setSearchResult([]);
        setNextKeys(nextKeysDefault);
      }, 20000);
      setTimeoutId(timeoutId);
    });
  };
  queryDict = queryChar => {
    if (queryChar !== "") {
      let sql = Query.builder(queryChar);
      db.transaction(
        tx => {
          tx.executeSql(sql, [queryChar], (_, { rows: { _array } }) => {
            setSearchResult(_array);
          });
        },
        e => {
          console.log(e);
        },
        null
      );
    } else {
      setSearchResult([]);
    }
  };
  wordList = () => {
    return (
      <FlatList
        data={searchResult}
        renderItem={data => (
          <TouchableOpacity
            style={styles.rowFrontContainer}
            activeOpacity={0.5}
            onLongPress={() => {
              Speech.speak(data.item.word);
            }}
          >
            <View style={styles.wordTitleContainer}>
              <View style={{ width: "95%" }}>
                <View style={styles.wordTitleContainer}>
                  <Text style={styles.wordTitle}>{data.item.word}</Text>
                </View>
                <Text>
                  {data.item.mean}
                  <Text style={styles.wordFreq}>
                    {" "}
                    ({data.item[Query.dbColumnForMedian]})
                  </Text>
                </Text>
              </View>
              <View style={{ justifyContent: "center" }}></View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(data, index) => index.toString()}
      />
    );
  };
  nextKeysMapSetter = newInput => {
    const currentNextKeys = nextKeysMap[newInput] || nextKeysDefault;
    setNextKeys(currentNextKeys);
  };
  keyBoard = () => {
    return (
      <View style={styles.keyboardContainer}>
        {KEYS.map((line, lindex) => {
          return (
            <View key={lindex} style={styles.keyboardLineContainer}>
              {line.map((key, keyindex) => {
                if (key !== "backspace") {
                  if (nextKeys.includes(key)) {
                    return (
                      <Button
                        key={key}
                        type="outline"
                        title={key}
                        titleStyle={styles.keyboardKey}
                        containerStyle={styles.keyboardKeyContainer}
                        onPress={() => {
                          setKeyInput(keyInput + key);
                          queryDict(keyInput + key);
                          nextKeysMapSetter(keyInput + key);
                          autoSaveToHistory();
                        }}
                      />
                    );
                  } else {
                    return (
                      <Button
                        key={key}
                        type="outline"
                        title={key}
                        titleStyle={styles.keyboardKey}
                        containerStyle={styles.keyboardKeyContainer}
                        disabled={true}
                      />
                    );
                  }
                } else {
                  return (
                    <Button
                      key={key}
                      type="outline"
                      icon={<MaterialIcons name={key} size={24} />}
                      title=""
                      style={{ marginLeft: 10 }}
                      onPress={() => {
                        setKeyInput(keyInput.slice(0, -1));
                        queryDict(keyInput.slice(0, -1));
                        nextKeysMapSetter(keyInput.slice(0, -1));
                        autoSaveToHistory();
                      }}
                    />
                  );
                }
              })}
            </View>
          );
        })}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around"
          }}
        >
          <Button
            key=" "
            type="outline"
            title="S P A C E"
            style={{ margin: 1 }}
            onPress={() => {
              setKeyInput(keyInput + " ");
              nextKeysMapSetter();
              autoSaveToHistory();
            }}
          />
          <Button
            icon={<MaterialIcons name="clear" size={24} />}
            title=""
            type="outline"
            style={{ margin: 1 }}
            containerStyle={{ width: "40%" }}
            onPress={() => {
              setKeyInput("");
              queryDict("");
              nextKeysMapSetter("");
              autoSaveToHistory();
            }}
          />
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.inputBox}
          onChangeText={text => setKeyInput(text)}
          editable={false}
          value={keyInput}
        />
      </View>
      <View style={styles.scrollViewContainer}>{wordList(searchResult)}</View>
      {keyBoard()}
    </View>
  );
}

HomeScreen.navigationOptions = {
  title: "Dictionary"
};

/*
function DevelopmentModeNotice() {
  if (__DEV__) {
    return <Text style={styles.developmentModeText}>Development mode</Text>;
  } else {
    return <Text style={styles.developmentModeText}>Production</Text>;
  }
}
*/

const KEYS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", "backspace"]
];

const styles = StyleSheet.create({
  scrollViewContainer: {
    height: "60%"
  },
  container: {
    flex: 1
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  inputBox: {
    height: 60,
    fontSize: 36,
    fontFamily: "Menlo-Regular",
    borderWidth: 2,
    margin: 4,
    padding: 4
  },
  keyboardContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 10
  },
  wordListContainer: {
    padding: 2,
    paddingLeft: 10,
    borderBottomWidth: 1
  },
  keyboardLineContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  keyboardKey: {
    fontFamily: "Menlo-Regular",
    fontSize: 24,
    fontWeight: "bold"
  },
  keyboardKeyContainer: { width: "9%", margin: 1 },
  rowFrontContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 5,
    paddingLeft: 10,
    backgroundColor: "#FFF",
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    justifyContent: "center"
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
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
  wordTitleInputted: {
    fontWeight: "bold",
    color: "#566573",
    fontSize: 20
  },
  wordFreq: {
    opacity: 0.5,
    fontSize: 14
  }
});

import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from "react";
import {Alert, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {CLEAR, colors, colorsToEmoji, ENTER} from "./src/constants"
import Keyboard from "./src/components/Keyboard"
import * as Clipboard from "expo-clipboard";

const NUMBER_OF_TRIES = 6;
const copyArray = (arr) => {
    return [...arr.map((rows) => [...rows])];
};
const getDayOfTheYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;

    return Math.floor((diff / oneDay) - 59 );
};
const dayOfTheYear = getDayOfTheYear();
const words = [
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
];
export default function App() {
    const word = words[dayOfTheYear];

    const letters = word.split("");
    const [rows, setRows] = useState(
        new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''))
    );
    const [currRow, setCurrRow] = useState(0);
    const [currCol, setCurrCol] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const isCellActive = (row, col) => {
        return row === currRow && col === currCol;
    }

    useEffect(() => {
        if (currRow > 0) {
            checkGameState();
        }
    }, [currRow])

    const onKeyPressed = (key) => {
        if (gameState !== 'playing') {
            return;
        }

        const updatedRows = copyArray(rows);
        if (key === CLEAR) {
            const prevCol = currCol - 1;
            if (prevCol >= 0) {
                updatedRows[currRow][prevCol] = '';
                setRows(updatedRows);
                setCurrCol(prevCol);
            }
            return;
        }
        if (key === ENTER) {
            if (currCol === rows[0].length) {
                setCurrRow(currRow + 1);
                setCurrCol(0);
                return;
            }
            return;
        }

        if (currCol < rows[0].length) {
            updatedRows[currRow][currCol] = key;
            setRows(updatedRows);
            setCurrCol(currCol + 1);
        }

    };
    const getCellBGColor = (row, col) => {
        const letter = rows[row][col];
        if (row >= currRow) {
            return colors.black;
        }
        if (letter === letters[col]) {
            return colors.primary;
        }
        if (letters.includes(letter)) {
            return colors.secondary;
        }
        return colors.darkgrey;
    }
    const getAllLettersWithColor = (color) => {
        return rows.flatMap((row, i) => row.filter((letter, j) => getCellBGColor(i, j) === color))
    }
    const checkGameState = () => {
        if (checkIfWon()  && gameState !== 'won') {
            Alert.alert("Hey", "You won!", [{text: 'Share', onPress: shareScore}]);
            setGameState('won')
        } else if (checkIfLost() && gameState !== 'lost') {
            Alert.alert("Oops!", "Try again!");
            setGameState('lost')
        }
    };
    const checkIfWon = () => {
        return rows[currRow - 1].every((letter, i) => letter === letters[i])
    };
    const checkIfLost = () => {
        return !checkIfWon() && currRow === rows.length;
    };
    const shareScore = () => {
        const textMap = rows.map((row, i) => row.map((letter, j) => colorsToEmoji[getCellBGColor(i, j)]).join('')).filter(row => row).join('\n');
        const textToShare = ` My Wordle score for today!\n${textMap}`;
        Clipboard.setString(textToShare);
        Alert.alert('Woahoo!','Copied successfully')
    };
    const greenCaps = getAllLettersWithColor(colors.primary);
    const yellowCaps = getAllLettersWithColor(colors.secondary);
    const greyCaps = getAllLettersWithColor(colors.darkgrey);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light"/>
            <Text style={styles.titles}>WORDLE</Text>
            <ScrollView style={styles.map}>
                {
                    rows.map((row, i) => (<View key={`index-${i}-row`} style={styles.row}>
                        {
                            row.map((letter, j) => (
                                <View key={`index-${i}-${j}-col`}
                                      style={[
                                          styles.cell,
                                          {
                                              borderColor: isCellActive(i, j)
                                                  ? colors.grey
                                                  : colors.darkgrey,
                                              backgroundColor: getCellBGColor(i, j),
                                          },

                                      ]}>
                                    <Text style={styles.cellText}>{letter.toUpperCase()} </Text>
                                </View>))
                        }
                    </View>))
                }
            </ScrollView>
            <Keyboard onKeyPressed={onKeyPressed} greenCaps={greenCaps} yellowCaps={yellowCaps} greyCaps={greyCaps}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        alignItems: 'center',
        paddingTop: 35
    },
    titles: {
        color: colors.lightgrey,
        fontSize: 32,
        fontWeight: "bold",
        letterSpacing: 7
    },
    map: {
        height: 100,
        alignSelf: "stretch",
        marginVertical: 20

    },
    row: {
        alignSelf: "stretch",
        flexDirection: "row",
        justifyContent: "center"
    },
    cell: {
        flex: 1,
        aspectRatio: 1,
        borderColor: colors.grey,
        borderWidth: 3,
        margin: 3,
        maxWidth: 70,
        alignItems: 'center',
        justifyContent: "center",

    },
    cellText: {
        color: colors.lightgrey,
        fontWeight: "bold",
        fontSize: 28
    }
});

import {StatusBar} from 'expo-status-bar';
import React, {useState} from "react";
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {CLEAR, colors, ENTER} from "./src/constants"
import Keyboard from "./src/components/Keyboard"

const NUMBER_OF_TRIES = 6;
const copyArray = (arr) => {
    return [...arr.map((rows) => [...rows])];
};
export default function App() {
    const word = 'hello';
    const letters = word.split("");
    const [rows, setRows] = useState(
        new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''))
    );
    const [currRow, setCurrRow] = useState(0);
    const [currCol, setCurrCol] = useState(0);
    const isCellActive = (row, col) => {
        return row === currRow && col === currCol;
    }
    const onKeyPressed = (key) => {
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
    const getCellBGColor = (letter, row, col) => {
        if (row>= currRow) {
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
                                              backgroundColor: getCellBGColor(letter, i, j),
                                          },

                                          ]}>
                                    <Text style={styles.cellText}>{letter.toUpperCase()} </Text>
                                </View>))
                        }
                    </View>))
                }
            </ScrollView>
            <Keyboard onKeyPressed={onKeyPressed} />
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

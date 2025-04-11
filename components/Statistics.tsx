import React from "react";
import { Text, View, StyleSheet } from "react-native";

interface Props {
  sessionsCompleted: number;
  breaksTaken: number;
}

export function Statistics({ sessionsCompleted, breaksTaken }: Props) {
  return (
    <View style={styles.viex}>
      <Text style={styles.text}>Trabajos: {sessionsCompleted}</Text>
      <Text style={styles.text}>Recesos: {breaksTaken}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  viex: {
    margin: 15,
  },
  text: {
    fontSize: 18,
    marginTop: 10,
  },
});

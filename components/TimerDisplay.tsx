import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  timeLeft: number;
  isWorkSession: boolean;
}

export function TimerDisplay({ timeLeft, isWorkSession }: Props) {
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <View style={styles.circle}>
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      <Text style={styles.session}>{isWorkSession ? "Trabajo" : "Descanso"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 180,
    height: 180,
    borderRadius: 85,
    borderStyle:"dotted",
    borderWidth: 4,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  timer: {
    fontSize: 30,
    fontWeight: "bold",
  },
  session: {
    fontSize: 18,
    marginTop: 5,
  },
});

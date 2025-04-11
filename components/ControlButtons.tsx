import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
  resetProgress: () => void;
}

export function ControlButtons({ isRunning, setIsRunning, resetProgress }: Props) {
  return (
    <View style={styles.viex}>
      <TouchableOpacity onPress={() => setIsRunning(!isRunning)} style={styles.button}>
        <Text style={styles.buttonText}>{isRunning ? "Pausar" : "Iniciar"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={resetProgress} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reiniciar progreso</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  viex:{
    marginTop:250,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    margin:7,
    borderRadius: 10,

  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign:"center",
  },
  resetButton: {
    backgroundColor: "red",
    padding: 10,
    margin:5,
    borderRadius: 10,
    width:140,
    height:40,
  },
  resetButtonText: {
    color: "white",
    fontSize: 14,
    textAlign:"center",
  },
});

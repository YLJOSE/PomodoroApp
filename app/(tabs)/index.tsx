import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Audio } from "expo-av";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

// configuracion de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,// para el sonido de notificacion
    shouldSetBadge: false,
  }),
});

// Duración de los tiempos (en segundos)
const WORK_TIME = 25 * 60; // editar tiempo de trabajo
const BREAK_TIME = 5 * 60; // editar tiempo de descanso

export default function PomodoroClock() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true); // true = trabaj ; false = desacanso
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [breaksTaken, setBreaksTaken] = useState(0);
  const [bgColor, setBgColor] = useState("#f4f4f4");

  //cargar progreso y pedir permiso para notificaciones
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Las notificaciones están deshabilitadas.");
      }
    };
    requestPermissions();
    loadSessions();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      setBgColor(isWorkSession ? "#4CAF50" : "#008CBA"); // verde : estudio, azul = receso
    } else if (timeLeft === 0) {
      setIsRunning(false);
      handleSessionEnd();
    } else {
      setBgColor("#FFD700"); // amarillo pausa o fondo principal
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // animacion de color de fondo(cambio)
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(bgColor, { duration: 500 }),
  }));

  // obtencion de sonido de finalizacion de estudio || trabajo reemplaza al sonido de la notificacion desactivada
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require("../../assets/sounds/alarm.mp3"));
    await sound.playAsync();
  };

  // notificacion al terminar
  const sendNotification = async (message: string) => {
    await Notifications.scheduleNotificationAsync({
      content: { title: "Pomodoro", body: message },
      trigger: null,
    });
  };

  // guardo el progreso en AsyncStorage(alamcenar datos de manera persitente y asincrono)
  const saveSession = async () => {
    const newSessions = sessionsCompleted + 1;
    setSessionsCompleted(newSessions);
    await AsyncStorage.setItem("sessions", newSessions.toString());
  };

  const saveBreak = async () => {
    const newBreaks = breaksTaken + 1;
    setBreaksTaken(newBreaks);
    await AsyncStorage.setItem("breaks", newBreaks.toString());
  };

  // obtener progreso guardado
  const loadSessions = async () => {
    const savedSessions = await AsyncStorage.getItem("sessions");
    if (savedSessions !== null) setSessionsCompleted(parseInt(savedSessions, 10));

    const savedBreaks = await AsyncStorage.getItem("breaks");
    if (savedBreaks !== null) setBreaksTaken(parseInt(savedBreaks, 10));
  };

  // manejo de fin de sesion
  const handleSessionEnd = () => {
    playSound();
    sendNotification(isWorkSession ? "Tiempo de descanso! 🛑" : "Hora de estudiar! 💪"); // texto para la notificacion

    if (isWorkSession) {
      saveSession();
      setTimeLeft(BREAK_TIME);
    } else {
      saveBreak();
      setTimeLeft(WORK_TIME);
    }

    setIsWorkSession(!isWorkSession);
    setIsRunning(false);
  };

  // reinicio del progreso
  const resetProgress = async () => {
    setSessionsCompleted(0);
    setBreaksTaken(0);
    await AsyncStorage.setItem("sessions", "0");
    await AsyncStorage.setItem("breaks", "0");
  };

  // formatear tiempo en  minutos y segundos
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>

      <Text style={styles.subtitle}>{isWorkSession ? "Trabajo" : "Descanso"}</Text>

      <View style={styles.circle}>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      </View>

      <TouchableOpacity onPress={() => setIsRunning(!isRunning)} style={styles.button}>
        <Text style={styles.buttonText}>{isRunning ? "Pausar" : "Iniciar"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={resetProgress} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reiniciar progreso</Text>
      </TouchableOpacity>

      <Text style={styles.sessions}>Pomodoros: {sessionsCompleted}</Text>
      <Text style={styles.sessions}>Descansos: {breaksTaken}</Text>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "white",
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 200,
    
  },
  timer: {
    fontSize: 30,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginVertical:20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  sessions: {
    fontSize: 18,
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 10,
    marginTop: 10,
    marginVertical:10,
  },
  resetButtonText: {
    color: "white",
    fontSize: 14,
  },
});

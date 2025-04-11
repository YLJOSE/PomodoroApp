import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";

export function usePomodoro() {
  
  const[WORKTIME,setWorkTime] = useState(1*60);
  const[BREAKTIME,setBreakTime] = useState(1*60);

  const [timeLeft, setTimeLeft] = useState(WORKTIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [breaksTaken, setBreaksTaken] = useState(0);
  const [bgColor, setBgColor] = useState("#f4f4f4");

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      setBgColor(isWorkSession ? "#00FF00" : "#0033FF"); // verde = estudio, azul = descanso
    } else if (timeLeft === 0) {
      setIsRunning(false);
      handleSessionEnd();
    } else {
      setBgColor("#FFFF66"); // amarillo = pausa
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleSessionEnd = async () => {
    playSound();
    if (isWorkSession) {
      saveSession();
      setTimeLeft(BREAKTIME);
    } else {
      saveBreak();
      setTimeLeft(WORKTIME);
    }
    setIsWorkSession(!isWorkSession);
    setIsRunning(false);
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require("../assets/sounds/alarm.mp3"));
    await sound.playAsync();
  };

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

  const loadSessions = async () => {
    const savedSessions = await AsyncStorage.getItem("sessions");
    if (savedSessions) setSessionsCompleted(parseInt(savedSessions, 10));

    const savedBreaks = await AsyncStorage.getItem("breaks");
    if (savedBreaks) setBreaksTaken(parseInt(savedBreaks, 10));
  };

  const resetProgress = async () => {
    setSessionsCompleted(0);
    setBreaksTaken(0);
    await AsyncStorage.setItem("sessions", "0");
    await AsyncStorage.setItem("breaks", "0");
  };

  return {
    setWorkTime,
    setBreakTime,
    WORKTIME,
    BREAKTIME,
    setTimeLeft,
    timeLeft,
    isRunning,
    isWorkSession,
    sessionsCompleted,
    breaksTaken,
    setIsRunning,
    resetProgress,
    bgColor,
  };
}

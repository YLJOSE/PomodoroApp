import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import BackgroundTimer from "expo-background-timer";

export function usePomodoro() {
  const [WORKTIME, setWorkTime] = useState(1 * 60);
  const [BREAKTIME, setBreakTime] = useState(1 * 60);

  const [timeLeft, setTimeLeft] = useState(WORKTIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [breaksTaken, setBreaksTaken] = useState(0);
  const [bgColor, setBgColor] = useState("#f4f4f4");

  const intervalRef = useRef<number | null>(null);

  // Configurar sonido en segundo plano
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });

    loadSessions();
  }, []);

  useEffect(() => {
    if (isRunning) {
      startBackgroundTimer();
      setBgColor(isWorkSession ? "#00FF00" : "#0033FF");
    } else {
      stopBackgroundTimer();
      setBgColor("#FFFF66");
    }

    return () => stopBackgroundTimer();
  }, [isRunning]);

  const startBackgroundTimer = () => {
    if (intervalRef.current) return;

    intervalRef.current = BackgroundTimer.bgSetInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopBackgroundTimer();
          handleSessionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopBackgroundTimer = () => {
    if (intervalRef.current) {
      BackgroundTimer.bgClearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleSessionEnd = async () => {
    await playSound();
    if (isWorkSession) {
      await saveSession();
      setTimeLeft(BREAKTIME);
    } else {
      await saveBreak();
      setTimeLeft(WORKTIME);
    }
    setIsWorkSession(!isWorkSession);
    setIsRunning(false);
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/alarm.mp3")
    );
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

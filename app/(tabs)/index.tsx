import React from "react";
import { usePomodoro } from "@/hooks/usePomodoro";
import { TimerDisplay } from "@/components/TimerDisplay";
import { ControlButtons } from "@/components/ControlButtons";
import { Statistics } from "@/components/Statistics";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import UpdatesTimes from "@/components/UpdatesTimes";

export default function PomodoroClock() {
  const pomodoro = usePomodoro();
  // animacion de color de fondo
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(pomodoro.bgColor, { duration: 500 }),
  }));
  
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.blocks}>
      <TimerDisplay timeLeft={pomodoro.timeLeft} isWorkSession={pomodoro.isWorkSession} />
      </View>
      <ControlButtons isRunning={pomodoro.isRunning} setIsRunning={pomodoro.setIsRunning} resetProgress={pomodoro.resetProgress} />
      <UpdatesTimes wTime={pomodoro.WORKTIME} bTime={pomodoro.BREAKTIME} setWTime={pomodoro.setWorkTime} setBTime={pomodoro.setBreakTime} setTimeLeft={pomodoro.setTimeLeft}/>
      <Statistics sessionsCompleted={pomodoro.sessionsCompleted} breaksTaken={pomodoro.breaksTaken} />
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blocks: {
    margin:10,
  },
});
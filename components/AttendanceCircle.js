import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default function AttendanceCircle({ percentage = 0, size = 120 }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const getColor = () => {
    if (percentage < 75) return "#E74C3C";
    if (percentage < 90) return "#F39C12";
    return "#2ECC71";
  };

  const circleSize = size;
  const borderWidth = size * 0.08;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.circle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            borderWidth,
            borderColor: getColor(),
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.text,
            {
              fontSize: size * 0.22,
              color: getColor(),
            },
          ]}
        >
          {percentage}%
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  circle: {
    backgroundColor: "#E6F7F7",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
});

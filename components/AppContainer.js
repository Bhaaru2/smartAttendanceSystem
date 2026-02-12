import { View, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export default function AppContainer({ children }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
});

import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

interface OfflineIndicatorProps {
  cached?: boolean;
}

export default function OfflineIndicator({
  cached = false,
}: OfflineIndicatorProps) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check initial connection state
    NetInfo.fetch().then((state) => {
      setIsOffline(!state.isConnected);
    });

    // Listen for connection changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Show the notice when there is no internet
  // OR when the screen is displaying cached data.
  if (!isOffline && !cached) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>

      <Text style={styles.text}>
        {isOffline
          ? "You are offline. Showing saved data."
          : "Showing cached data. It may not be the latest."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3CD",
    borderBottomWidth: 1,
    borderBottomColor: "#FFE69C",
    paddingVertical: 8,
    paddingHorizontal: 15,
  },

  icon: {
    fontSize: 15,
    marginRight: 7,
  },

  text: {
    flex: 1,
    fontSize: 13,
    color: "#664D03",
    fontWeight: "500",
  },
});
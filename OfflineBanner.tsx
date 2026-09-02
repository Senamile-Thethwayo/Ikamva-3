import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const OfflineBanner = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

     return () => unsubscribe();
  }, []);

  if (isConnected) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>⚠️ No Internet Connection</Text>
    </View>
  );
};

export default OfflineBanner;

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
 
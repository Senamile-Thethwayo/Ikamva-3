import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { getData, removeData } from "./utils/Storage";
import { initDatabase } from "./db/Database";
import { initReferenceDatabase } from "./db/ReferenceDatabase";

/**
 * Entry point — shows the animated splash screen while initialising
 * the database, then routes to the correct screen.
 */
export default function Index() {
  const logoScale   = useRef(new Animated.Value(0.75)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const barWidth    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ── Animate splash ────────────────────────────────────
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(logoScale,   { toValue: 1, friction: 5,   useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(barWidth,    { toValue: 1, duration: 1400, useNativeDriver: false }),
    ]).start();

    // ── Init DBs + decide route ───────────────────────────
    const boot = async () => {
      try {
        await initDatabase();
        await initReferenceDatabase();
      } catch (e) {
        console.warn("DB init error (non-fatal):", e);
      }

      // Wait at least 2.8s so the splash is fully visible
      await new Promise((r) => setTimeout(r, 2800));

      try {
        const loggedIn = await getData("userLoggedIn");

        // Validate the session — it must have an id to be considered valid
        if (loggedIn && loggedIn.id) {
          router.replace("/(tabs)/home");
          return;
        }

        // Clear any corrupt/incomplete session data
        await removeData("userLoggedIn");

        const hasAccount = await getData("hasAccount");
        if (hasAccount) {
          router.replace("/login");
          return;
        }

        router.replace("/UserSetup");
      } catch {
        router.replace("/UserSetup");
      }
    };

    boot();
  }, []);

  return (
    <View style={s.root}>
      {/* Logo */}
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
        <Image
          source={require("../assets/images/splash-icon.png")}
          style={s.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* App name */}
      <Animated.View style={[s.textWrap, { opacity: textOpacity }]}>
        <Text style={s.title}>IKAMVA HUB</Text>
        <Text style={s.tagline}>Find Your School. Find Your Future.</Text>
      </Animated.View>

      {/* Progress bar */}
      <View style={s.track}>
        <Animated.View
          style={[s.bar, {
            width: barWidth.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
          }]}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  logo: { width: 200, height: 200 },
  textWrap: { alignItems: "center", marginTop: 20 },
  title:   { fontSize: 32, fontWeight: "900", color: "#14B8A6", letterSpacing: 3, marginBottom: 6 },
  tagline: { fontSize: 14, color: "rgba(255,255,255,0.5)", letterSpacing: 1, marginBottom: 48 },
  track: {
    position: "absolute", bottom: 60, left: 40, right: 40,
    height: 3, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden",
  },
  bar: { height: "100%", backgroundColor: "#14B8A6", borderRadius: 2 },
});

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "./lib/supabase";
import { getData, saveData } from "./utils/Storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // If the user is already logged in, go straight to home
  useEffect(() => {
    const check = async () => {
      const loggedIn = await getData("userLoggedIn");
      if (loggedIn) {
        router.replace("/(tabs)/home");
      } else {
        setCheckingSession(false);
      }
    };
    check();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // ── Try Supabase Auth first ───────────────────────────
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (!error && data.user) {
        await saveData("userLoggedIn", {
          id:          data.user.id,
          email:       data.user.email,
          supabase_id: data.user.id,
        });
        await saveData("hasAccount", true);
        (global as any).userLoggedIn   = true;
        (global as any).currentUserId  = data.user.id;
        router.replace("/(tabs)/home");
        return;
      }

      // ── Fallback to local SQLite (offline / legacy accounts) ─
      const db = await import("expo-sqlite").then(m => m.openDatabaseSync("ikamvahub.db"));
      const result = await db.getAllAsync(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email.trim(), password],
      );

      if (result.length > 0) {
        const user = result[0] as any;
        await saveData("userLoggedIn", { id: user.id, email: user.email });
        await saveData("hasAccount", true);
        (global as any).userLoggedIn  = true;
        (global as any).currentUserId = user.id;
        router.replace("/(tabs)/home");
        return;
      }

      alert("Invalid email or password. Please try again.");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show nothing while checking session to avoid flash
  if (checkingSession) {
    return <View style={styles.container} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="person-outline" size={34} color="#fff" />
        </View>

        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#fff" />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="rgba(255,255,255,0.65)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.65)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing In..." : "Log In"}
          </Text>
          {!loading && (
            <Ionicons name="arrow-forward" size={20} color="#087F7A" />
          )}
        </TouchableOpacity>

        {/* Sign Up link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/UserSetup")}>
            <Text style={styles.signupLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#087F7A",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: 36,
  },
  inputContainer: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 31,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 13,
  },
  button: {
    height: 62,
    borderRadius: 31,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#087F7A",
    fontSize: 17,
    fontWeight: "800",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  signupText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  signupLink: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});

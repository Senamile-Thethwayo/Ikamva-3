import { useEffect, useState } from "react";
import {
    createProfile,
    createUser,
    initDatabase,
} from "./db/Database";

import {
    initReferenceDatabase,
    seedReferenceDatabase,
} from "./db/ReferenceDatabase";

import { saveData } from "./utils/Storage";
import { supabase } from "./lib/supabase";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useRouter } from "expo-router";

export default function UserSetup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // DATABASE SETUP
  // =========================
  useEffect(() => {
    const setupDatabases = async () => {
      try {
        await initDatabase();
        await initReferenceDatabase();
        await seedReferenceDatabase();

        console.log("✅ All databases ready");
      } catch (error) {
        console.error("❌ Database setup failed:", error);
      }
    };

    setupDatabases();
  }, []);

  // =========================
  // CREATE ACCOUNT
  // =========================
  const handleCreateAccount = async () => {
    if (!name.trim()) {
      Alert.alert("Missing information", "Please enter your full name.");
      return;
    }

    if (!age.trim()) {
      Alert.alert("Missing information", "Please enter your age.");
      return;
    }

    if (!gender) {
      Alert.alert("Missing information", "Please select your gender.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Missing information", "Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Missing information", "Please enter a password.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Password too short",
        "Your password must be at least 6 characters long."
      );
      return;
    }

    try {
      setLoading(true);

      // ── Register via Supabase Auth ────────────────────────
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim() },
        },
      });

      if (error) {
        Alert.alert("Registration Failed", error.message);
        return;
      }

      if (data.user) {
        // Update profile with extra fields
        await supabase.from("profiles").upsert({
          id:     data.user.id,
          email:  email.trim(),
          name:   name.trim(),
          age,
          gender,
        });

        // Also keep local DB for offline use
        try {
          const userId = await createUser(name.trim(), email.trim(), password);
          if (userId) {
            await createProfile({
              user_id: userId,
              age, gender,
              school: "", grade: "", career_interest: "",
              bio: "", profile_pic: "", phone: "", location: "",
            });
          }
        } catch { /* local DB is best-effort */ }

        await saveData("hasAccount", true);
        await saveData("userLoggedIn", {
          id:           data.user.id,
          email:        data.user.email,
          supabase_id:  data.user.id,
        });

        Alert.alert(
          "Welcome to IKAMVAHUB!",
          "Your account has been created successfully.",
          [{ text: "Get Started", onPress: () => router.replace("/login") }]
        );
      }
    } catch (error) {
      console.error("❌ Error creating account:", error);

      Alert.alert(
        "Account creation failed",
        "Something went wrong while creating your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* TOP BAR */}
        <View style={styles.topBar}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.canGoBack() ? router.back() : router.replace("/login")}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            <View style={styles.activeProgress} />

            <View style={styles.progressLine} />

            <View style={styles.inactiveProgress} />

            <View style={styles.progressLine} />

            <View style={styles.inactiveProgress} />
          </View>

          <View style={{ width: 40 }} />

        </View>

        {/* HEADER */}
        <View style={styles.header}>

          <View style={styles.iconCircle}>
            <Ionicons
              name="person-outline"
              size={32}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.title}>
            Create your{"\n"}IKAMVAHUB account
          </Text>

          <Text style={styles.subtitle}>
            Let's personalize your experience
          </Text>

        </View>

        {/* FORM */}
        <View style={styles.form}>

          {/* FULL NAME */}
          <View style={styles.inputContainer}>

            <Ionicons
              name="person-outline"
              size={21}
              color="#FFFFFF"
            />

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

          </View>

          {/* AGE */}
          <View style={styles.inputContainer}>

            <MaterialIcons
              name="cake"
              size={21}
              color="#FFFFFF"
            />

            <TextInput
              style={styles.input}
              placeholder="Age"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              maxLength={2}
            />

          </View>

          {/* GENDER */}
          <View style={styles.genderContainer}>

            <View style={styles.genderTitleRow}>

              <Ionicons
                name="male-female-outline"
                size={21}
                color="#FFFFFF"
              />

              <Text style={styles.genderTitle}>
                Gender
              </Text>

            </View>

            <View style={styles.genderRow}>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "Male" &&
                    styles.selectedGender,
                ]}
                onPress={() => setGender("Male")}
              >
                <Text style={styles.genderText}>
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "Female" &&
                    styles.selectedGender,
                ]}
                onPress={() => setGender("Female")}
              >
                <Text style={styles.genderText}>
                  Female
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "Prefer not to say" &&
                    styles.selectedGender,
                ]}
                onPress={() =>
                  setGender("Prefer not to say")
                }
              >
                <Text style={styles.genderText}>
                  Prefer not
                </Text>
              </TouchableOpacity>

            </View>

          </View>

          {/* EMAIL */}
          <View style={styles.inputContainer}>

            <Ionicons
              name="mail-outline"
              size={21}
              color="#FFFFFF"
            />

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

          </View>

          {/* PASSWORD */}
          <View style={styles.inputContainer}>

            <Ionicons
              name="lock-closed-outline"
              size={21}
              color="#FFFFFF"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(!showPassword)
              }
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={22}
                color="#FFFFFF"
              />
            </TouchableOpacity>

          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleCreateAccount}
            disabled={loading}
          >

            <Text style={styles.buttonText}>
              {loading
                ? "Creating Account..."
                : "Get Started"}
            </Text>

            {!loading && (
              <Ionicons
                name="arrow-forward"
                size={21}
                color="#087F7A"
              />
            )}

          </TouchableOpacity>

          {/* LOGIN */}
          <View style={styles.loginRow}>

            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginLink}>
                {" "}Login
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  // =========================
  // MAIN
  // =========================

  container: {
    flex: 1,
    backgroundColor: "#087F7A",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 55,
    paddingBottom: 35,
  },

  // =========================
  // TOP BAR
  // =========================

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  activeProgress: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
  },

  inactiveProgress: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  progressLine: {
    width: 45,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 7,
  },

  // =========================
  // HEADER
  // =========================

  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 35,
  },

  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 37,
  },

  subtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },

  // =========================
  // FORM
  // =========================

  form: {
    width: "100%",
  },

  inputContainer: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 31,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 13,
  },

  // =========================
  // GENDER
  // =========================

  genderContainer: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 22,
    padding: 15,
    marginBottom: 15,
  },

  genderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  genderTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 13,
    fontWeight: "500",
  },

  genderRow: {
    flexDirection: "row",
    gap: 8,
  },

  genderButton: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedGender: {
    backgroundColor: "rgba(255,255,255,0.28)",
    borderColor: "#FFFFFF",
  },

  genderText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  // =========================
  // GET STARTED
  // =========================

  button: {
    height: 62,
    borderRadius: 31,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
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

  // =========================
  // LOGIN
  // =========================

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 26,
  },

  loginText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },

  loginLink: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

});

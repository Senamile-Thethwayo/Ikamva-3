import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getUserProfile, updateProfileDetails } from "./db/Database";
import { getData } from "./utils/Storage";

const TEAL      = "#14B8A6";
const TEAL_DARK = "#0A7A7C";
const WHITE     = "#FFFFFF";
const DARK      = "#1F2937";
const GREY      = "#6B7280";

function Field({ label, value, onChange, placeholder, keyboardType = "default", autoCapitalize = "sentences" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: any;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? label}
        placeholderTextColor="#aaa"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

export default function ProfileDetails() {
  const [name,           setName]           = useState("");
  const [email,          setEmail]          = useState("");
  const [phone,          setPhone]          = useState("");
  const [age,            setAge]            = useState("");
  const [gender,         setGender]         = useState("");
  const [school,         setSchool]         = useState("");
  const [grade,          setGrade]          = useState("");
  const [careerInterest, setCareerInterest] = useState("");
  const [bio,            setBio]            = useState("");
  const [location,       setLocation]       = useState("");
  const [saving,         setSaving]         = useState(false);

  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    try {
      const session = await getData("userLoggedIn");
      const userId  = session?.id ?? (global as any).currentUserId ?? 1;
      const user: any = await getUserProfile(userId);
      if (user) {
        setName(user.name   ?? "");
        setEmail(user.email ?? "");
        setPhone(user.phone ?? "");
        setAge(user.age     ?? "");
        setGender(user.gender ?? "");
        setSchool(user.school ?? "");
        setGrade(user.grade   ?? "");
        setCareerInterest(user.career_interest ?? "");
        setBio(user.bio       ?? "");
        setLocation(user.location ?? "");
      }
    } catch (e) {
      console.error("Load user error:", e);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter your full name.");
      return;
    }
    try {
      setSaving(true);
      const session = await getData("userLoggedIn");
      const userId  = session?.id ?? (global as any).currentUserId ?? 1;
      await updateProfileDetails(userId, name.trim(), email.trim());
      Alert.alert("Saved", "Your profile has been updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      console.error("Save error:", e);
      Alert.alert("Error", "Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={TEAL_DARK} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.replace("/(tabs)/home" as any)}>
          <Ionicons name="home-outline" size={20} color={WHITE} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Personal Information</Text>

        <Field label="Full Name"        value={name}           onChange={setName}           placeholder="Your full name" autoCapitalize="words" />
        <Field label="Email Address"    value={email}          onChange={setEmail}          placeholder="your@email.com" keyboardType="email-address" autoCapitalize="none" />
        <Field label="Phone Number"     value={phone}          onChange={setPhone}          placeholder="+27 ..." keyboardType="phone-pad" autoCapitalize="none" />
        <Field label="Age"              value={age}            onChange={setAge}            placeholder="Your age" keyboardType="numeric" />
        <Field label="Gender"           value={gender}         onChange={setGender}         placeholder="e.g. Male / Female / Other" />
        <Field label="Location"         value={location}       onChange={setLocation}       placeholder="City or town" />

        <Text style={styles.sectionLabel}>Academic Information</Text>

        <Field label="School"           value={school}         onChange={setSchool}         placeholder="Your current school" autoCapitalize="words" />
        <Field label="Grade"            value={grade}          onChange={setGrade}          placeholder="e.g. Grade 12" />
        <Field label="Career Interest"  value={careerInterest} onChange={setCareerInterest} placeholder="e.g. Medicine, Engineering..." autoCapitalize="words" />

        <View style={styles.fieldWrap}>
          <Text style={styles.fieldLabel}>Bio</Text>
          <TextInput
            style={[styles.fieldInput, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us a bit about yourself..."
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color={WHITE} />
          <Text style={styles.saveBtnText}>{saving ? "Saving..." : "Save Changes"}</Text>
        </TouchableOpacity>

        {/* Back to home */}
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace("/(tabs)/home" as any)}>
          <Ionicons name="home-outline" size={17} color={TEAL} />
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: "#F7F8FA" },
  header: { backgroundColor: TEAL_DARK, paddingTop: 52, paddingBottom: 16, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerBtn:   { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: WHITE },

  scroll: { padding: 18 },

  sectionLabel: { fontSize: 13, fontWeight: "800", color: TEAL_DARK, textTransform: "uppercase", letterSpacing: 0.8, marginTop: 20, marginBottom: 10 },

  fieldWrap:  { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: GREY, marginBottom: 5 },
  fieldInput: {
    backgroundColor: WHITE, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB",
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: DARK,
  },
  bioInput: { minHeight: 100, paddingTop: 12 },

  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: TEAL_DARK, borderRadius: 14, paddingVertical: 16,
    gap: 8, marginTop: 24,
    elevation: 3, shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6,
  },
  saveBtnText: { color: WHITE, fontSize: 16, fontWeight: "800" },

  homeBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: TEAL, borderRadius: 14,
    paddingVertical: 14, gap: 8, marginTop: 12,
  },
  homeBtnText: { color: TEAL, fontSize: 15, fontWeight: "700" },
});

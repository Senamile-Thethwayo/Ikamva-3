import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = {
  primary: "#14B8A6",
  teal: "#0A7A7C",
  primaryLight: "#E6F7F7",
  primaryBorder: "#B2E8E4",
  background: "#F8FAFC",
  white: "#FFFFFF",
  text: "#111827",
  secondaryText: "#4B5563",
  muted: "#6B7280",
  border: "#E5E7EB",
};

export default function FundingDetailsScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    provider?: string;
    closingDate?: string;
    amount?: string;
    type?: string;
    fields?: string;
    applyLink?: string;
  }>();

  const name = params.name || "Funding Opportunity";
  const provider = params.provider || "Provider";

  const closingDate =
    params.closingDate || "Closing date unavailable";

  const type = params.type || "Funding";

  const amount =
    params.amount ||
    (type === "Bursary"
      ? "Funding details available"
      : "Funding information available");

  const applyLink = params.applyLink || "";

  const fields = params.fields
    ? params.fields
        .split("|")
        .filter((field) => field.trim().length > 0)
    : ["All Fields"];

  const handleShare = async () => {
    try {
      await Share.share({
        title: name,
        message: `${name} — offered by ${provider}.\n\nClosing date: ${closingDate}\n\nApply here: ${applyLink || "Visit the provider website for details."}`,
        url: applyLink || undefined,
      });
    } catch (e) {
      console.error("Share error:", e);
    }
  };

  const applyOfficialWebsite = async () => {
    if (!applyLink || !applyLink.trim()) {
      console.log("No application link available.");
      return;
    }
    try {
      const supported = await Linking.canOpenURL(applyLink);
      if (supported) {
        await Linking.openURL(applyLink);
      } else {
        console.log("Cannot open URL:", applyLink);
      }
    } catch (error) {
      console.error("Error opening application link:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={27}
              color={COLORS.text}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            {type} Details
          </Text>

          <Pressable style={styles.favoriteButton}>
            <Ionicons
              name="heart-outline"
              size={27}
              color={COLORS.primary}
            />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {/* MAIN FUNDING CARD */}
          <View style={styles.mainCard}>

            <View style={styles.mainTop}>

              <View style={styles.logoSection}>
                <View style={styles.logoBox}>
                  <Ionicons
                    name={
                      type === "Scholarship"
                        ? "school-outline"
                        : "briefcase-outline"
                    }
                    size={44}
                    color={COLORS.primary}
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.titleSection}>
                <Text style={styles.fundingName}>{name}</Text>
                <Text style={styles.provider}>{provider}</Text>
              </View>
            </View>

            {/* INFORMATION SECTION */}
            <View style={styles.informationSection}>

              {/* AMOUNT / FUNDING */}
              <View style={styles.detailRow}>

                <View style={styles.detailIcon}>
                  <Ionicons
                    name="cash-outline"
                    size={22}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.detailContent}>

                  <Text style={styles.detailTitle}>
                    {type === "Bursary"
                      ? "Funding"
                      : "Amount"}
                  </Text>

                  <Text style={styles.detailText}>
                    {amount}
                  </Text>

                </View>
              </View>

              <View style={styles.separator} />

              {/* ELIGIBILITY */}
              <View style={styles.detailRow}>

                <View style={styles.detailIcon}>
                  <Ionicons
                    name="people-outline"
                    size={22}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.detailContent}>

                  <Text style={styles.detailTitle}>
                    Eligibility
                  </Text>

                  <Text style={styles.detailText}>
                    Eligibility requirements and
                    selection criteria are available
                    on the official provider website.
                  </Text>

                </View>
              </View>

              <View style={styles.separator} />

              {/* CLOSING DATE */}
              <View style={styles.detailRow}>

                <View style={styles.detailIcon}>
                  <Ionicons
                    name="calendar-outline"
                    size={22}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.detailContent}>

                  <Text style={styles.detailTitle}>
                    Closing Date
                  </Text>

                  <Text style={styles.detailText}>
                    {closingDate}
                  </Text>

                </View>
              </View>

              <View style={styles.separator} />

              {/* HOW TO APPLY */}
              <View style={styles.detailRow}>

                <View style={styles.detailIcon}>
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.detailContent}>

                  <Text style={styles.detailTitle}>
                    How to Apply
                  </Text>

                  <Text style={styles.detailText}>
                    Apply online through the official{" "}
                    {provider} website.
                  </Text>

                </View>
              </View>

              {/* APPLY BUTTON */}
              <Pressable
                onPress={applyOfficialWebsite}
                style={({ pressed }) => [
                  styles.applyButton,
                  pressed && styles.applyButtonPressed,
                ]}
              >
                <Ionicons
                  name="open-outline"
                  size={22}
                  color={COLORS.white}
                />

                <Text style={styles.applyButtonText}>
                  Apply on Official Website
                </Text>
              </Pressable>

              {/* NOTE */}
              <View style={styles.noteBox}>

                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={COLORS.primary}
                />

                <View style={styles.noteContent}>

                  <Text style={styles.noteTitle}>
                    Note
                  </Text>

                  <Text style={styles.noteText}>
                    All detailed requirements,
                    documents and selection criteria
                    should be checked on the official
                    website before applying.
                  </Text>

                </View>
              </View>

            </View>
          </View>

          {/* SHARE BUTTON */}
          <Pressable style={styles.shareButton} onPress={handleShare}>

            <Ionicons
              name="share-social-outline"
              size={22}
              color={COLORS.primary}
            />

            <Text style={styles.shareText}>
              Share
            </Text>

          </Pressable>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
  },

  favoriteButton: {
    width: 42,
    height: 42,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  scrollContent: {
    padding: 18,
    paddingBottom: 35,
  },

  mainCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 9,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },

  mainTop: {
    flexDirection: "row",
    padding: 18,
    minHeight: 220,
  },

  logoSection: {
    width: 145,
    alignItems: "center",
    justifyContent: "center",
  },

  logoBox: {
    width: 105,
    height: 105,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 5,
  },

  titleSection: {
    flex: 1,
    paddingLeft: 18,
    justifyContent: "center",
  },

  fundingName: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    color: COLORS.text,
  },

  provider: {
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.secondaryText,
    marginTop: 7,
  },

  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 14,
  },

  fieldBadge: {
    backgroundColor: COLORS.greenBackground,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },

  fieldBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.greenText,
  },

  typeBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },

  typeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },

  informationSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 18,
  },

  detailRow: {
    flexDirection: "row",
    paddingVertical: 17,
  },

  detailIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  detailContent: {
    flex: 1,
  },

  detailTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },

  detailText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.secondaryText,
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  applyButton: {
    height: 54,
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  applyButtonPressed: {
    opacity: 0.8,
  },

  applyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },

  noteBox: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginTop: 18,
  },

  noteContent: {
    flex: 1,
    marginLeft: 9,
  },

  noteTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 4,
  },

  noteText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#1E40AF",
  },

  shareButton: {
    height: 54,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  shareText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
  },
});
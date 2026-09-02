/**
 * "How to Navigate" screen — video tutorial section.
 */
import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TEAL       = "#14B8A6";
const TEAL_DARK  = "#0A7A7C";
const TEAL_LIGHT = "#E8FAF7";
const DARK       = "#111B4A";
const GREY       = "#697397";
const WHITE      = "#FFFFFF";

// ── Video map — each key matches the card title exactly ──────
const LOCAL_VIDEOS: Record<string, any> = {
  "How to Navigate IKAMVA HUB":      require("../assets/videos/Kamo.mp4"),
  "How to Apply for High Schools":   require("../assets/videos/Sino.mp4"),
  "How to Use the APS Calculator":   require("../assets/videos/Owam.mp4"),
  "Finding the Right Career Path":   require("../assets/videos/Kea.mp4"),
  "Connecting with a Mentor":        require("../assets/videos/Sena.mp4"),
  "How to Find Bursaries":           require("../assets/videos/Phila.mp4"),
};

// ── Thumbnail designs — unique per video topic ───────────────
function VideoThumbnail({ title }: { title: string }) {
  const configs: Record<string, {
    bg: string; accent: string; icon: any; label: string; emoji: string;
  }> = {
    "How to Navigate IKAMVA HUB": {
      bg: "#0A7A7C", accent: "#14B8A6", icon: "compass", label: "App Tour", emoji: "🧭",
    },
    "How to Apply for High Schools": {
      bg: "#1E40AF", accent: "#3B82F6", icon: "school", label: "Schools", emoji: "🏫",
    },
    "How to Use the APS Calculator": {
      bg: "#92400E", accent: "#F59E0B", icon: "calculator", label: "APS Score", emoji: "🧮",
    },
    "Finding the Right Career Path": {
      bg: "#065F46", accent: "#10B981", icon: "briefcase", label: "Careers", emoji: "💼",
    },
    "Connecting with a Mentor": {
      bg: "#4C1D95", accent: "#8B5CF6", icon: "people", label: "Mentors", emoji: "🤝",
    },
    "How to Find Bursaries": {
      bg: "#9F1239", accent: "#F43F5E", icon: "cash", label: "Bursaries", emoji: "💰",
    },
  };

  const cfg = configs[title] ?? {
    bg: "#0A7A7C", accent: "#14B8A6", icon: "play-circle", label: "Tutorial", emoji: "▶",
  };

  return (
    <View style={[tn.root, { backgroundColor: cfg.bg }]}>
      {/* Top-left badge */}
      <View style={[tn.badge, { backgroundColor: cfg.accent + "33", borderColor: cfg.accent + "66" }]}>
        <Text style={[tn.badgeText, { color: cfg.accent }]}>{cfg.label}</Text>
      </View>

      {/* Centre icon circle */}
      <View style={[tn.iconCircle, { backgroundColor: cfg.accent + "25" }]}>
        <Ionicons name={cfg.icon as any} size={38} color={cfg.accent} />
      </View>

      {/* Emoji watermark bottom-right */}
      <Text style={tn.emoji}>{cfg.emoji}</Text>

      {/* Decorative dots */}
      <View style={[tn.dot1, { backgroundColor: cfg.accent + "30" }]} />
      <View style={[tn.dot2, { backgroundColor: cfg.accent + "18" }]} />

      {/* Play overlay */}
      <View style={tn.playOverlay}>
        <Ionicons name="play" size={18} color="#fff" />
      </View>
    </View>
  );
}

const tn = StyleSheet.create({
  root: {
    width: "100%", height: 150,
    alignItems: "center", justifyContent: "center",
    overflow: "hidden", position: "relative",
  },
  badge: {
    position: "absolute", top: 10, left: 10,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1,
  },
  badgeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  iconCircle: {
    width: 76, height: 76, borderRadius: 38,
    alignItems: "center", justifyContent: "center",
  },
  emoji: {
    position: "absolute", bottom: 8, right: 12,
    fontSize: 30, opacity: 0.35,
  },
  dot1: {
    position: "absolute", width: 90, height: 90, borderRadius: 45,
    top: -30, right: -20,
  },
  dot2: {
    position: "absolute", width: 60, height: 60, borderRadius: 30,
    bottom: -20, left: -10,
  },
  playOverlay: {
    position: "absolute", bottom: 10, right: 10,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.3)",
  },
});

type VideoItem = {
  title:       string;
  description: string;
  duration:    string;
  icon:        any;
  url:         string;
};

const VIDEO_ITEMS: VideoItem[] = [
  {
    title:       "How to Navigate IKAMVA HUB",
    description: "A complete walkthrough of all features — schools, mentors, universities, bursaries and more.",
    duration:    "Watch now",
    icon:        "play-circle-outline",
    url:         "",
  },
  {
    title:       "How to Apply for High Schools",
    description: "Step-by-step guide on how to search for schools, view subjects, facilities and contact details.",
    duration:    "Watch now",
    icon:        "school-outline",
    url:         "",
  },
  {
    title:       "How to Use the APS Calculator",
    description: "Step-by-step guide to calculating your APS and finding qualifying courses.",
    duration:    "Watch now",
    icon:        "calculator-outline",
    url:         "",
  },
  {
    title:       "Finding the Right Career Path",
    description: "Learn how to use the Careers section to explore your future.",
    duration:    "Watch now",
    icon:        "briefcase-outline",
    url:         "",
  },
  {
    title:       "Connecting with a Mentor",
    description: "How to find a mentor in your field and send them a message.",
    duration:    "Watch now",
    icon:        "people-outline",
    url:         "",
  },
  {
    title:       "How to Find Bursaries",
    description: "Browse and filter hundreds of bursaries to fund your studies.",
    duration:    "Watch now",
    icon:        "cash-outline",
    url:         "",
  },
];

export default function HowToNavigate() {
  const [playingTitle, setPlayingTitle] = useState<string | null>(null);
  const videoRef = useRef<Video>(null);

  const handlePress = (item: VideoItem) => {
    const localSource = LOCAL_VIDEOS[item.title];
    if (localSource) {
      // Open inline player modal
      setPlayingTitle(item.title);
      return;
    }
    if (item.url) {
      Linking.openURL(item.url);
      return;
    }
    alert(`"${item.title}"\n\nThis tutorial video is coming soon!`);
  };

  const closePlayer = async () => {
    await videoRef.current?.pauseAsync().catch(() => {});
    setPlayingTitle(null);
  };

  const playingItem = VIDEO_ITEMS.find((v) => v.title === playingTitle);
  const playingSource = playingTitle ? LOCAL_VIDEOS[playingTitle] : null;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={TEAL_DARK} />

      {/* ── Header ────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={WHITE} />
        </TouchableOpacity>
        <View style={s.headerText}>
          <Text style={s.headerTitle}>How to Navigate</Text>
          <Text style={s.headerSub}>Video tutorials for IKAMVA HUB</Text>
        </View>
        <TouchableOpacity style={s.iconBtn} onPress={() => router.replace("/(tabs)/home" as any)}>
          <Ionicons name="home-outline" size={20} color={WHITE} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={s.banner}>
          <Ionicons name="videocam-outline" size={22} color={TEAL_DARK} />
          <Text style={s.bannerText}>
            All tutorial videos are ready. Tap any card to watch in full screen.
          </Text>
        </View>

        {VIDEO_ITEMS.map((vid) => {
          const hasLocalVideo = !!LOCAL_VIDEOS[vid.title];
          const hasUrl        = !!vid.url;
          const isAvailable   = hasLocalVideo || hasUrl;

          return (
            <TouchableOpacity
              key={vid.title}
              style={[s.card, isAvailable && s.cardAvailable]}
              activeOpacity={0.85}
              onPress={() => handlePress(vid)}
            >
              {/* Thumbnail — unique design per video */}
              <View style={{ position: "relative" }}>
                <VideoThumbnail title={vid.title} />
                {/* Duration badge — absolute over thumbnail bottom-left */}
                <View style={s.durationBadge}>
                  <Ionicons name={isAvailable ? "play-circle" : "time-outline"} size={11} color={isAvailable ? TEAL : GREY} />
                  <Text style={[s.durationText, isAvailable && { color: TEAL, fontWeight: "700" }]}>{vid.duration}</Text>
                </View>
              </View>

              {/* Info */}
              <View style={s.cardInfo}>
                <View style={[s.iconBadge, { backgroundColor: TEAL + "18" }]}>
                  <Ionicons name={vid.icon} size={18} color={TEAL} />
                </View>
                <Text style={s.cardTitle}>{vid.title}</Text>
                <Text style={s.cardDesc}>{vid.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Full-screen video player modal ─────────────────── */}
      {playingSource && (
        <Modal
          visible={!!playingTitle}
          animationType="fade"
          transparent={false}
          onRequestClose={closePlayer}
        >
          <View style={s.playerRoot}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Close button */}
            <TouchableOpacity style={s.playerClose} onPress={closePlayer}>
              <Ionicons name="close" size={28} color={WHITE} />
            </TouchableOpacity>

            {/* Title */}
            <Text style={s.playerTitle} numberOfLines={2}>
              {playingItem?.title}
            </Text>

            {/* Video — fills entire screen */}
            <Video
              ref={videoRef}
              source={playingSource}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              shouldPlay
            />

            {/* Description */}
            {playingItem?.description ? (
              <Text style={s.playerDesc}>{playingItem.description}</Text>
            ) : null}
          </View>
        </Modal>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFA" },

  header: {
    backgroundColor: TEAL_DARK, paddingTop: 52, paddingBottom: 18,
    paddingHorizontal: 18, flexDirection: "row", alignItems: "center", gap: 12,
  },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  headerText:  { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "900", color: WHITE },
  headerSub:   { fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 },

  scroll: { padding: 16 },

  banner: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: TEAL_LIGHT, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#B2E8E4", marginBottom: 20,
  },
  bannerText: { flex: 1, fontSize: 13, color: TEAL_DARK, lineHeight: 19 },

  card: {
    backgroundColor: WHITE, borderRadius: 16, marginBottom: 16,
    borderWidth: 1, borderColor: "#EBEBEB", overflow: "hidden",
    elevation: 3, shadowColor: "#000", shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 5,
  },
  cardAvailable: {
    borderColor: TEAL,
  },

  thumb: {
    height: 150, alignItems: "center", justifyContent: "center",
    borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  playCircle: {
    width: 58, height: 58, borderRadius: 29,
    alignItems: "center", justifyContent: "center",
  },
  durationBadge: {
    position: "absolute", bottom: 10, right: 12,
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  durationText: { fontSize: 11, color: GREY, fontWeight: "600" },

  cardInfo:  { padding: 16 },
  iconBadge: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  cardTitle: { fontSize: 15, fontWeight: "800", color: DARK, marginBottom: 5 },
  cardDesc:  { fontSize: 13, color: GREY, lineHeight: 19 },

  note: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: TEAL_LIGHT, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: "#B2E8E4", marginTop: 4,
  },
  noteText: { flex: 1, fontSize: 12, color: TEAL_DARK, lineHeight: 18 },

  // ── Video Player Modal ───────────────────────────────────
  playerRoot: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  playerClose: {
    position: "absolute", top: 52, right: 20,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
    zIndex: 10,
  },
  playerTitle: {
    position: "absolute", top: 56, left: 20, right: 70,
    fontSize: 16, fontWeight: "800", color: WHITE, zIndex: 10,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  playerDesc: {
    position: "absolute", bottom: 40, left: 20, right: 20,
    fontSize: 13, color: "rgba(255,255,255,0.75)",
    textAlign: "center", lineHeight: 19,
  },
});

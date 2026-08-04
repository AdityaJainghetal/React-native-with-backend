import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// Optional: expo-speech-recognition or @react-native-voice/voice for voice search
// import Voice from "@react-native-voice/voice";

const { width } = Dimensions.get("window");
const API_BASE_URL = "https://bharat-pay-3.onrender.com"; // change to your backend
const HINTS_URL = `${API_BASE_URL}/api/uservideo/search/hints`;

export default function Navbar({ onMenuPress, points = 0 }) {
  const navigation = useNavigation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [hints, setHints] = useState([]);
  const [showHints, setShowHints] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Check login
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(Boolean(token));
      if (token) fetchProfile(token);
    };
    checkAuth();
  }, []);

  const fetchProfile = async (token) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user || res.data);
    } catch (err) {
      if (err.response?.status === 401) handleSignOut();
    } finally {
      setLoading(false);
    }
  };

  // Search hints
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setHints([]);
      setShowHints(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(HINTS_URL, { params: { q } });
        const data = res.data?.data || res.data?.hints || res.data || [];
        setHints(Array.isArray(data) ? data : []);
        setShowHints(true);
      } catch {
        setHints([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = useCallback(
    (query) => {
      const q = (typeof query === "string" ? query : searchQuery).trim();
      if (!q) return;
      setShowHints(false);
      setIsListening(false);
      navigation.navigate("Search", { q });
    },
    [searchQuery, navigation],
  );

  const handleMicClick = () => {
    // Voice search placeholder
    // Install @react-native-voice/voice or expo-speech for real implementation
    Alert.alert(
      "Voice Search",
      "Install @react-native-voice/voice for voice search support.",
    );
  };

  const handleSignOut = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        await axios
          .post(
            `${API_BASE_URL}/api/logout`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          )
          .catch(() => {});
      }
    } catch {
    } finally {
      await AsyncStorage.multiRemove(["token", "user"]);
      setUser(null);
      setIsLoggedIn(false);
      setIsDropdownOpen(false);
      navigation.navigate("Login");
    }
  };

  const onHintClick = (hint) => {
    const text =
      typeof hint === "string"
        ? hint
        : hint.text || hint.title || hint.name || "";
    setSearchQuery(text);
    setShowHints(false);
    handleSearch(text);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <View style={styles.navbar}>
        {/* Left */}
        <View style={styles.left}>
          <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn}>
            <Text style={styles.icon}>☰</Text>
          </TouchableOpacity>

          <Text style={styles.logo}>Vidoo</Text>

          <View style={styles.pointsBadge}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.pointsText}>{Number(points).toFixed(1)}</Text>
            <Text style={styles.ptsLabel}>pts</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              isListening && { borderColor: "#ef4444" },
            ]}
            placeholder={isListening ? "Listening..." : "Search"}
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch()}
            onFocus={() =>
              searchQuery.trim() && hints.length > 0 && setShowHints(true)
            }
          />
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => handleSearch()}
          >
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Right */}
        <View style={styles.right}>
          <TouchableOpacity onPress={handleMicClick} style={styles.iconBtn}>
            <Text style={styles.icon}>{isListening ? "🎤" : "🎙️"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("UploadVideo")}
            style={styles.iconBtn}
          >
            <Text style={styles.icon}>＋</Text>
          </TouchableOpacity>

          {isLoggedIn ? (
            <TouchableOpacity
              onPress={() => setIsDropdownOpen(true)}
              style={styles.avatarBtn}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <Text style={styles.avatarText}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.signInBtn}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Hints Dropdown */}
      {showHints && hints.length > 0 && (
        <View style={styles.hintsBox}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {hints.map((hint, i) => {
              const text =
                typeof hint === "string"
                  ? hint
                  : hint.text || hint.title || hint.name || "";
              const type = hint.type || "";
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.hintItem}
                  onPress={() => onHintClick(hint)}
                >
                  <Text style={styles.hintIcon}>🔍</Text>
                  <Text style={styles.hintText} numberOfLines={1}>
                    {text}
                  </Text>
                  {type ? <Text style={styles.hintType}>{type}</Text> : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Profile Dropdown Modal */}
      <Modal
        visible={isDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={styles.dropdown}>
            {/* User Info */}
            <View style={styles.dropdownHeader}>
              <View style={styles.dropdownAvatar}>
                {user?.avatar ? (
                  <Image
                    source={{ uri: user.avatar }}
                    style={styles.dropdownAvatarImg}
                  />
                ) : (
                  <Text style={styles.dropdownAvatarText}>
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName} numberOfLines={1}>
                  {user?.name || "User"}
                </Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {user?.email || "@username"}
                </Text>
                <Text style={styles.userPoints}>
                  ★ {Number(points).toFixed(0)} pts
                </Text>
                <TouchableOpacity
                  style={styles.viewChannelBtn}
                  onPress={() => {
                    setIsDropdownOpen(false);
                    navigation.navigate("Channel", {
                      handle: user?._id || "me",
                    });
                  }}
                >
                  <Text style={styles.viewChannelText}>View your channel</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Menu Items */}
            <ScrollView style={{ maxHeight: 400 }}>
              <MenuItem
                icon="👤"
                label="My Profile"
                onPress={() => {
                  setIsDropdownOpen(false);
                  navigation.navigate("Profile");
                }}
              />
              <MenuItem
                icon="🎬"
                label="Vidoo Studio"
                onPress={() => {
                  setIsDropdownOpen(false);
                  navigation.navigate("Studio");
                }}
              />

              {/* Settings expandable */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setIsSettingsOpen(!isSettingsOpen)}
              >
                <Text style={styles.menuIcon}>⚙️</Text>
                <Text style={styles.menuLabel}>Settings</Text>
                <Text style={styles.chevron}>{isSettingsOpen ? "▾" : "›"}</Text>
              </TouchableOpacity>

              {isSettingsOpen && (
                <View style={styles.subMenu}>
                  <MenuItem
                    icon="🕐"
                    label="History"
                    small
                    onPress={() => {
                      setIsDropdownOpen(false);
                      navigation.navigate("History");
                    }}
                  />
                  <MenuItem
                    icon="❤️"
                    label="Liked Videos"
                    small
                    onPress={() => {
                      setIsDropdownOpen(false);
                      navigation.navigate("LikedVideos");
                    }}
                  />
                  <MenuItem
                    icon="⏰"
                    label="Watch Later"
                    small
                    onPress={() => {
                      setIsDropdownOpen(false);
                      navigation.navigate("WatchLater");
                    }}
                  />
                  <MenuItem
                    icon="📹"
                    label="Your Videos"
                    small
                    onPress={() => {
                      setIsDropdownOpen(false);
                      navigation.navigate("YourVideos");
                    }}
                  />
                </View>
              )}

              <MenuItem
                icon="💰"
                label="Withdraw Rewards"
                onPress={() => {
                  setIsDropdownOpen(false);
                  navigation.navigate("Withdraw");
                }}
              />
              <MenuItem
                icon="🏆"
                label="Leaderboard"
                onPress={() => {
                  setIsDropdownOpen(false);
                  navigation.navigate("Leaderboard");
                }}
              />

              <View style={styles.divider} />

              <MenuItem icon="❓" label="FAQ" />
              <MenuItem icon="💬" label="Feedback" />
              <MenuItem icon="📞" label="Customer Support" />
              <MenuItem icon="📄" label="Terms and Conditions" />

              <TouchableOpacity
                style={[
                  styles.menuItem,
                  { borderTopWidth: 1, borderTopColor: "#27272a" },
                ]}
                onPress={handleSignOut}
              >
                <Text style={[styles.menuIcon, { color: "#f87171" }]}>🚪</Text>
                <Text style={[styles.menuLabel, { color: "#f87171" }]}>
                  Sign out
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

function MenuItem({ icon, label, onPress, small }) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, small && { paddingLeft: 36 }]}
      onPress={onPress}
    >
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navbar: {
    minHeight: Platform.OS === "ios" ? 64 : 58,
    backgroundColor: "#0f0f0f",
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "ios" ? 20 : 25,
    paddingBottom: 8,
    zIndex: 100,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    padding: 8,
  },
  icon: {
    color: "#fff",
    fontSize: 20,
  },
  logo: {
    color: "#dc2626",
    fontSize: 22,
    fontWeight: "800",
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#272727",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(234,179,8,0.3)",
    gap: 3,
  },
  star: {
    color: "#facc15",
    fontSize: 12,
  },
  pointsText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  ptsLabel: {
    color: "#9ca3af",
    fontSize: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 6,
    maxWidth: 340,
    alignSelf: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#374151",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 8 : 6,
    color: "#fff",
    fontSize: 14,
    minHeight: 34,
  },
  searchBtn: {
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#374151",
    borderLeftWidth: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 14,
    justifyContent: "center",
    minWidth: 42,
  },
  searchIcon: {
    fontSize: 16,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  signInBtn: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  signInText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  // Hints
  hintsBox: {
    position: "absolute",
    top: 56,
    left: 10,
    right: 10,
    backgroundColor: "#212121",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    maxHeight: 280,
    zIndex: 200,
    elevation: 10,
  },
  hintItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  hintIcon: {
    fontSize: 14,
    color: "#9ca3af",
  },
  hintText: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  hintType: {
    color: "#6b7280",
    fontSize: 11,
  },

  // Dropdown
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingRight: 12,
  },
  dropdown: {
    width: width * 0.85,
    maxWidth: 320,
    backgroundColor: "#0f0f0f",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#374151",
    overflow: "hidden",
  },
  dropdownHeader: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
    gap: 12,
  },
  dropdownAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  dropdownAvatarImg: {
    width: "100%",
    height: "100%",
  },
  dropdownAvatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  userEmail: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 2,
  },
  userPoints: {
    color: "#facc15",
    fontSize: 12,
    marginTop: 4,
  },
  viewChannelBtn: {
    marginTop: 8,
    backgroundColor: "#272727",
    paddingVertical: 7,
    borderRadius: 6,
    alignItems: "center",
  },
  viewChannelText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuIcon: {
    fontSize: 18,
    width: 24,
  },
  menuLabel: {
    color: "#e5e5e5",
    fontSize: 14,
    flex: 1,
  },
  chevron: {
    color: "#9ca3af",
    fontSize: 16,
  },
  subMenu: {
    backgroundColor: "#1a1a1a",
  },
  divider: {
    height: 1,
    backgroundColor: "#1f1f1f",
    marginVertical: 4,
  },
});

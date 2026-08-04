import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Optional (recommended):
// import * as ImagePicker from "expo-image-picker";
// import * as DocumentPicker from "expo-document-picker";
// import { Video } from "expo-av";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// API base URLs
const API_BASE = "https://bharat-pay-3.onrender.com/api";
const API_CATEGORY = "https://bharat-pay-3.onrender.com/api/category";
const BACKEND_URL = "https://bharat-pay-3.onrender.com";

// Helpers
const getToken = async () => (await AsyncStorage.getItem("token")) || null;
const getUserId = async () => {
  try {
    const userStr = await AsyncStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return user?.id || user?._id || null;
  } catch {
    return null;
  }
};

const STATIC_CATEGORIES = [
  { _id: "1", name: "Gaming" },
  { _id: "2", name: "Education" },
  { _id: "3", name: "Entertainment" },
  { _id: "4", name: "Music" },
  { _id: "5", name: "Technology" },
  { _id: "6", name: "Sports" },
  { _id: "7", name: "Cooking" },
  { _id: "8", name: "Travel" },
];

export default function ChannelPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const urlHandle = route.params?.handle;

  const [channels, setChannels] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [channel, setChannel] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Videos");
  const [loading, setLoading] = useState(true);

  // Subscription
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  // Create channel modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: "",
    channelDescription: "",
    category: "",
    channelImageFile: null,
    channelImagePreview: "",
    channelBannerFile: null,
    channelBannerPreview: "",
    contactemail: "",
  });
  const [createError, setCreateError] = useState("");

  // Upload video modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedUploadChannelId, setSelectedUploadChannelId] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoname, setVideoname] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoCategory, setVideoCategory] = useState("");
  const [videoType, setVideoType] = useState("short");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Video player modal
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);

  // Helpers
  const getVideoUrl = (videoPath) => {
    if (!videoPath) return "";
    if (videoPath.startsWith("http")) return videoPath;
    return `${BACKEND_URL}/${videoPath.replace(/\\/g, "/")}`;
  };

  const getThumbnailUrl = (thumbnailPath) => {
    if (!thumbnailPath) {
      return "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=450&fit=crop";
    }
    if (thumbnailPath.startsWith("http")) return thumbnailPath;
    return `${BACKEND_URL}/${thumbnailPath.replace(/\\/g, "/")}`;
  };

  const parseDurationToSeconds = (value) => {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return null;
      const directNumber = Number(trimmed);
      if (!Number.isNaN(directNumber)) return directNumber;

      const colonParts = trimmed.split(":").map((p) => p.trim());
      if (colonParts.length === 2) {
        const [mins, secs] = colonParts.map(Number);
        if (!Number.isNaN(mins) && !Number.isNaN(secs)) return mins * 60 + secs;
      }
      if (colonParts.length === 3) {
        const [hrs, mins, secs] = colonParts.map(Number);
        if (!Number.isNaN(hrs) && !Number.isNaN(mins) && !Number.isNaN(secs)) {
          return hrs * 3600 + mins * 60 + secs;
        }
      }
    }
    return null;
  };

  const formatDuration = (value) => {
    const seconds = parseDurationToSeconds(value);
    if (seconds === null) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await fetch(API_CATEGORY);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(
          Array.isArray(data) && data.length > 0 ? data : STATIC_CATEGORIES,
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(STATIC_CATEGORIES);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch user's channels
  useEffect(() => {
    const fetchUserChannels = async () => {
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/uservideo/channel`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch channels");

        const data = await res.json();
        const userChannels = data.channels || [];
        setChannels(userChannels);

        let initialChannelId = null;
        if (urlHandle) {
          const matched = userChannels.find(
            (ch) =>
              ch.name?.replace(/\s+/g, "").toLowerCase() ===
              urlHandle.toLowerCase(),
          );
          if (matched) initialChannelId = matched._id;
        }

        if (!initialChannelId && userChannels.length > 0) {
          initialChannelId = userChannels[0]._id;
        }

        setSelectedChannelId(initialChannelId);
      } catch (err) {
        console.error("Error fetching channels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserChannels();
  }, [urlHandle]);

  // Fetch selected channel + videos
  useEffect(() => {
    if (!selectedChannelId) return;

    const fetchChannelVideos = async () => {
      const token = await getToken();
      if (!token) return;

      try {
        const selected = channels.find((c) => c._id === selectedChannelId);
        if (!selected) return;

        const videosRes = await fetch(
          `${API_BASE}/uservideo/channel/${selectedChannelId}/videos`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        let videos = [];
        if (videosRes.ok) {
          const result = await videosRes.json();
          videos = result.videos || [];
        }

        const cleanHandle = selected.name?.replace(/\s+/g, "") || selected._id;

        const channelData = {
          ...selected,
          handle: `@${cleanHandle}`,
          avatar:
            selected.channelImage ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
          banner:
            selected.channelBanner ||
            "https://images.unsplash.com/photo-1557683316-973673baf926?w=1600",
          description:
            selected.channeldescription || "No description available",
          videos,
          videosCount: videos.length,
        };

        setChannel(channelData);
        setSubscribersCount(selected.subscribedBy?.length || 0);

        const userId = await getUserId();
        setIsSubscribed(selected.subscribedBy?.includes(userId) || false);

        // Update route params if needed
        // navigation.setParams({ handle: cleanHandle });
      } catch (err) {
        console.error("Error fetching channel/videos:", err);
      }
    };

    fetchChannelVideos();
  }, [selectedChannelId, channels]);

  useEffect(() => {
    if (!loading && !showCreateModal && (!channel || channels.length === 0)) {
      setShowCreateModal(true);
    }
  }, [loading, channel, channels.length]);

  // Subscribe / Unsubscribe
  const handleSubscription = async () => {
    if (!selectedChannelId) return;

    const token = await getToken();
    if (!token) {
      Alert.alert("Login required", "Please login to subscribe");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/uservideo/subscribe/${selectedChannelId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Subscription failed");

      setIsSubscribed(result.subscribed);
      setSubscribersCount(result.subscribersCount);

      setChannel((prev) => ({
        ...prev,
        subscribers: result.subscribersCount,
      }));
    } catch (error) {
      console.error("Subscription error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  const handleChannelChange = (channelId) => {
    setSelectedChannelId(channelId);
  };

  // Image picker helper (using expo-image-picker recommended)
  const pickImage = async (field) => {
    // Uncomment when using expo-image-picker:
    /*
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setNewChannel((prev) => ({
        ...prev,
        [`${field}File`]: {
          uri: asset.uri,
          type: asset.mimeType || "image/jpeg",
          name: asset.fileName || `${field}.jpg`,
        },
        [`${field}Preview`]: asset.uri,
      }));
    }
    */
    Alert.alert(
      "Info",
      "Image picker not configured. Install expo-image-picker.",
    );
  };

  const handleCreateChannel = async () => {
    const token = await getToken();

    if (!token) {
      setCreateError("Please login first.");
      return;
    }
    if (!newChannel.name.trim()) {
      setCreateError("Channel name is required");
      return;
    }
    if (!newChannel.category) {
      setCreateError("Please select a category");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newChannel.name.trim());
      formData.append(
        "channeldescription",
        newChannel.channelDescription || "",
      );
      formData.append("category", newChannel.category);
      formData.append("contactemail", newChannel.contactemail || "");

      if (newChannel.channelImageFile) {
        formData.append("channelImage", newChannel.channelImageFile);
      }
      if (newChannel.channelBannerFile) {
        formData.append("channelBanner", newChannel.channelBannerFile);
      }

      const response = await fetch(`${API_BASE}/uservideo/createchannel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to create channel");
      }

      // Refetch channels
      const channelsRes = await fetch(`${API_BASE}/uservideo/channel`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (channelsRes.ok) {
        const data = await channelsRes.json();
        setChannels(data.channels || []);
        setSelectedChannelId(result.channel._id);
      }

      setShowCreateModal(false);
      setNewChannel({
        name: "",
        channelDescription: "",
        category: "",
        channelImageFile: null,
        channelImagePreview: "",
        channelBannerFile: null,
        channelBannerPreview: "",
        contactemail: "",
      });

      Alert.alert("Success", "Channel created successfully!");
    } catch (error) {
      console.error("Channel creation error:", error);
      setCreateError(error.message || "Failed to create channel.");
    }
  };

  // Video file picker
  const pickVideo = async () => {
    // Uncomment with expo-document-picker or expo-image-picker (videos)
    /*
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setVideoFile({
        uri: asset.uri,
        type: asset.mimeType || "video/mp4",
        name: asset.name || "video.mp4",
      });
      setVideoPreview(asset.name);
    }
    */
    Alert.alert(
      "Info",
      "Video picker not configured. Install expo-document-picker.",
    );
  };

  const pickThumbnail = async () => {
    // Same as pickImage logic
    Alert.alert("Info", "Thumbnail picker not configured.");
  };

  const handleUploadVideo = async () => {
    const token = await getToken();

    if (!token) {
      setUploadError("Please login first.");
      return;
    }
    if (!selectedUploadChannelId) {
      setUploadError("Please select a channel");
      return;
    }
    if (!videoFile) {
      setUploadError("Please select a video file");
      return;
    }
    if (!videoname.trim()) {
      setUploadError("Please enter a video name");
      return;
    }
    if (!videoCategory) {
      setUploadError("Please select a video category");
      return;
    }
    if (!agreeTerms) {
      setUploadError("Please agree to the terms");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");

      const formData = new FormData();
      formData.append("name", videoname.trim());
      formData.append("description", videoDescription || "");
      formData.append("category", videoCategory);
      formData.append("videoType", videoType);
      formData.append("video", videoFile);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const response = await fetch(
        `${API_BASE}/uservideo/upload/${selectedUploadChannelId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Failed to upload video",
        );
      }

      Alert.alert("Success", "Video uploaded successfully!");

      // Refresh videos
      const videosRes = await fetch(
        `${API_BASE}/uservideo/channel/${selectedChannelId}/videos`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (videosRes.ok) {
        const data = await videosRes.json();
        setChannel((prev) => ({
          ...prev,
          videos: data.videos || [],
          videosCount: data.videos?.length || 0,
        }));
      }

      // Reset form
      setShowUploadModal(false);
      setVideoFile(null);
      setVideoPreview("");
      setThumbnailFile(null);
      setThumbnailPreview("");
      setVideoname("");
      setVideoDescription("");
      setVideoCategory("");
      setVideoType("short");
      setAgreeTerms(false);
      setSelectedUploadChannelId("");
    } catch (error) {
      console.error("Video upload error:", error);
      setUploadError(
        error.message || "Failed to upload video. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handlePlayVideo = (video) => {
    setCurrentVideo(video);
    setVideoDuration(null);
    setShowVideoPlayer(true);
  };

  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
    setCurrentVideo(null);
    setVideoDuration(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>Loading channels...</Text>
      </View>
    );
  }

  const currentChannel = channel || {
    name: "Your channel",
    handle: "@yourchannel",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    banner: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1600",
    description: "Create your channel to get started.",
    videos: [],
    category: { name: "" },
  };

  const tabs = ["Videos", "Playlists", "Posts"];

  const renderVideoItem = ({ item: video }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => handlePlayVideo(video)}
      activeOpacity={0.85}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: getThumbnailUrl(video.thumbnail) }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
      </View>
      <Text style={styles.videoTitle} numberOfLines={2}>
        {video.title || video.name}
      </Text>
      <Text style={styles.videoMeta}>
        {video.views?.toLocaleString() || 0} views •{" "}
        {video.uploaded || "recent"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: currentChannel.banner }}
            style={styles.banner}
            resizeMode="cover"
          />
        </View>

        {/* Profile Header */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: currentChannel.avatar }}
            style={styles.avatar}
          />

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate("CustomizeChannel")}
            >
              <Text style={styles.btnText}>✏️ Customize</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.greenBtn}
              onPress={() => setShowUploadModal(true)}
            >
              <Text style={styles.btnText}>📹 Upload</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.blueBtn}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.btnText}>＋ Create</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Channel Info */}
        <View style={styles.infoSection}>
          <Text style={styles.channelName}>{currentChannel.name}</Text>

          <View style={styles.metaRow}>
            {currentChannel.handle && (
              <Text style={styles.handle}>{currentChannel.handle}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.subscribeBtn,
                isSubscribed ? styles.subscribedBtn : styles.notSubscribedBtn,
              ]}
              onPress={handleSubscription}
            >
              <Text style={styles.subscribeText}>
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.subscribers}>
              {subscribersCount.toLocaleString()} subscribers
            </Text>

            {currentChannel.category?.name ? (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {currentChannel.category.name}
                </Text>
              </View>
            ) : null}
          </View>

          {currentChannel.description ? (
            <Text style={styles.description}>{currentChannel.description}</Text>
          ) : null}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={styles.tab}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
                {activeTab === tab && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Channel Switcher */}
        {channels.length > 0 && (
          <View style={styles.switcher}>
            <Text style={styles.switcherLabel}>Switch channel</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {channels.map((ch) => (
                <TouchableOpacity
                  key={ch._id}
                  style={[
                    styles.channelChip,
                    selectedChannelId === ch._id && styles.channelChipActive,
                  ]}
                  onPress={() => handleChannelChange(ch._id)}
                >
                  <Text
                    style={[
                      styles.channelChipText,
                      selectedChannelId === ch._id &&
                        styles.channelChipTextActive,
                    ]}
                  >
                    {ch.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "Videos" && (
            <>
              {currentChannel.videos?.length > 0 ? (
                <FlatList
                  data={currentChannel.videos}
                  keyExtractor={(item) => item._id}
                  renderItem={renderVideoItem}
                  numColumns={2}
                  columnWrapperStyle={styles.videoRow}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={styles.emptyText}>No videos yet</Text>
              )}
            </>
          )}

          {activeTab === "Playlists" && (
            <Text style={styles.emptyText}>No playlists created yet</Text>
          )}

          {activeTab === "Posts" && (
            <Text style={styles.emptyText}>No community posts yet</Text>
          )}
        </View>
      </ScrollView>

      {/* ========== VIDEO PLAYER MODAL ========== */}
      <Modal
        visible={showVideoPlayer}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseVideoPlayer}
      >
        <SafeAreaView style={styles.playerContainer}>
          <View style={styles.playerHeader}>
            <Text style={styles.playerTitle} numberOfLines={1}>
              {currentVideo?.title || currentVideo?.name}
            </Text>
            <TouchableOpacity onPress={handleCloseVideoPlayer}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Replace with expo-av Video component */}
          <View style={styles.videoBox}>
            <Text style={styles.videoPlaceholder}>
              Video Player{"\n"}
              (Install expo-av and use Video component)
            </Text>
            {/* 
            <Video
              source={{ uri: getVideoUrl(currentVideo?.videofile || currentVideo?.videoUrl) }}
              style={{ width: "100%", height: 250 }}
              useNativeControls
              resizeMode="contain"
              shouldPlay
              onLoad={(status) => {
                if (status.durationMillis) {
                  setVideoDuration(status.durationMillis / 1000);
                }
              }}
            />
            */}
          </View>

          <View style={styles.playerInfo}>
            <Text style={styles.playerMeta}>
              {currentVideo?.views?.toLocaleString() || 0} views •{" "}
              {currentVideo?.createdAt
                ? new Date(currentVideo.createdAt).toLocaleDateString()
                : ""}{" "}
              • Duration:{" "}
              {formatDuration(currentVideo?.duration || videoDuration)}
            </Text>
            {currentVideo?.description ? (
              <Text style={styles.playerDesc}>{currentVideo.description}</Text>
            ) : null}
          </View>
        </SafeAreaView>
      </Modal>

      {/* ========== CREATE CHANNEL MODAL ========== */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Create a new channel</Text>

              {createError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{createError}</Text>
                </View>
              ) : null}

              <Text style={styles.label}>Channel name *</Text>
              <TextInput
                style={styles.input}
                value={newChannel.name}
                onChangeText={(text) =>
                  setNewChannel({ ...newChannel, name: text })
                }
                placeholder="My Awesome Channel"
                placeholderTextColor="#6b7280"
              />

              <Text style={styles.label}>Category *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 12 }}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat._id}
                    style={[
                      styles.categoryChip,
                      newChannel.category === cat._id &&
                        styles.categoryChipActive,
                    ]}
                    onPress={() =>
                      setNewChannel({ ...newChannel, category: cat._id })
                    }
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        newChannel.category === cat._id &&
                          styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Channel Image (avatar)</Text>
              <TouchableOpacity
                style={styles.fileBtn}
                onPress={() => pickImage("channelImage")}
              >
                <Text style={styles.fileBtnText}>
                  {newChannel.channelImagePreview
                    ? "Change Image"
                    : "Select Image"}
                </Text>
              </TouchableOpacity>
              {newChannel.channelImagePreview ? (
                <Image
                  source={{ uri: newChannel.channelImagePreview }}
                  style={styles.previewAvatar}
                />
              ) : null}

              <Text style={styles.label}>Channel Banner</Text>
              <TouchableOpacity
                style={styles.fileBtn}
                onPress={() => pickImage("channelBanner")}
              >
                <Text style={styles.fileBtnText}>
                  {newChannel.channelBannerPreview
                    ? "Change Banner"
                    : "Select Banner"}
                </Text>
              </TouchableOpacity>
              {newChannel.channelBannerPreview ? (
                <Image
                  source={{ uri: newChannel.channelBannerPreview }}
                  style={styles.previewBanner}
                />
              ) : null}

              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newChannel.channelDescription}
                onChangeText={(text) =>
                  setNewChannel({ ...newChannel, channelDescription: text })
                }
                placeholder="Tell people about your channel..."
                placeholderTextColor="#6b7280"
                multiline
              />

              <Text style={styles.label}>Contact email (optional)</Text>
              <TextInput
                style={styles.input}
                value={newChannel.contactemail}
                onChangeText={(text) =>
                  setNewChannel({ ...newChannel, contactemail: text })
                }
                placeholder="example@email.com"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowCreateModal(false)}
                >
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.createBtn}
                  onPress={handleCreateChannel}
                >
                  <Text style={styles.btnText}>Create channel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========== UPLOAD VIDEO MODAL ========== */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Upload Video</Text>

              {uploadError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{uploadError}</Text>
                </View>
              ) : null}

              <Text style={styles.label}>Upload to channel *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 12 }}
              >
                {channels.map((ch) => (
                  <TouchableOpacity
                    key={ch._id}
                    style={[
                      styles.categoryChip,
                      selectedUploadChannelId === ch._id &&
                        styles.categoryChipActive,
                    ]}
                    onPress={() => setSelectedUploadChannelId(ch._id)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedUploadChannelId === ch._id &&
                          styles.categoryChipTextActive,
                      ]}
                    >
                      {ch.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Video file *</Text>
              <TouchableOpacity style={styles.fileBtn} onPress={pickVideo}>
                <Text style={styles.fileBtnText}>
                  {videoPreview ? videoPreview : "Select Video"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Video Type</Text>
              <View style={styles.typeRow}>
                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    videoType === "short" && styles.typeBtnActive,
                  ]}
                  onPress={() => setVideoType("short")}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      videoType === "short" && styles.typeBtnTextActive,
                    ]}
                  >
                    Short
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    videoType === "long" && styles.typeBtnActive,
                  ]}
                  onPress={() => setVideoType("long")}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      videoType === "long" && styles.typeBtnTextActive,
                    ]}
                  >
                    Long
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Thumbnail (optional)</Text>
              <TouchableOpacity style={styles.fileBtn} onPress={pickThumbnail}>
                <Text style={styles.fileBtnText}>
                  {thumbnailPreview ? "Change Thumbnail" : "Select Thumbnail"}
                </Text>
              </TouchableOpacity>
              {thumbnailPreview ? (
                <Image
                  source={{ uri: thumbnailPreview }}
                  style={styles.previewBanner}
                />
              ) : null}

              <Text style={styles.label}>Video Title *</Text>
              <TextInput
                style={styles.input}
                value={videoname}
                onChangeText={setVideoname}
                placeholder="Enter video title"
                placeholderTextColor="#6b7280"
              />

              <Text style={styles.label}>Video Category *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 12 }}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat._id}
                    style={[
                      styles.categoryChip,
                      videoCategory === cat._id && styles.categoryChipActive,
                    ]}
                    onPress={() => setVideoCategory(cat._id)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        videoCategory === cat._id &&
                          styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={videoDescription}
                onChangeText={setVideoDescription}
                placeholder="Describe your video..."
                placeholderTextColor="#6b7280"
                multiline
              />

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAgreeTerms(!agreeTerms)}
              >
                <View
                  style={[
                    styles.checkbox,
                    agreeTerms && styles.checkboxChecked,
                  ]}
                >
                  {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>
                  I agree to the Terms of Service and confirm I own/have rights
                  to this content.
                </Text>
              </TouchableOpacity>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => {
                    setShowUploadModal(false);
                    setUploadError("");
                  }}
                  disabled={uploading}
                >
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.createBtn, uploading && { opacity: 0.6 }]}
                  onPress={handleUploadVideo}
                  disabled={uploading}
                >
                  <Text style={styles.btnText}>
                    {uploading ? "Uploading..." : "Upload"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#9ca3af",
    marginTop: 12,
    fontSize: 16,
  },

  // Banner
  bannerContainer: {
    height: 160,
    backgroundColor: "#1f1f1f",
  },
  banner: {
    width: "100%",
    height: "100%",
  },

  // Profile
  profileSection: {
    paddingHorizontal: 16,
    marginTop: -40,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: "#0f0f0f",
    backgroundColor: "#1f1f1f",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    flex: 1,
    marginLeft: 12,
  },
  secondaryBtn: {
    backgroundColor: "#272727",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  greenBtn: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  blueBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  // Info
  infoSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  channelName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  handle: {
    color: "#9ca3af",
    fontSize: 15,
  },
  subscribeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  notSubscribedBtn: {
    backgroundColor: "#dc2626",
  },
  subscribedBtn: {
    backgroundColor: "#3f3f46",
  },
  subscribeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  subscribers: {
    color: "#9ca3af",
    fontSize: 14,
  },
  categoryBadge: {
    backgroundColor: "#27272a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3f3f46",
  },
  categoryText: {
    color: "#d1d5db",
    fontSize: 12,
  },
  description: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 12,
    lineHeight: 20,
  },

  // Tabs
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
    marginTop: 20,
    paddingHorizontal: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "relative",
  },
  tabText: {
    color: "#9ca3af",
    fontSize: 15,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: "#fff",
  },

  // Switcher
  switcher: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  switcherLabel: {
    color: "#9ca3af",
    fontSize: 13,
    marginBottom: 8,
  },
  channelChip: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#3f3f46",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  channelChipActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  channelChipText: {
    color: "#d1d5db",
    fontSize: 13,
  },
  channelChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  // Videos
  tabContent: {
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  videoRow: {
    justifyContent: "space-between",
  },
  videoCard: {
    width: (width - 36) / 2,
    marginBottom: 18,
  },
  thumbnailContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 2,
  },
  videoTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 8,
  },
  videoMeta: {
    color: "#9ca3af",
    fontSize: 11,
    marginTop: 3,
  },
  emptyText: {
    color: "#9ca3af",
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 40,
  },

  // Player Modal
  playerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  playerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    marginRight: 12,
  },
  closeBtn: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "300",
  },
  videoBox: {
    width: "100%",
    height: 250,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholder: {
    color: "#6b7280",
    textAlign: "center",
  },
  playerInfo: {
    padding: 16,
    backgroundColor: "#1a1a1a",
  },
  playerMeta: {
    color: "#9ca3af",
    fontSize: 13,
  },
  playerDesc: {
    color: "#d1d5db",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: "rgba(239,68,68,0.15)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: "#f87171",
    fontSize: 13,
  },
  label: {
    color: "#d1d5db",
    fontSize: 13,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#0f0f0f",
    borderWidth: 1,
    borderColor: "#3f3f46",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  fileBtn: {
    backgroundColor: "#0f0f0f",
    borderWidth: 1,
    borderColor: "#3f3f46",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  fileBtnText: {
    color: "#60a5fa",
    fontSize: 14,
  },
  previewAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: 8,
  },
  previewBanner: {
    width: "100%",
    height: 90,
    borderRadius: 8,
    marginTop: 8,
  },
  categoryChip: {
    backgroundColor: "#0f0f0f",
    borderWidth: 1,
    borderColor: "#3f3f46",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  categoryChipText: {
    color: "#9ca3af",
    fontSize: 13,
  },
  categoryChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  typeRow: {
    flexDirection: "row",
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    borderWidth: 1,
    borderColor: "#3f3f46",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  typeBtnActive: {
    backgroundColor: "#16a34a",
    borderColor: "#16a34a",
  },
  typeBtnText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  typeBtnTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 14,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#6b7280",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  checkboxLabel: {
    color: "#9ca3af",
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  cancelBtn: {
    backgroundColor: "#3f3f46",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
});

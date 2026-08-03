import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");
const BACKEND_URL = "https://bharat-pay-3.onrender.com";
const API_BASE = `${BACKEND_URL}/api/uservideo`;

const FALLBACK_SHORTS = [
  {
    id: "s1",
    title: "Amazing Nature Moments",
    views: "2.6M views",
    likes: "145K",
    comments: "3.2K",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "s2",
    title: "Cute Cats Compilation",
    views: "4.2M views",
    likes: "220K",
    comments: "8.5K",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
];

const normalizeShort = (video = {}) => ({
  id: video._id || video.id || String(Date.now() + Math.random()),
  title: video.title || "Untitled Short",
  views: `${Number(video.views || 0).toLocaleString()} views`,
  likes: Number(video.likesCount ?? video.likes ?? 0).toLocaleString(),
  comments: Number(video.comments || 0).toLocaleString(),
  videoUrl: video.videoUrl
    ? /^https?:\/\//i.test(video.videoUrl)
      ? video.videoUrl.replace(/\\/g, "/")
      : `${BACKEND_URL}/${String(video.videoUrl).replace(/\\/g, "/")}`
    : "https://www.w3schools.com/html/mov_bbb.mp4",
});

const getArrayFromPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.videos)) return payload.videos;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export default function ShortsScreen() {
  const route = useRoute();
  const [shortsData, setShortsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState({});
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef({});

  useEffect(() => {
    const loadShorts = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE}/trending-shorts`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json().catch(() => ({}));
        const list = getArrayFromPayload(data);
        const normalized =
          list.length > 0 ? list.map(normalizeShort) : FALLBACK_SHORTS;

        setShortsData(normalized);

        const selectedVideo = route?.params?.video;
        if (selectedVideo?.id || selectedVideo?._id) {
          const matchIndex = normalized.findIndex(
            (item) =>
              String(item.id) === String(selectedVideo.id ?? selectedVideo._id),
          );
          if (matchIndex >= 0) {
            setCurrentIndex(matchIndex);
          }
        }
      } catch (error) {
        console.warn("Shorts load error:", error);
        setShortsData(FALLBACK_SHORTS);
      } finally {
        setLoading(false);
      }
    };

    loadShorts();
  }, [route?.params?.video?.id, route?.params?.video?._id]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0]?.index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  const renderItem = ({ item, index }) => {
    const isActive = index === currentIndex;

    return (
      <View style={styles.videoContainer}>
        <Video
          ref={(ref) => (videoRefs.current[index] = ref)}
          source={{ uri: item.videoUrl }}
          style={styles.video}
          resizeMode="cover"
          shouldPlay={isActive}
          isLooping
          isMuted={muted}
          useNativeControls={false}
        />

        <View style={styles.overlay} />

        <View style={styles.bottomLeft}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.views}>{item.views}</Text>
          <View style={styles.audioRow}>
            <MaterialCommunityIcons name="music" size={16} color="#fff" />
            <Text style={styles.audioText}>Original Audio</Text>
          </View>
        </View>

        <View style={styles.rightButtons}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => toggleLike(item.id)}
          >
            <Ionicons
              name={liked[item.id] ? "heart" : "heart-outline"}
              size={32}
              color={liked[item.id] ? "#ff2d55" : "#fff"}
            />
            <Text style={styles.iconText}>{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="chatbubble-outline" size={30} color="#fff" />
            <Text style={styles.iconText}>{item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="share-social-outline" size={30} color="#fff" />
            <Text style={styles.iconText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn} onPress={toggleMute}>
            <Ionicons
              name={muted ? "volume-mute" : "volume-high"}
              size={30}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-horizontal" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      ) : (
        <FlatList
          data={shortsData}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={height}
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews
          maxToRenderPerBatch={2}
          windowSize={3}
          initialNumToRender={1}
          getItemLayout={(_, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    width,
    height,
    backgroundColor: "#000",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  bottomLeft: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 100 : 80,
    left: 16,
    right: 100,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  views: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    marginBottom: 6,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  audioText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  rightButtons: {
    position: "absolute",
    right: 12,
    bottom: Platform.OS === "ios" ? 120 : 100,
    alignItems: "center",
    gap: 22,
  },
  iconBtn: {
    alignItems: "center",
  },
  iconText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 3,
    fontWeight: "500",
  },
});

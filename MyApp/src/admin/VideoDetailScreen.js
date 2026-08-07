

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
  StatusBar,
  TextInput,
  Alert,
  FlatList,
  Pressable,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEvent } from "expo";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BACKEND_URL = "https://bharat-pay-3.onrender.com";
const API_BASE = `${BACKEND_URL}/api/uservideo`;

const FALLBACK_VIDEO = {
  id: 1,
  title: "Big Buck Bunny",
  channel: "Blender Foundation",
  description: "This video is being loaded from the server.",
  views: 0,
  videoUrl:
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  thumbnail:
    "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
};

const formatTime = (seconds) => {
  if (!seconds || Number.isNaN(Number(seconds))) return "0:00";
  const safe = Math.max(0, Math.floor(Number(seconds)));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const resolveMediaUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = String(value).replace(/\\/g, "/");
  if (normalized.startsWith("uploads/")) return `${BACKEND_URL}/${normalized}`;
  if (normalized.includes("uploads/"))
    return `${BACKEND_URL}/${normalized.split("uploads/").pop()}`;
  if (normalized.startsWith("/uploads/")) return `${BACKEND_URL}${normalized}`;
  return `${BACKEND_URL}/${normalized}`;
};

export default function VideoDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const routeId = route?.params?.id ?? route?.params?.videoId ?? 1;
  const routeVideo = route?.params?.item ?? route?.params?.video ?? null;

  const [loading, setLoading] = useState(true);
  const [videoDetails, setVideoDetails] = useState(routeVideo || FALLBACK_VIDEO);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [likesCount, setLikesCount] = useState(
    Number(routeVideo?.likesCount ?? routeVideo?.likes ?? 0)
  );
  const [dislikesCount, setDislikesCount] = useState(
    Number(routeVideo?.dislikesCount ?? routeVideo?.dislikes ?? 0)
  );
  const [liked, setLiked] = useState(Boolean(routeVideo?.isLiked));
  const [disliked, setDisliked] = useState(Boolean(routeVideo?.isDisliked));
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [suggestedLoading, setSuggestedLoading] = useState(false);

  const controlsTimer = useRef(null);
  const lastTap = useRef(0);
  const lastTapSide = useRef(null); // "left" | "right"

  const resolvedVideoUrl = useMemo(() => {
    const candidate =
      videoDetails?.videoUrl ||
      videoDetails?.video ||
      videoDetails?.videofile ||
      videoDetails?.uri ||
      FALLBACK_VIDEO.videoUrl;
    return resolveMediaUrl(candidate) || FALLBACK_VIDEO.videoUrl;
  }, [videoDetails]);

  const resolvedThumbnail = useMemo(() => {
    const candidate =
      videoDetails?.thumbnail ||
      videoDetails?.thumb ||
      videoDetails?.poster ||
      FALLBACK_VIDEO.thumbnail;
    return resolveMediaUrl(candidate) || FALLBACK_VIDEO.thumbnail;
  }, [videoDetails]);

  const player = useVideoPlayer(resolvedVideoUrl, (p) => {
    p.loop = false;
    p.muted = false;
    p.play();
  });

  // Unlock orientation
  useEffect(() => {
    ScreenOrientation.unlockAsync().catch(() => {});
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      ).catch(() => {});
    };
  }, []);

  // Reload video when URL changes
  useEffect(() => {
    if (!player || !resolvedVideoUrl) return;
    const load = async () => {
      try {
        await player.replaceAsync(resolvedVideoUrl);
        player.play();
      } catch (e) {
        console.warn("Video load error:", e);
      }
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true);
    };
    load();
  }, [player, resolvedVideoUrl]);

  // Mute
  useEffect(() => {
    if (!player) return;
    try {
      player.muted = isMuted;
    } catch (e) {}
  }, [player, isMuted]);

  useEvent(player, "playingChange", (payload) => {
    setIsPlaying(Boolean(payload?.isPlaying));
  });

  useEvent(player, "timeUpdate", (payload) => {
    const t = Number(payload?.currentTime || 0);
    const d = Number(payload?.duration || 0);
    setCurrentTime(t);
    if (d > 0) setDuration(d);
  });

  // Fetch data
  useEffect(() => {
    const fetchAll = async () => {
      if (!routeId) return;
      const token = await AsyncStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Video details
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/${routeId}`, { headers });
        const data = await res.json().catch(() => ({}));
        const payload = data?.video || data;
        if (payload) {
          setVideoDetails((prev) => ({ ...prev, ...payload }));
          setLikesCount(Number(payload.likesCount ?? payload.likes ?? 0));
          setDislikesCount(Number(payload.dislikesCount ?? payload.dislikes ?? 0));
          setLiked(Boolean(payload.isLiked));
          setDisliked(Boolean(payload.isDisliked));
        }
      } catch (e) {
        console.warn("Video details error:", e);
      } finally {
        setLoading(false);
      }

      // Comments
      try {
        setCommentsLoading(true);
        const res = await fetch(`${API_BASE}/${routeId}/comments`, { headers });
        const data = await res.json().catch(() => ({}));
        setComments(Array.isArray(data?.comments) ? data.comments : []);
      } catch (e) {
        console.warn("Comments error:", e);
      } finally {
        setCommentsLoading(false);
      }

      // Suggested Videos
      try {
        setSuggestedLoading(true);
        const res = await fetch(`${API_BASE}?limit=12&exclude=${routeId}`, {
          headers,
        });
        const data = await res.json().catch(() => ({}));
        let list = [];
        if (Array.isArray(data?.videos)) list = data.videos;
        else if (Array.isArray(data?.data)) list = data.data;
        else if (Array.isArray(data)) list = data;

        list = list.filter((v) => String(v._id || v.id) !== String(routeId));
        setSuggestedVideos(list.slice(0, 12));
      } catch (e) {
        console.warn("Suggested error:", e);
      } finally {
        setSuggestedLoading(false);
      }
    };

    fetchAll();
  }, [routeId]);

  // Auto hide controls
  useEffect(() => {
    if (!showControls) return;
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3500);
    return () => clearTimeout(controlsTimer.current);
  }, [showControls, isPlaying]);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
  }, []);

  const handleTogglePlayPause = () => {
    if (!player) return;
    try {
      isPlaying ? player.pause() : player.play();
    } catch (e) {}
    showControlsTemporarily();
  };

  // Double tap seek (YouTube style)
  const handleSideTap = (side) => {
    const now = Date.now();
    if (now - lastTap.current < 280 && lastTapSide.current === side) {
      // Double tap
      if (player && duration) {
        const offset = side === "left" ? -10 : 10;
        const newTime = Math.max(0, Math.min(duration, currentTime + offset));
        player.currentTime = newTime;
        setCurrentTime(newTime);
      }
    } else {
      // Single tap → toggle controls
      setShowControls((prev) => !prev);
    }
    lastTap.current = now;
    lastTapSide.current = side;
  };

  const handleSeek = (value) => {
    if (!player || !duration) return;
    try {
      const seekTo = Math.max(0, Math.min(duration, value * duration));
      player.currentTime = seekTo;
      setCurrentTime(seekTo);
    } catch (e) {}
  };

  const handleLike = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Login required", "Please login to like this video.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/${routeId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success) {
        setLikesCount(Number(data.likes ?? likesCount));
        setDislikesCount(Number(data.dislikes ?? dislikesCount));
        setLiked(data.reaction === "like");
        setDisliked(data.reaction === "dislike");
      }
    } catch (e) {}
  };

  const handleDislike = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Login required", "Please login to dislike this video.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/${routeId}/dislike`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success) {
        setLikesCount(Number(data.likes ?? likesCount));
        setDislikesCount(Number(data.dislikes ?? dislikesCount));
        setLiked(data.reaction === "like");
        setDisliked(data.reaction === "dislike");
      }
    } catch (e) {}
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !routeId) return;
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Login required", "Please login to comment.");
      return;
    }
    try {
      setCommentLoading(true);
      const res = await fetch(`${API_BASE}/${routeId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentText: commentText.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success) {
        setComments((prev) => [
          {
            _id: Date.now().toString(),
            text: commentText.trim(),
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setCommentText("");
      }
    } catch (e) {
    } finally {
      setCommentLoading(false);
    }
  };

  const openSuggestedVideo = (item) => {
    const id = item._id || item.id;
    navigation.replace("VideoDetail", {
      id,
      videoId: id,
      item,
      video: item,
    });
  };

  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  const renderSuggestedItem = ({ item }) => {
    const thumb =
      resolveMediaUrl(item.thumbnail || item.thumb || item.poster) ||
      FALLBACK_VIDEO.thumbnail;

    return (
      <TouchableOpacity
        style={styles.suggestedCard}
        activeOpacity={0.85}
        onPress={() => openSuggestedVideo(item)}
      >
        <Image source={{ uri: thumb }} style={styles.suggestedThumb} />
        <View style={styles.suggestedInfo}>
          <Text style={styles.suggestedTitle} numberOfLines={2}>
            {item.title || "Untitled"}
          </Text>
          <Text style={styles.suggestedMeta} numberOfLines={1}>
            {item.channel?.name || item.channel || "Channel"} •{" "}
            {(item.views || 0).toLocaleString()} views
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
      >
        {/* ================= VIDEO PLAYER ================= */}
        <View style={styles.videoWrapper}>
          <VideoView
            player={player}
            style={styles.videoPlayer}
            contentFit="contain"
            nativeControls={false}
            allowsPictureInPicture={false}
          />

          {/* Left / Right double-tap zones */}
          <View style={styles.tapZones} pointerEvents="box-none">
            <Pressable
              style={styles.tapZone}
              onPress={() => handleSideTap("left")}
            />
            <Pressable
              style={styles.tapZone}
              onPress={() => handleSideTap("right")}
            />
          </View>

          {showControls && (
            <View style={styles.overlay} pointerEvents="box-none">
              {/* Top */}
              <View style={styles.topBar}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.videoTitle} numberOfLines={1}>
                  {videoDetails?.title || FALLBACK_VIDEO.title}
                </Text>

                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => setIsMuted((p) => !p)}
                >
                  <Ionicons
                    name={isMuted ? "volume-mute" : "volume-high"}
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              {/* Center Play */}
              <TouchableOpacity
                style={styles.centerPlay}
                onPress={handleTogglePlayPause}
              >
                <View style={styles.playCircle}>
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={40}
                    color="#fff"
                  />
                </View>
              </TouchableOpacity>

              {/* Bottom Controls */}
              <View style={styles.bottomControls}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={progress}
                  minimumTrackTintColor="#ff0000"
                  maximumTrackTintColor="rgba(255,255,255,0.3)"
                  thumbTintColor="#ff0000"
                  onSlidingStart={() => setShowControls(true)}
                  onSlidingComplete={handleSeek}
                />

                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* ================= INFO ================= */}
        <View style={styles.infoCard}>
          <Text style={styles.title}>
            {videoDetails?.title || FALLBACK_VIDEO.title}
          </Text>
          <Text style={styles.meta}>
            {(videoDetails?.views || 0).toLocaleString()} views •{" "}
            {videoDetails?.createdAt
              ? new Date(videoDetails.createdAt).toLocaleDateString()
              : "Recently"}
          </Text>

          <View style={styles.channelRow}>
            <Image
              source={{ uri: resolvedThumbnail }}
              style={styles.channelAvatar}
            />
            <Text style={styles.channelName}>
              {videoDetails?.channel?.name ||
                videoDetails?.channel ||
                "Channel"}
            </Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, liked && styles.actionBtnActive]}
              onPress={handleLike}
            >
              <Ionicons
                name={liked ? "thumbs-up" : "thumbs-up-outline"}
                size={18}
                color="#fff"
              />
              <Text style={styles.actionText}>{likesCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, disliked && styles.actionBtnActive]}
              onPress={handleDislike}
            >
              <Ionicons
                name={disliked ? "thumbs-down" : "thumbs-down-outline"}
                size={18}
                color="#fff"
              />
              <Text style={styles.actionText}>{dislikesCount}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            {videoDetails?.description || FALLBACK_VIDEO.description}
          </Text>
        </View>

        {/* ================= SUGGESTED VIDEOS ================= */}
        <View style={styles.suggestedSection}>
          <Text style={styles.sectionTitle}>Suggested Videos</Text>

          {suggestedLoading ? (
            <ActivityIndicator color="#fff" style={{ marginVertical: 20 }} />
          ) : suggestedVideos.length > 0 ? (
            <FlatList
              data={suggestedVideos}
              keyExtractor={(item) => String(item._id || item.id)}
              renderItem={renderSuggestedItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
            />
          ) : (
            <Text style={styles.emptyText}>No suggestions available</Text>
          )}
        </View>

        {/* ================= COMMENTS ================= */}
        <View style={styles.commentsCard}>
          <Text style={styles.sectionTitle}>Comments</Text>

          <View style={styles.commentInputRow}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#888"
              multiline
            />
            <TouchableOpacity
              style={[
                styles.postBtn,
                (!commentText.trim() || commentLoading) && { opacity: 0.5 },
              ]}
              onPress={handleCommentSubmit}
              disabled={!commentText.trim() || commentLoading}
            >
              {commentLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.postBtnText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>

          {commentsLoading ? (
            <ActivityIndicator color="#fff" style={{ marginVertical: 14 }} />
          ) : comments.length > 0 ? (
            comments.map((c) => (
              <View key={c._id || c.id} style={styles.commentItem}>
                <Text style={styles.commentText}>
                  {c.text || c.comment}
                </Text>
                <Text style={styles.commentMeta}>
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleDateString()
                    : "Just now"}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No comments yet.</Text>
          )}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#fff" />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  videoWrapper: {
    width: SCREEN_WIDTH,
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
  tapZones: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  tapZone: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "ios" ? 48 : 16,
    gap: 10,
  },
  videoTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  iconBtn: {
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 8,
    borderRadius: 20,
  },
  centerPlay: {
    alignSelf: "center",
  },
  playCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomControls: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  slider: {
    width: "100%",
    height: 32,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
  },
  infoCard: {
    backgroundColor: "#18181b",
    margin: 12,
    borderRadius: 14,
    padding: 14,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },
  meta: {
    color: "#a1a1aa",
    fontSize: 13,
    marginTop: 6,
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 12,
  },
  channelAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#333",
  },
  channelName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  actionBtnActive: {
    backgroundColor: "rgba(239,68,68,0.25)",
  },
  actionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  description: {
    color: "#d4d4d8",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 14,
  },
  suggestedSection: {
    marginTop: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 14,
    marginBottom: 12,
  },
  suggestedCard: {
    width: 210,
    marginRight: 12,
    backgroundColor: "#18181b",
    borderRadius: 12,
    overflow: "hidden",
  },
  suggestedThumb: {
    width: "100%",
    height: 118,
    backgroundColor: "#222",
  },
  suggestedInfo: {
    padding: 10,
  },
  suggestedTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  suggestedMeta: {
    color: "#a1a1aa",
    fontSize: 11,
    marginTop: 4,
  },
  commentsCard: {
    backgroundColor: "#18181b",
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 14,
    padding: 14,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  commentInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    backgroundColor: "#0f0f0f",
    color: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  postBtn: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 72,
    alignItems: "center",
  },
  postBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  commentItem: {
    backgroundColor: "#0f0f0f",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#262626",
  },
  commentText: {
    color: "#fff",
    fontSize: 14,
  },
  commentMeta: {
    color: "#a1a1aa",
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: "#a1a1aa",
    fontSize: 13,
    marginHorizontal: 14,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
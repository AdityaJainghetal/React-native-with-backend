

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const safeSeconds = Math.max(0, Math.floor(Number(seconds)));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
};

const resolveMediaUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;

  const normalized = String(value).replace(/\\/g, "/");
  if (normalized.startsWith("uploads/")) {
    return `${BACKEND_URL}/${normalized}`;
  }
  if (normalized.includes("uploads/")) {
    return `${BACKEND_URL}/${normalized.split("uploads/").pop()}`;
  }
  if (normalized.startsWith("/uploads/")) {
    return `${BACKEND_URL}${normalized}`;
  }

  return `${BACKEND_URL}/${normalized}`;
};

export default function VideoDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const routeId = route?.params?.id ?? route?.params?.videoId ?? 1;
  const routeVideo = route?.params?.item ?? route?.params?.video ?? null;

  const [loading, setLoading] = useState(true);
  const [videoDetails, setVideoDetails] = useState(
    routeVideo || FALLBACK_VIDEO,
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [likesCount, setLikesCount] = useState(
    Number(routeVideo?.likesCount ?? routeVideo?.likes ?? 0),
  );
  const [dislikesCount, setDislikesCount] = useState(
    Number(routeVideo?.dislikesCount ?? routeVideo?.dislikes ?? 0),
  );
  const [liked, setLiked] = useState(Boolean(routeVideo?.isLiked));
  const [disliked, setDisliked] = useState(Boolean(routeVideo?.isDisliked));
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const controlsTimer = useRef(null);

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

  useEffect(() => {
    ScreenOrientation.unlockAsync().catch(() => {});
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      ).catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (!player || !resolvedVideoUrl) return;

    const load = async () => {
      try {
        await player.replaceAsync(resolvedVideoUrl);
        player.play();
      } catch (error) {
        console.warn("Video player load error:", error);
      }
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true);
    };

    load();
  }, [player, resolvedVideoUrl]);

  useEffect(() => {
    if (!player) return;
    try {
      player.muted = isMuted;
    } catch (error) {
      console.warn("Muted toggle error:", error);
    }
  }, [player, isMuted]);

  useEvent(player, "playingChange", (payload) => {
    setIsPlaying(Boolean(payload?.isPlaying));
  });

  useEvent(player, "timeUpdate", (payload) => {
    const nextTime = Number(payload?.currentTime || 0);
    const nextDuration = Number(payload?.duration || 0);
    setCurrentTime(nextTime);
    if (nextDuration > 0) setDuration(nextDuration);
  });

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!routeId) return;

      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE}/${routeId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = await response.json().catch(() => ({}));
        const payload = data?.video || data;
        if (payload) {
          setVideoDetails((prev) => ({ ...prev, ...payload }));
          setLikesCount(Number(payload.likesCount ?? payload.likes ?? 0));
          setDislikesCount(
            Number(payload.dislikesCount ?? payload.dislikes ?? 0),
          );
          setLiked(Boolean(payload.isLiked));
          setDisliked(Boolean(payload.isDisliked));
        }
      } catch (error) {
        console.warn("Load video details error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      if (!routeId) return;

      try {
        setCommentsLoading(true);
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE}/${routeId}/comments`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json().catch(() => ({}));
        const list = Array.isArray(data?.comments) ? data.comments : [];
        setComments(list);
      } catch (error) {
        console.warn("Load comments error:", error);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchVideoDetails();
    fetchComments();
  }, [routeId]);

  useEffect(() => {
    if (!showControls) return undefined;
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(controlsTimer.current);
  }, [showControls]);

  const showControlsTemporarily = () => {
    setShowControls(true);
  };

  const handleTogglePlayPause = () => {
    try {
      if (!player) return;
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    } catch (error) {
      console.warn("Play state error:", error);
    }
    showControlsTemporarily();
  };

  const handleLike = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Login required", "Please login to like this video.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/${routeId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json().catch(() => ({}));

      if (data?.success) {
        setLikesCount(Number(data.likes ?? likesCount));
        setDislikesCount(Number(data.dislikes ?? dislikesCount));
        setLiked(Boolean(data.reaction === "like"));
        setDisliked(Boolean(data.reaction === "dislike"));
      }
    } catch (error) {
      console.warn("Like error:", error);
    }
  };

  const handleDislike = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Login required", "Please login to dislike this video.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/${routeId}/dislike`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json().catch(() => ({}));

      if (data?.success) {
        setLikesCount(Number(data.likes ?? likesCount));
        setDislikesCount(Number(data.dislikes ?? dislikesCount));
        setLiked(Boolean(data.reaction === "like"));
        setDisliked(Boolean(data.reaction === "dislike"));
      }
    } catch (error) {
      console.warn("Dislike error:", error);
    }
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
      const response = await fetch(`${API_BASE}/${routeId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentText: commentText.trim() }),
      });

      const data = await response.json().catch(() => ({}));
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
    } catch (error) {
      console.warn("Comment post error:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleSeek = (value) => {
    if (!player || !duration) return;
    try {
      const seekTo = Math.max(0, Math.min(duration, value * duration));
      player.currentTime = seekTo;
      setCurrentTime(seekTo);
    } catch (error) {
      console.warn("Seek error:", error);
    }
  };

  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.videoWrapper}>
          <VideoView
            player={player}
            style={styles.videoPlayer}
            contentFit="contain"
            nativeControls={false}
            allowsPictureInPicture={false}
            startsPictureInPictureAutomatically={false}
          />

          {showControls && (
            <View style={styles.overlay} pointerEvents="box-none">
              <View style={styles.topBar}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {videoDetails?.title || FALLBACK_VIDEO.title}
                </Text>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="close" size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.centerPlayButton}
                onPress={handleTogglePlayPause}
              >
                {isPlaying ? (
                  <Ionicons name="pause" size={52} color="#fff" />
                ) : (
                  <Ionicons name="play" size={52} color="#fff" />
                )}
              </TouchableOpacity>

              <View style={styles.bottomControls}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={progress}
                  minimumTrackTintColor="#ef4444"
                  maximumTrackTintColor="#444"
                  thumbTintColor="#ef4444"
                  onSlidingStart={() => setShowControls(true)}
                  onSlidingComplete={handleSeek}
                />

                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Text>

                  <TouchableOpacity onPress={() => setIsMuted((prev) => !prev)}>
                    <Ionicons
                      name={isMuted ? "volume-mute" : "volume-high"}
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.channelRow}>
            <Image
              source={{ uri: resolvedThumbnail }}
              style={styles.channelAvatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {videoDetails?.title || FALLBACK_VIDEO.title}
              </Text>
              <Text style={styles.meta}>
                {(videoDetails?.views || 0).toLocaleString()} views •{" "}
                {videoDetails?.createdAt
                  ? new Date(videoDetails.createdAt).toLocaleDateString()
                  : "Recently added"}
              </Text>
              <Text style={styles.channelName}>
                {videoDetails?.channel?.name ||
                  videoDetails?.channel ||
                  "Channel"}
              </Text>
            </View>
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
            comments.map((comment) => (
              <View key={comment._id || comment.id} style={styles.commentItem}>
                <Text style={styles.commentText}>
                  {comment.text || comment.comment}
                </Text>
                <Text style={styles.commentMeta}>
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString()
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
    paddingBottom: 32,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 18,
  },
  videoTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 12,
  },
  closeBtn: {
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 8,
    borderRadius: 20,
  },
  centerPlayButton: {
    alignSelf: "center",
    padding: 10,
  },
  bottomControls: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  slider: {
    width: "100%",
    height: 36,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
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
  channelRow: {
    flexDirection: "row",
    gap: 12,
  },
  channelAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#333",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  meta: {
    color: "#a1a1aa",
    fontSize: 12,
    marginTop: 4,
  },
  channelName: {
    color: "#fff",
    fontSize: 14,
    marginTop: 6,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    flexWrap: "wrap",
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
    backgroundColor: "rgba(239,68,68,0.2)",
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
  commentsCard: {
    backgroundColor: "#18181b",
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 14,
    padding: 14,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
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
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

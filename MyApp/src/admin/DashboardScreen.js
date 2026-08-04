// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   Platform,
//   StatusBar,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { ChevronRight, Play, Plus } from "lucide-react-native";
// import Toast from "react-native-toast-message";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Navbar from "./Navbar";
// import TopicChips from "./TopicChips";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");
// const CARD_WIDTH = SCREEN_WIDTH * 0.42;
// const CARD_HEIGHT = CARD_WIDTH * 0.5625; // 16:9

// const BACKEND_URL = "https://bharat-pay-3.onrender.com";
// const API_BASE = `${BACKEND_URL}/api/uservideo`;

// const normalizeVideoListItem = (video = {}) => ({
//   id: video._id || video.id,
//   title: video.title || "Untitled video",
//   thumb: video.thumbnail
//     ? /^https?:\/\//i.test(video.thumbnail)
//       ? video.thumbnail.replace(/\\/g, "/")
//       : `${BACKEND_URL}/${String(video.thumbnail).replace(/\\/g, "/")}`
//     : "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
//   thumbnail: video.thumbnail
//     ? /^https?:\/\//i.test(video.thumbnail)
//       ? video.thumbnail.replace(/\\/g, "/")
//       : `${BACKEND_URL}/${String(video.thumbnail).replace(/\\/g, "/")}`
//     : "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
//   description: video.description || "",
//   views: Number(video.views || 0),
//   likesCount: Number(video.likesCount ?? video.likes ?? 0),
//   dislikesCount: Number(video.dislikesCount ?? 0),
//   videoUrl: video.videoUrl
//     ? /^https?:\/\//i.test(video.videoUrl)
//       ? video.videoUrl.replace(/\\/g, "/")
//       : `${BACKEND_URL}/${String(video.videoUrl).replace(/\\/g, "/")}`
//     : "",
//   videoType: video.videoType || null,
//   raw: video,
//   channel: video.channel || null,
//   createdAt: video.createdAt || null,
//   isLiked: Boolean(video.isLiked || video.userReaction === "like"),
//   isDisliked: Boolean(video.isDisliked || video.userReaction === "dislike"),
// });

// const normalizeShort = (video = {}) => ({
//   id: video._id || video.id,
//   title: video.title || "Untitled short",
//   thumbnail: video.thumbnail
//     ? /^https?:\/\//i.test(video.thumbnail)
//       ? video.thumbnail.replace(/\\/g, "/")
//       : `${BACKEND_URL}/${String(video.thumbnail).replace(/\\/g, "/")}`
//     : "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
//   views: Number(video.views || 0),
//   likes: Number(video.likesCount ?? video.likes ?? 0),
//   comments: Number(video.comments || 0),
//   videoUrl: video.videoUrl
//     ? /^https?:\/\//i.test(video.videoUrl)
//       ? video.videoUrl.replace(/\\/g, "/")
//       : `${BACKEND_URL}/${String(video.videoUrl).replace(/\\/g, "/")}`
//     : "",
//   videoType: video.videoType || "short",
//   raw: video,
//   isShort: true,
// });

// const normalizeSubscriptionChannel = (channel = {}) => ({
//   id: channel._id || channel.id || channel.channelId,
//   title: channel.name || channel.channelName || "Subscribed Channel",
//   thumb:
//     channel.channelImage ||
//     channel.avatar ||
//     channel.image ||
//     "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
//   thumbnail:
//     channel.channelImage ||
//     channel.avatar ||
//     channel.image ||
//     "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
//   description: channel.description || "",
//   views: Number(channel.views || 0),
//   raw: channel,
//   channel: channel.channel || channel,
//   isChannel: true,
//   videoType: "channel",
// });

// const getArrayFromPayload = (payload) => {
//   if (Array.isArray(payload)) return payload;
//   if (Array.isArray(payload?.videos)) return payload.videos;
//   if (Array.isArray(payload?.data)) return payload.data;
//   if (Array.isArray(payload?.channels)) return payload.channels;
//   if (Array.isArray(payload?.subscribedChannels))
//     return payload.subscribedChannels;
//   if (Array.isArray(payload?.subscribers)) return payload.subscribers;
//   return [];
// };

// const fetchWithAuth = async (endpoint) => {
//   const token = await AsyncStorage.getItem("token");
//   if (!token) return [];

//   const res = await fetch(`${API_BASE}/${endpoint}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   const data = await res.json().catch(() => ({}));
//   return getArrayFromPayload(data);
// };

// // ────────────────────────────────────────────────
// // Components
// // ────────────────────────────────────────────────

// function SectionHeader({ title }) {
//   return (
//     <View style={styles.sectionHeader}>
//       <Text style={styles.sectionTitle}>{title}</Text>
//       <ChevronRight size={20} color="#a1a1aa" />
//     </View>
//   );
// }

// function MovieCard({ item, onPress, onAddToWatchLater }) {
//   const [adding, setAdding] = useState(false);

//   const handlePlus = async () => {
//     if (adding || !onAddToWatchLater) return;
//     setAdding(true);
//     try {
//       await onAddToWatchLater(item);
//     } finally {
//       setAdding(false);
//     }
//   };

//   return (
//     <TouchableOpacity
//       activeOpacity={0.85}
//       onPress={() => onPress(item)}
//       style={styles.card}
//     >
//       <Image
//         source={{ uri: item.thumb || item.thumbnail }}
//         style={styles.cardImage}
//         resizeMode="cover"
//       />

//       <View style={styles.cardOverlay}>
//         <View style={styles.cardActions}>
//           <TouchableOpacity
//             style={styles.actionBtnWhite}
//             onPress={() => onPress(item)}
//           >
//             <Play size={16} color="#000" fill="#000" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.actionBtnBorder, adding && { opacity: 0.5 }]}
//             onPress={handlePlus}
//             disabled={adding}
//           >
//             <Plus size={16} color="#fff" />
//           </TouchableOpacity>

         
//         </View>

//         <Text style={styles.cardTitle} numberOfLines={1}>
//           {item.title}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

// // ────────────────────────────────────────────────
// // Main Screen
// // ────────────────────────────────────────────────

// export default function NetflixStylePage() {
//   const navigation = useNavigation();
//   const [recommended, setRecommended] = useState([]);
//   const [trending, setTrending] = useState([]);
//   const [latest, setLatest] = useState([]);
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [shorts, setShorts] = useState([]);
//   const [selectedTopic, setSelectedTopic] = useState("For you");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadHomeData = async () => {
//       try {
//         setLoading(true);
//         const [
//           recommendedData,
//           trendingData,
//           latestData,
//           subscriptionsData,
//           shortsData,
//         ] = await Promise.all([
//           fetchWithAuth("recommended"),
//           fetchWithAuth("trending"),
//           fetchWithAuth("latest"),
//           fetchWithAuth("subscribed-channels"),
//           fetchWithAuth("trending-shorts"),
//         ]);

//         setRecommended(
//           getArrayFromPayload(recommendedData).map(normalizeVideoListItem),
//         );
//         setTrending(
//           getArrayFromPayload(trendingData).map(normalizeVideoListItem),
//         );
//         setLatest(getArrayFromPayload(latestData).map(normalizeVideoListItem));
//         setSubscriptions(
//           getArrayFromPayload(subscriptionsData).map(
//             normalizeSubscriptionChannel,
//           ),
//         );
//         setShorts(getArrayFromPayload(shortsData).map(normalizeShort));
//       } catch (error) {
//         console.warn("Home videos load error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadHomeData();
//   }, []);

//   const isShortContent = (item) => {
//     const rawTypes = item?.videoType ?? item?.raw?.videoType ?? [];
//     const normalizedTypes = (Array.isArray(rawTypes) ? rawTypes : [rawTypes])
//       .filter(Boolean)
//       .map((type) => String(type).toLowerCase());

//     return (
//       Boolean(item?.isShort) ||
//       normalizedTypes.some(
//         (type) =>
//           type === "short" || type === "shorts" || type.includes("short"),
//       )
//     );
//   };

//   const handleItemClick = (item) => {
//     if (item?.isChannel) {
//       navigation.navigate("SubscribedChannels", { id: item.id });
//       return;
//     }

//     if (isShortContent(item)) {
//       navigation.navigate("MainTabs", {
//         screen: "Shorts",
//         params: { video: item },
//       });
//       return;
//     }

//     navigation.navigate("VideoDetail", { id: item.id, item });
//   };

//   const handleAddToWatchLater = async (item) => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       if (!token) {
//         Toast.show({ type: "error", text1: "Please login first" });
//         return;
//       }

//       const res = await fetch(`${API_BASE}/watch-later/${item.id}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await res.json();

//       if (data.success) {
//         Toast.show({
//           type: "success",
//           text1: data.message || "Added to Watch Later",
//         });
//       } else {
//         Toast.show({
//           type: "error",
//           text1: data.message || "Failed to add",
//         });
//       }
//     } catch (err) {
//       console.error("Add to Watch Later error:", err);
//       Toast.show({ type: "error", text1: "Something went wrong" });
//     }
//   };

//   // Horizontal videos section
//   const renderHorizontalSection = (
//     title,
//     data,
//     emptyMsg,
//     showProgress = true,
//   ) => (
//     <View style={styles.section}>
//       <SectionHeader title={title} />

//       {loading && data.length === 0 ? (
//         <ActivityIndicator color="#fff" style={{ marginVertical: 24 }} />
//       ) : data.length > 0 ? (
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.horizontalList}
//         >
//           {data.map((item) => (
//             <View key={item.id} style={styles.cardWrapper}>
//               <MovieCard
//                 item={item}
//                 onPress={handleItemClick}
//                 onAddToWatchLater={handleAddToWatchLater}
//               />
//               {showProgress && (
//                 <View style={styles.progressContainer}>
//                   <View style={styles.progressBarBg}>
//                     <View style={[styles.progressBarFill, { width: "70%" }]} />
//                   </View>
//                   <Text style={styles.viewsText}>
//                     {item.views?.toLocaleString?.() || 0} views
//                   </Text>
//                 </View>
//               )}
//             </View>
//           ))}
//         </ScrollView>
//       ) : (
//         <Text style={styles.emptyText}>{emptyMsg}</Text>
//       )}
//     </View>
//   );

//   // Dynamic Shorts Grid
//   const renderShortsGrid = (title) => (
//     <View style={[styles.section, { marginBottom: 36 }]}>
//       <SectionHeader title={title} />

//       {loading && shorts.length === 0 ? (
//         <ActivityIndicator color="#fff" style={{ marginVertical: 24 }} />
//       ) : shorts.length > 0 ? (
//         <View style={styles.shortsGrid}>
//           {shorts.map((item) => (
//             <TouchableOpacity
//               key={item.id}
//               style={styles.shortCard}
//               onPress={() => handleItemClick(item)}
//               activeOpacity={0.85}
//             >
//               <View style={styles.shortImageWrapper}>
//                 <Image
//                   source={{
//                     uri:
//                       item.thumbnail ||
//                       item.thumb ||
//                       "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
//                   }}
//                   style={styles.shortImage}
//                   resizeMode="cover"
//                 />
//                 <View style={styles.shortBadge}>
//                   <Text style={styles.shortBadgeText}>
//                     #{item.id % 10 || 1}
//                   </Text>
//                 </View>
//               </View>

//               <Text style={styles.shortTitle} numberOfLines={1}>
//                 {item.title}
//               </Text>

//               <View style={styles.shortMeta}>
//                 <Text style={styles.shortMetaText}>
//                   {Number(item.views || 0).toLocaleString()} views
//                 </Text>
//                 <Text style={styles.shortMetaText}>
//                   {Number(item.likes || 0).toLocaleString()} likes
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       ) : (
//         <Text style={styles.emptyText}>No shorts available right now.</Text>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#000" />
//       <Navbar onMenuPress={() => {}} points={0} />
//       <TopicChips onTopicChange={(topic) => setSelectedTopic(topic)} />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Recommended */}
//         {renderHorizontalSection(
//           "Recommended Videos",
//           recommended,
//           "No recommended videos available right now.",
//         )}

//         {/* Trending */}
//         {renderHorizontalSection(
//           "Trending Videos",
//           trending,
//           "No trending videos available right now.",
//         )}

//         {/* Trending Shorts (Dynamic) */}
//         {renderShortsGrid("Trending Shorts")}

//         {/* Latest */}
//         {renderHorizontalSection(
//           "Latest Videos",
//           latest,
//           "No latest videos available right now.",
//         )}

//         {/* Subscriptions */}
//         {renderHorizontalSection(
//           "Subscription Videos",
//           subscriptions,
//           "Subscribe to channels to see their videos here.",
//           false,
//         )}

//         {/* Top Shorts (Dynamic) */}
//         {renderShortsGrid("Top Shorts")}
//       </ScrollView>
//     </View>
//   );
// }

// // ────────────────────────────────────────────────
// // Styles
// // ────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   container: {
//     flex: 5,
//     backgroundColor: "#000",
//   },
//   scrollContent: {
//     paddingTop: 20,
//     paddingBottom: 50,
//     paddingHorizontal: 16,
//   },
//   section: {
//     marginBottom: 28,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 14,
//     gap: 6,
//   },
//   sectionTitle: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "700",
//   },
//   horizontalList: {
//     paddingRight: 12,
//     gap: 12,
//   },
//   cardWrapper: {
//     width: CARD_WIDTH,
//   },
//   card: {
//     width: CARD_WIDTH,
//     height: CARD_HEIGHT,
//     borderRadius: 8,
//     overflow: "hidden",
//     backgroundColor: "#18181b",
//   },
//   cardImage: {
//     width: "100%",
//     height: "100%",
//   },
//   cardOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.55)",
//     justifyContent: "flex-end",
//     padding: 10,
//   },
//   cardActions: {
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 6,
//   },
//   actionBtnWhite: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   actionBtnBorder: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     borderWidth: 1.5,
//     borderColor: "rgba(255,255,255,0.55)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cardTitle: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   progressContainer: {
//     marginTop: 8,
//   },
//   progressBarBg: {
//     height: 3,
//     backgroundColor: "#3f3f46",
//     borderRadius: 2,
//     overflow: "hidden",
//   },
//   progressBarFill: {
//     height: "100%",
//     backgroundColor: "#dc2626",
//   },
//   viewsText: {
//     color: "#a1a1aa",
//     fontSize: 11,
//     marginTop: 4,
//   },
//   emptyText: {
//     color: "#a1a1aa",
//     fontSize: 14,
//     marginTop: 8,
//   },

//   // Shorts
//   shortsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     rowGap: 16,
//   },
//   shortCard: {
//     width: (SCREEN_WIDTH - 44) / 2,
//   },
//   shortImageWrapper: {
//     aspectRatio: 16 / 9,
//     borderRadius: 8,
//     overflow: "hidden",
//     marginBottom: 6,
//     backgroundColor: "#18181b",
//   },
//   shortImage: {
//     width: "100%",
//     height: "100%",
//   },
//   shortBadge: {
//     position: "absolute",
//     top: 6,
//     right: 6,
//     backgroundColor: "rgba(0,0,0,0.75)",
//     paddingHorizontal: 7,
//     paddingVertical: 3,
//     borderRadius: 4,
//   },
//   shortBadgeText: {
//     color: "#fff",
//     fontSize: 11,
//     fontWeight: "600",
//   },
//   shortTitle: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   shortMeta: {
//     flexDirection: "row",
//     gap: 12,
//     marginTop: 3,
//   },
//   shortMetaText: {
//     color: "#a1a1aa",
//     fontSize: 11,
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronRight, Play, Plus } from "lucide-react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "./Navbar";
import TopicChips from "./TopicChips";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CARD_WIDTH = SCREEN_WIDTH * 0.42;
const CARD_HEIGHT = CARD_WIDTH * (9 / 16); // 16:9

const SHORT_WIDTH = (SCREEN_WIDTH - 44) / 2;
const SHORT_HEIGHT = SHORT_WIDTH * (16 / 9); // vertical Shorts

const BACKEND_URL = "https://bharat-pay-3.onrender.com";
const API_BASE = `${BACKEND_URL}/api/uservideo`;

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────
const normalizeVideoListItem = (video = {}) => ({
  id: video._id || video.id,
  title: video.title || "Untitled video",
  thumb: video.thumbnail
    ? /^https?:\/\//i.test(video.thumbnail)
      ? video.thumbnail.replace(/\\/g, "/")
      : `${BACKEND_URL}/${String(video.thumbnail).replace(/\\/g, "/")}`
    : "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
  thumbnail: video.thumbnail
    ? /^https?:\/\//i.test(video.thumbnail)
      ? video.thumbnail.replace(/\\/g, "/")
      : `${BACKEND_URL}/${String(video.thumbnail).replace(/\\/g, "/")}`
    : "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
  description: video.description || "",
  views: Number(video.views || 0),
  likesCount: Number(video.likesCount ?? video.likes ?? 0),
  dislikesCount: Number(video.dislikesCount ?? 0),
  videoUrl: video.videoUrl
    ? /^https?:\/\//i.test(video.videoUrl)
      ? video.videoUrl.replace(/\\/g, "/")
      : `${BACKEND_URL}/${String(video.videoUrl).replace(/\\/g, "/")}`
    : "",
  videoType: video.videoType || null,
  raw: video,
  channel: video.channel || null,
  createdAt: video.createdAt || null,
  isLiked: Boolean(video.isLiked || video.userReaction === "like"),
  isDisliked: Boolean(video.isDisliked || video.userReaction === "dislike"),
});

const normalizeShort = (video = {}) => ({
  id: video._id || video.id,
  title: video.title || "Untitled short",
  thumbnail: video.thumbnail
    ? /^https?:\/\//i.test(video.thumbnail)
      ? video.thumbnail.replace(/\\/g, "/")
      : `${BACKEND_URL}/${String(video.thumbnail).replace(/\\/g, "/")}`
    : "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
  views: Number(video.views || 0),
  likes: Number(video.likesCount ?? video.likes ?? 0),
  comments: Number(video.comments || 0),
  videoUrl: video.videoUrl
    ? /^https?:\/\//i.test(video.videoUrl)
      ? video.videoUrl.replace(/\\/g, "/")
      : `${BACKEND_URL}/${String(video.videoUrl).replace(/\\/g, "/")}`
    : "",
  videoType: video.videoType || "short",
  raw: video,
  isShort: true,
});

const normalizeSubscriptionChannel = (channel = {}) => ({
  id: channel._id || channel.id || channel.channelId,
  title: channel.name || channel.channelName || "Subscribed Channel",
  thumb:
    channel.channelImage ||
    channel.avatar ||
    channel.image ||
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
  thumbnail:
    channel.channelImage ||
    channel.avatar ||
    channel.image ||
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
  description: channel.description || "",
  views: Number(channel.views || 0),
  raw: channel,
  channel: channel.channel || channel,
  isChannel: true,
  videoType: "channel",
});

const getArrayFromPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.videos)) return payload.videos;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.channels)) return payload.channels;
  if (Array.isArray(payload?.subscribedChannels)) return payload.subscribedChannels;
  if (Array.isArray(payload?.subscribers)) return payload.subscribers;
  return [];
};

const fetchWithAuth = async (endpoint) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) return [];
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  return getArrayFromPayload(data);
};

// ────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────
function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ChevronRight size={20} color="#a1a1aa" />
    </View>
  );
}

function MovieCard({ item, onPress, onAddToWatchLater }) {
  const [adding, setAdding] = useState(false);

  const handlePlus = async () => {
    if (adding || !onAddToWatchLater) return;
    setAdding(true);
    try {
      await onAddToWatchLater(item);
    } finally {
      setAdding(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(item)}
      style={styles.card}
    >
      <Image
        source={{ uri: item.thumb || item.thumbnail }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      {/* Overlay */}
      <View style={styles.cardOverlay}>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtnWhite}
            onPress={() => onPress(item)}
          >
            <Play size={16} color="#000" fill="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtnBorder, adding && { opacity: 0.5 }]}
            onPress={handlePlus}
            disabled={adding}
          >
            <Plus size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ────────────────────────────────────────────────
// Main Screen
// ────────────────────────────────────────────────
export default function NetflixStylePage() {
  const navigation = useNavigation();

  const [recommended, setRecommended] = useState([]);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("For you");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [
          recommendedData,
          trendingData,
          latestData,
          subscriptionsData,
          shortsData,
        ] = await Promise.all([
          fetchWithAuth("recommended"),
          fetchWithAuth("trending"),
          fetchWithAuth("latest"),
          fetchWithAuth("subscribed-channels"),
          fetchWithAuth("trending-shorts"),
        ]);

        setRecommended(getArrayFromPayload(recommendedData).map(normalizeVideoListItem));
        setTrending(getArrayFromPayload(trendingData).map(normalizeVideoListItem));
        setLatest(getArrayFromPayload(latestData).map(normalizeVideoListItem));
        setSubscriptions(
          getArrayFromPayload(subscriptionsData).map(normalizeSubscriptionChannel)
        );
        setShorts(getArrayFromPayload(shortsData).map(normalizeShort));
      } catch (error) {
        console.warn("Home videos load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const isShortContent = (item) => {
    const rawTypes = item?.videoType ?? item?.raw?.videoType ?? [];
    const normalizedTypes = (Array.isArray(rawTypes) ? rawTypes : [rawTypes])
      .filter(Boolean)
      .map((type) => String(type).toLowerCase());

    return (
      Boolean(item?.isShort) ||
      normalizedTypes.some(
        (type) => type === "short" || type === "shorts" || type.includes("short")
      )
    );
  };

  const handleItemClick = (item) => {
    if (item?.isChannel) {
      navigation.navigate("SubscribedChannels", { id: item.id });
      return;
    }

    if (isShortContent(item)) {
      navigation.navigate("MainTabs", {
        screen: "Shorts",
        params: { video: item },
      });
      return;
    }

    navigation.navigate("VideoDetail", { id: item.id, item });
  };

  const handleAddToWatchLater = async (item) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Toast.show({ type: "error", text1: "Please login first" });
        return;
      }

      const res = await fetch(`${API_BASE}/watch-later/${item.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        Toast.show({
          type: "success",
          text1: data.message || "Added to Watch Later",
        });
      } else {
        Toast.show({
          type: "error",
          text1: data.message || "Failed to add",
        });
      }
    } catch (err) {
      console.error("Add to Watch Later error:", err);
      Toast.show({ type: "error", text1: "Something went wrong" });
    }
  };

  // ──── Horizontal Videos Section ────
  const renderHorizontalSection = (title, data, emptyMsg, showProgress = true) => (
    <View style={styles.section}>
      <SectionHeader title={title} />

      {loading && data.length === 0 ? (
        <ActivityIndicator color="#fff" style={{ marginVertical: 24 }} />
      ) : data.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {data.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <MovieCard
                item={item}
                onPress={handleItemClick}
                onAddToWatchLater={handleAddToWatchLater}
              />
              {showProgress && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: "65%" }]} />
                  </View>
                  <Text style={styles.viewsText}>
                    {item.views?.toLocaleString?.() || 0} views
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>{emptyMsg}</Text>
      )}
    </View>
  );

  // ──── Shorts Grid (Vertical cards) ────
  const renderShortsGrid = (title) => (
    <View style={[styles.section, { marginBottom: 36 }]}>
      <SectionHeader title={title} />

      {loading && shorts.length === 0 ? (
        <ActivityIndicator color="#fff" style={{ marginVertical: 24 }} />
      ) : shorts.length > 0 ? (
        <View style={styles.shortsGrid}>
          {shorts.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.shortCard}
              onPress={() => handleItemClick(item)}
              activeOpacity={0.9}
            >
              <View style={styles.shortImageWrapper}>
                <Image
                  source={{
                    uri:
                      item.thumbnail ||
                      item.thumb ||
                      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
                  }}
                  style={styles.shortImage}
                  resizeMode="cover"
                />
                <View style={styles.shortOverlay}>
                  <Text style={styles.shortTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.shortViews}>
                    {Number(item.views || 0).toLocaleString()} views
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No shorts available right now.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Navbar onMenuPress={() => {}} points={0} />
      <TopicChips onTopicChange={(topic) => setSelectedTopic(topic)} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHorizontalSection(
          "Recommended Videos",
          recommended,
          "No recommended videos available right now."
        )}

        {renderHorizontalSection(
          "Trending Videos",
          trending,
          "No trending videos available right now."
        )}

        {renderShortsGrid("Trending Shorts")}

        {renderHorizontalSection(
          "Latest Videos",
          latest,
          "No latest videos available right now."
        )}

        {renderHorizontalSection(
          "Subscription Videos",
          subscriptions,
          "Subscribe to channels to see their videos here.",
          false
        )}

        {renderShortsGrid("Top Shorts")}
      </ScrollView>
    </View>
  );
}

// ────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 60,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 6,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  horizontalList: {
    paddingRight: 12,
    gap: 12,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#18181b",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    padding: 10,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  actionBtnWhite: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnBorder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: "#3f3f46",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#dc2626",
  },
  viewsText: {
    color: "#a1a1aa",
    fontSize: 11,
    marginTop: 4,
  },
  emptyText: {
    color: "#a1a1aa",
    fontSize: 14,
    marginTop: 8,
  },

  // Shorts (Vertical)
  shortsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  shortCard: {
    width: SHORT_WIDTH,
  },
  shortImageWrapper: {
    width: SHORT_WIDTH,
    height: SHORT_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#18181b",
  },
  shortImage: {
    width: "100%",
    height: "100%",
  },
  shortOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  shortTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 17,
  },
  shortViews: {
    color: "#cccccc",
    fontSize: 11,
    marginTop: 4,
  },
});
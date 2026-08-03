// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
//   Dimensions,
//   Alert,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   Bell,
//   Search,
//   MoreVertical,
//   Play,
//   Link as LinkIcon,
//   ChevronDown,
// } from "lucide-react-native";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// const BACKEND_URL = "https://bharat-pay-3.onrender.com";
// const API_BASE = `${BACKEND_URL}/api/uservideo`;

// export default function SubscribedChannels() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { id } = route.params || {};

//   const [channel, setChannel] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [subscribersCount, setSubscribersCount] = useState(0);
//   const [subscribeLoading, setSubscribeLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("Home");
//   const [loading, setLoading] = useState(true);

//   const tabs = ["Home", "Videos", "Playlists"];

//   const getMediaUrl = (path) => {
//     if (!path) return null;
//     const cleaned = String(path).replace(/\\/g, "/");
//     if (cleaned.startsWith("http")) return cleaned;
//     return `${BACKEND_URL}/${cleaned}`;
//   };

//   const formatCount = (num) => {
//     if (!num) return "0";
//     if (num >= 1_000_000_000)
//       return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
//     if (num >= 1_000_000)
//       return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
//     if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
//     return num.toString();
//   };

//   // ─── Fetch channel ───
//   useEffect(() => {
//     const fetchChannel = async () => {
//       if (!id) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const token = await AsyncStorage.getItem("token");

//         const res = await fetch(`${API_BASE}/channel/${id}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });

//         const data = await res.json();

//         if (data.success && data.channel) {
//           setChannel(data.channel);
//           setSubscribersCount(data.channel.subscribersCount || 0);
//           setIsSubscribed(Boolean(data.channel.isSubscribed));
//           setVideos(data.videos || []);
//         } else {
//           setChannel(null);
//           setVideos([]);
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setChannel(null);
//         setVideos([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChannel();
//   }, [id]);

//   // ─── Subscribe / Unsubscribe ───
//   const handleSubscribe = async () => {
//     if (!id) return;
//     setSubscribeLoading(true);
//     const token = await AsyncStorage.getItem("token");

//     if (!token) {
//       Alert.alert("Login required", "Please login to subscribe");
//       setSubscribeLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/subscribe/${id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();

//       if (data.success) {
//         setIsSubscribed(data.subscribed);
//         if (typeof data.subscribersCount === "number") {
//           setSubscribersCount(data.subscribersCount);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Something went wrong");
//     } finally {
//       setSubscribeLoading(false);
//     }
//   };

//   // ─── Open video ───
//   const openVideo = (video) => {
//     navigation.navigate("VideoDetail", {
//       id: video._id,
//       item: {
//         id: video._id,
//         title: video.title || video.name,
//         thumb: getMediaUrl(video.thumbnail),
//         videofile: getMediaUrl(video.videofile || video.videoUrl || video.video),
//         description: video.description || "",
//         views: video.views || 0,
//       },
//     });
//   };

//   // ─── Loading ───
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#ef4444" />
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   const avatarUrl =
//     getMediaUrl(channel?.channelImage) ||
//     "https://via.placeholder.com/150";

//   // ─── Video row ───
//   const renderVideo = ({ item: video }) => (
//     <TouchableOpacity
//       style={styles.videoRow}
//       activeOpacity={0.8}
//       onPress={() => openVideo(video)}
//     >
//       <View style={styles.thumbWrapper}>
//         <Image
//           source={{
//             uri:
//               getMediaUrl(video.thumbnail) ||
//               "https://via.placeholder.com/246x138",
//           }}
//           style={styles.thumb}
//         />
//         <View style={styles.durationBadge}>
//           <Text style={styles.durationText}>
//             {video.duration || "0:00"}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.videoInfo}>
//         <Text style={styles.videoTitle} numberOfLines={2}>
//           {video.title || video.name}
//         </Text>
//         <Text style={styles.videoMeta} numberOfLines={1}>
//           {channel?.name} • {formatCount(video.views)} views
//           {video.createdAt
//             ? ` • ${new Date(video.createdAt).toLocaleDateString()}`
//             : ""}
//         </Text>
//         {video.description ? (
//           <Text style={styles.videoDesc} numberOfLines={2}>
//             {video.description}
//           </Text>
//         ) : null}
//       </View>

//       <TouchableOpacity
//         style={styles.moreBtn}
//         onPress={() => {}}
//         hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//       >
//         <MoreVertical size={18} color="#a1a1aa" />
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* ========== CHANNEL HEADER ========== */}
//         <View style={styles.header}>
//           <Image source={{ uri: avatarUrl }} style={styles.avatar} />

//           <View style={styles.headerInfo}>
//             <View style={styles.nameRow}>
//               <Text style={styles.channelName} numberOfLines={1}>
//                 {channel?.name || "Channel Name"}
//               </Text>
//             </View>

//             <Text style={styles.handleRow}>
//               @{channel?.handle || channel?.name?.replace(/\s+/g, "") || "channel"}
//               {"  •  "}
//               {formatCount(subscribersCount)} subscribers
//               {"  •  "}
//               {formatCount(channel?.videoCount || videos.length)} videos
//             </Text>

//             <Text style={styles.description} numberOfLines={3}>
//               {channel?.description ||
//                 channel?.channeldescription ||
//                 "No description available"}
//             </Text>

//             {/* Subscribe button */}
//             <TouchableOpacity
//               style={[
//                 styles.subscribeBtn,
//                 isSubscribed && styles.subscribedBtn,
//               ]}
//               onPress={handleSubscribe}
//               disabled={subscribeLoading}
//               activeOpacity={0.8}
//             >
//               {subscribeLoading ? (
//                 <ActivityIndicator
//                   size="small"
//                   color={isSubscribed ? "#fff" : "#000"}
//                 />
//               ) : isSubscribed ? (
//                 <>
//                   <Bell size={16} color="#fff" />
//                   <Text style={styles.subscribedText}>Subscribed</Text>
//                   <ChevronDown size={16} color="#fff" />
//                 </>
//               ) : (
//                 <Text style={styles.subscribeText}>Subscribe</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* ========== TABS ========== */}
//         <View style={styles.tabsContainer}>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.tabsScroll}
//           >
//             {tabs.map((tab) => (
//               <TouchableOpacity
//                 key={tab}
//                 style={[styles.tab, activeTab === tab && styles.tabActive]}
//                 onPress={() => setActiveTab(tab)}
//               >
//                 <Text
//                   style={[
//                     styles.tabText,
//                     activeTab === tab && styles.tabTextActive,
//                   ]}
//                 >
//                   {tab}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>

//           <TouchableOpacity style={styles.searchBtn}>
//             <Search size={20} color="#a1a1aa" />
//           </TouchableOpacity>
//         </View>

//         {/* ========== VIDEOS ========== */}
//         <View style={styles.videosSection}>
//           {videos.length === 0 ? (
//             <Text style={styles.emptyText}>
//               No videos found for this channel.
//             </Text>
//           ) : (
//             <FlatList
//               data={videos}
//               keyExtractor={(item) => item._id}
//               renderItem={renderVideo}
//               scrollEnabled={false}
//             />
//           )}
//         </View>

//         {/* ========== PLAYLIST PREVIEW ========== */}
//         {videos.length > 0 && (
//           <View style={styles.playlistSection}>
//             <View style={styles.playlistHeader}>
//               <Text style={styles.playlistTitle}>
//                 {channel?.name} - Playlist
//               </Text>
//               <TouchableOpacity style={styles.playAllBtn}>
//                 <Play size={14} color="#fff" fill="#fff" />
//                 <Text style={styles.playAllText}>Play all</Text>
//               </TouchableOpacity>
//             </View>

//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{ gap: 10, paddingRight: 16 }}
//             >
//               {videos.slice(0, 6).map((video) => (
//                 <TouchableOpacity
//                   key={video._id + "-pl"}
//                   style={styles.playlistCard}
//                   onPress={() => openVideo(video)}
//                   activeOpacity={0.85}
//                 >
//                   <View style={styles.playlistThumbWrapper}>
//                     <Image
//                       source={{
//                         uri:
//                           getMediaUrl(video.thumbnail) ||
//                           "https://via.placeholder.com/210x118",
//                       }}
//                       style={styles.playlistThumb}
//                     />
//                     <View style={styles.durationBadge}>
//                       <Text style={styles.durationText}>
//                         {video.duration || "0:00"}
//                       </Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </View>
//   );
// }

// // ────────────────────────────────────────────────
// // Styles
// // ────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0f0f0f",
//   },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: "#0f0f0f",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     color: "#a1a1aa",
//     marginTop: 12,
//   },

//   // Header
//   header: {
//     flexDirection: "row",
//     padding: 16,
//     gap: 14,
//     alignItems: "flex-start",
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "#272727",
//     borderWidth: 1,
//     borderColor: "#333",
//   },
//   headerInfo: {
//     flex: 1,
//   },
//   nameRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   channelName: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "700",
//     flexShrink: 1,
//   },
//   handleRow: {
//     color: "#a1a1aa",
//     fontSize: 13,
//     marginTop: 4,
//   },
//   description: {
//     color: "#d4d4d8",
//     fontSize: 13,
//     marginTop: 8,
//     lineHeight: 18,
//   },

//   // Subscribe
//   subscribeBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     alignSelf: "flex-start",
//     marginTop: 12,
//     backgroundColor: "#fff",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//   },
//   subscribedBtn: {
//     backgroundColor: "#272727",
//     borderWidth: 1,
//     borderColor: "#333",
//   },
//   subscribeText: {
//     color: "#000",
//     fontWeight: "600",
//     fontSize: 13,
//   },
//   subscribedText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 13,
//   },

//   // Tabs
//   tabsContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: "#272727",
//     paddingLeft: 8,
//   },
//   tabsScroll: {
//     flexGrow: 1,
//   },
//   tab: {
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//   },
//   tabActive: {
//     borderBottomWidth: 2,
//     borderBottomColor: "#fff",
//   },
//   tabText: {
//     color: "#a1a1aa",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   tabTextActive: {
//     color: "#fff",
//   },
//   searchBtn: {
//     padding: 12,
//   },

//   // Videos
//   videosSection: {
//     paddingHorizontal: 12,
//     paddingTop: 12,
//   },
//   emptyText: {
//     color: "#71717a",
//     textAlign: "center",
//     paddingVertical: 40,
//     fontSize: 14,
//   },
//   videoRow: {
//     flexDirection: "row",
//     marginBottom: 16,
//     gap: 10,
//   },
//   thumbWrapper: {
//     width: SCREEN_WIDTH * 0.42,
//     aspectRatio: 16 / 9,
//     borderRadius: 10,
//     overflow: "hidden",
//     backgroundColor: "#1a1a1a",
//   },
//   thumb: {
//     width: "100%",
//     height: "100%",
//   },
//   durationBadge: {
//     position: "absolute",
//     bottom: 4,
//     right: 4,
//     backgroundColor: "rgba(0,0,0,0.85)",
//     paddingHorizontal: 5,
//     paddingVertical: 2,
//     borderRadius: 3,
//   },
//   durationText: {
//     color: "#fff",
//     fontSize: 11,
//     fontWeight: "600",
//   },
//   videoInfo: {
//     flex: 1,
//     paddingTop: 2,
//   },
//   videoTitle: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "600",
//     lineHeight: 18,
//   },
//   videoMeta: {
//     color: "#a1a1aa",
//     fontSize: 12,
//     marginTop: 4,
//   },
//   videoDesc: {
//     color: "#71717a",
//     fontSize: 12,
//     marginTop: 4,
//     lineHeight: 16,
//   },
//   moreBtn: {
//     paddingTop: 4,
//     paddingLeft: 4,
//   },

//   // Playlist
//   playlistSection: {
//     marginTop: 8,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: "#272727",
//     paddingLeft: 12,
//   },
//   playlistHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//     paddingRight: 12,
//   },
//   playlistTitle: {
//     color: "#e4e4e7",
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   playAllBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     backgroundColor: "#272727",
//   },
//   playAllText: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "500",
//   },
//   playlistCard: {
//     width: 160,
//   },
//   playlistThumbWrapper: {
//     width: 160,
//     aspectRatio: 16 / 9,
//     borderRadius: 10,
//     overflow: "hidden",
//     backgroundColor: "#1a1a1a",
//   },
//   playlistThumb: {
//     width: "100%",
//     height: "100%",
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Bell,
  Search,
  MoreVertical,
  Play,
  ChevronDown,
  ChevronRight,
} from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BACKEND_URL = "https://bharat-pay-3.onrender.com";
const API_BASE = `${BACKEND_URL}/api/uservideo`;

export default function SubscribedChannels() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  // List mode (no id)
  const [subscribedList, setSubscribedList] = useState([]);
  const [listLoading, setListLoading] = useState(!id);

  // Detail mode (with id)
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [loading, setLoading] = useState(!!id);

  const tabs = ["Home", "Videos", "Playlists"];

  const getMediaUrl = (path) => {
    if (!path) return null;
    const cleaned = String(path).replace(/\\/g, "/");
    if (cleaned.startsWith("http")) return cleaned;
    return `${BACKEND_URL}/${cleaned}`;
  };

  const formatCount = (num) => {
    if (!num) return "0";
    if (num >= 1_000_000_000)
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return String(num);
  };

  // ─── LIST: subscribed channels ───
  useEffect(() => {
    if (id) return;

    const fetchSubscribed = async () => {
      try {
        setListLoading(true);
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setSubscribedList([]);
          return;
        }

        const res = await fetch(`${API_BASE}/subscribed-channels`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        // flexible response shapes
        const list =
          data.channels ||
          data.subscribedChannels ||
          data.data ||
          (Array.isArray(data) ? data : []);

        setSubscribedList(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Subscribed list error:", err);
        setSubscribedList([]);
      } finally {
        setListLoading(false);
      }
    };

    fetchSubscribed();
  }, [id]);

  // ─── DETAIL: single channel ───
  useEffect(() => {
    if (!id) return;

    const fetchChannel = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");

        const res = await fetch(`${API_BASE}/channel/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = await res.json();

        if (data.success && data.channel) {
          setChannel(data.channel);
          setSubscribersCount(
            data.channel.subscribersCount ?? data.channel.subscribers ?? 0
          );
          setIsSubscribed(Boolean(data.channel.isSubscribed ?? true));
          setVideos(data.videos || []);
        } else {
          // fallback: try videos endpoint
          setChannel(data.channel || { _id: id, name: "Channel" });
          setVideos(data.videos || []);
        }

        // also try channel videos if empty
        if ((!data.videos || data.videos.length === 0) && token) {
          try {
            const vRes = await fetch(`${API_BASE}/channel/${id}/videos`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (vRes.ok) {
              const vData = await vRes.json();
              setVideos(vData.videos || []);
            }
          } catch (_) {}
        }
      } catch (err) {
        console.error("Fetch channel error:", err);
        setChannel(null);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [id]);

  // ─── Subscribe toggle ───
  const handleSubscribe = async () => {
    if (!id) return;
    setSubscribeLoading(true);
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert("Login required", "Please login to subscribe");
      setSubscribeLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/subscribe/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        setIsSubscribed(data.subscribed);
        if (typeof data.subscribersCount === "number") {
          setSubscribersCount(data.subscribersCount);
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setSubscribeLoading(false);
    }
  };

  const openChannel = (ch) => {
    const channelId = ch._id || ch.id || ch.channelId;
    if (!channelId) return;
    navigation.push("SubscribedChannels", { id: channelId });
  };

  const openVideo = (video) => {
    navigation.navigate("VideoDetail", {
      id: video._id,
      item: {
        id: video._id,
        title: video.title || video.name,
        thumb: getMediaUrl(video.thumbnail),
        videofile: getMediaUrl(
          video.videofile || video.videoUrl || video.video
        ),
        description: video.description || "",
        views: video.views || 0,
        likes: video.likesCount ?? video.likes ?? 0,
        dislikes: video.dislikesCount ?? video.dislikes ?? 0,
      },
    });
  };

  // ═══════════════ LIST MODE (no id) ═══════════════
  if (!id) {
    if (listLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={styles.loadingText}>Loading subscriptions...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Subscriptions</Text>
          <Text style={styles.listSubtitle}>
            {subscribedList.length} channel
            {subscribedList.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {subscribedList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No subscribed channels yet</Text>
            <Text style={styles.emptyHint}>
              Subscribe to channels to see them here
            </Text>
          </View>
        ) : (
          <FlatList
            data={subscribedList}
            keyExtractor={(item) =>
              String(item._id || item.id || item.channelId)
            }
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            renderItem={({ item: ch }) => {
              const avatar =
                getMediaUrl(ch.channelImage || ch.avatar || ch.image) ||
                "https://via.placeholder.com/80";
              const name = ch.name || ch.channelName || "Channel";
              const subs =
                ch.subscribersCount ?? ch.subscribers ?? ch.subscriberCount ?? 0;

              return (
                <TouchableOpacity
                  style={styles.channelRow}
                  activeOpacity={0.8}
                  onPress={() => openChannel(ch)}
                >
                  <Image source={{ uri: avatar }} style={styles.listAvatar} />
                  <View style={styles.channelRowInfo}>
                    <Text style={styles.channelRowName} numberOfLines={1}>
                      {name}
                    </Text>
                    <Text style={styles.channelRowMeta}>
                      {formatCount(subs)} subscribers
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#71717a" />
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    );
  }

  // ═══════════════ DETAIL MODE (with id) ═══════════════
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>Loading channel...</Text>
      </View>
    );
  }

  const avatarUrl =
    getMediaUrl(channel?.channelImage) || "https://via.placeholder.com/150";

  const renderVideo = ({ item: video }) => (
    <TouchableOpacity
      style={styles.videoRow}
      activeOpacity={0.8}
      onPress={() => openVideo(video)}
    >
      <View style={styles.thumbWrapper}>
        <Image
          source={{
            uri:
              getMediaUrl(video.thumbnail) ||
              "https://via.placeholder.com/246x138",
          }}
          style={styles.thumb}
        />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration || "0:00"}</Text>
        </View>
      </View>

      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {video.title || video.name}
        </Text>
        <Text style={styles.videoMeta} numberOfLines={1}>
          {channel?.name} • {formatCount(video.views)} views
          {video.createdAt
            ? ` • ${new Date(video.createdAt).toLocaleDateString()}`
            : ""}
        </Text>
        {video.description ? (
          <Text style={styles.videoDesc} numberOfLines={2}>
            {video.description}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity style={styles.moreBtn} hitSlop={10}>
        <MoreVertical size={18} color="#a1a1aa" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />

          <View style={styles.headerInfo}>
            <Text style={styles.channelName} numberOfLines={1}>
              {channel?.name || "Channel Name"}
            </Text>

            <Text style={styles.handleRow}>
              @
              {channel?.handle ||
                channel?.name?.replace(/\s+/g, "") ||
                "channel"}
              {"  •  "}
              {formatCount(subscribersCount)} subscribers
              {"  •  "}
              {formatCount(channel?.videoCount || videos.length)} videos
            </Text>

            <Text style={styles.description} numberOfLines={3}>
              {channel?.description ||
                channel?.channeldescription ||
                "No description available"}
            </Text>

            <TouchableOpacity
              style={[
                styles.subscribeBtn,
                isSubscribed && styles.subscribedBtn,
              ]}
              onPress={handleSubscribe}
              disabled={subscribeLoading}
              activeOpacity={0.8}
            >
              {subscribeLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isSubscribed ? "#fff" : "#000"}
                />
              ) : isSubscribed ? (
                <>
                  <Bell size={16} color="#fff" />
                  <Text style={styles.subscribedText}>Subscribed</Text>
                  <ChevronDown size={16} color="#fff" />
                </>
              ) : (
                <Text style={styles.subscribeText}>Subscribe</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.searchBtn}>
            <Search size={20} color="#a1a1aa" />
          </TouchableOpacity>
        </View>

        {/* Videos */}
        <View style={styles.videosSection}>
          {videos.length === 0 ? (
            <Text style={styles.emptyText}>
              No videos found for this channel.
            </Text>
          ) : (
            <FlatList
              data={videos}
              keyExtractor={(item) => item._id}
              renderItem={renderVideo}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Playlist preview */}
        {videos.length > 0 && (
          <View style={styles.playlistSection}>
            <View style={styles.playlistHeader}>
              <Text style={styles.playlistTitle}>
                {channel?.name} - Playlist
              </Text>
              <TouchableOpacity style={styles.playAllBtn}>
                <Play size={14} color="#fff" fill="#fff" />
                <Text style={styles.playAllText}>Play all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingRight: 16 }}
            >
              {videos.slice(0, 6).map((video) => (
                <TouchableOpacity
                  key={video._id + "-pl"}
                  style={styles.playlistCard}
                  onPress={() => openVideo(video)}
                  activeOpacity={0.85}
                >
                  <View style={styles.playlistThumbWrapper}>
                    <Image
                      source={{
                        uri:
                          getMediaUrl(video.thumbnail) ||
                          "https://via.placeholder.com/210x118",
                      }}
                      style={styles.playlistThumb}
                    />
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>
                        {video.duration || "0:00"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: "#a1a1aa",
    marginTop: 12,
  },

  // List mode
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  listSubtitle: {
    color: "#a1a1aa",
    fontSize: 13,
    marginTop: 4,
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyHint: {
    color: "#71717a",
    fontSize: 13,
    marginTop: 6,
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#272727",
  },
  listAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#272727",
  },
  channelRowInfo: {
    flex: 1,
    marginLeft: 12,
  },
  channelRowName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  channelRowMeta: {
    color: "#a1a1aa",
    fontSize: 12,
    marginTop: 2,
  },

  // Detail header
  header: {
    flexDirection: "row",
    padding: 16,
    gap: 14,
    alignItems: "flex-start",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#272727",
    borderWidth: 1,
    borderColor: "#333",
  },
  headerInfo: {
    flex: 1,
  },
  channelName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  handleRow: {
    color: "#a1a1aa",
    fontSize: 13,
    marginTop: 4,
  },
  description: {
    color: "#d4d4d8",
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  subscribeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: 12,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  subscribedBtn: {
    backgroundColor: "#272727",
    borderWidth: 1,
    borderColor: "#333",
  },
  subscribeText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 13,
  },
  subscribedText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  // Tabs
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#272727",
    paddingLeft: 8,
  },
  tabsScroll: {
    flexGrow: 1,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  tabText: {
    color: "#a1a1aa",
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
  },
  searchBtn: {
    padding: 12,
  },

  // Videos
  videosSection: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  videoRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
  },
  thumbWrapper: {
    width: SCREEN_WIDTH * 0.42,
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  durationBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  durationText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  videoInfo: {
    flex: 1,
    paddingTop: 2,
  },
  videoTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
  },
  videoMeta: {
    color: "#a1a1aa",
    fontSize: 12,
    marginTop: 4,
  },
  videoDesc: {
    color: "#71717a",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  moreBtn: {
    paddingTop: 4,
    paddingLeft: 4,
  },

  // Playlist
  playlistSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#272727",
    paddingLeft: 12,
  },
  playlistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingRight: 12,
  },
  playlistTitle: {
    color: "#e4e4e7",
    fontSize: 15,
    fontWeight: "600",
  },
  playAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#272727",
  },
  playAllText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  playlistCard: {
    width: 160,
  },
  playlistThumbWrapper: {
    width: 160,
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  playlistThumb: {
    width: "100%",
    height: "100%",
  },
});
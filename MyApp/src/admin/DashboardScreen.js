// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   Dimensions,
//   StyleSheet,
//   TouchableOpacity,
//   Pressable,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { ChevronRight, Play, Plus, Info } from "lucide-react-native";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// const CARD_WIDTH = SCREEN_WIDTH * 0.65;
// const CARD_HEIGHT = CARD_WIDTH * 0.5625;
// const SPACING = 12;

// const BACKEND_URL = "https://bharat-pay-3.onrender.com"; // change to your real backend URL
// const API_BASE = `${BACKEND_URL}/api/uservideo`;

// // Fallback static data (same as web)
// const romanticShows = [
//   {
//     id: 1,
//     title: "Love in the Clouds",
//     thumb:
//       "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=225&fit=crop",
//   },
//   {
//     id: 2,
//     title: "Hidden Love",
//     thumb:
//       "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400&h=225&fit=crop",
//   },
//   {
//     id: 3,
//     title: "Queen of Tears",
//     thumb:
//       "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=225&fit=crop",
//   },
//   {
//     id: 4,
//     title: "Inheritors",
//     thumb:
//       "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop",
//   },
//   {
//     id: 5,
//     title: "When I Fly Towards You",
//     thumb:
//       "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=400&h=225&fit=crop",
//   },
// ];

// const kidsFilms = [
//   {
//     id: 101,
//     title: "Chhota Bheem: The Crown",
//     thumb:
//       "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=225&fit=crop",
//   },
//   {
//     id: 102,
//     title: "Motu Patlu: Kung Fu",
//     thumb:
//       "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=225&fit=crop",
//   },
//   {
//     id: 103,
//     title: "Doraemon: Nobita",
//     thumb:
//       "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=225&fit=crop",
//   },
//   {
//     id: 104,
//     title: "Oggy & Cockroaches",
//     thumb:
//       "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=225&fit=crop",
//   },
//   {
//     id: 105,
//     title: "Shinchan Movie",
//     thumb:
//       "https://images.unsplash.com/photo-1606164587034-81b84c4e11d0?w=400&h=225&fit=crop",
//   },
//   {
//     id: 106,
//     title: "Tom & Jerry",
//     thumb:
//       "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=225&fit=crop",
//   },
// ];

// const koreanContent = [
//   {
//     id: 201,
//     title: "Vincenzo",
//     thumb:
//       "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=225&fit=crop",
//   },
//   {
//     id: 202,
//     title: "Crash Landing on You",
//     thumb:
//       "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=225&fit=crop",
//   },
//   {
//     id: 203,
//     title: "Squid Game",
//     thumb:
//       "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=225&fit=crop",
//   },
//   {
//     id: 204,
//     title: "Weak Hero Class 1",
//     thumb:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
//   },
//   {
//     id: 205,
//     title: "Moving",
//     thumb:
//       "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=225&fit=crop",
//   },
//   {
//     id: 206,
//     title: "Sweet Home",
//     thumb:
//       "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=225&fit=crop",
//   },
// ];

// const actionMovies = [
//   {
//     id: 301,
//     title: "Extraction 2",
//     thumb:
//       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
//   },
//   {
//     id: 304,
//     title: "Top Gun: Maverick",
//     thumb:
//       "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=225&fit=crop",
//   },
// ];

// const trendingShorts = [
//   ...koreanContent.slice(0, 3),
//   ...actionMovies.slice(0, 2),
//   {
//     id: 401,
//     title: "Viral Dance",
//     thumb:
//       "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
//   },
//   {
//     id: 402,
//     title: "Funny Reels",
//     thumb:
//       "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=225&fit=crop",
//   },
// ];

// // ────────────────────────────────────────────────
// // Components
// // ────────────────────────────────────────────────

// function SectionHeader({ title }) {
//   return (
//     <View style={styles.sectionHeader}>
//       <Text style={styles.sectionTitle}>{title}</Text>
//       <ChevronRight size={20} color="#aaa" />
//     </View>
//   );
// }

// function MovieCard({ item, onPress, onAddToWatchLater }) {
//   const [pressed, setPressed] = useState(false);
//   const [adding, setAdding] = useState(false);

//   const handlePlusPress = async () => {
//     if (adding || !onAddToWatchLater) return;
//     setAdding(true);
//     try {
//       await onAddToWatchLater(item);
//     } finally {
//       setAdding(false);
//     }
//   };

//   return (
//     <Pressable
//       onPress={() => onPress(item)}
//       onPressIn={() => setPressed(true)}
//       onPressOut={() => setPressed(false)}
//       style={[styles.cardContainer, pressed && styles.cardPressed]}
//     >
//       <Image
//         source={{ uri: item.thumb }}
//         style={styles.cardImage}
//         resizeMode="cover"
//       />

//       {pressed && (
//         <View style={styles.cardOverlay}>
//           <View style={styles.cardControls}>
//             <TouchableOpacity
//               style={styles.iconButton}
//               onPress={() => onPress(item)}
//             >
//               <Play size={18} color="black" fill="black" />
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.iconButtonOutline}
//               onPress={handlePlusPress}
//               disabled={adding}
//             >
//               <Plus size={18} color="white" />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.iconButtonOutline}>
//               <Info size={18} color="white" />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.cardTitle} numberOfLines={1}>
//             {item.title}
//           </Text>
//         </View>
//       )}

//       {/* Progress + views (same as web) */}
//       <View style={styles.progressContainer}>
//         <View style={styles.progressBg}>
//           <View style={[styles.progressFill, { width: "70%" }]} />
//         </View>
//         <Text style={styles.progressText}>
//           {item.views?.toLocaleString?.() || item.views || 0} views
//         </Text>
//       </View>
//     </Pressable>
//   );
// }

// function ShortItem({ item, onPress }) {
//   return (
//     <TouchableOpacity
//       onPress={() => onPress(item)}
//       style={styles.shortItem}
//       activeOpacity={0.8}
//     >
//       <View style={styles.shortImageContainer}>
//         <Image
//           source={{ uri: item.thumb }}
//           style={styles.shortImage}
//           resizeMode="cover"
//         />
//         <View style={styles.rankBadge}>
//           <Text style={styles.rankText}>#{item.id % 10 || 1}</Text>
//         </View>
//       </View>
//       <Text style={styles.shortTitle} numberOfLines={1}>
//         {item.title}
//       </Text>
//     </TouchableOpacity>
//   );
// }

// // ────────────────────────────────────────────────
// // Main Screen
// // ────────────────────────────────────────────────

// export default function DashboardScreen() {
//   const navigation = useNavigation();

//   const [recommendedVideos, setRecommendedVideos] = useState([]);
//   const [recommendedLoading, setRecommendedLoading] = useState(true);

//   const [trendingVideos, setTrendingVideos] = useState([]);
//   const [trendingLoading, setTrendingLoading] = useState(true);

//   const [latestVideos, setLatestVideos] = useState([]);
//   const [latestLoading, setLatestLoading] = useState(true);

//   const [subscriptionVideos, setSubscriptionVideos] = useState([]);
//   const [subscriptionLoading, setSubscriptionLoading] = useState(true);

//   // ─── Fetch helpers ───
//   const normalizeVideos = (videos = []) =>
//     videos.slice(0, 8).map((video) => ({
//       id: video._id || video.id,
//       title: video.title || "Untitled video",
//       thumb: video.thumbnail
//         ? `${BACKEND_URL}/${video.thumbnail.replace(/\\/g, "/")}`
//         : "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
//       description: video.description || "",
//       duration: video.duration || "",
//       views: video.views || 0,
//       category: video.category || null,
//     }));

//   const fetchWithAuth = async (endpoint) => {
//     const token = await AsyncStorage.getItem("token");
//     if (!token) return [];

//     const response = await fetch(`${API_BASE}/${endpoint}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
//     const data = await response.json();
//     return Array.isArray(data.videos) ? data.videos : [];
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const videos = await fetchWithAuth("recommended");
//         setRecommendedVideos(normalizeVideos(videos));
//       } catch (e) {
//         console.error(e);
//         setRecommendedVideos([]);
//       } finally {
//         setRecommendedLoading(false);
//       }
//     };
//     load();
//   }, []);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const videos = await fetchWithAuth("trending");
//         setTrendingVideos(normalizeVideos(videos));
//       } catch (e) {
//         console.error(e);
//         setTrendingVideos([]);
//       } finally {
//         setTrendingLoading(false);
//       }
//     };
//     load();
//   }, []);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const videos = await fetchWithAuth("latest");
//         setLatestVideos(normalizeVideos(videos));
//       } catch (e) {
//         console.error(e);
//         setLatestVideos([]);
//       } finally {
//         setLatestLoading(false);
//       }
//     };
//     load();
//   }, []);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const videos = await fetchWithAuth("subscriptions");
//         setSubscriptionVideos(normalizeVideos(videos));
//       } catch (e) {
//         console.error(e);
//         setSubscriptionVideos([]);
//       } finally {
//         setSubscriptionLoading(false);
//       }
//     };
//     load();
//   }, []);

//   // ─── Handlers ───
//   const handleItemPress = (item) => {
//     navigation.navigate("VideoDetail", {
//       id: item.id,
//       item,
//     });
//   };

//   const handleAddToWatchLater = async (item) => {
//     const token = await AsyncStorage.getItem("token");
//     if (!token) {
//       Alert.alert("Login required", "Please login first");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/watch-later/${item.id}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await res.json();

//       if (data.success) {
//         Alert.alert("Success", data.message || "Added to Watch Later");
//       } else {
//         Alert.alert("Error", data.message || "Failed to add");
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Something went wrong");
//     }
//   };

//   // ─── Render helpers ───
//   const renderHorizontalList = (data, loading, emptyMessage) => {
//     if (loading) {
//       return (
//         <View style={{ paddingHorizontal: SPACING, paddingVertical: 20 }}>
//           <ActivityIndicator color="#e50914" />
//           <Text style={styles.loadingText}>Loading...</Text>
//         </View>
//       );
//     }

//     if (!data || data.length === 0) {
//       return <Text style={styles.emptyText}>{emptyMessage}</Text>;
//     }

//     return (
//       <FlatList
//         data={data}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={{ paddingHorizontal: SPACING }}
//         snapToInterval={CARD_WIDTH + SPACING}
//         decelerationRate="fast"
//         renderItem={({ item }) => (
//           <View style={{ width: CARD_WIDTH, marginRight: SPACING }}>
//             <MovieCard
//               item={item}
//               onPress={handleItemPress}
//               onAddToWatchLater={handleAddToWatchLater}
//             />
//           </View>
//         )}
//       />
//     );
//   };

//   const renderGrid = (data) => (
//     <FlatList
//       data={data}
//       numColumns={2}
//       keyExtractor={(item) => item.id.toString()}
//       columnWrapperStyle={{ gap: 12 }}
//       contentContainerStyle={{ paddingHorizontal: SPACING, paddingBottom: 12 }}
//       scrollEnabled={false}
//       renderItem={({ item }) => (
//         <View style={{ flex: 1 }}>
//           <ShortItem item={item} onPress={handleItemPress} />
//         </View>
//       )}
//     />
//   );

//   const sections = [
//     {
//       key: "recommended",
//       title: "Recommended Videos",
//       type: "horizontal",
//       data: recommendedVideos,
//       loading: recommendedLoading,
//       empty: "No recommended videos available right now.",
//     },
//     {
//       key: "trending",
//       title: "Trending Videos",
//       type: "horizontal",
//       data: trendingVideos,
//       loading: trendingLoading,
//       empty: "No trending videos available right now.",
//     },
//     {
//       key: "shorts-trending",
//       title: "Trending Shorts",
//       type: "grid",
//       data: trendingShorts,
//     },
//     {
//       key: "latest",
//       title: "Latest Videos",
//       type: "horizontal",
//       data: latestVideos,
//       loading: latestLoading,
//       empty: "No latest videos available right now.",
//     },
//     {
//       key: "subscription",
//       title: "Subscription Videos",
//       type: "horizontal",
//       data: subscriptionVideos,
//       loading: subscriptionLoading,
//       empty: "Subscribe to channels to see their videos here.",
//     },
//     {
//       key: "shorts-top",
//       title: "Top Shorts",
//       type: "grid",
//       data: trendingShorts,
//     },
//   ];

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={sections}
//         keyExtractor={(item) => item.key}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingTop: 60, paddingBottom: 40 }}
//         renderItem={({ item }) => (
//           <View style={styles.section}>
//             <SectionHeader title={item.title} />
//             {item.type === "horizontal"
//               ? renderHorizontalList(item.data, item.loading, item.empty)
//               : renderGrid(item.data)}
//           </View>
//         )}
//         initialNumToRender={4}
//         maxToRenderPerBatch={6}
//         windowSize={5}
//       />
//     </View>
//   );
// }

// // ────────────────────────────────────────────────
// // Styles
// // ────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: SPACING,
//     marginBottom: 8,
//   },
//   sectionTitle: {
//     color: "white",
//     fontSize: 20,
//     fontWeight: "700",
//   },
//   cardContainer: {
//     borderRadius: 8,
//     overflow: "hidden",
//     backgroundColor: "#111",
//   },
//   cardImage: {
//     width: CARD_WIDTH,
//     height: CARD_HEIGHT,
//   },
//   cardPressed: {
//     transform: [{ scale: 1.04 }],
//   },
//   cardOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.65)",
//     justifyContent: "flex-end",
//     padding: 12,
//   },
//   cardControls: {
//     flexDirection: "row",
//     marginBottom: 8,
//   },
//   iconButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 8,
//   },
//   iconButtonOutline: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     borderWidth: 1.5,
//     borderColor: "rgba(255,255,255,0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 8,
//   },
//   cardTitle: {
//     color: "white",
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   progressContainer: {
//     marginTop: 6,
//     paddingHorizontal: 2,
//   },
//   progressBg: {
//     height: 3,
//     backgroundColor: "#444",
//     borderRadius: 2,
//     overflow: "hidden",
//   },
//   progressFill: {
//     height: "100%",
//     backgroundColor: "#e50914",
//   },
//   progressText: {
//     color: "#aaa",
//     fontSize: 12,
//     marginTop: 4,
//   },
//   shortItem: {
//     marginBottom: 16,
//   },
//   shortImageContainer: {
//     position: "relative",
//     aspectRatio: 16 / 9,
//     borderRadius: 8,
//     overflow: "hidden",
//   },
//   shortImage: {
//     flex: 1,
//   },
//   rankBadge: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   rankText: {
//     color: "white",
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   shortTitle: {
//     color: "white",
//     fontSize: 14,
//     marginTop: 6,
//     fontWeight: "500",
//   },
//   loadingText: {
//     color: "#aaa",
//     fontSize: 13,
//     marginTop: 8,
//     textAlign: "center",
//   },
//   emptyText: {
//     color: "#aaa",
//     fontSize: 14,
//     paddingHorizontal: SPACING,
//     paddingVertical: 12,
//   },
// });


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChevronRight, Play, Plus, Info } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CARD_WIDTH = SCREEN_WIDTH * 0.65;
const CARD_HEIGHT = CARD_WIDTH * 0.5625;
const SPACING = 12;

const BACKEND_URL = "https://bharat-pay-3.onrender.com";
const API_BASE = `${BACKEND_URL}/api/uservideo`;

// Fallback static data
const romanticShows = [
  {
    id: 1,
    title: "Love in the Clouds",
    thumb:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=225&fit=crop",
  },
  {
    id: 2,
    title: "Hidden Love",
    thumb:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400&h=225&fit=crop",
  },
  {
    id: 3,
    title: "Queen of Tears",
    thumb:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=225&fit=crop",
  },
  {
    id: 4,
    title: "Inheritors",
    thumb:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop",
  },
  {
    id: 5,
    title: "When I Fly Towards You",
    thumb:
      "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=400&h=225&fit=crop",
  },
];

const kidsFilms = [
  {
    id: 101,
    title: "Chhota Bheem: The Crown",
    thumb:
      "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=225&fit=crop",
  },
  {
    id: 102,
    title: "Motu Patlu: Kung Fu",
    thumb:
      "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=225&fit=crop",
  },
  {
    id: 103,
    title: "Doraemon: Nobita",
    thumb:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=225&fit=crop",
  },
  {
    id: 104,
    title: "Oggy & Cockroaches",
    thumb:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=225&fit=crop",
  },
  {
    id: 105,
    title: "Shinchan Movie",
    thumb:
      "https://images.unsplash.com/photo-1606164587034-81b84c4e11d0?w=400&h=225&fit=crop",
  },
  {
    id: 106,
    title: "Tom & Jerry",
    thumb:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=225&fit=crop",
  },
];

const koreanContent = [
  {
    id: 201,
    title: "Vincenzo",
    thumb:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=225&fit=crop",
  },
  {
    id: 202,
    title: "Crash Landing on You",
    thumb:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=225&fit=crop",
  },
  {
    id: 203,
    title: "Squid Game",
    thumb:
      "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=225&fit=crop",
  },
  {
    id: 204,
    title: "Weak Hero Class 1",
    thumb:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
  },
  {
    id: 205,
    title: "Moving",
    thumb:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=225&fit=crop",
  },
  {
    id: 206,
    title: "Sweet Home",
    thumb:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=225&fit=crop",
  },
];

const actionMovies = [
  {
    id: 301,
    title: "Extraction 2",
    thumb:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
  },
  {
    id: 304,
    title: "Top Gun: Maverick",
    thumb:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=225&fit=crop",
  },
];

const trendingShorts = [
  ...koreanContent.slice(0, 3),
  ...actionMovies.slice(0, 2),
  {
    id: 401,
    title: "Viral Dance",
    thumb:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
  },
  {
    id: 402,
    title: "Funny Reels",
    thumb:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=225&fit=crop",
  },
];

// ────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────

function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ChevronRight size={20} color="#aaa" />
    </View>
  );
}

function MovieCard({ item, onPress, onAddToWatchLater }) {
  const [pressed, setPressed] = useState(false);
  const [adding, setAdding] = useState(false);

  const handlePlusPress = async () => {
    if (adding || !onAddToWatchLater) return;
    setAdding(true);
    try {
      await onAddToWatchLater(item);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Pressable
      onPress={() => onPress(item)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.cardContainer, pressed && styles.cardPressed]}
    >
      <Image
        source={{ uri: item.thumb }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      {pressed && (
        <View style={styles.cardOverlay}>
          <View style={styles.cardControls}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onPress(item)}
            >
              <Play size={18} color="black" fill="black" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButtonOutline}
              onPress={handlePlusPress}
              disabled={adding}
            >
              <Plus size={18} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButtonOutline}>
              <Info size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      )}

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: "70%" }]} />
        </View>
        <Text style={styles.progressText}>
          {item.views?.toLocaleString?.() || item.views || 0} views
        </Text>
      </View>
    </Pressable>
  );
}

function ShortItem({ item, onPress }) {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={styles.shortItem}
      activeOpacity={0.8}
    >
      <View style={styles.shortImageContainer}>
        <Image
          source={{ uri: item.thumb }}
          style={styles.shortImage}
          resizeMode="cover"
        />
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{item.id % 10 || 1}</Text>
        </View>
      </View>
      <Text style={styles.shortTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

// ────────────────────────────────────────────────
// Main Screen
// ────────────────────────────────────────────────

export default function DashboardScreen() {
  const navigation = useNavigation();

  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(true);

  const [trendingVideos, setTrendingVideos] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const [latestVideos, setLatestVideos] = useState([]);
  const [latestLoading, setLatestLoading] = useState(true);

  const [subscriptionVideos, setSubscriptionVideos] = useState([]);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  // ─── Media URL helper (handles both full URL + relative path) ───
  const getMediaUrl = (path) => {
    if (!path) return null;
    const cleaned = String(path).replace(/\\/g, "/");
    if (cleaned.startsWith("http")) return cleaned;
    return `${BACKEND_URL}/${cleaned}`;
  };

  // ─── Normalize videos from API ───
  const normalizeVideos = (videos = []) =>
    videos.slice(0, 8).map((video) => ({
      id: video._id || video.id,
      title: video.title || video.name || "Untitled video",
      thumb:
        getMediaUrl(video.thumbnail) ||
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=225&fit=crop",
      videofile: getMediaUrl(
        video.videofile || video.videoUrl || video.video
      ),
      description: video.description || "",
      duration: video.duration || "",
      views: video.views || 0,
      likes: video.likes || 0,
      dislikes: video.dislikes || 0,
      category: video.category || null,
      channel: video.channel?.name || video.channelName || null,
    }));

  const fetchWithAuth = async (endpoint) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return [];

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
    const data = await response.json();
    return Array.isArray(data.videos) ? data.videos : [];
  };

  useEffect(() => {
    const load = async () => {
      try {
        const videos = await fetchWithAuth("recommended");
        setRecommendedVideos(normalizeVideos(videos));
      } catch (e) {
        console.error(e);
        setRecommendedVideos([]);
      } finally {
        setRecommendedLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const videos = await fetchWithAuth("trending");
        setTrendingVideos(normalizeVideos(videos));
      } catch (e) {
        console.error(e);
        setTrendingVideos([]);
      } finally {
        setTrendingLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const videos = await fetchWithAuth("latest");
        setLatestVideos(normalizeVideos(videos));
      } catch (e) {
        console.error(e);
        setLatestVideos([]);
      } finally {
        setLatestLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const videos = await fetchWithAuth("subscriptions");
        setSubscriptionVideos(normalizeVideos(videos));
      } catch (e) {
        console.error(e);
        setSubscriptionVideos([]);
      } finally {
        setSubscriptionLoading(false);
      }
    };
    load();
  }, []);

  // ─── Handlers ───
  const handleItemPress = (item) => {
    navigation.navigate("VideoDetail", {
      id: item.id,
      item,
    });
  };

  const handleAddToWatchLater = async (item) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Login required", "Please login first");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/watch-later/${item.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.success) {
        Alert.alert("Success", data.message || "Added to Watch Later");
      } else {
        Alert.alert("Error", data.message || "Failed to add");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  // ─── Render helpers ───
  const renderHorizontalList = (data, loading, emptyMessage) => {
    if (loading) {
      return (
        <View style={{ paddingHorizontal: SPACING, paddingVertical: 20 }}>
          <ActivityIndicator color="#e50914" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (!data || data.length === 0) {
      return <Text style={styles.emptyText}>{emptyMessage}</Text>;
    }

    return (
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={{ width: CARD_WIDTH, marginRight: SPACING }}>
            <MovieCard
              item={item}
              onPress={handleItemPress}
              onAddToWatchLater={handleAddToWatchLater}
            />
          </View>
        )}
      />
    );
  };

  const renderGrid = (data) => (
    <FlatList
      data={data}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={{ paddingHorizontal: SPACING, paddingBottom: 12 }}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={{ flex: 1 }}>
          <ShortItem item={item} onPress={handleItemPress} />
        </View>
      )}
    />
  );

  const sections = [
    {
      key: "recommended",
      title: "Recommended Videos",
      type: "horizontal",
      data: recommendedVideos,
      loading: recommendedLoading,
      empty: "No recommended videos available right now.",
    },
    {
      key: "trending",
      title: "Trending Videos",
      type: "horizontal",
      data: trendingVideos,
      loading: trendingLoading,
      empty: "No trending videos available right now.",
    },
    {
      key: "shorts-trending",
      title: "Trending Shorts",
      type: "grid",
      data: trendingShorts,
    },
    {
      key: "latest",
      title: "Latest Videos",
      type: "horizontal",
      data: latestVideos,
      loading: latestLoading,
      empty: "No latest videos available right now.",
    },
    {
      key: "subscription",
      title: "Subscription Videos",
      type: "horizontal",
      data: subscriptionVideos,
      loading: subscriptionLoading,
      empty: "Subscribe to channels to see their videos here.",
    },
    {
      key: "shorts-top",
      title: "Top Shorts",
      type: "grid",
      data: trendingShorts,
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <SectionHeader title={item.title} />
            {item.type === "horizontal"
              ? renderHorizontalList(item.data, item.loading, item.empty)
              : renderGrid(item.data)}
          </View>
        )}
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={5}
      />
    </View>
  );
}

// ────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING,
    marginBottom: 8,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  cardContainer: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  cardImage: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  cardPressed: {
    transform: [{ scale: 1.04 }],
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
    padding: 12,
  },
  cardControls: {
    flexDirection: "row",
    marginBottom: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  iconButtonOutline: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cardTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  progressContainer: {
    marginTop: 6,
    paddingHorizontal: 2,
  },
  progressBg: {
    height: 3,
    backgroundColor: "#444",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#e50914",
  },
  progressText: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
  },
  shortItem: {
    marginBottom: 16,
  },
  shortImageContainer: {
    position: "relative",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: "hidden",
  },
  shortImage: {
    flex: 1,
  },
  rankBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rankText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  shortTitle: {
    color: "white",
    fontSize: 14,
    marginTop: 6,
    fontWeight: "500",
  },
  loadingText: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
  },
  emptyText: {
    color: "#aaa",
    fontSize: 14,
    paddingHorizontal: SPACING,
    paddingVertical: 12,
  },
});
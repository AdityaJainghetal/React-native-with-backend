// // import React, { useState, useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   Image,
// //   TouchableOpacity,
// //   FlatList,
// //   Modal,
// //   TextInput,
// //   ScrollView,
// //   Switch,
// //   ActivityIndicator,
// //   Alert,
// //   StyleSheet,
// //   Dimensions,
// // } from "react-native";
// // import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
// // import { useNavigation, useRoute } from "@react-navigation/native";
// // import * as ImagePicker from "expo-image-picker";
// // import { VideoView, useVideoPlayer } from "expo-video";
// // import { Picker } from "@react-native-picker/picker";
// // import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// // const { width } = Dimensions.get("window");

// // const API_BASE = "https://bharat-pay-3.onrender.com/api";
// // const BACKEND_URL = "https://bharat-pay-3.onrender.com";

// // const STATIC_CATEGORIES = [
// //   { _id: "1", name: "Gaming" },
// //   { _id: "2", name: "Education" },
// //   { _id: "3", name: "Entertainment" },
// //   { _id: "4", name: "Music" },
// //   { _id: "5", name: "Technology" },
// //   { _id: "6", name: "Sports" },
// //   { _id: "7", name: "Cooking" },
// //   { _id: "8", name: "Travel" },
// // ];

// // const getToken = () =>
// //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWI2ZjlkYmI3YjJjMTI5ZjM5MTI1MzciLCJpYXQiOjE3NzQ1OTQ3OTUsImV4cCI6MTc3NTE5OTU5NX0.b0MeF1JbY4fL6TQqVWBc4wuqvAZQSCoAE4Y_9FllR-k";
// // const getUserId = () => "69b6f9dbb7b2c129f3912537";

// // export default function ChannelPage() {
// //   const navigation = useNavigation();
// //   const route = useRoute();
// //   const { handle: urlHandle } = route.params || {};

// //   const [channels, setChannels] = useState([]);
// //   const [selectedChannelId, setSelectedChannelId] = useState(null);
// //   const [channel, setChannel] = useState(null);
// //   const [categories, setCategories] = useState(STATIC_CATEGORIES);
// //   const [activeTab, setActiveTab] = useState("Videos");
// //   const [loading, setLoading] = useState(true);
// //   const [showChannelDropdown, setShowChannelDropdown] = useState(false);

// //   // Subscription
// //   const [isSubscribed, setIsSubscribed] = useState(false);
// //   const [subscribersCount, setSubscribersCount] = useState(0);

// //   // Create Channel Modal
// //   const [showCreateModal, setShowCreateModal] = useState(false);
// //   const [newChannel, setNewChannel] = useState({
// //     name: "",
// //     channelDescription: "",
// //     category: "",
// //     channelImageUri: null,
// //     channelBannerUri: null,
// //     contactemail: "",
// //   });
// //   const [createError, setCreateError] = useState("");

// //   // Upload Video Modal
// //   const [showUploadModal, setShowUploadModal] = useState(false);
// //   const [selectedUploadChannelId, setSelectedUploadChannelId] = useState("");
// //   const [videoUri, setVideoUri] = useState(null);
// //   const [thumbnailUri, setThumbnailUri] = useState(null);
// //   const [videoname, setVideoname] = useState("");
// //   const [videoDescription, setVideoDescription] = useState("");
// //   const [videoCategory, setVideoCategory] = useState("");
// //   const [agreeTerms, setAgreeTerms] = useState(false);
// //   const [uploadError, setUploadError] = useState("");
// //   const [uploading, setUploading] = useState(false);

// //   // Video Player
// //   const [showVideoPlayer, setShowVideoPlayer] = useState(false);
// //   const [currentVideo, setCurrentVideo] = useState(null);

// //   // Helper to get full image URL
// //   const getFullUrl = (path) => {
// //     if (!path) return "https://picsum.photos/id/1015/800/300";
// //     if (path.startsWith("http")) return path;
// //     return `${BACKEND_URL}/${path}`;
// //   };

// //   // Fetch Categories
// //   useEffect(() => {
// //     const fetchCategories = async () => {
// //       try {
// //         const res = await fetch(`${API_BASE}/category`);
// //         if (res.ok) {
// //           const data = await res.json();
// //           setCategories(
// //             Array.isArray(data) && data.length > 0 ? data : STATIC_CATEGORIES,
// //           );
// //         }
// //       } catch (e) {
// //         setCategories(STATIC_CATEGORIES);
// //       }
// //     };
// //     fetchCategories();
// //   }, []);

// //   // Fetch User's Channels
// //   useEffect(() => {
// //     const fetchUserChannels = async () => {
// //       const token = getToken();
// //       if (!token) {
// //         setLoading(false);
// //         Alert.alert("Login Required", "Please login first.");
// //         return;
// //       }

// //       try {
// //         setLoading(true);
// //         const res = await fetch(`${API_BASE}/uservideo/channel`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });

// //         if (!res.ok) throw new Error("Failed to fetch channels");

// //         const data = await res.json();
// //         const userChannels = data.channels || [];
// //         setChannels(userChannels);

// //         let initialId = null;
// //         if (urlHandle) {
// //           const matched = userChannels.find(
// //             (ch) =>
// //               ch.name?.replace(/\s+/g, "").toLowerCase() ===
// //               urlHandle.toLowerCase(),
// //           );
// //           if (matched) initialId = matched._id;
// //         }
// //         if (!initialId && userChannels.length > 0)
// //           initialId = userChannels[0]._id;

// //         setSelectedChannelId(initialId);
// //       } catch (err) {
// //         console.error("Error fetching channels:", err);
// //         Alert.alert("Error", err.message || "Failed to load channels");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchUserChannels();
// //   }, [urlHandle]);

// //   // Fetch Selected Channel + Videos
// //   useEffect(() => {
// //     if (!selectedChannelId) return;

// //     const fetchChannelVideos = async () => {
// //       const token = getToken();
// //       if (!token) return;

// //       try {
// //         const selected = channels.find((c) => c._id === selectedChannelId);
// //         if (!selected) return;

// //         const videosRes = await fetch(
// //           `${API_BASE}/uservideo/channel/${selectedChannelId}/videos`,
// //           { headers: { Authorization: `Bearer ${token}` } },
// //         );

// //         let videos = [];
// //         if (videosRes.ok) {
// //           const result = await videosRes.json();
// //           videos = result.videos || [];
// //         }

// //         const cleanHandle = selected.name?.replace(/\s+/g, "") || selected._id;

// //         const channelData = {
// //           ...selected,
// //           handle: `@${cleanHandle}`,
// //           avatar: getFullUrl(selected.channelImage),
// //           banner: getFullUrl(selected.channelBanner),
// //           description:
// //             selected.channeldescription || "No description available",
// //           videos,
// //         };

// //         setChannel(channelData);
// //         setSubscribersCount(selected.subscribers || 0);
// //         setIsSubscribed(selected.subscribedBy?.includes(getUserId()) || false);
// //       } catch (err) {
// //         console.error("Error fetching channel/videos:", err);
// //       }
// //     };

// //     fetchChannelVideos();
// //   }, [selectedChannelId, channels]);

// //   // Image & Video Picker
// //   const pickImage = async (setter) => {
// //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// //     if (status !== "granted") {
// //       Alert.alert("Permission Denied", "We need access to your photos.");
// //       return;
// //     }

// //     const result = await ImagePicker.launchImageLibraryAsync({
// //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //       allowsEditing: true,
// //       quality: 0.8,
// //     });

// //     if (!result.canceled) setter(result.assets[0].uri);
// //   };

// //   const pickVideo = async () => {
// //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// //     if (status !== "granted") {
// //       Alert.alert("Permission Denied", "We need access to your videos.");
// //       return;
// //     }

// //     const result = await ImagePicker.launchImageLibraryAsync({
// //       mediaTypes: ImagePicker.MediaTypeOptions.Videos,
// //       allowsEditing: false,
// //       quality: 1,
// //     });

// //     if (!result.canceled) setVideoUri(result.assets[0].uri);
// //   };

// //   // Channel Switch
// //   const switchChannel = (channelId) => {
// //     setSelectedChannelId(channelId);
// //     setShowChannelDropdown(false);
// //   };

// //   // Subscription
// //   const handleSubscription = async () => {
// //     if (!selectedChannelId) return;

// //     const token = getToken();
// //     if (!token) return Alert.alert("Error", "Please login to subscribe");

// //     try {
// //       const res = await fetch(
// //         `${API_BASE}/uservideo/subscribe/${selectedChannelId}`,
// //         {
// //           method: "POST",
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         },
// //       );

// //       const result = await res.json();
// //       if (!res.ok) throw new Error(result.message || "Subscription failed");

// //       setIsSubscribed(result.subscribed);
// //       setSubscribersCount((prev) => (result.subscribed ? prev + 1 : prev - 1));
// //     } catch (error) {
// //       Alert.alert("Error", error.message || "Something went wrong");
// //     }
// //   };

// //   // Create Channel
// //   const handleCreateChannel = async () => {
// //     const token = getToken();
// //     if (!token) return setCreateError("Please login first.");

// //     if (!newChannel.name.trim())
// //       return setCreateError("Channel name is required");
// //     if (!newChannel.category) return setCreateError("Please select a category");

// //     try {
// //       const formData = new FormData();
// //       formData.append("name", newChannel.name.trim());
// //       formData.append(
// //         "channeldescription",
// //         newChannel.channelDescription || "",
// //       );
// //       formData.append("category", newChannel.category);
// //       formData.append("contactemail", newChannel.contactemail || "");

// //       if (newChannel.channelImageUri) {
// //         formData.append("channelImage", {
// //           uri: newChannel.channelImageUri,
// //           name: newChannel.channelImageUri.split("/").pop(),
// //           type: "image/jpeg",
// //         });
// //       }
// //       if (newChannel.channelBannerUri) {
// //         formData.append("channelBanner", {
// //           uri: newChannel.channelBannerUri,
// //           name: newChannel.channelBannerUri.split("/").pop(),
// //           type: "image/jpeg",
// //         });
// //       }

// //       const response = await fetch(`${API_BASE}/uservideo/createchannel`, {
// //         method: "POST",
// //         headers: { Authorization: `Bearer ${token}` },
// //         body: formData,
// //       });

// //       const result = await response.json();
// //       if (!response.ok)
// //         throw new Error(result.message || "Failed to create channel");

// //       Alert.alert("Success", "Channel created successfully!");

// //       // Refresh channels
// //       const channelsRes = await fetch(`${API_BASE}/uservideo/channel`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       if (channelsRes.ok) {
// //         const data = await channelsRes.json();
// //         setChannels(data.channels || []);
// //         if (result.channel?._id) setSelectedChannelId(result.channel._id);
// //       }

// //       setShowCreateModal(false);
// //       setNewChannel({
// //         name: "",
// //         channelDescription: "",
// //         category: "",
// //         channelImageUri: null,
// //         channelBannerUri: null,
// //         contactemail: "",
// //       });
// //       setCreateError("");
// //     } catch (error) {
// //       setCreateError(error.message || "Failed to create channel.");
// //     }
// //   };

// //   // Upload Video
// //   const handleUploadVideo = async () => {
// //     const token = getToken();
// //     if (!token) return setUploadError("Please login first.");

// //     if (!selectedUploadChannelId)
// //       return setUploadError("Please select a channel");
// //     if (!videoUri) return setUploadError("Please select a video file");
// //     if (!videoname.trim()) return setUploadError("Please enter a video name");
// //     if (!videoCategory) return setUploadError("Please select a video category");
// //     if (!agreeTerms) return setUploadError("Please agree to the terms");

// //     setUploading(true);
// //     setUploadError("");

// //     try {
// //       const formData = new FormData();
// //       formData.append("name", videoname.trim());
// //       formData.append("description", videoDescription || "");
// //       formData.append("category", videoCategory);
// //       formData.append("video", {
// //         uri: videoUri,
// //         name: videoUri.split("/").pop() || "video.mp4",
// //         type: "video/mp4",
// //       });

// //       if (thumbnailUri) {
// //         formData.append("thumbnail", {
// //           uri: thumbnailUri,
// //           name: thumbnailUri.split("/").pop() || "thumbnail.jpg",
// //           type: "image/jpeg",
// //         });
// //       }

// //       const response = await fetch(
// //         `${API_BASE}/uservideo/upload/${selectedUploadChannelId}`,
// //         {
// //           method: "POST",
// //           headers: { Authorization: `Bearer ${token}` },
// //           body: formData,
// //         },
// //       );

// //       const result = await response.json();
// //       if (!response.ok)
// //         throw new Error(result.message || "Failed to upload video");

// //       Alert.alert("Success", "Video uploaded successfully!");

// //       // Refresh videos
// //       const videosRes = await fetch(
// //         `${API_BASE}/uservideo/channel/${selectedChannelId}/videos`,
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         },
// //       );
// //       if (videosRes.ok) {
// //         const data = await videosRes.json();
// //         setChannel((prev) => ({ ...prev, videos: data.videos || [] }));
// //       }

// //       setShowUploadModal(false);
// //       setVideoUri(null);
// //       setThumbnailUri(null);
// //       setVideoname("");
// //       setVideoDescription("");
// //       setVideoCategory("");
// //       setAgreeTerms(false);
// //       setSelectedUploadChannelId("");
// //       setUploadError("");
// //     } catch (error) {
// //       setUploadError(error.message || "Failed to upload video.");
// //     } finally {
// //       setUploading(false);
// //     }
// //   };

// //   const handlePlayVideo = (video) => {
// //     setCurrentVideo(video);
// //     setShowVideoPlayer(true);
// //   };

// //   if (loading) {
// //     return (
// //       <SafeAreaProvider>
// //         <SafeAreaView style={styles.center}>
// //           <ActivityIndicator size="large" color="#ef4444" />
// //           <Text style={{ color: "#aaa", marginTop: 12 }}>
// //             Loading channels...
// //           </Text>
// //         </SafeAreaView>
// //       </SafeAreaProvider>
// //     );
// //   }

// //   if (channels.length === 0) {
// //     return (
// //       <SafeAreaProvider>
// //         <SafeAreaView style={styles.center}>
// //           <Text style={{ color: "#fff", fontSize: 18 }}>No channels found</Text>
// //           <TouchableOpacity
// //             style={styles.primaryBtn}
// //             onPress={() => setShowCreateModal(true)}
// //           >
// //             <Text style={{ color: "#fff", fontWeight: "bold" }}>
// //               Create Channel
// //             </Text>
// //           </TouchableOpacity>
// //         </SafeAreaView>
// //       </SafeAreaProvider>
// //     );
// //   }

// //   return (
// //     <SafeAreaProvider>
// //       <SafeAreaView style={styles.container}>
// //         {/* Channel Selector Dropdown */}
// //         <TouchableOpacity
// //           style={styles.channelSelector}
// //           onPress={() => setShowChannelDropdown(!showChannelDropdown)}
// //         >
// //           <View style={styles.channelSelectorContent}>
// //             <Image
// //               source={{ uri: channel?.avatar }}
// //               style={styles.selectorAvatar}
// //             />
// //             <View style={{ flex: 1 }}>
// //               <Text style={styles.selectorName}>{channel?.name}</Text>
// //               <Text style={styles.selectorHandle}>{channel?.handle}</Text>
// //             </View>
// //             <Icon name="chevron-down" size={24} color="#fff" />
// //           </View>
// //         </TouchableOpacity>

// //         {/* Dropdown List */}
// //         {showChannelDropdown && (
// //           <View style={styles.dropdown}>
// //             <ScrollView style={{ maxHeight: 280 }}>
// //               {channels.map((ch) => (
// //                 <TouchableOpacity
// //                   key={ch._id}
// //                   style={[
// //                     styles.dropdownItem,
// //                     selectedChannelId === ch._id && styles.dropdownItemActive,
// //                   ]}
// //                   onPress={() => switchChannel(ch._id)}
// //                 >
// //                   <Image
// //                     source={{ uri: getFullUrl(ch.channelImage) }}
// //                     style={styles.dropdownAvatar}
// //                   />
// //                   <View>
// //                     <Text style={styles.dropdownName}>{ch.name}</Text>
// //                     <Text style={styles.dropdownHandle}>
// //                       @{ch.name?.replace(/\s+/g, "") || ch._id}
// //                     </Text>
// //                   </View>
// //                 </TouchableOpacity>
// //               ))}
// //             </ScrollView>
// //           </View>
// //         )}

// //         {/* Banner */}
// //         <Image source={{ uri: channel?.banner }} style={styles.banner} />

// //         {/* Avatar + Info */}
// //         <View style={styles.profileSection}>
// //           <Image source={{ uri: channel?.avatar }} style={styles.avatar} />

// //           <View style={styles.infoContainer}>
// //             <Text style={styles.channelName}>{channel?.name}</Text>
// //             <Text style={styles.handle}>{channel?.handle}</Text>

// //             <View style={styles.statsRow}>
// //               <TouchableOpacity
// //                 onPress={handleSubscription}
// //                 style={[
// //                   styles.subscribeBtn,
// //                   isSubscribed && styles.subscribedBtn,
// //                 ]}
// //               >
// //                 <Icon name="account-group" size={18} color="#fff" />
// //                 <Text style={styles.subscribeText}>
// //                   {isSubscribed ? "Subscribed" : "Subscribe"}
// //                 </Text>
// //               </TouchableOpacity>
// //               <Text style={styles.subscribersText}>
// //                 {subscribersCount.toLocaleString()} subscribers
// //               </Text>
// //             </View>
// //           </View>
// //         </View>

// //         {/* Action Buttons */}
// //         <View style={styles.actionButtons}>
// //           <TouchableOpacity
// //             style={[styles.actionBtn, { backgroundColor: "#10b981" }]}
// //             onPress={() => setShowUploadModal(true)}
// //           >
// //             <Icon name="video-plus" size={18} color="#fff" />
// //             <Text style={styles.actionText}>Upload video</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity
// //             style={[styles.actionBtn, { backgroundColor: "#2563eb" }]}
// //             onPress={() => setShowCreateModal(true)}
// //           >
// //             <Icon name="plus" size={18} color="#fff" />
// //             <Text style={styles.actionText}>Create channel</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Tabs */}
// //         <View style={styles.tabBar}>
// //           {["Videos", "Playlists", "Posts"].map((tab) => (
// //             <TouchableOpacity
// //               key={tab}
// //               onPress={() => setActiveTab(tab)}
// //               style={[styles.tab, activeTab === tab && styles.activeTab]}
// //             >
// //               <Text
// //                 style={[
// //                   styles.tabText,
// //                   activeTab === tab && styles.activeTabText,
// //                 ]}
// //               >
// //                 {tab}
// //               </Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>

// //         {/* Videos Grid */}
// //         {activeTab === "Videos" && (
// //           <FlatList
// //             data={channel?.videos || []}
// //             keyExtractor={(item) => item._id}
// //             numColumns={2}
// //             contentContainerStyle={styles.videoGrid}
// //             renderItem={({ item }) => (
// //               <TouchableOpacity
// //                 style={styles.videoCard}
// //                 onPress={() => handlePlayVideo(item)}
// //               >
// //                 <Image
// //                   source={{ uri: getFullUrl(item.thumbnail) }}
// //                   style={styles.thumbnail}
// //                 />
// //                 <Text style={styles.videoTitle} numberOfLines={2}>
// //                   {item.title || item.name}
// //                 </Text>
// //                 <Text style={styles.videoMeta}>
// //                   {(item.views || 0).toLocaleString()} views •{" "}
// //                   {new Date(item.createdAt).toLocaleDateString()}
// //                 </Text>
// //               </TouchableOpacity>
// //             )}
// //             ListEmptyComponent={
// //               <Text style={styles.emptyText}>
// //                 No videos yet. Upload your first video!
// //               </Text>
// //             }
// //           />
// //         )}

// //         {/* Video Player Modal */}
// //         <Modal
// //           visible={showVideoPlayer}
// //           animationType="slide"
// //           onRequestClose={() => setShowVideoPlayer(false)}
// //         >
// //           <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
// //             <View style={styles.playerHeader}>
// //               <Text style={styles.playerTitle}>
// //                 {currentVideo?.title || currentVideo?.name}
// //               </Text>
// //               <TouchableOpacity onPress={() => setShowVideoPlayer(false)}>
// //                 <Icon name="close" size={28} color="#fff" />
// //               </TouchableOpacity>
// //             </View>

// //             {currentVideo && (
// //               <VideoView
// //                 player={useVideoPlayer({
// //                   uri: `${BACKEND_URL}/${currentVideo.videofile || currentVideo.videoUrl}`,
// //                 })}
// //                 style={{ width: "100%", height: width * 0.5625 }}
// //                 allowsFullscreen
// //                 allowsPictureInPicture
// //               />
// //             )}
// //           </SafeAreaView>
// //         </Modal>

// //         {/* Create Channel Modal */}
// //         <Modal visible={showCreateModal} animationType="slide">
// //           <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
// //             <ScrollView style={{ padding: 20 }}>
// //               <Text style={styles.modalTitle}>Create a new channel</Text>
// //               {createError && (
// //                 <Text style={styles.errorText}>{createError}</Text>
// //               )}

// //               <TextInput
// //                 style={styles.input}
// //                 placeholder="Channel name *"
// //                 value={newChannel.name}
// //                 onChangeText={(t) => setNewChannel({ ...newChannel, name: t })}
// //               />
// //               <TextInput
// //                 style={[styles.input, { height: 80 }]}
// //                 placeholder="Description (optional)"
// //                 multiline
// //                 value={newChannel.channelDescription}
// //                 onChangeText={(t) =>
// //                   setNewChannel({ ...newChannel, channelDescription: t })
// //                 }
// //               />

// //               <View style={styles.pickerContainer}>
// //                 <Text style={styles.label}>Category *</Text>
// //                 <Picker
// //                   selectedValue={newChannel.category}
// //                   onValueChange={(v) =>
// //                     setNewChannel({ ...newChannel, category: v })
// //                   }
// //                 >
// //                   <Picker.Item label="Select category" value="" />
// //                   {categories.map((cat) => (
// //                     <Picker.Item
// //                       key={cat._id}
// //                       label={cat.name}
// //                       value={cat._id}
// //                     />
// //                   ))}
// //                 </Picker>
// //               </View>

// //               <TouchableOpacity
// //                 style={styles.uploadBtn}
// //                 onPress={() =>
// //                   pickImage((uri) =>
// //                     setNewChannel({ ...newChannel, channelImageUri: uri }),
// //                   )
// //                 }
// //               >
// //                 <Text
// //                   style={{
// //                     color: newChannel.channelImageUri ? "#10b981" : "#aaa",
// //                   }}
// //                 >
// //                   {newChannel.channelImageUri
// //                     ? "Avatar Selected"
// //                     : "Upload Avatar"}
// //                 </Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={styles.uploadBtn}
// //                 onPress={() =>
// //                   pickImage((uri) =>
// //                     setNewChannel({ ...newChannel, channelBannerUri: uri }),
// //                   )
// //                 }
// //               >
// //                 <Text
// //                   style={{
// //                     color: newChannel.channelBannerUri ? "#10b981" : "#aaa",
// //                   }}
// //                 >
// //                   {newChannel.channelBannerUri
// //                     ? "Banner Selected"
// //                     : "Upload Banner"}
// //                 </Text>
// //               </TouchableOpacity>

// //               <TextInput
// //                 style={styles.input}
// //                 placeholder="Contact email (optional)"
// //                 value={newChannel.contactemail}
// //                 onChangeText={(t) =>
// //                   setNewChannel({ ...newChannel, contactemail: t })
// //                 }
// //               />

// //               <View style={styles.modalActions}>
// //                 <TouchableOpacity
// //                   style={styles.cancelBtn}
// //                   onPress={() => {
// //                     setShowCreateModal(false);
// //                     setCreateError("");
// //                   }}
// //                 >
// //                   <Text style={{ color: "#fff" }}>Cancel</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   style={styles.submitBtn}
// //                   onPress={handleCreateChannel}
// //                 >
// //                   <Text style={{ color: "#fff", fontWeight: "bold" }}>
// //                     Create Channel
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </ScrollView>
// //           </SafeAreaView>
// //         </Modal>

// //         {/* Upload Video Modal */}
// //         <Modal visible={showUploadModal} animationType="slide">
// //           <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
// //             <ScrollView style={{ padding: 20 }}>
// //               <Text style={styles.modalTitle}>Upload Video</Text>
// //               {uploadError && (
// //                 <Text style={styles.errorText}>{uploadError}</Text>
// //               )}

// //               <TouchableOpacity style={styles.uploadBtn} onPress={pickVideo}>
// //                 <Text style={{ color: videoUri ? "#10b981" : "#aaa" }}>
// //                   {videoUri ? "Video Selected" : "Select Video *"}
// //                 </Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={styles.uploadBtn}
// //                 onPress={() => pickImage(setThumbnailUri)}
// //               >
// //                 <Text style={{ color: thumbnailUri ? "#10b981" : "#aaa" }}>
// //                   {thumbnailUri
// //                     ? "Thumbnail Selected"
// //                     : "Select Thumbnail (optional)"}
// //                 </Text>
// //               </TouchableOpacity>

// //               <TextInput
// //                 style={styles.input}
// //                 placeholder="Video Title *"
// //                 value={videoname}
// //                 onChangeText={setVideoname}
// //               />

// //               <View style={styles.pickerContainer}>
// //                 <Text style={styles.label}>Category *</Text>
// //                 <Picker
// //                   selectedValue={videoCategory}
// //                   onValueChange={setVideoCategory}
// //                 >
// //                   <Picker.Item label="Select category" value="" />
// //                   {categories.map((cat) => (
// //                     <Picker.Item
// //                       key={cat._id}
// //                       label={cat.name}
// //                       value={cat._id}
// //                     />
// //                   ))}
// //                 </Picker>
// //               </View>

// //               <TextInput
// //                 style={[styles.input, { height: 80 }]}
// //                 placeholder="Description"
// //                 multiline
// //                 value={videoDescription}
// //                 onChangeText={setVideoDescription}
// //               />

// //               <View
// //                 style={{
// //                   flexDirection: "row",
// //                   alignItems: "center",
// //                   marginVertical: 12,
// //                 }}
// //               >
// //                 <Switch value={agreeTerms} onValueChange={setAgreeTerms} />
// //                 <Text style={{ color: "#ccc", marginLeft: 10, flex: 1 }}>
// //                   I agree to Terms of Service and own this content.
// //                 </Text>
// //               </View>

// //               <View style={styles.modalActions}>
// //                 <TouchableOpacity
// //                   style={styles.cancelBtn}
// //                   onPress={() => setShowUploadModal(false)}
// //                 >
// //                   <Text style={{ color: "#fff" }}>Cancel</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   style={styles.submitBtn}
// //                   onPress={handleUploadVideo}
// //                   disabled={uploading}
// //                 >
// //                   <Text style={{ color: "#fff", fontWeight: "bold" }}>
// //                     {uploading ? "Uploading..." : "Upload Video"}
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </ScrollView>
// //           </SafeAreaView>
// //         </Modal>
// //       </SafeAreaView>
// //     </SafeAreaProvider>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#0f0f0f" },
// //   banner: { width: "100%", height: 200, resizeMode: "cover" },
// //   profileSection: { flexDirection: "row", padding: 16, marginTop: -50 },
// //   avatar: {
// //     width: 90,
// //     height: 90,
// //     borderRadius: 50,
// //     borderWidth: 4,
// //     borderColor: "#0f0f0f",
// //   },
// //   infoContainer: { marginLeft: 16, flex: 1 },
// //   channelName: { fontSize: 26, fontWeight: "bold", color: "#fff" },
// //   handle: { color: "#aaa", fontSize: 16 },
// //   statsRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginTop: 8,
// //     gap: 12,
// //   },
// //   subscribeBtn: {
// //     backgroundColor: "#ef4444",
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //     borderRadius: 30,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //   },
// //   subscribedBtn: { backgroundColor: "#3f3f46" },
// //   subscribeText: { color: "#fff", fontWeight: "600" },
// //   subscribersText: { color: "#aaa" },
// //   actionButtons: {
// //     flexDirection: "row",
// //     paddingHorizontal: 16,
// //     gap: 10,
// //     marginBottom: 16,
// //   },
// //   actionBtn: {
// //     flex: 1,
// //     backgroundColor: "#272727",
// //     paddingVertical: 12,
// //     borderRadius: 30,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 8,
// //   },
// //   actionText: { color: "#fff", fontWeight: "600" },
// //   tabBar: {
// //     flexDirection: "row",
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#333",
// //   },
// //   tab: { flex: 1, paddingVertical: 14, alignItems: "center" },
// //   activeTab: { borderBottomWidth: 3, borderBottomColor: "#fff" },
// //   tabText: { color: "#aaa", fontSize: 16 },
// //   activeTabText: { color: "#fff" },
// //   videoGrid: { padding: 8 },
// //   videoCard: { flex: 1, margin: 6 },
// //   thumbnail: { width: "100%", aspectRatio: 16 / 9, borderRadius: 12 },
// //   videoTitle: { color: "#fff", marginTop: 8, fontSize: 15, fontWeight: "500" },
// //   videoMeta: { color: "#888", fontSize: 13, marginTop: 4 },
// //   emptyText: { color: "#888", textAlign: "center", marginTop: 40 },
// //   center: { flex: 1, justifyContent: "center", alignItems: "center" },
// //   modalTitle: {
// //     color: "#fff",
// //     fontSize: 22,
// //     fontWeight: "bold",
// //     marginBottom: 20,
// //   },
// //   errorText: { color: "#ff6b6b", marginBottom: 12 },
// //   input: {
// //     backgroundColor: "#1a1a1a",
// //     color: "#fff",
// //     padding: 14,
// //     borderRadius: 10,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: "#333",
// //   },
// //   uploadBtn: {
// //     backgroundColor: "#1a1a1a",
// //     padding: 14,
// //     borderRadius: 10,
// //     marginBottom: 16,
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: "#333",
// //   },
// //   pickerContainer: { marginBottom: 16 },
// //   label: { color: "#aaa", marginBottom: 6 },
// //   modalActions: {
// //     flexDirection: "row",
// //     justifyContent: "flex-end",
// //     gap: 16,
// //     marginTop: 20,
// //   },
// //   cancelBtn: {
// //     paddingVertical: 12,
// //     paddingHorizontal: 24,
// //     backgroundColor: "#444",
// //     borderRadius: 30,
// //   },
// //   submitBtn: {
// //     paddingVertical: 12,
// //     paddingHorizontal: 24,
// //     backgroundColor: "#2563eb",
// //     borderRadius: 30,
// //   },
// //   primaryBtn: {
// //     backgroundColor: "#2563eb",
// //     padding: 14,
// //     borderRadius: 30,
// //     marginTop: 20,
// //   },
// //   playerHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     padding: 16,
// //     backgroundColor: "#111",
// //   },
// //   playerTitle: { color: "#fff", fontSize: 18, flex: 1 },

// //   // Dropdown Styles
// //   channelSelector: {
// //     backgroundColor: "#1a1a1a",
// //     padding: 12,
// //     marginHorizontal: 16,
// //     marginTop: 10,
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: "#333",
// //   },
// //   channelSelectorContent: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 12,
// //   },
// //   selectorAvatar: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //   },
// //   selectorName: {
// //     fontSize: 16,
// //     fontWeight: "bold",
// //     color: "#fff",
// //   },
// //   selectorHandle: {
// //     color: "#888",
// //     fontSize: 13,
// //   },
// //   dropdown: {
// //     position: "absolute",
// //     top: 125,
// //     left: 16,
// //     right: 16,
// //     backgroundColor: "#1a1a1a",
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: "#333",
// //     zIndex: 1000,
// //     padding: 8,
// //     elevation: 5,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //   },
// //   dropdownItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     padding: 12,
// //     borderRadius: 10,
// //     gap: 12,
// //   },
// //   dropdownItemActive: {
// //     backgroundColor: "#ef444430",
// //   },
// //   dropdownAvatar: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //   },
// //   dropdownName: {
// //     color: "#fff",
// //     fontWeight: "600",
// //   },
// //   dropdownHandle: {
// //     color: "#888",
// //     fontSize: 12,
// //   },
// // });


// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   Platform,
//   KeyboardAvoidingView,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "expo-image-picker";
// import {
//   Eye,
//   Clock,
//   DollarSign,
//   IndianRupee,
//   History,
//   Users,
//   TrendingUp,
//   Calendar,
//   Edit,
//   Mail,
//   ArrowUpDown,
//   X,
//   Upload,
//   Lock,
//   EyeOff,
// } from "lucide-react-native";

// const API_BASE = "https://bharat-pay-3.onrender.com/api";
// const BACKEND_URL = "https://bharat-pay-3.onrender.com";

// export default function ProfileScreen() {
//   const navigation = useNavigation();

//   const [activeTab, setActiveTab] = useState("my-videos");
//   const [sortBy, setSortBy] = useState("latest");
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Edit Profile
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [editForm, setEditForm] = useState({ name: "", email: "" });
//   const [avatarUri, setAvatarUri] = useState(null);
//   const [editLoading, setEditLoading] = useState(false);
//   const [editError, setEditError] = useState(null);

//   // Change Password
//   const [isPasswordOpen, setIsPasswordOpen] = useState(false);
//   const [passwordForm, setPasswordForm] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [showPasswords, setShowPasswords] = useState({
//     old: false,
//     new: false,
//     confirm: false,
//   });
//   const [passwordLoading, setPasswordLoading] = useState(false);
//   const [passwordError, setPasswordError] = useState(null);
//   const [passwordSuccess, setPasswordSuccess] = useState(false);

//   const [myVideos, setMyVideos] = useState([]);

//   const getMediaUrl = (path) => {
//     if (!path) return null;
//     const cleaned = String(path).replace(/\\/g, "/");
//     if (cleaned.startsWith("http")) return cleaned;
//     return `${BACKEND_URL}/${cleaned}`;
//   };

//   // ─── Fetch Profile ───
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = await AsyncStorage.getItem("token");
//         if (!token) throw new Error("No token found. Please login first.");

//         const res = await fetch(`${API_BASE}/me`, {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) {
//           if (res.status === 401) {
//             await AsyncStorage.multiRemove(["token", "user"]);
//             navigation.replace("Login");
//             throw new Error("Session expired. Please login again.");
//           }
//           throw new Error(`Server error: ${res.status}`);
//         }

//         const data = await res.json();
//         if (!data.success || !data.user) {
//           throw new Error("Invalid profile data received");
//         }

//         const profile = data.user;

//         setUser({
//           _id: profile._id,
//           name: profile.name || "User",
//           handle: `@${(profile.name || "user").toLowerCase().replace(/\s+/g, "")}`,
//           email: profile.email || "",
//           avatar:
//             getMediaUrl(profile.avatar) ||
//             "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
//           createdAt: profile.createdAt
//             ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
//                 month: "long",
//                 year: "numeric",
//               })
//             : "Unknown date",
//           subscribers: profile.subscribers || 0,
//           totalVideos: profile.videos?.length || 0,
//           totalViews: profile.totalViews || 0,
//           totalEarnings: profile.totalEarnings || 0,
//           avgRPM: profile.avgRPM || "0.0",
//           earningsThisMonth: profile.earningsThisMonth || 0,
//           pendingWithdrawal: profile.pendingWithdrawal || 0,
//         });

//         setEditForm({
//           name: profile.name || "",
//           email: profile.email || "",
//         });
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [navigation]);

//   // ─── Pick Avatar ───
//   const pickAvatar = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });

//     if (!result.canceled && result.assets?.[0]) {
//       setAvatarUri(result.assets[0].uri);
//       setEditError(null);
//     }
//   };

//   // ─── Edit Profile Submit ───
//   const handleEditSubmit = async () => {
//     setEditLoading(true);
//     setEditError(null);

//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token || !user?._id) throw new Error("Please login again");

//       const formData = new FormData();
//       const trimmedName = editForm.name?.trim();
//       if (trimmedName && trimmedName !== user.name) {
//         formData.append("name", trimmedName);
//       }

//       const trimmedEmail = editForm.email?.trim().toLowerCase();
//       if (trimmedEmail && trimmedEmail !== user.email.toLowerCase()) {
//         formData.append("email", trimmedEmail);
//       }

//       if (avatarUri) {
//         formData.append("avatar", {
//           uri: avatarUri,
//           type: "image/jpeg",
//           name: "avatar.jpg",
//         });
//       }

//       if (!formData.has("name") && !formData.has("email") && !avatarUri) {
//         throw new Error("No changes detected");
//       }

//       const res = await fetch(`${API_BASE}/user/${user._id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok || !data.success) {
//         throw new Error(data.message || "Failed to update profile");
//       }

//       setUser((prev) => ({
//         ...prev,
//         name: data.user.name || prev.name,
//         email: data.user.email || prev.email,
//         avatar: getMediaUrl(data.user.avatar) || prev.avatar,
//         handle: data.user.name
//           ? `@${data.user.name.toLowerCase().replace(/\s+/g, "")}`
//           : prev.handle,
//       }));

//       setEditForm({
//         name: data.user.name || editForm.name,
//         email: data.user.email || editForm.email,
//       });

//       setAvatarUri(null);
//       setIsEditOpen(false);
//       Alert.alert("Success", "Profile updated successfully!");
//     } catch (err) {
//       setEditError(err.message);
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   const closeEdit = () => {
//     setIsEditOpen(false);
//     setEditError(null);
//     setAvatarUri(null);
//   };

//   // ─── Change Password ───
//   const handlePasswordSubmit = async () => {
//     try {
//       setPasswordLoading(true);
//       setPasswordError(null);
//       setPasswordSuccess(false);

//       const { oldPassword, newPassword, confirmPassword } = passwordForm;

//       if (!oldPassword || !newPassword || !confirmPassword) {
//         throw new Error("All fields are required");
//       }
//       if (newPassword.length < 6) {
//         throw new Error("New password must be at least 6 characters");
//       }
//       if (newPassword !== confirmPassword) {
//         throw new Error("New passwords do not match");
//       }

//       const token = await AsyncStorage.getItem("token");
//       if (!token || !user?._id) throw new Error("Authentication required");

//       const res = await fetch(`${API_BASE}/user/password/${user._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ oldPassword, newPassword }),
//       });

//       const data = await res.json();
//       if (!res.ok || !data.success) {
//         throw new Error(data.message || "Failed to change password");
//       }

//       setPasswordSuccess(true);
//       setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });

//       setTimeout(() => {
//         setIsPasswordOpen(false);
//         setPasswordSuccess(false);
//       }, 1500);
//     } catch (err) {
//       setPasswordError(err.message);
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   const closePasswordModal = () => {
//     setIsPasswordOpen(false);
//     setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
//     setPasswordError(null);
//     setPasswordSuccess(false);
//     setShowPasswords({ old: false, new: false, confirm: false });
//   };

//   // ─── Logout ───
//   const handleLogout = async () => {
//     await AsyncStorage.multiRemove(["token", "user"]);
//     navigation.replace("Login");
//   };

//   const tabs = [
//     { id: "my-videos", label: "My Videos", Icon: Eye },
//     { id: "earnings", label: "Earnings", Icon: IndianRupee },
//     { id: "watch-history", label: "History", Icon: History },
//   ];

//   // ─── Loading / Error ───
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#ef4444" />
//         <Text style={styles.loadingText}>Loading profile...</Text>
//       </View>
//     );
//   }

//   if (error || !user) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>Error: {error || "Profile not loaded"}</Text>
//         <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.replace("Login")}>
//           <Text style={styles.retryText}>Go to Login</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // ─── Tab Content ───
//   const renderTabContent = () => {
//     if (activeTab === "earnings") {
//       return (
//         <View>
//           <Text style={styles.sectionTitle}>Earnings Overview</Text>
//           <View style={styles.earningsGrid}>
//             {[
//               { label: "This Month", value: `₹${(user.earningsThisMonth || 0).toLocaleString()}` },
//               { label: "Total Earnings", value: `₹${(user.totalEarnings || 0).toLocaleString()}` },
//               { label: "Pending", value: `₹${(user.pendingWithdrawal || 0).toLocaleString()}` },
//               { label: "Avg. RPM", value: `₹${user.avgRPM || "0.0"}` },
//             ].map((item) => (
//               <View key={item.label} style={styles.earningCard}>
//                 <Text style={styles.earningLabel}>{item.label}</Text>
//                 <Text style={styles.earningValue}>{item.value}</Text>
//               </View>
//             ))}
//           </View>
//           <Text style={styles.emptyHint}>Earnings history will appear here once available</Text>
//         </View>
//       );
//     }

//     if (activeTab === "watch-history") {
//       return (
//         <View>
//           <Text style={styles.sectionTitle}>Watch History</Text>
//           <Text style={styles.emptyHint}>Your watch history will appear here</Text>
//         </View>
//       );
//     }

//     // My Videos
//     return (
//       <View>
//         <View style={styles.videosHeader}>
//           <Text style={styles.sectionTitle}>My Videos</Text>
//           <View style={styles.sortRow}>
//             <ArrowUpDown size={14} color="#71717a" />
//             <TouchableOpacity
//               onPress={() =>
//                 setSortBy((s) =>
//                   s === "latest" ? "views" : s === "views" ? "earnings" : "latest"
//                 )
//               }
//             >
//               <Text style={styles.sortText}>
//                 {sortBy === "latest"
//                   ? "Latest"
//                   : sortBy === "views"
//                   ? "Highest Views"
//                   : "Highest Earnings"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {myVideos.length === 0 ? (
//           <View style={styles.emptyVideos}>
//             <Text style={styles.emptyTitle}>No videos yet</Text>
//             <Text style={styles.emptyHint}>Upload your first video to get started</Text>
//           </View>
//         ) : (
//           myVideos.map((video) => (
//             <TouchableOpacity
//               key={video.id || video._id}
//               style={styles.videoCard}
//               onPress={() => setSelectedVideo(video)}
//               activeOpacity={0.85}
//             >
//               <Image
//                 source={{ uri: video.thumbnail }}
//                 style={styles.videoThumb}
//               />
//               <View style={styles.videoInfo}>
//                 <Text style={styles.videoTitle} numberOfLines={2}>
//                   {video.title}
//                 </Text>
//                 <View style={styles.videoMetaRow}>
//                   <View style={styles.metaItem}>
//                     <Eye size={13} color="#a1a1aa" />
//                     <Text style={styles.metaText}>
//                       {video.views?.toLocaleString() || 0}
//                     </Text>
//                   </View>
//                   <View style={styles.metaItem}>
//                     <DollarSign size={13} color="#ef4444" />
//                     <Text style={styles.metaText}>
//                       ₹{(video.earnings || 0).toFixed(2)}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* ── Profile Header ── */}
//         <View style={styles.profileHeader}>
//           <Image source={{ uri: user.avatar }} style={styles.avatar} />
//           <Text style={styles.name}>{user.name}</Text>
//           <Text style={styles.handle}>{user.handle}</Text>

//           <View style={styles.infoRow}>
//             <Users size={14} color="#a1a1aa" />
//             <Text style={styles.infoText}>
//               {user.subscribers.toLocaleString()} subscribers
//             </Text>
//             <Calendar size={14} color="#a1a1aa" style={{ marginLeft: 12 }} />
//             <Text style={styles.infoText}>Joined {user.createdAt}</Text>
//           </View>

//           <View style={styles.emailRow}>
//             <Mail size={14} color="#71717a" />
//             <Text style={styles.emailText}>{user.email}</Text>
//           </View>

//           {/* Action buttons */}
//           <View style={styles.actionsRow}>
//             <TouchableOpacity
//               style={[styles.actionBtn, styles.withdrawBtn]}
//               onPress={() => navigation.navigate("Withdraw")}
//             >
//               <IndianRupee size={16} color="#fff" />
//               <Text style={styles.actionBtnTextWhite}>Withdraw</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionBtn}
//               onPress={() => setIsEditOpen(true)}
//             >
//               <Edit size={15} color="#e4e4e7" />
//               <Text style={styles.actionBtnText}>Edit</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionBtn}
//               onPress={() => setIsPasswordOpen(true)}
//             >
//               <Lock size={15} color="#e4e4e7" />
//               <Text style={styles.actionBtnText}>Password</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>
//         </View>

//         {/* ── Stats ── */}
//         <View style={styles.statsGrid}>
//           {[
//             { Icon: Eye, value: user.totalViews?.toLocaleString() || "0", label: "Total Views", color: "#3b82f6" },
//             { Icon: Clock, value: "0h", label: "Watch Hours", color: "#10b981" },
//             { Icon: DollarSign, value: `₹${(user.totalEarnings || 0).toLocaleString()}`, label: "Earnings", color: "#ef4444" },
//             { Icon: TrendingUp, value: `₹${user.avgRPM}`, label: "Avg. RPM", color: "#a855f7" },
//           ].map(({ Icon, value, label, color }) => (
//             <View key={label} style={styles.statCard}>
//               <Icon size={22} color={color} />
//               <Text style={styles.statValue}>{value}</Text>
//               <Text style={styles.statLabel}>{label}</Text>
//             </View>
//           ))}
//         </View>

//         {/* ── Tabs ── */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.tabsScroll}
//           contentContainerStyle={styles.tabsContent}
//         >
//           {tabs.map(({ id, label, Icon }) => {
//             const isActive = activeTab === id;
//             return (
//               <TouchableOpacity
//                 key={id}
//                 style={[styles.tab, isActive && styles.tabActive]}
//                 onPress={() => setActiveTab(id)}
//               >
//                 <Icon size={16} color={isActive ? "#ef4444" : "#a1a1aa"} />
//                 <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
//                   {label}
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>

//         {/* ── Tab Content ── */}
//         <View style={styles.tabBody}>{renderTabContent()}</View>

//         <View style={{ height: 40 }} />
//       </ScrollView>

//       {/* ====================== EDIT PROFILE MODAL ====================== */}
//       <Modal visible={isEditOpen} animationType="slide" transparent>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={styles.modalOverlay}
//         >
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Edit Profile</Text>
//               <TouchableOpacity onPress={closeEdit}>
//                 <X size={22} color="#fff" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               {editError ? (
//                 <View style={styles.errorBox}>
//                   <Text style={styles.errorBoxText}>{editError}</Text>
//                 </View>
//               ) : null}

//               <Text style={styles.label}>Avatar</Text>
//               <View style={styles.avatarEditRow}>
//                 <Image
//                   source={{ uri: avatarUri || user.avatar }}
//                   style={styles.editAvatar}
//                 />
//                 <TouchableOpacity style={styles.pickAvatarBtn} onPress={pickAvatar}>
//                   <Upload size={16} color="#fff" />
//                   <Text style={styles.pickAvatarText}>
//                     {avatarUri ? "Change" : "Choose image"}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//               <Text style={styles.hint}>Max 5MB • JPG, PNG</Text>

//               <Text style={styles.label}>Name</Text>
//               <TextInput
//                 style={styles.input}
//                 value={editForm.name}
//                 onChangeText={(t) => setEditForm({ ...editForm, name: t })}
//                 placeholder="Your name"
//                 placeholderTextColor="#71717a"
//               />

//               <Text style={styles.label}>Email</Text>
//               <TextInput
//                 style={styles.input}
//                 value={editForm.email}
//                 onChangeText={(t) => setEditForm({ ...editForm, email: t })}
//                 placeholder="your@email.com"
//                 placeholderTextColor="#71717a"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//               />

//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   style={[styles.modalBtn, styles.cancelBtn]}
//                   onPress={closeEdit}
//                   disabled={editLoading}
//                 >
//                   <Text style={styles.modalBtnText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.modalBtn, styles.saveBtn]}
//                   onPress={handleEditSubmit}
//                   disabled={editLoading}
//                 >
//                   {editLoading ? (
//                     <ActivityIndicator color="#fff" size="small" />
//                   ) : (
//                     <Text style={styles.modalBtnText}>Save Changes</Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>

//       {/* ====================== CHANGE PASSWORD MODAL ====================== */}
//       <Modal visible={isPasswordOpen} animationType="slide" transparent>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={styles.modalOverlay}
//         >
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//                 <Lock size={18} color="#ef4444" />
//                 <Text style={styles.modalTitle}>Change Password</Text>
//               </View>
//               <TouchableOpacity onPress={closePasswordModal}>
//                 <X size={22} color="#fff" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               {passwordError ? (
//                 <View style={styles.errorBox}>
//                   <Text style={styles.errorBoxText}>{passwordError}</Text>
//                 </View>
//               ) : null}
//               {passwordSuccess ? (
//                 <View style={styles.successBox}>
//                   <Text style={styles.successText}>Password updated!</Text>
//                 </View>
//               ) : null}

//               {/* Old Password */}
//               <Text style={styles.label}>Current Password</Text>
//               <View style={styles.passwordRow}>
//                 <TextInput
//                   style={[styles.input, { flex: 1, marginBottom: 0 }]}
//                   value={passwordForm.oldPassword}
//                   onChangeText={(t) =>
//                     setPasswordForm({ ...passwordForm, oldPassword: t })
//                   }
//                   secureTextEntry={!showPasswords.old}
//                   placeholderTextColor="#71717a"
//                 />
//                 <TouchableOpacity
//                   style={styles.eyeBtn}
//                   onPress={() =>
//                     setShowPasswords((p) => ({ ...p, old: !p.old }))
//                   }
//                 >
//                   {showPasswords.old ? (
//                     <EyeOff size={18} color="#a1a1aa" />
//                   ) : (
//                     <Eye size={18} color="#a1a1aa" />
//                   )}
//                 </TouchableOpacity>
//               </View>

//               {/* New Password */}
//               <Text style={styles.label}>New Password</Text>
//               <View style={styles.passwordRow}>
//                 <TextInput
//                   style={[styles.input, { flex: 1, marginBottom: 0 }]}
//                   value={passwordForm.newPassword}
//                   onChangeText={(t) =>
//                     setPasswordForm({ ...passwordForm, newPassword: t })
//                   }
//                   secureTextEntry={!showPasswords.new}
//                   placeholderTextColor="#71717a"
//                 />
//                 <TouchableOpacity
//                   style={styles.eyeBtn}
//                   onPress={() =>
//                     setShowPasswords((p) => ({ ...p, new: !p.new }))
//                   }
//                 >
//                   {showPasswords.new ? (
//                     <EyeOff size={18} color="#a1a1aa" />
//                   ) : (
//                     <Eye size={18} color="#a1a1aa" />
//                   )}
//                 </TouchableOpacity>
//               </View>

//               {/* Confirm */}
//               <Text style={styles.label}>Confirm New Password</Text>
//               <View style={styles.passwordRow}>
//                 <TextInput
//                   style={[styles.input, { flex: 1, marginBottom: 0 }]}
//                   value={passwordForm.confirmPassword}
//                   onChangeText={(t) =>
//                     setPasswordForm({ ...passwordForm, confirmPassword: t })
//                   }
//                   secureTextEntry={!showPasswords.confirm}
//                   placeholderTextColor="#71717a"
//                 />
//                 <TouchableOpacity
//                   style={styles.eyeBtn}
//                   onPress={() =>
//                     setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))
//                   }
//                 >
//                   {showPasswords.confirm ? (
//                     <EyeOff size={18} color="#a1a1aa" />
//                   ) : (
//                     <Eye size={18} color="#a1a1aa" />
//                   )}
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   style={[styles.modalBtn, styles.cancelBtn]}
//                   onPress={closePasswordModal}
//                   disabled={passwordLoading}
//                 >
//                   <Text style={styles.modalBtnText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.modalBtn, styles.saveBtn]}
//                   onPress={handlePasswordSubmit}
//                   disabled={passwordLoading || passwordSuccess}
//                 >
//                   {passwordLoading ? (
//                     <ActivityIndicator color="#fff" size="small" />
//                   ) : (
//                     <Text style={styles.modalBtnText}>Update Password</Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>

//       {/* ====================== VIDEO DETAIL MODAL ====================== */}
//       <Modal visible={!!selectedVideo} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Video Details</Text>
//               <TouchableOpacity onPress={() => setSelectedVideo(null)}>
//                 <X size={22} color="#fff" />
//               </TouchableOpacity>
//             </View>
//             {selectedVideo && (
//               <View>
//                 <Image
//                   source={{ uri: selectedVideo.thumbnail }}
//                   style={styles.detailThumb}
//                 />
//                 <Text style={styles.detailTitle}>{selectedVideo.title}</Text>
//               </View>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// // ────────────────────────────────────────────────
// // Styles
// // ────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#09090b",
//   },
//   center: {
//     flex: 1,
//     backgroundColor: "#09090b",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//   },
//   loadingText: {
//     color: "#a1a1aa",
//     marginTop: 12,
//   },
//   errorText: {
//     color: "#f87171",
//     fontSize: 16,
//     textAlign: "center",
//   },
//   retryBtn: {
//     marginTop: 16,
//     backgroundColor: "#ef4444",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   retryText: {
//     color: "#fff",
//     fontWeight: "600",
//   },

//   // Profile header
//   profileHeader: {
//     backgroundColor: "#18181b",
//     borderBottomWidth: 1,
//     borderBottomColor: "#27272a",
//     alignItems: "center",
//     paddingVertical: 24,
//     paddingHorizontal: 16,
//   },
//   avatar: {
//     width: 88,
//     height: 88,
//     borderRadius: 44,
//     borderWidth: 2,
//     borderColor: "#3f3f46",
//   },
//   name: {
//     color: "#fff",
//     fontSize: 24,
//     fontWeight: "700",
//     marginTop: 12,
//   },
//   handle: {
//     color: "#a1a1aa",
//     fontSize: 14,
//     marginTop: 2,
//   },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     marginTop: 12,
//   },
//   infoText: {
//     color: "#a1a1aa",
//     fontSize: 13,
//   },
//   emailRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginTop: 8,
//   },
//   emailText: {
//     color: "#71717a",
//     fontSize: 13,
//   },
//   actionsRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//     marginTop: 16,
//     justifyContent: "center",
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "#27272a",
//     borderWidth: 1,
//     borderColor: "#3f3f46",
//     paddingVertical: 9,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//   },
//   withdrawBtn: {
//     backgroundColor: "#ef4444",
//     borderColor: "#ef4444",
//   },
//   actionBtnText: {
//     color: "#e4e4e7",
//     fontWeight: "600",
//     fontSize: 13,
//   },
//   actionBtnTextWhite: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 13,
//   },
//   logoutBtn: {
//     marginTop: 12,
//   },
//   logoutText: {
//     color: "#f87171",
//     fontSize: 13,
//     fontWeight: "500",
//   },

//   // Stats
//   statsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     padding: 12,
//     gap: 10,
//   },
//   statCard: {
//     width: "47%",
//     backgroundColor: "#18181b",
//     borderWidth: 1,
//     borderColor: "#27272a",
//     borderRadius: 14,
//     padding: 16,
//     alignItems: "center",
//   },
//   statValue: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "700",
//     marginTop: 8,
//   },
//   statLabel: {
//     color: "#71717a",
//     fontSize: 11,
//     marginTop: 2,
//   },

//   // Tabs
//   tabsScroll: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#27272a",
//   },
//   tabsContent: {
//     paddingHorizontal: 8,
//   },
//   tab: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//   },
//   tabActive: {
//     borderBottomWidth: 2,
//     borderBottomColor: "#ef4444",
//   },
//   tabText: {
//     color: "#a1a1aa",
//     fontSize: 13,
//     fontWeight: "500",
//   },
//   tabTextActive: {
//     color: "#ef4444",
//   },
//   tabBody: {
//     backgroundColor: "#18181b",
//     margin: 12,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#27272a",
//     padding: 16,
//     minHeight: 280,
//   },

//   sectionTitle: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 12,
//   },
//   emptyHint: {
//     color: "#71717a",
//     textAlign: "center",
//     paddingVertical: 30,
//     fontSize: 14,
//   },
//   emptyVideos: {
//     alignItems: "center",
//     paddingVertical: 40,
//   },
//   emptyTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//   },

//   // Earnings
//   earningsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 10,
//   },
//   earningCard: {
//     width: "47%",
//     backgroundColor: "#09090b",
//     borderWidth: 1,
//     borderColor: "#27272a",
//     borderRadius: 12,
//     padding: 14,
//     alignItems: "center",
//   },
//   earningLabel: {
//     color: "#71717a",
//     fontSize: 11,
//   },
//   earningValue: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//     marginTop: 4,
//   },

//   // Videos
//   videosHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   sortRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   sortText: {
//     color: "#a1a1aa",
//     fontSize: 12,
//   },
//   videoCard: {
//     flexDirection: "row",
//     backgroundColor: "#09090b",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#27272a",
//     overflow: "hidden",
//     marginBottom: 10,
//   },
//   videoThumb: {
//     width: 120,
//     height: 72,
//     backgroundColor: "#27272a",
//   },
//   videoInfo: {
//     flex: 1,
//     padding: 10,
//     justifyContent: "space-between",
//   },
//   videoTitle: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "500",
//     lineHeight: 17,
//   },
//   videoMetaRow: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   metaItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   metaText: {
//     color: "#a1a1aa",
//     fontSize: 12,
//   },

//   // Modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.8)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     backgroundColor: "#18181b",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: "90%",
//     padding: 20,
//     borderWidth: 1,
//     borderColor: "#27272a",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   modalTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//   },
//   errorBox: {
//     backgroundColor: "#450a0a",
//     borderWidth: 1,
//     borderColor: "#991b1b",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//   },
//   errorBoxText: {
//     color: "#fca5a5",
//     fontSize: 13,
//   },
//   successBox: {
//     backgroundColor: "#052e16",
//     borderWidth: 1,
//     borderColor: "#166534",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//   },
//   successText: {
//     color: "#86efac",
//     fontSize: 13,
//   },
//   label: {
//     color: "#a1a1aa",
//     fontSize: 12,
//     marginBottom: 6,
//     marginTop: 12,
//   },
//   input: {
//     backgroundColor: "#09090b",
//     borderWidth: 1,
//     borderColor: "#3f3f46",
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     color: "#fff",
//     fontSize: 15,
//     marginBottom: 4,
//   },
//   hint: {
//     color: "#52525b",
//     fontSize: 11,
//     marginTop: 4,
//   },
//   avatarEditRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 14,
//   },
//   editAvatar: {
//     width: 72,
//     height: 72,
//     borderRadius: 36,
//     borderWidth: 2,
//     borderColor: "#3f3f46",
//   },
//   pickAvatarBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "#27272a",
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#3f3f46",
//   },
//   pickAvatarText: {
//     color: "#fff",
//     fontSize: 13,
//   },
//   passwordRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   eyeBtn: {
//     position: "absolute",
//     right: 12,
//     padding: 4,
//   },
//   modalActions: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 10,
//     marginTop: 24,
//     marginBottom: 8,
//   },
//   modalBtn: {
//     paddingVertical: 11,
//     paddingHorizontal: 18,
//     borderRadius: 10,
//   },
//   cancelBtn: {
//     backgroundColor: "#27272a",
//   },
//   saveBtn: {
//     backgroundColor: "#ef4444",
//   },
//   modalBtnText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   detailThumb: {
//     width: "100%",
//     height: 180,
//     borderRadius: 12,
//     backgroundColor: "#27272a",
//   },
//   detailTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//     marginTop: 14,
//   },
// });


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {
  Eye,
  Clock,
  DollarSign,
  IndianRupee,
  History,
  Users,
  TrendingUp,
  Calendar,
  Edit,
  Mail,
  ArrowUpDown,
  X,
  Upload,
  Lock,
  EyeOff,
} from "lucide-react-native";

const API_BASE = "https://bharat-pay-3.onrender.com/api";
const BACKEND_URL = "https://bharat-pay-3.onrender.com";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState("my-videos");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Profile
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [avatarUri, setAvatarUri] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // Change Password
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [myVideos, setMyVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);

  const getMediaUrl = (path) => {
    if (!path) return null;
    const cleaned = String(path).replace(/\\/g, "/");
    if (cleaned.startsWith("http")) return cleaned;
    return `${BACKEND_URL}/${cleaned}`;
  };

  // ─── Fetch Profile ───
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login first.");

        const res = await fetch(`${API_BASE}/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            await AsyncStorage.multiRemove(["token", "user"]);
            navigation.replace("Login");
            throw new Error("Session expired. Please login again.");
          }
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        if (!data.success || !data.user) {
          throw new Error("Invalid profile data received");
        }

        const profile = data.user;

        setUser({
          _id: profile._id,
          name: profile.name || "User",
          handle: `@${(profile.name || "user")
            .toLowerCase()
            .replace(/\s+/g, "")}`,
          email: profile.email || "",
          avatar:
            getMediaUrl(profile.avatar) ||
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
          createdAt: profile.createdAt
            ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })
            : "Unknown date",
          subscribers: profile.subscribers || 0,
          totalVideos: profile.videos?.length || 0,
          totalViews: profile.totalViews || 0,
          totalEarnings: profile.totalEarnings || 0,
          avgRPM: profile.avgRPM || "0.0",
          earningsThisMonth: profile.earningsThisMonth || 0,
          pendingWithdrawal: profile.pendingWithdrawal || 0,
        });

        setEditForm({
          name: profile.name || "",
          email: profile.email || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigation]);

  // ─── Fetch My Videos (channels → videos) ───
  useEffect(() => {
    if (!user?._id) return;

    const fetchMyVideos = async () => {
      try {
        setVideosLoading(true);
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const chRes = await fetch(`${API_BASE}/uservideo/channel`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!chRes.ok) return;

        const chData = await chRes.json();
        const channels = chData.channels || [];

        if (channels.length === 0) {
          setMyVideos([]);
          return;
        }

        const allVideos = [];

        for (const ch of channels) {
          const vRes = await fetch(
            `${API_BASE}/uservideo/channel/${ch._id}/videos`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!vRes.ok) continue;

          const vData = await vRes.json();
          const list = vData.videos || [];

          list.forEach((v) => {
            allVideos.push({
              id: v._id,
              _id: v._id,
              title: v.title || "Untitled",
              description: v.description || "",
              thumbnail: getMediaUrl(v.thumbnail),
              videofile: getMediaUrl(v.videoUrl || v.videofile || v.video),
              views: v.views || 0,
              likes: v.likesCount ?? v.likes ?? 0,
              dislikes: v.dislikesCount ?? v.dislikes ?? 0,
              commentsCount: Array.isArray(v.comments)
                ? v.comments.length
                : v.commentsCount || 0,
              earnings: v.earnings || 0,
              uploadDate: v.createdAt,
              channel: v.channel?.name || ch.name,
              status: "public",
            });
          });
        }

        allVideos.sort(
          (a, b) => new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0)
        );

        setMyVideos(allVideos);

        const totalViews = allVideos.reduce((s, v) => s + (v.views || 0), 0);
        setUser((prev) =>
          prev
            ? {
                ...prev,
                totalVideos: allVideos.length,
                totalViews: prev.totalViews || totalViews,
              }
            : prev
        );
      } catch (e) {
        console.warn("My videos fetch error:", e);
      } finally {
        setVideosLoading(false);
      }
    };

    fetchMyVideos();
  }, [user?._id]);

  // ─── Pick Avatar ───
  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setAvatarUri(result.assets[0].uri);
      setEditError(null);
    }
  };

  // ─── Edit Profile Submit ───
  const handleEditSubmit = async () => {
    setEditLoading(true);
    setEditError(null);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !user?._id) throw new Error("Please login again");

      const formData = new FormData();
      const trimmedName = editForm.name?.trim();
      if (trimmedName && trimmedName !== user.name) {
        formData.append("name", trimmedName);
      }

      const trimmedEmail = editForm.email?.trim().toLowerCase();
      if (trimmedEmail && trimmedEmail !== user.email.toLowerCase()) {
        formData.append("email", trimmedEmail);
      }

      if (avatarUri) {
        formData.append("avatar", {
          uri: avatarUri,
          type: "image/jpeg",
          name: "avatar.jpg",
        });
      }

      if (!formData.has("name") && !formData.has("email") && !avatarUri) {
        throw new Error("No changes detected");
      }

      const res = await fetch(`${API_BASE}/user/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser((prev) => ({
        ...prev,
        name: data.user.name || prev.name,
        email: data.user.email || prev.email,
        avatar: getMediaUrl(data.user.avatar) || prev.avatar,
        handle: data.user.name
          ? `@${data.user.name.toLowerCase().replace(/\s+/g, "")}`
          : prev.handle,
      }));

      setEditForm({
        name: data.user.name || editForm.name,
        email: data.user.email || editForm.email,
      });

      setAvatarUri(null);
      setIsEditOpen(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditError(null);
    setAvatarUri(null);
  };

  // ─── Change Password ───
  const handlePasswordSubmit = async () => {
    try {
      setPasswordLoading(true);
      setPasswordError(null);
      setPasswordSuccess(false);

      const { oldPassword, newPassword, confirmPassword } = passwordForm;

      if (!oldPassword || !newPassword || !confirmPassword) {
        throw new Error("All fields are required");
      }
      if (newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match");
      }

      const token = await AsyncStorage.getItem("token");
      if (!token || !user?._id) throw new Error("Authentication required");

      const res = await fetch(`${API_BASE}/user/password/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to change password");
      }

      setPasswordSuccess(true);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setIsPasswordOpen(false);
        setPasswordSuccess(false);
      }, 1500);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setIsPasswordOpen(false);
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError(null);
    setPasswordSuccess(false);
    setShowPasswords({ old: false, new: false, confirm: false });
  };

  // ─── Logout ───
  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    navigation.replace("Login");
  };

  const tabs = [
    { id: "my-videos", label: "My Videos", Icon: Eye },
    { id: "earnings", label: "Earnings", Icon: IndianRupee },
    { id: "watch-history", label: "History", Icon: History },
  ];

  // ─── Loading / Error ───
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Error: {error || "Profile not loaded"}
        </Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.retryText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Tab Content ───
  const renderTabContent = () => {
    if (activeTab === "earnings") {
      return (
        <View>
          <Text style={styles.sectionTitle}>Earnings Overview</Text>
          <View style={styles.earningsGrid}>
            {[
              {
                label: "This Month",
                value: `₹${(user.earningsThisMonth || 0).toLocaleString()}`,
              },
              {
                label: "Total Earnings",
                value: `₹${(user.totalEarnings || 0).toLocaleString()}`,
              },
              {
                label: "Pending",
                value: `₹${(user.pendingWithdrawal || 0).toLocaleString()}`,
              },
              { label: "Avg. RPM", value: `₹${user.avgRPM || "0.0"}` },
            ].map((item) => (
              <View key={item.label} style={styles.earningCard}>
                <Text style={styles.earningLabel}>{item.label}</Text>
                <Text style={styles.earningValue}>{item.value}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.emptyHint}>
            Earnings history will appear here once available
          </Text>
        </View>
      );
    }

    if (activeTab === "watch-history") {
      return (
        <View>
          <Text style={styles.sectionTitle}>Watch History</Text>
          <Text style={styles.emptyHint}>
            Your watch history will appear here
          </Text>
        </View>
      );
    }

    // My Videos
    const sortedVideos = [...myVideos].sort((a, b) => {
      if (sortBy === "latest")
        return new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0);
      if (sortBy === "views") return (b.views || 0) - (a.views || 0);
      if (sortBy === "earnings") return (b.earnings || 0) - (a.earnings || 0);
      return 0;
    });

    return (
      <View>
        <View style={styles.videosHeader}>
          <Text style={styles.sectionTitle}>
            My Videos ({myVideos.length})
          </Text>
          <View style={styles.sortRow}>
            <ArrowUpDown size={14} color="#71717a" />
            <TouchableOpacity
              onPress={() =>
                setSortBy((s) =>
                  s === "latest"
                    ? "views"
                    : s === "views"
                    ? "earnings"
                    : "latest"
                )
              }
            >
              <Text style={styles.sortText}>
                {sortBy === "latest"
                  ? "Latest"
                  : sortBy === "views"
                  ? "Highest Views"
                  : "Highest Earnings"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {videosLoading ? (
          <ActivityIndicator color="#ef4444" style={{ marginVertical: 30 }} />
        ) : sortedVideos.length === 0 ? (
          <View style={styles.emptyVideos}>
            <Text style={styles.emptyTitle}>No videos yet</Text>
            <Text style={styles.emptyHint}>
              Upload your first video to get started
            </Text>
          </View>
        ) : (
          sortedVideos.map((video) => (
            <TouchableOpacity
              key={video.id || video._id}
              style={styles.videoCard}
              onPress={() => {
                navigation.navigate("VideoDetail", {
                  id: video.id || video._id,
                  item: video,
                });
              }}
              onLongPress={() => setSelectedVideo(video)}
              activeOpacity={0.85}
            >
              <Image
                source={{
                  uri:
                    video.thumbnail ||
                    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400",
                }}
                style={styles.videoThumb}
              />
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {video.title}
                </Text>
                <View style={styles.videoMetaRow}>
                  <View style={styles.metaItem}>
                    <Eye size={13} color="#a1a1aa" />
                    <Text style={styles.metaText}>
                      {(video.views || 0).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaText}>👍 {video.likes || 0}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaText}>
                      💬 {video.commentsCount || 0}
                    </Text>
                  </View>
                </View>
                {video.channel ? (
                  <Text style={styles.channelHint} numberOfLines={1}>
                    {video.channel}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Profile Header ── */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.handle}>{user.handle}</Text>

          <View style={styles.infoRow}>
            <Users size={14} color="#a1a1aa" />
            <Text style={styles.infoText}>
              {user.subscribers.toLocaleString()} subscribers
            </Text>
            <Calendar size={14} color="#a1a1aa" style={{ marginLeft: 12 }} />
            <Text style={styles.infoText}>Joined {user.createdAt}</Text>
          </View>

          <View style={styles.emailRow}>
            <Mail size={14} color="#71717a" />
            <Text style={styles.emailText}>{user.email}</Text>
          </View>

          {/* Action buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.withdrawBtn]}
              onPress={() => navigation.navigate("Withdraw")}
            >
              <IndianRupee size={16} color="#fff" />
              <Text style={styles.actionBtnTextWhite}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setIsEditOpen(true)}
            >
              <Edit size={15} color="#e4e4e7" />
              <Text style={styles.actionBtnText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setIsPasswordOpen(true)}
            >
              <Lock size={15} color="#e4e4e7" />
              <Text style={styles.actionBtnText}>Password</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsGrid}>
          {[
            {
              Icon: Eye,
              value: user.totalViews?.toLocaleString() || "0",
              label: "Total Views",
              color: "#3b82f6",
            },
            {
              Icon: Clock,
              value: "0h",
              label: "Watch Hours",
              color: "#10b981",
            },
            {
              Icon: DollarSign,
              value: `₹${(user.totalEarnings || 0).toLocaleString()}`,
              label: "Earnings",
              color: "#ef4444",
            },
            {
              Icon: TrendingUp,
              value: `₹${user.avgRPM}`,
              label: "Avg. RPM",
              color: "#a855f7",
            },
          ].map(({ Icon, value, label, color }) => (
            <View key={label} style={styles.statCard}>
              <Icon size={22} color={color} />
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* ── Tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <TouchableOpacity
                key={id}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(id)}
              >
                <Icon size={16} color={isActive ? "#ef4444" : "#a1a1aa"} />
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Tab Content ── */}
        <View style={styles.tabBody}>{renderTabContent()}</View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ====================== EDIT PROFILE MODAL ====================== */}
      <Modal visible={isEditOpen} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={closeEdit}>
                <X size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {editError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorBoxText}>{editError}</Text>
                </View>
              ) : null}

              <Text style={styles.label}>Avatar</Text>
              <View style={styles.avatarEditRow}>
                <Image
                  source={{ uri: avatarUri || user.avatar }}
                  style={styles.editAvatar}
                />
                <TouchableOpacity
                  style={styles.pickAvatarBtn}
                  onPress={pickAvatar}
                >
                  <Upload size={16} color="#fff" />
                  <Text style={styles.pickAvatarText}>
                    {avatarUri ? "Change" : "Choose image"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.hint}>Max 5MB • JPG, PNG</Text>

              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(t) => setEditForm({ ...editForm, name: t })}
                placeholder="Your name"
                placeholderTextColor="#71717a"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={editForm.email}
                onChangeText={(t) => setEditForm({ ...editForm, email: t })}
                placeholder="your@email.com"
                placeholderTextColor="#71717a"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={closeEdit}
                  disabled={editLoading}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.saveBtn]}
                  onPress={handleEditSubmit}
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.modalBtnText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ====================== CHANGE PASSWORD MODAL ====================== */}
      <Modal visible={isPasswordOpen} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Lock size={18} color="#ef4444" />
                <Text style={styles.modalTitle}>Change Password</Text>
              </View>
              <TouchableOpacity onPress={closePasswordModal}>
                <X size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {passwordError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorBoxText}>{passwordError}</Text>
                </View>
              ) : null}
              {passwordSuccess ? (
                <View style={styles.successBox}>
                  <Text style={styles.successText}>Password updated!</Text>
                </View>
              ) : null}

              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={passwordForm.oldPassword}
                  onChangeText={(t) =>
                    setPasswordForm({ ...passwordForm, oldPassword: t })
                  }
                  secureTextEntry={!showPasswords.old}
                  placeholderTextColor="#71717a"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() =>
                    setShowPasswords((p) => ({ ...p, old: !p.old }))
                  }
                >
                  {showPasswords.old ? (
                    <EyeOff size={18} color="#a1a1aa" />
                  ) : (
                    <Eye size={18} color="#a1a1aa" />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={passwordForm.newPassword}
                  onChangeText={(t) =>
                    setPasswordForm({ ...passwordForm, newPassword: t })
                  }
                  secureTextEntry={!showPasswords.new}
                  placeholderTextColor="#71717a"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() =>
                    setShowPasswords((p) => ({ ...p, new: !p.new }))
                  }
                >
                  {showPasswords.new ? (
                    <EyeOff size={18} color="#a1a1aa" />
                  ) : (
                    <Eye size={18} color="#a1a1aa" />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={passwordForm.confirmPassword}
                  onChangeText={(t) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: t })
                  }
                  secureTextEntry={!showPasswords.confirm}
                  placeholderTextColor="#71717a"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() =>
                    setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))
                  }
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={18} color="#a1a1aa" />
                  ) : (
                    <Eye size={18} color="#a1a1aa" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={closePasswordModal}
                  disabled={passwordLoading}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.saveBtn]}
                  onPress={handlePasswordSubmit}
                  disabled={passwordLoading || passwordSuccess}
                >
                  {passwordLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.modalBtnText}>Update Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ====================== VIDEO DETAIL MODAL ====================== */}
      <Modal visible={!!selectedVideo} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Video Details</Text>
              <TouchableOpacity onPress={() => setSelectedVideo(null)}>
                <X size={22} color="#fff" />
              </TouchableOpacity>
            </View>
            {selectedVideo && (
              <View>
                <Image
                  source={{
                    uri:
                      selectedVideo.thumbnail ||
                      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400",
                  }}
                  style={styles.detailThumb}
                />
                <Text style={styles.detailTitle}>{selectedVideo.title}</Text>
                <Text style={{ color: "#a1a1aa", marginTop: 8, fontSize: 13 }}>
                  {(selectedVideo.views || 0).toLocaleString()} views
                  {"  •  "}👍 {selectedVideo.likes || 0}
                  {"  •  "}👎 {selectedVideo.dislikes || 0}
                  {"  •  "}💬 {selectedVideo.commentsCount || 0}
                </Text>
                {selectedVideo.description ? (
                  <Text
                    style={{ color: "#d4d4d8", marginTop: 12, fontSize: 14 }}
                  >
                    {selectedVideo.description}
                  </Text>
                ) : null}
                <TouchableOpacity
                  style={[
                    styles.modalBtn,
                    styles.saveBtn,
                    { marginTop: 20, alignItems: "center" },
                  ]}
                  onPress={() => {
                    setSelectedVideo(null);
                    navigation.navigate("VideoDetail", {
                      id: selectedVideo.id || selectedVideo._id,
                      item: selectedVideo,
                    });
                  }}
                >
                  <Text style={styles.modalBtnText}>Play Video</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  center: {
    flex: 1,
    backgroundColor: "#09090b",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    color: "#a1a1aa",
    marginTop: 12,
  },
  errorText: {
    color: "#f87171",
    fontSize: 16,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: "#ef4444",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },

  profileHeader: {
    backgroundColor: "#18181b",
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: "#3f3f46",
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
  },
  handle: {
    color: "#a1a1aa",
    fontSize: 14,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
  },
  infoText: {
    color: "#a1a1aa",
    fontSize: 13,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  emailText: {
    color: "#71717a",
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
    justifyContent: "center",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#27272a",
    borderWidth: 1,
    borderColor: "#3f3f46",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  withdrawBtn: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  actionBtnText: {
    color: "#e4e4e7",
    fontWeight: "600",
    fontSize: 13,
  },
  actionBtnTextWhite: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  logoutBtn: {
    marginTop: 12,
  },
  logoutText: {
    color: "#f87171",
    fontSize: 13,
    fontWeight: "500",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 10,
  },
  statCard: {
    width: "47%",
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },
  statLabel: {
    color: "#71717a",
    fontSize: 11,
    marginTop: 2,
  },

  tabsScroll: {
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
  },
  tabsContent: {
    paddingHorizontal: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#ef4444",
  },
  tabText: {
    color: "#a1a1aa",
    fontSize: 13,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#ef4444",
  },
  tabBody: {
    backgroundColor: "#18181b",
    margin: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#27272a",
    padding: 16,
    minHeight: 280,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  emptyHint: {
    color: "#71717a",
    textAlign: "center",
    paddingVertical: 30,
    fontSize: 14,
  },
  emptyVideos: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  earningsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  earningCard: {
    width: "47%",
    backgroundColor: "#09090b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  earningLabel: {
    color: "#71717a",
    fontSize: 11,
  },
  earningValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },

  videosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    color: "#a1a1aa",
    fontSize: 12,
  },
  videoCard: {
    flexDirection: "row",
    backgroundColor: "#09090b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    overflow: "hidden",
    marginBottom: 10,
  },
  videoThumb: {
    width: 120,
    height: 72,
    backgroundColor: "#27272a",
  },
  videoInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  videoTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 17,
  },
  videoMetaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#a1a1aa",
    fontSize: 12,
  },
  channelHint: {
    color: "#71717a",
    fontSize: 11,
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#18181b",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    padding: 20,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  errorBox: {
    backgroundColor: "#450a0a",
    borderWidth: 1,
    borderColor: "#991b1b",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorBoxText: {
    color: "#fca5a5",
    fontSize: 13,
  },
  successBox: {
    backgroundColor: "#052e16",
    borderWidth: 1,
    borderColor: "#166534",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  successText: {
    color: "#86efac",
    fontSize: 13,
  },
  label: {
    color: "#a1a1aa",
    fontSize: 12,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#09090b",
    borderWidth: 1,
    borderColor: "#3f3f46",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 15,
    marginBottom: 4,
  },
  hint: {
    color: "#52525b",
    fontSize: 11,
    marginTop: 4,
  },
  avatarEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  editAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#3f3f46",
  },
  pickAvatarBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#27272a",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3f3f46",
  },
  pickAvatarText: {
    color: "#fff",
    fontSize: 13,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    padding: 4,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 24,
    marginBottom: 8,
  },
  modalBtn: {
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  cancelBtn: {
    backgroundColor: "#27272a",
  },
  saveBtn: {
    backgroundColor: "#ef4444",
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  detailThumb: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#27272a",
  },
  detailTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 14,
  },
});
// import React from "react";
// import { View, Text } from "react-native";
// import CustomButton from "../components/CustomButton";
// import styles from "../styles/globalStyles";

// export default function ProfileScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Admin Profile</Text>
//       <Text>Email: admin@gmail.com</Text>

//       <CustomButton
//         title="Logout"
//         onPress={() => navigation.replace("Login")}
//       />
//     </View>
//   );
// }


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   TextInput,
//   ScrollView,
//   Switch,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import * as ImagePicker from 'expo-image-picker';
// import { VideoView, useVideoPlayer } from 'expo-video';
// import { Picker } from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const { width } = Dimensions.get('window');

// const API_BASE = 'https://bitzo-server-1.onrender.com/api';
// const BACKEND_URL = 'https://bitzo-server-1.onrender.com';

// const STATIC_CATEGORIES = [
//   { _id: '1', name: 'Gaming' },
//   { _id: '2', name: 'Education' },
//   { _id: '3', name: 'Entertainment' },
//   { _id: '4', name: 'Music' },
//   { _id: '5', name: 'Technology' },
//   { _id: '6', name: 'Sports' },
//   { _id: '7', name: 'Cooking' },
//   { _id: '8', name: 'Travel' },
// ];

// const getToken = () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWI2ZjlkYmI3YjJjMTI5ZjM5MTI1MzciLCJpYXQiOjE3NzQ1OTQ3OTUsImV4cCI6MTc3NTE5OTU5NX0.b0MeF1JbY4fL6TQqVWBc4wuqvAZQSCoAE4Y_9FllR-k'; // Replace with AsyncStorage in production
// const getUserId = () => '69b6f9dbb7b2c129f3912537'; // Replace with real userId from storage

// export default function ChannelPage() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { handle: urlHandle } = route.params || {};

//   const [channels, setChannels] = useState([]);
//   const [selectedChannelId, setSelectedChannelId] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [categories, setCategories] = useState(STATIC_CATEGORIES);
//   const [activeTab, setActiveTab] = useState('Videos');
//   const [loading, setLoading] = useState(true);

//   // Subscription
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [subscribersCount, setSubscribersCount] = useState(0);

//   // Create Channel Modal
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newChannel, setNewChannel] = useState({
//     name: '',
//     channelDescription: '',
//     category: '',
//     channelImageUri: null,
//     channelBannerUri: null,
//     contactemail: '',
//   });
//   const [createError, setCreateError] = useState('');

//   // Upload Video Modal
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [selectedUploadChannelId, setSelectedUploadChannelId] = useState('');
//   const [videoUri, setVideoUri] = useState(null);
//   const [thumbnailUri, setThumbnailUri] = useState(null);
//   const [videoname, setVideoname] = useState('');
//   const [videoDescription, setVideoDescription] = useState('');
//   const [videoCategory, setVideoCategory] = useState('');
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [uploadError, setUploadError] = useState('');
//   const [uploading, setUploading] = useState(false);

//   // Video Player
//   const [showVideoPlayer, setShowVideoPlayer] = useState(false);
//   const [currentVideo, setCurrentVideo] = useState(null);

//   // Fetch Categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/category`);
//         if (res.ok) {
//           const data = await res.json();
//           setCategories(Array.isArray(data) && data.length > 0 ? data : STATIC_CATEGORIES);
//         }
//       } catch (e) {
//         setCategories(STATIC_CATEGORIES);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch User's Channels
//   useEffect(() => {
//     const fetchUserChannels = async () => {
//       const token = getToken();
//       if (!token) {
//         setLoading(false);
//         Alert.alert('Login Required', 'Please login first.');
//         return;
//       }

//       try {
//         setLoading(true);
//         const res = await fetch(`${API_BASE}/uservideo/channel`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error('Failed to fetch channels');

//         const data = await res.json();
//         const userChannels = data.channels || [];
//         setChannels(userChannels);

//         let initialId = null;
//         if (urlHandle) {
//           const matched = userChannels.find(
//             (ch) => ch.name?.replace(/\s+/g, '').toLowerCase() === urlHandle.toLowerCase()
//           );
//           if (matched) initialId = matched._id;
//         }
//         if (!initialId && userChannels.length > 0) initialId = userChannels[0]._id;

//         setSelectedChannelId(initialId);
//       } catch (err) {
//         console.error('Error fetching channels:', err);
//         Alert.alert('Error', err.message || 'Failed to load channels');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserChannels();
//   }, [urlHandle]);

//   // Fetch Selected Channel + Videos
//   useEffect(() => {
//     if (!selectedChannelId) return;

//     const fetchChannelVideos = async () => {
//       const token = getToken();
//       if (!token) return;

//       try {
//         const selected = channels.find((c) => c._id === selectedChannelId);
//         if (!selected) return;

//         const videosRes = await fetch(
//           `${API_BASE}/uservideo/channel/${selectedChannelId}/videos`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         let videos = [];
//         if (videosRes.ok) {
//           const result = await videosRes.json();
//           videos = result.videos || [];
//         }

//         const cleanHandle = selected.name?.replace(/\s+/g, '') || selected._id;

//         const channelData = {
//           ...selected,
//           handle: `@${cleanHandle}`,
//           avatar: selected.channelImage || 'https://i.pravatar.cc/150',
//           banner: selected.channelBanner || 'https://picsum.photos/id/1015/800/300',
//           description: selected.channeldescription || 'No description available',
//           videos,
//         };

//         setChannel(channelData);
//         setSubscribersCount(selected.subscribers || 0);
//         setIsSubscribed(selected.subscribedBy?.includes(getUserId()) || false);
//       } catch (err) {
//         console.error('Error fetching channel/videos:', err);
//       }
//     };

//     fetchChannelVideos();
//   }, [selectedChannelId, channels]);

//   // Image & Video Picker
//   const pickImage = async (setter) => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'We need access to your photos.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 0.8,
//     });

//     if (!result.canceled) setter(result.assets[0].uri);
//   };

//   const pickVideo = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'We need access to your videos.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//       allowsEditing: false,
//       quality: 1,
//     });

//     if (!result.canceled) setVideoUri(result.assets[0].uri);
//   };

//   // Subscription
//   const handleSubscription = async () => {
//     if (!selectedChannelId) return;

//     const token = getToken();
//     if (!token) return Alert.alert('Error', 'Please login to subscribe');

//     try {
//       const res = await fetch(`${API_BASE}/uservideo/subscribe/${selectedChannelId}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || 'Subscription failed');

//       setIsSubscribed(result.subscribed);
//       setSubscribersCount((prev) => (result.subscribed ? prev + 1 : prev - 1));
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Something went wrong');
//     }
//   };

//   // Create Channel
//   const handleCreateChannel = async () => {
//     const token = getToken();
//     if (!token) return setCreateError('Please login first.');

//     if (!newChannel.name.trim()) return setCreateError('Channel name is required');
//     if (!newChannel.category) return setCreateError('Please select a category');

//     try {
//       const formData = new FormData();
//       formData.append('name', newChannel.name.trim());
//       formData.append('channeldescription', newChannel.channelDescription || '');
//       formData.append('category', newChannel.category);
//       formData.append('contactemail', newChannel.contactemail || '');

//       if (newChannel.channelImageUri) {
//         formData.append('channelImage', {
//           uri: newChannel.channelImageUri,
//           name: newChannel.channelImageUri.split('/').pop(),
//           type: 'image/jpeg',
//         });
//       }
//       if (newChannel.channelBannerUri) {
//         formData.append('channelBanner', {
//           uri: newChannel.channelBannerUri,
//           name: newChannel.channelBannerUri.split('/').pop(),
//           type: 'image/jpeg',
//         });
//       }

//       const response = await fetch(`${API_BASE}/uservideo/createchannel`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || 'Failed to create channel');

//       Alert.alert('Success', 'Channel created successfully!');

//       // Refresh channels
//       const channelsRes = await fetch(`${API_BASE}/uservideo/channel`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (channelsRes.ok) {
//         const data = await channelsRes.json();
//         setChannels(data.channels || []);
//         setSelectedChannelId(result.channel?._id);
//       }

//       setShowCreateModal(false);
//       setNewChannel({
//         name: '',
//         channelDescription: '',
//         category: '',
//         channelImageUri: null,
//         channelBannerUri: null,
//         contactemail: '',
//       });
//     } catch (error) {
//       setCreateError(error.message || 'Failed to create channel.');
//     }
//   };

//   // Upload Video
//   const handleUploadVideo = async () => {
//     const token = getToken();
//     if (!token) return setUploadError('Please login first.');

//     if (!selectedUploadChannelId) return setUploadError('Please select a channel');
//     if (!videoUri) return setUploadError('Please select a video file');
//     if (!videoname.trim()) return setUploadError('Please enter a video name');
//     if (!videoCategory) return setUploadError('Please select a video category');
//     if (!agreeTerms) return setUploadError('Please agree to the terms');

//     setUploading(true);
//     setUploadError('');

//     try {
//       const formData = new FormData();
//       formData.append('name', videoname.trim());
//       formData.append('description', videoDescription || '');
//       formData.append('category', videoCategory);
//       formData.append('video', {
//         uri: videoUri,
//         name: videoUri.split('/').pop() || 'video.mp4',
//         type: 'video/mp4',
//       });

//       if (thumbnailUri) {
//         formData.append('thumbnail', {
//           uri: thumbnailUri,
//           name: thumbnailUri.split('/').pop() || 'thumbnail.jpg',
//           type: 'image/jpeg',
//         });
//       }

//       const response = await fetch(`${API_BASE}/uservideo/upload/${selectedUploadChannelId}`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || 'Failed to upload video');

//       Alert.alert('Success', 'Video uploaded successfully!');

//       // Refresh videos
//       const videosRes = await fetch(`${API_BASE}/uservideo/channel/${selectedChannelId}/videos`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (videosRes.ok) {
//         const data = await videosRes.json();
//         setChannel((prev) => ({ ...prev, videos: data.videos || [] }));
//       }

//       setShowUploadModal(false);
//       // Reset form
//       setVideoUri(null);
//       setThumbnailUri(null);
//       setVideoname('');
//       setVideoDescription('');
//       setVideoCategory('');
//       setAgreeTerms(false);
//       setSelectedUploadChannelId('');
//     } catch (error) {
//       setUploadError(error.message || 'Failed to upload video.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handlePlayVideo = (video) => {
//     setCurrentVideo(video);
//     setShowVideoPlayer(true);
//   };

//   if (loading) {
//     return (
//       <SafeAreaProvider>
//         <SafeAreaView style={styles.center}>
//           <ActivityIndicator size="large" color="#ff0000" />
//           <Text style={{ color: '#aaa', marginTop: 12 }}>Loading channels...</Text>
//         </SafeAreaView>
//       </SafeAreaProvider>
//     );
//   }

//   if (channels.length === 0) {
//     return (
//       <SafeAreaProvider>
//         <SafeAreaView style={styles.center}>
//           <Text style={{ color: '#fff', fontSize: 18 }}>No channels found</Text>
//           <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowCreateModal(true)}>
//             <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Channel</Text>
//           </TouchableOpacity>
//         </SafeAreaView>
//       </SafeAreaProvider>
//     );
//   }

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container}>
//         {/* Banner */}
//         <Image source={{ uri: channel?.banner }} style={styles.banner} />

//         {/* Avatar + Info */}
//         <View style={styles.profileSection}>
//           <Image source={{ uri: channel?.avatar }} style={styles.avatar} />

//           <View style={styles.infoContainer}>
//             <Text style={styles.channelName}>{channel?.name}</Text>
//             <Text style={styles.handle}>{channel?.handle}</Text>

//             <View style={styles.statsRow}>
//               <TouchableOpacity onPress={handleSubscription} style={[styles.subscribeBtn, isSubscribed && styles.subscribedBtn]}>
//                 <Icon name="account-group" size={18} color="#fff" />
//                 <Text style={styles.subscribeText}>{isSubscribed ? 'Subscribed' : 'Subscribe'}</Text>
//               </TouchableOpacity>
//               <Text style={styles.subscribersText}>{subscribersCount.toLocaleString()} subscribers</Text>
//             </View>
//           </View>
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionButtons}>
//           <TouchableOpacity style={styles.actionBtn}>
//             <Icon name="pencil" size={18} color="#fff" />
//             <Text style={styles.actionText}>Customize channel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10b981' }]} onPress={() => setShowUploadModal(true)}>
//             <Icon name="video-plus" size={18} color="#fff" />
//             <Text style={styles.actionText}>Upload video</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2563eb' }]} onPress={() => setShowCreateModal(true)}>
//             <Icon name="plus" size={18} color="#fff" />
//             <Text style={styles.actionText}>Create channel</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Tabs */}
//         <View style={styles.tabBar}>
//           {['Videos', 'Playlists', 'Posts'].map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               onPress={() => setActiveTab(tab)}
//               style={[styles.tab, activeTab === tab && styles.activeTab]}
//             >
//               <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Videos Grid */}
//         {activeTab === 'Videos' && (
//           <FlatList
//             data={channel?.videos || []}
//             keyExtractor={(item) => item._id}
//             numColumns={2}
//             contentContainerStyle={styles.videoGrid}
//             renderItem={({ item }) => (
//               <TouchableOpacity style={styles.videoCard} onPress={() => handlePlayVideo(item)}>
//                 <Image
//                   source={{ uri: item.thumbnail ? `${BACKEND_URL}/${item.thumbnail}` : 'https://picsum.photos/300/170' }}
//                   style={styles.thumbnail}
//                 />
//                 <Text style={styles.videoTitle} numberOfLines={2}>{item.title || item.name}</Text>
//                 <Text style={styles.videoMeta}>
//                   {(item.views || 0).toLocaleString()} views • {new Date(item.createdAt).toLocaleDateString()}
//                 </Text>
//               </TouchableOpacity>
//             )}
//             ListEmptyComponent={<Text style={styles.emptyText}>No videos yet</Text>}
//           />
//         )}

//         {/* Video Player Modal */}
//         <Modal visible={showVideoPlayer} animationType="slide" onRequestClose={() => setShowVideoPlayer(false)}>
//           <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
//             <View style={styles.playerHeader}>
//               <Text style={styles.playerTitle}>{currentVideo?.title || currentVideo?.name}</Text>
//               <TouchableOpacity onPress={() => setShowVideoPlayer(false)}>
//                 <Icon name="close" size={28} color="#fff" />
//               </TouchableOpacity>
//             </View>

//             {currentVideo && (
//               <VideoView
//                 player={useVideoPlayer({ uri: `${BACKEND_URL}/${currentVideo.videofile || currentVideo.videoUrl}` })}
//                 style={{ width: '100%', height: width * 0.5625 }}
//                 allowsFullscreen
//                 allowsPictureInPicture
//               />
//             )}
//           </SafeAreaView>
//         </Modal>

//         {/* Create Channel Modal */}
//         <Modal visible={showCreateModal} animationType="slide">
//           <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
//             <ScrollView style={{ padding: 20 }}>
//               <Text style={styles.modalTitle}>Create a new channel</Text>
//               {createError && <Text style={styles.errorText}>{createError}</Text>}

//               <TextInput style={styles.input} placeholder="Channel name *" value={newChannel.name} onChangeText={(t) => setNewChannel({ ...newChannel, name: t })} />
//               <TextInput style={[styles.input, { height: 80 }]} placeholder="Description (optional)" multiline value={newChannel.channelDescription} onChangeText={(t) => setNewChannel({ ...newChannel, channelDescription: t })} />

//               <View style={styles.pickerContainer}>
//                 <Text style={styles.label}>Category *</Text>
//                 <Picker selectedValue={newChannel.category} onValueChange={(v) => setNewChannel({ ...newChannel, category: v })}>
//                   <Picker.Item label="Select category" value="" />
//                   {categories.map((cat) => <Picker.Item key={cat._id} label={cat.name} value={cat._id} />)}
//                 </Picker>
//               </View>

//               <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage((uri) => setNewChannel({ ...newChannel, channelImageUri: uri }))}>
//                 <Text style={{ color: newChannel.channelImageUri ? '#10b981' : '#aaa' }}>{newChannel.channelImageUri ? 'Avatar Selected' : 'Upload Avatar'}</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage((uri) => setNewChannel({ ...newChannel, channelBannerUri: uri }))}>
//                 <Text style={{ color: newChannel.channelBannerUri ? '#10b981' : '#aaa' }}>{newChannel.channelBannerUri ? 'Banner Selected' : 'Upload Banner'}</Text>
//               </TouchableOpacity>

//               <TextInput style={styles.input} placeholder="Contact email (optional)" value={newChannel.contactemail} onChangeText={(t) => setNewChannel({ ...newChannel, contactemail: t })} />

//               <View style={styles.modalActions}>
//                 <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCreateModal(false)}>
//                   <Text style={{ color: '#fff' }}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.submitBtn} onPress={handleCreateChannel}>
//                   <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Channel</Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </SafeAreaView>
//         </Modal>

//         {/* Upload Video Modal */}
//         <Modal visible={showUploadModal} animationType="slide">
//           <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
//             <ScrollView style={{ padding: 20 }}>
//               <Text style={styles.modalTitle}>Upload Video</Text>
//               {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}

//               <TouchableOpacity style={styles.uploadBtn} onPress={pickVideo}>
//                 <Text style={{ color: videoUri ? '#10b981' : '#aaa' }}>{videoUri ? 'Video Selected' : 'Select Video *'}</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(setThumbnailUri)}>
//                 <Text style={{ color: thumbnailUri ? '#10b981' : '#aaa' }}>{thumbnailUri ? 'Thumbnail Selected' : 'Select Thumbnail (optional)'}</Text>
//               </TouchableOpacity>

//               <TextInput style={styles.input} placeholder="Video Title *" value={videoname} onChangeText={setVideoname} />

//               <View style={styles.pickerContainer}>
//                 <Text style={styles.label}>Category *</Text>
//                 <Picker selectedValue={videoCategory} onValueChange={setVideoCategory}>
//                   <Picker.Item label="Select category" value="" />
//                   {categories.map((cat) => <Picker.Item key={cat._id} label={cat.name} value={cat._id} />)}
//                 </Picker>
//               </View>

//               <TextInput style={[styles.input, { height: 80 }]} placeholder="Description" multiline value={videoDescription} onChangeText={setVideoDescription} />

//               <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
//                 <Switch value={agreeTerms} onValueChange={setAgreeTerms} />
//                 <Text style={{ color: '#ccc', marginLeft: 10, flex: 1 }}>I agree to Terms of Service and own this content.</Text>
//               </View>

//               <View style={styles.modalActions}>
//                 <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowUploadModal(false)}>
//                   <Text style={{ color: '#fff' }}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.submitBtn} onPress={handleUploadVideo} disabled={uploading}>
//                   <Text style={{ color: '#fff', fontWeight: 'bold' }}>{uploading ? 'Uploading...' : 'Upload Video'}</Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </SafeAreaView>
//         </Modal>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0f0f0f' },
//   banner: { width: '100%', height: 200, resizeMode: 'cover' },
//   profileSection: { flexDirection: 'row', padding: 16, marginTop: -50 },
//   avatar: { width: 90, height: 90, borderRadius: 50, borderWidth: 4, borderColor: '#0f0f0f' },
//   infoContainer: { marginLeft: 16, flex: 1 },
//   channelName: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
//   handle: { color: '#aaa', fontSize: 16 },
//   statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 },
//   subscribeBtn: { backgroundColor: '#ef4444', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, flexDirection: 'row', alignItems: 'center', gap: 6 },
//   subscribedBtn: { backgroundColor: '#3f3f46' },
//   subscribeText: { color: '#fff', fontWeight: '600' },
//   subscribersText: { color: '#aaa' },
//   actionButtons: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 16 },
//   actionBtn: { flex: 1, backgroundColor: '#272727', paddingVertical: 12, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
//   actionText: { color: '#fff', fontWeight: '600' },
//   tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#333' },
//   tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
//   activeTab: { borderBottomWidth: 3, borderBottomColor: '#fff' },
//   tabText: { color: '#aaa', fontSize: 16 },
//   activeTabText: { color: '#fff' },
//   videoGrid: { padding: 8 },
//   videoCard: { flex: 1, margin: 6 },
//   thumbnail: { width: '100%', aspectRatio: 16 / 9, borderRadius: 12 },
//   videoTitle: { color: '#fff', marginTop: 8, fontSize: 15, fontWeight: '500' },
//   videoMeta: { color: '#888', fontSize: 13, marginTop: 4 },
//   emptyText: { color: '#888', textAlign: 'center', marginTop: 40 },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
//   errorText: { color: '#ff6b6b', marginBottom: 12 },
//   input: { backgroundColor: '#1a1a1a', color: '#fff', padding: 14, borderRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: '#333' },
//   uploadBtn: { backgroundColor: '#1a1a1a', padding: 14, borderRadius: 10, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
//   pickerContainer: { marginBottom: 16 },
//   label: { color: '#aaa', marginBottom: 6 },
//   modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 20 },
//   cancelBtn: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#444', borderRadius: 30 },
//   submitBtn: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#2563eb', borderRadius: 30 },
//   primaryBtn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 30, marginTop: 20 },
//   playerHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#111' },
//   playerTitle: { color: '#fff', fontSize: 18, flex: 1 },
// });

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   TextInput,
//   ScrollView,
//   Switch,
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import * as ImagePicker from 'expo-image-picker';
// import { VideoView, useVideoPlayer } from 'expo-video';
// import { Picker } from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const { width } = Dimensions.get('window');

// const API_BASE = 'https://bitzo-server-1.onrender.com/api';
// const BACKEND_URL = 'https://bitzo-server-1.onrender.com';

// const STATIC_CATEGORIES = [
//   { _id: '1', name: 'Gaming' },
//   { _id: '2', name: 'Education' },
//   { _id: '3', name: 'Entertainment' },
//   { _id: '4', name: 'Music' },
//   { _id: '5', name: 'Technology' },
//   { _id: '6', name: 'Sports' },
//   { _id: '7', name: 'Cooking' },
//   { _id: '8', name: 'Travel' },
// ];

// const getToken = () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWI2ZjlkYmI3YjJjMTI5ZjM5MTI1MzciLCJpYXQiOjE3NzQ1OTQ3OTUsImV4cCI6MTc3NTE5OTU5NX0.b0MeF1JbY4fL6TQqVWBc4wuqvAZQSCoAE4Y_9FllR-k';
// const getUserId = () => '69b6f9dbb7b2c129f3912537';

// export default function ChannelPage() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { handle: urlHandle } = route.params || {};

//   const [channels, setChannels] = useState([]);
//   const [selectedChannelId, setSelectedChannelId] = useState(null);
//   const [channel, setChannel] = useState(null);
//   const [categories, setCategories] = useState(STATIC_CATEGORIES);
//   const [activeTab, setActiveTab] = useState('Videos');
//   const [loading, setLoading] = useState(true);
//   const [showChannelDropdown, setShowChannelDropdown] = useState(false);

//   // Subscription
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [subscribersCount, setSubscribersCount] = useState(0);

//   // Create Channel Modal
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newChannel, setNewChannel] = useState({
//     name: '',
//     channelDescription: '',
//     category: '',
//     channelImageUri: null,
//     channelBannerUri: null,
//     contactemail: '',
//   });
//   const [createError, setCreateError] = useState('');

//   // Upload Video Modal
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [selectedUploadChannelId, setSelectedUploadChannelId] = useState('');
//   const [videoUri, setVideoUri] = useState(null);
//   const [thumbnailUri, setThumbnailUri] = useState(null);
//   const [videoname, setVideoname] = useState('');
//   const [videoDescription, setVideoDescription] = useState('');
//   const [videoCategory, setVideoCategory] = useState('');
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [uploadError, setUploadError] = useState('');
//   const [uploading, setUploading] = useState(false);

//   // Video Player
//   const [showVideoPlayer, setShowVideoPlayer] = useState(false);
//   const [currentVideo, setCurrentVideo] = useState(null);

//   // Fetch Categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/category`);
//         if (res.ok) {
//           const data = await res.json();
//           setCategories(Array.isArray(data) && data.length > 0 ? data : STATIC_CATEGORIES);
//         }
//       } catch (e) {
//         setCategories(STATIC_CATEGORIES);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch User's Channels
//   useEffect(() => {
//     const fetchUserChannels = async () => {
//       const token = getToken();
//       if (!token) {
//         setLoading(false);
//         Alert.alert('Login Required', 'Please login first.');
//         return;
//       }

//       try {
//         setLoading(true);
//         const res = await fetch(`${API_BASE}/uservideo/channel`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error('Failed to fetch channels');

//         const data = await res.json();
//         const userChannels = data.channels || [];
//         setChannels(userChannels);

//         let initialId = null;
//         if (urlHandle) {
//           const matched = userChannels.find(
//             (ch) => ch.name?.replace(/\s+/g, '').toLowerCase() === urlHandle.toLowerCase()
//           );
//           if (matched) initialId = matched._id;
//         }
//         if (!initialId && userChannels.length > 0) initialId = userChannels[0]._id;

//         setSelectedChannelId(initialId);
//       } catch (err) {
//         console.error('Error fetching channels:', err);
//         Alert.alert('Error', err.message || 'Failed to load channels');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserChannels();
//   }, [urlHandle]);

//   // Fetch Selected Channel + Videos
//   useEffect(() => {
//     if (!selectedChannelId) return;

//     const fetchChannelVideos = async () => {
//       const token = getToken();
//       if (!token) return;

//       try {
//         const selected = channels.find((c) => c._id === selectedChannelId);
//         if (!selected) return;

//         const videosRes = await fetch(
//           `${API_BASE}/uservideo/channel/${selectedChannelId}/videos`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         let videos = [];
//         if (videosRes.ok) {
//           const result = await videosRes.json();
//           videos = result.videos || [];
//         }

//         const cleanHandle = selected.name?.replace(/\s+/g, '') || selected._id;

//         const channelData = {
//           ...selected,
//           handle: `@${cleanHandle}`,
//           avatar: selected.channelImage ? `${BACKEND_URL}/${selected.channelImage}` : 'https://i.pravatar.cc/150',
//           banner: selected.channelBanner ? `${BACKEND_URL}/${selected.channelBanner}` : 'https://picsum.photos/id/1015/800/300',
//           description: selected.channeldescription || 'No description available',
//           videos,
//         };

//         setChannel(channelData);
//         setSubscribersCount(selected.subscribers || 0);
//         setIsSubscribed(selected.subscribedBy?.includes(getUserId()) || false);
//       } catch (err) {
//         console.error('Error fetching channel/videos:', err);
//       }
//     };

//     fetchChannelVideos();
//   }, [selectedChannelId, channels]);

//   // Image & Video Picker
//   const pickImage = async (setter) => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'We need access to your photos.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 0.8,
//     });

//     if (!result.canceled) setter(result.assets[0].uri);
//   };

//   const pickVideo = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'We need access to your videos.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//       allowsEditing: false,
//       quality: 1,
//     });

//     if (!result.canceled) setVideoUri(result.assets[0].uri);
//   };

//   // Channel Switch
//   const switchChannel = (channelId) => {
//     setSelectedChannelId(channelId);
//     setShowChannelDropdown(false);
//   };

//   // Subscription
//   const handleSubscription = async () => {
//     if (!selectedChannelId) return;

//     const token = getToken();
//     if (!token) return Alert.alert('Error', 'Please login to subscribe');

//     try {
//       const res = await fetch(`${API_BASE}/uservideo/subscribe/${selectedChannelId}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || 'Subscription failed');

//       setIsSubscribed(result.subscribed);
//       setSubscribersCount((prev) => (result.subscribed ? prev + 1 : prev - 1));
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Something went wrong');
//     }
//   };

//   // Create Channel
//   const handleCreateChannel = async () => {
//     const token = getToken();
//     if (!token) return setCreateError('Please login first.');

//     if (!newChannel.name.trim()) return setCreateError('Channel name is required');
//     if (!newChannel.category) return setCreateError('Please select a category');

//     try {
//       const formData = new FormData();
//       formData.append('name', newChannel.name.trim());
//       formData.append('channeldescription', newChannel.channelDescription || '');
//       formData.append('category', newChannel.category);
//       formData.append('contactemail', newChannel.contactemail || '');

//       if (newChannel.channelImageUri) {
//         formData.append('channelImage', {
//           uri: newChannel.channelImageUri,
//           name: newChannel.channelImageUri.split('/').pop(),
//           type: 'image/jpeg',
//         });
//       }
//       if (newChannel.channelBannerUri) {
//         formData.append('channelBanner', {
//           uri: newChannel.channelBannerUri,
//           name: newChannel.channelBannerUri.split('/').pop(),
//           type: 'image/jpeg',
//         });
//       }

//       const response = await fetch(`${API_BASE}/uservideo/createchannel`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || 'Failed to create channel');

//       Alert.alert('Success', 'Channel created successfully!');

//       // Refresh channels
//       const channelsRes = await fetch(`${API_BASE}/uservideo/channel`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (channelsRes.ok) {
//         const data = await channelsRes.json();
//         setChannels(data.channels || []);
//         if (result.channel?._id) setSelectedChannelId(result.channel._id);
//       }

//       setShowCreateModal(false);
//       setNewChannel({
//         name: '',
//         channelDescription: '',
//         category: '',
//         channelImageUri: null,
//         channelBannerUri: null,
//         contactemail: '',
//       });
//       setCreateError('');
//     } catch (error) {
//       setCreateError(error.message || 'Failed to create channel.');
//     }
//   };

//   // Upload Video
//   const handleUploadVideo = async () => {
//     const token = getToken();
//     if (!token) return setUploadError('Please login first.');

//     if (!selectedUploadChannelId) return setUploadError('Please select a channel');
//     if (!videoUri) return setUploadError('Please select a video file');
//     if (!videoname.trim()) return setUploadError('Please enter a video name');
//     if (!videoCategory) return setUploadError('Please select a video category');
//     if (!agreeTerms) return setUploadError('Please agree to the terms');

//     setUploading(true);
//     setUploadError('');

//     try {
//       const formData = new FormData();
//       formData.append('name', videoname.trim());
//       formData.append('description', videoDescription || '');
//       formData.append('category', videoCategory);
//       formData.append('video', {
//         uri: videoUri,
//         name: videoUri.split('/').pop() || 'video.mp4',
//         type: 'video/mp4',
//       });

//       if (thumbnailUri) {
//         formData.append('thumbnail', {
//           uri: thumbnailUri,
//           name: thumbnailUri.split('/').pop() || 'thumbnail.jpg',
//           type: 'image/jpeg',
//         });
//       }

//       const response = await fetch(`${API_BASE}/uservideo/upload/${selectedUploadChannelId}`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || 'Failed to upload video');

//       Alert.alert('Success', 'Video uploaded successfully!');

//       // Refresh videos
//       const videosRes = await fetch(`${API_BASE}/uservideo/channel/${selectedChannelId}/videos`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (videosRes.ok) {
//         const data = await videosRes.json();
//         setChannel((prev) => ({ ...prev, videos: data.videos || [] }));
//       }

//       setShowUploadModal(false);
//       setVideoUri(null);
//       setThumbnailUri(null);
//       setVideoname('');
//       setVideoDescription('');
//       setVideoCategory('');
//       setAgreeTerms(false);
//       setSelectedUploadChannelId('');
//       setUploadError('');
//     } catch (error) {
//       setUploadError(error.message || 'Failed to upload video.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handlePlayVideo = (video) => {
//     setCurrentVideo(video);
//     setShowVideoPlayer(true);
//   };

//   if (loading) {
//     return (
//       <SafeAreaProvider>
//         <SafeAreaView style={styles.center}>
//           <ActivityIndicator size="large" color="#ef4444" />
//           <Text style={{ color: '#aaa', marginTop: 12 }}>Loading channels...</Text>
//         </SafeAreaView>
//       </SafeAreaProvider>
//     );
//   }

//   if (channels.length === 0) {
//     return (
//       <SafeAreaProvider>
//         <SafeAreaView style={styles.center}>
//           <Text style={{ color: '#fff', fontSize: 18 }}>No channels found</Text>
//           <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowCreateModal(true)}>
//             <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Channel</Text>
//           </TouchableOpacity>
//         </SafeAreaView>
//       </SafeAreaProvider>
//     );
//   }

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container}>

//         {/* Channel Selector Dropdown */}
//         <TouchableOpacity 
//           style={styles.channelSelector}
//           onPress={() => setShowChannelDropdown(!showChannelDropdown)}
//         >
//           <View style={styles.channelSelectorContent}>
//             <Image 
//               source={{ uri: channel?.avatar }} 
//               style={styles.selectorAvatar} 
//             />
//             <View style={{ flex: 1 }}>
//               <Text style={styles.selectorName}>{channel?.name}</Text>
//               <Text style={styles.selectorHandle}>{channel?.handle}</Text>
//             </View>
//             <Icon name="chevron-down" size={24} color="#fff" />
//           </View>
//         </TouchableOpacity>

//         {/* Dropdown List */}
//         {showChannelDropdown && (
//           <View style={styles.dropdown}>
//             <ScrollView style={{ maxHeight: 280 }}>
//               {channels.map((ch) => (
//                 <TouchableOpacity
//                   key={ch._id}
//                   style={[
//                     styles.dropdownItem,
//                     selectedChannelId === ch._id && styles.dropdownItemActive
//                   ]}
//                   onPress={() => switchChannel(ch._id)}
//                 >
//                   <Image 
//                     source={{ 
//                       uri: ch.channelImage 
//                         ? `${BACKEND_URL}/${ch.channelImage}` 
//                         : 'https://i.pravatar.cc/150' 
//                     }} 
//                     style={styles.dropdownAvatar} 
//                   />
//                   <View>
//                     <Text style={styles.dropdownName}>{ch.name}</Text>
//                     <Text style={styles.dropdownHandle}>
//                       @{ch.name?.replace(/\s+/g, '') || ch._id}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//         {/* Banner */}
//         <Image source={{ uri: channel?.banner }} style={styles.banner} />

//         {/* Avatar + Info */}
//         <View style={styles.profileSection}>
//           <Image source={{ uri: channel?.avatar }} style={styles.avatar} />

//           <View style={styles.infoContainer}>
//             <Text style={styles.channelName}>{channel?.name}</Text>
//             <Text style={styles.handle}>{channel?.handle}</Text>

//             <View style={styles.statsRow}>
//               <TouchableOpacity 
//                 onPress={handleSubscription} 
//                 style={[styles.subscribeBtn, isSubscribed && styles.subscribedBtn]}
//               >
//                 <Icon name="account-group" size={18} color="#fff" />
//                 <Text style={styles.subscribeText}>
//                   {isSubscribed ? 'Subscribed' : 'Subscribe'}
//                 </Text>
//               </TouchableOpacity>
//               <Text style={styles.subscribersText}>
//                 {subscribersCount.toLocaleString()} subscribers
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionButtons}>
//           <TouchableOpacity 
//             style={[styles.actionBtn, { backgroundColor: '#10b981' }]} 
//             onPress={() => setShowUploadModal(true)}
//           >
//             <Icon name="video-plus" size={18} color="#fff" />
//             <Text style={styles.actionText}>Upload video</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={[styles.actionBtn, { backgroundColor: '#2563eb' }]} 
//             onPress={() => setShowCreateModal(true)}
//           >
//             <Icon name="plus" size={18} color="#fff" />
//             <Text style={styles.actionText}>Create channel</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Tabs */}
//         <View style={styles.tabBar}>
//           {['Videos', 'Playlists', 'Posts'].map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               onPress={() => setActiveTab(tab)}
//               style={[styles.tab, activeTab === tab && styles.activeTab]}
//             >
//               <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
//                 {tab}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Videos Grid */}
//         {activeTab === 'Videos' && (
//           <FlatList
//             data={channel?.videos || []}
//             keyExtractor={(item) => item._id}
//             numColumns={2}
//             contentContainerStyle={styles.videoGrid}
//             renderItem={({ item }) => (
//               <TouchableOpacity 
//                 style={styles.videoCard} 
//                 onPress={() => handlePlayVideo(item)}
//               >
//                 <Image
//                   source={{ 
//                     uri: item.thumbnail 
//                       ? `${BACKEND_URL}/${item.thumbnail}` 
//                       : 'https://picsum.photos/300/170' 
//                   }}
//                   style={styles.thumbnail}
//                 />
//                 <Text style={styles.videoTitle} numberOfLines={2}>
//                   {item.title || item.name}
//                 </Text>
//                 <Text style={styles.videoMeta}>
//                   {(item.views || 0).toLocaleString()} views • {new Date(item.createdAt).toLocaleDateString()}
//                 </Text>
//               </TouchableOpacity>
//             )}
//             ListEmptyComponent={
//               <Text style={styles.emptyText}>No videos yet. Upload your first video!</Text>
//             }
//           />
//         )}

//         {/* Video Player Modal */}
//         <Modal 
//           visible={showVideoPlayer} 
//           animationType="slide" 
//           onRequestClose={() => setShowVideoPlayer(false)}
//         >
//           <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
//             <View style={styles.playerHeader}>
//               <Text style={styles.playerTitle}>
//                 {currentVideo?.title || currentVideo?.name}
//               </Text>
//               <TouchableOpacity onPress={() => setShowVideoPlayer(false)}>
//                 <Icon name="close" size={28} color="#fff" />
//               </TouchableOpacity>
//             </View>

//             {currentVideo && (
//               <VideoView
//                 player={useVideoPlayer({ 
//                   uri: `${BACKEND_URL}/${currentVideo.videofile || currentVideo.videoUrl}` 
//                 })}
//                 style={{ width: '100%', height: width * 0.5625 }}
//                 allowsFullscreen
//                 allowsPictureInPicture
//               />
//             )}
//           </SafeAreaView>
//         </Modal>

//         {/* Create Channel Modal */}
//         <Modal visible={showCreateModal} animationType="slide">
//           <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
//             <ScrollView style={{ padding: 20 }}>
//               <Text style={styles.modalTitle}>Create a new channel</Text>
//               {createError && <Text style={styles.errorText}>{createError}</Text>}

//               <TextInput 
//                 style={styles.input} 
//                 placeholder="Channel name *" 
//                 value={newChannel.name} 
//                 onChangeText={(t) => setNewChannel({ ...newChannel, name: t })} 
//               />
//               <TextInput 
//                 style={[styles.input, { height: 80 }]} 
//                 placeholder="Description (optional)" 
//                 multiline 
//                 value={newChannel.channelDescription} 
//                 onChangeText={(t) => setNewChannel({ ...newChannel, channelDescription: t })} 
//               />

//               <View style={styles.pickerContainer}>
//                 <Text style={styles.label}>Category *</Text>
//                 <Picker 
//                   selectedValue={newChannel.category} 
//                   onValueChange={(v) => setNewChannel({ ...newChannel, category: v })}
//                 >
//                   <Picker.Item label="Select category" value="" />
//                   {categories.map((cat) => (
//                     <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
//                   ))}
//                 </Picker>
//               </View>

//               <TouchableOpacity 
//                 style={styles.uploadBtn} 
//                 onPress={() => pickImage((uri) => setNewChannel({ ...newChannel, channelImageUri: uri }))}
//               >
//                 <Text style={{ color: newChannel.channelImageUri ? '#10b981' : '#aaa' }}>
//                   {newChannel.channelImageUri ? 'Avatar Selected' : 'Upload Avatar'}
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.uploadBtn} 
//                 onPress={() => pickImage((uri) => setNewChannel({ ...newChannel, channelBannerUri: uri }))}
//               >
//                 <Text style={{ color: newChannel.channelBannerUri ? '#10b981' : '#aaa' }}>
//                   {newChannel.channelBannerUri ? 'Banner Selected' : 'Upload Banner'}
//                 </Text>
//               </TouchableOpacity>

//               <TextInput 
//                 style={styles.input} 
//                 placeholder="Contact email (optional)" 
//                 value={newChannel.contactemail} 
//                 onChangeText={(t) => setNewChannel({ ...newChannel, contactemail: t })} 
//               />

//               <View style={styles.modalActions}>
//                 <TouchableOpacity 
//                   style={styles.cancelBtn} 
//                   onPress={() => {
//                     setShowCreateModal(false);
//                     setCreateError('');
//                   }}
//                 >
//                   <Text style={{ color: '#fff' }}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.submitBtn} onPress={handleCreateChannel}>
//                   <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Channel</Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </SafeAreaView>
//         </Modal>

//         {/* Upload Video Modal */}
//         <Modal visible={showUploadModal} animationType="slide">
//           <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
//             <ScrollView style={{ padding: 20 }}>
//               <Text style={styles.modalTitle}>Upload Video</Text>
//               {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}

//               <TouchableOpacity style={styles.uploadBtn} onPress={pickVideo}>
//                 <Text style={{ color: videoUri ? '#10b981' : '#aaa' }}>
//                   {videoUri ? 'Video Selected' : 'Select Video *'}
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.uploadBtn} 
//                 onPress={() => pickImage(setThumbnailUri)}
//               >
//                 <Text style={{ color: thumbnailUri ? '#10b981' : '#aaa' }}>
//                   {thumbnailUri ? 'Thumbnail Selected' : 'Select Thumbnail (optional)'}
//                 </Text>
//               </TouchableOpacity>

//               <TextInput 
//                 style={styles.input} 
//                 placeholder="Video Title *" 
//                 value={videoname} 
//                 onChangeText={setVideoname} 
//               />

//               <View style={styles.pickerContainer}>
//                 <Text style={styles.label}>Category *</Text>
//                 <Picker 
//                   selectedValue={videoCategory} 
//                   onValueChange={setVideoCategory}
//                 >
//                   <Picker.Item label="Select category" value="" />
//                   {categories.map((cat) => (
//                     <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
//                   ))}
//                 </Picker>
//               </View>

//               <TextInput 
//                 style={[styles.input, { height: 80 }]} 
//                 placeholder="Description" 
//                 multiline 
//                 value={videoDescription} 
//                 onChangeText={setVideoDescription} 
//               />

//               <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
//                 <Switch value={agreeTerms} onValueChange={setAgreeTerms} />
//                 <Text style={{ color: '#ccc', marginLeft: 10, flex: 1 }}>
//                   I agree to Terms of Service and own this content.
//                 </Text>
//               </View>

//               <View style={styles.modalActions}>
//                 <TouchableOpacity 
//                   style={styles.cancelBtn} 
//                   onPress={() => setShowUploadModal(false)}
//                 >
//                   <Text style={{ color: '#fff' }}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity 
//                   style={styles.submitBtn} 
//                   onPress={handleUploadVideo} 
//                   disabled={uploading}
//                 >
//                   <Text style={{ color: '#fff', fontWeight: 'bold' }}>
//                     {uploading ? 'Uploading...' : 'Upload Video'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </SafeAreaView>
//         </Modal>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0f0f0f' },
//   banner: { width: '100%', height: 200, resizeMode: 'cover' },
//   profileSection: { flexDirection: 'row', padding: 16, marginTop: -50 },
//   avatar: { width: 90, height: 90, borderRadius: 50, borderWidth: 4, borderColor: '#0f0f0f' },
//   infoContainer: { marginLeft: 16, flex: 1 },
//   channelName: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
//   handle: { color: '#aaa', fontSize: 16 },
//   statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 },
//   subscribeBtn: { 
//     backgroundColor: '#ef4444', 
//     paddingHorizontal: 20, 
//     paddingVertical: 10, 
//     borderRadius: 30, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 6 
//   },
//   subscribedBtn: { backgroundColor: '#3f3f46' },
//   subscribeText: { color: '#fff', fontWeight: '600' },
//   subscribersText: { color: '#aaa' },
//   actionButtons: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 16 },
//   actionBtn: { 
//     flex: 1, 
//     backgroundColor: '#272727', 
//     paddingVertical: 12, 
//     borderRadius: 30, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     gap: 8 
//   },
//   actionText: { color: '#fff', fontWeight: '600' },
//   tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#333' },
//   tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
//   activeTab: { borderBottomWidth: 3, borderBottomColor: '#fff' },
//   tabText: { color: '#aaa', fontSize: 16 },
//   activeTabText: { color: '#fff' },
//   videoGrid: { padding: 8 },
//   videoCard: { flex: 1, margin: 6 },
//   thumbnail: { width: '100%', aspectRatio: 16 / 9, borderRadius: 12 },
//   videoTitle: { color: '#fff', marginTop: 8, fontSize: 15, fontWeight: '500' },
//   videoMeta: { color: '#888', fontSize: 13, marginTop: 4 },
//   emptyText: { color: '#888', textAlign: 'center', marginTop: 40 },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
//   errorText: { color: '#ff6b6b', marginBottom: 12 },
//   input: { 
//     backgroundColor: '#1a1a1a', 
//     color: '#fff', 
//     padding: 14, 
//     borderRadius: 10, 
//     marginBottom: 16, 
//     borderWidth: 1, 
//     borderColor: '#333' 
//   },
//   uploadBtn: { 
//     backgroundColor: '#1a1a1a', 
//     padding: 14, 
//     borderRadius: 10, 
//     marginBottom: 16, 
//     alignItems: 'center', 
//     borderWidth: 1, 
//     borderColor: '#333' 
//   },
//   pickerContainer: { marginBottom: 16 },
//   label: { color: '#aaa', marginBottom: 6 },
//   modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 20 },
//   cancelBtn: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#444', borderRadius: 30 },
//   submitBtn: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#2563eb', borderRadius: 30 },
//   primaryBtn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 30, marginTop: 20 },
//   playerHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#111' },
//   playerTitle: { color: '#fff', fontSize: 18, flex: 1 },

//   // New Dropdown Styles
//   channelSelector: {
//     backgroundColor: '#1a1a1a',
//     padding: 12,
//     marginHorizontal: 16,
//     marginTop: 10,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   channelSelectorContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   selectorAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   selectorName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   selectorHandle: {
//     color: '#888',
//     fontSize: 13,
//   },
//   dropdown: {
//     position: 'absolute',
//     top: 125,
//     left: 16,
//     right: 16,
//     backgroundColor: '#1a1a1a',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#333',
//     zIndex: 1000,
//     padding: 8,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   dropdownItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 10,
//     gap: 12,
//   },
//   dropdownItemActive: {
//     backgroundColor: '#ef444430',
//   },
//   dropdownAvatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//   },
//   dropdownName: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   dropdownHandle: {
//     color: '#888',
//     fontSize: 12,
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const API_BASE = 'https://bitzo-server-1.onrender.com/api';
const BACKEND_URL = 'https://bitzo-server-1.onrender.com';

const STATIC_CATEGORIES = [
  { _id: '1', name: 'Gaming' },
  { _id: '2', name: 'Education' },
  { _id: '3', name: 'Entertainment' },
  { _id: '4', name: 'Music' },
  { _id: '5', name: 'Technology' },
  { _id: '6', name: 'Sports' },
  { _id: '7', name: 'Cooking' },
  { _id: '8', name: 'Travel' },
];

const getToken = () => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWI2ZjlkYmI3YjJjMTI5ZjM5MTI1MzciLCJpYXQiOjE3NzQ1OTQ3OTUsImV4cCI6MTc3NTE5OTU5NX0.b0MeF1JbY4fL6TQqVWBc4wuqvAZQSCoAE4Y_9FllR-k';
const getUserId = () => '69b6f9dbb7b2c129f3912537';

export default function ChannelPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { handle: urlHandle } = route.params || {};

  const [channels, setChannels] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [channel, setChannel] = useState(null);
  const [categories, setCategories] = useState(STATIC_CATEGORIES);
  const [activeTab, setActiveTab] = useState('Videos');
  const [loading, setLoading] = useState(true);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);

  // Subscription
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  // Create Channel Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: '',
    channelDescription: '',
    category: '',
    channelImageUri: null,
    channelBannerUri: null,
    contactemail: '',
  });
  const [createError, setCreateError] = useState('');

  // Upload Video Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedUploadChannelId, setSelectedUploadChannelId] = useState('');
  const [videoUri, setVideoUri] = useState(null);
  const [thumbnailUri, setThumbnailUri] = useState(null);
  const [videoname, setVideoname] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoCategory, setVideoCategory] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

  // Video Player
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  // Helper to get full image URL
  const getFullUrl = (path) => {
    if (!path) return 'https://picsum.photos/id/1015/800/300';
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}/${path}`;
  };

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/category`);
        if (res.ok) {
          const data = await res.json();
          setCategories(Array.isArray(data) && data.length > 0 ? data : STATIC_CATEGORIES);
        }
      } catch (e) {
        setCategories(STATIC_CATEGORIES);
      }
    };
    fetchCategories();
  }, []);

  // Fetch User's Channels
  useEffect(() => {
    const fetchUserChannels = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        Alert.alert('Login Required', 'Please login first.');
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/uservideo/channel`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch channels');

        const data = await res.json();
        const userChannels = data.channels || [];
        setChannels(userChannels);

        let initialId = null;
        if (urlHandle) {
          const matched = userChannels.find(
            (ch) => ch.name?.replace(/\s+/g, '').toLowerCase() === urlHandle.toLowerCase()
          );
          if (matched) initialId = matched._id;
        }
        if (!initialId && userChannels.length > 0) initialId = userChannels[0]._id;

        setSelectedChannelId(initialId);
      } catch (err) {
        console.error('Error fetching channels:', err);
        Alert.alert('Error', err.message || 'Failed to load channels');
      } finally {
        setLoading(false);
      }
    };

    fetchUserChannels();
  }, [urlHandle]);

  // Fetch Selected Channel + Videos
  useEffect(() => {
    if (!selectedChannelId) return;

    const fetchChannelVideos = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const selected = channels.find((c) => c._id === selectedChannelId);
        if (!selected) return;

        const videosRes = await fetch(
          `${API_BASE}/uservideo/channel/${selectedChannelId}/videos`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        let videos = [];
        if (videosRes.ok) {
          const result = await videosRes.json();
          videos = result.videos || [];
        }

        const cleanHandle = selected.name?.replace(/\s+/g, '') || selected._id;

        const channelData = {
          ...selected,
          handle: `@${cleanHandle}`,
          avatar: getFullUrl(selected.channelImage),
          banner: getFullUrl(selected.channelBanner),
          description: selected.channeldescription || 'No description available',
          videos,
        };

        setChannel(channelData);
        setSubscribersCount(selected.subscribers || 0);
        setIsSubscribed(selected.subscribedBy?.includes(getUserId()) || false);
      } catch (err) {
        console.error('Error fetching channel/videos:', err);
      }
    };

    fetchChannelVideos();
  }, [selectedChannelId, channels]);

  // Image & Video Picker
  const pickImage = async (setter) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) setter(result.assets[0].uri);
  };

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your videos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) setVideoUri(result.assets[0].uri);
  };

  // Channel Switch
  const switchChannel = (channelId) => {
    setSelectedChannelId(channelId);
    setShowChannelDropdown(false);
  };

  // Subscription
  const handleSubscription = async () => {
    if (!selectedChannelId) return;

    const token = getToken();
    if (!token) return Alert.alert('Error', 'Please login to subscribe');

    try {
      const res = await fetch(`${API_BASE}/uservideo/subscribe/${selectedChannelId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Subscription failed');

      setIsSubscribed(result.subscribed);
      setSubscribersCount((prev) => (result.subscribed ? prev + 1 : prev - 1));
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  // Create Channel
  const handleCreateChannel = async () => {
    const token = getToken();
    if (!token) return setCreateError('Please login first.');

    if (!newChannel.name.trim()) return setCreateError('Channel name is required');
    if (!newChannel.category) return setCreateError('Please select a category');

    try {
      const formData = new FormData();
      formData.append('name', newChannel.name.trim());
      formData.append('channeldescription', newChannel.channelDescription || '');
      formData.append('category', newChannel.category);
      formData.append('contactemail', newChannel.contactemail || '');

      if (newChannel.channelImageUri) {
        formData.append('channelImage', {
          uri: newChannel.channelImageUri,
          name: newChannel.channelImageUri.split('/').pop(),
          type: 'image/jpeg',
        });
      }
      if (newChannel.channelBannerUri) {
        formData.append('channelBanner', {
          uri: newChannel.channelBannerUri,
          name: newChannel.channelBannerUri.split('/').pop(),
          type: 'image/jpeg',
        });
      }

      const response = await fetch(`${API_BASE}/uservideo/createchannel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to create channel');

      Alert.alert('Success', 'Channel created successfully!');

      // Refresh channels
      const channelsRes = await fetch(`${API_BASE}/uservideo/channel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (channelsRes.ok) {
        const data = await channelsRes.json();
        setChannels(data.channels || []);
        if (result.channel?._id) setSelectedChannelId(result.channel._id);
      }

      setShowCreateModal(false);
      setNewChannel({
        name: '',
        channelDescription: '',
        category: '',
        channelImageUri: null,
        channelBannerUri: null,
        contactemail: '',
      });
      setCreateError('');
    } catch (error) {
      setCreateError(error.message || 'Failed to create channel.');
    }
  };

  // Upload Video
  const handleUploadVideo = async () => {
    const token = getToken();
    if (!token) return setUploadError('Please login first.');

    if (!selectedUploadChannelId) return setUploadError('Please select a channel');
    if (!videoUri) return setUploadError('Please select a video file');
    if (!videoname.trim()) return setUploadError('Please enter a video name');
    if (!videoCategory) return setUploadError('Please select a video category');
    if (!agreeTerms) return setUploadError('Please agree to the terms');

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('name', videoname.trim());
      formData.append('description', videoDescription || '');
      formData.append('category', videoCategory);
      formData.append('video', {
        uri: videoUri,
        name: videoUri.split('/').pop() || 'video.mp4',
        type: 'video/mp4',
      });

      if (thumbnailUri) {
        formData.append('thumbnail', {
          uri: thumbnailUri,
          name: thumbnailUri.split('/').pop() || 'thumbnail.jpg',
          type: 'image/jpeg',
        });
      }

      const response = await fetch(`${API_BASE}/uservideo/upload/${selectedUploadChannelId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to upload video');

      Alert.alert('Success', 'Video uploaded successfully!');

      // Refresh videos
      const videosRes = await fetch(`${API_BASE}/uservideo/channel/${selectedChannelId}/videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (videosRes.ok) {
        const data = await videosRes.json();
        setChannel((prev) => ({ ...prev, videos: data.videos || [] }));
      }

      setShowUploadModal(false);
      setVideoUri(null);
      setThumbnailUri(null);
      setVideoname('');
      setVideoDescription('');
      setVideoCategory('');
      setAgreeTerms(false);
      setSelectedUploadChannelId('');
      setUploadError('');
    } catch (error) {
      setUploadError(error.message || 'Failed to upload video.');
    } finally {
      setUploading(false);
    }
  };

  const handlePlayVideo = (video) => {
    setCurrentVideo(video);
    setShowVideoPlayer(true);
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.center}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={{ color: '#aaa', marginTop: 12 }}>Loading channels...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (channels.length === 0) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.center}>
          <Text style={{ color: '#fff', fontSize: 18 }}>No channels found</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowCreateModal(true)}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Channel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        {/* Channel Selector Dropdown */}
        <TouchableOpacity 
          style={styles.channelSelector}
          onPress={() => setShowChannelDropdown(!showChannelDropdown)}
        >
          <View style={styles.channelSelectorContent}>
            <Image 
              source={{ uri: channel?.avatar }} 
              style={styles.selectorAvatar} 
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.selectorName}>{channel?.name}</Text>
              <Text style={styles.selectorHandle}>{channel?.handle}</Text>
            </View>
            <Icon name="chevron-down" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Dropdown List */}
        {showChannelDropdown && (
          <View style={styles.dropdown}>
            <ScrollView style={{ maxHeight: 280 }}>
              {channels.map((ch) => (
                <TouchableOpacity
                  key={ch._id}
                  style={[
                    styles.dropdownItem,
                    selectedChannelId === ch._id && styles.dropdownItemActive
                  ]}
                  onPress={() => switchChannel(ch._id)}
                >
                  <Image 
                    source={{ uri: getFullUrl(ch.channelImage) }} 
                    style={styles.dropdownAvatar} 
                  />
                  <View>
                    <Text style={styles.dropdownName}>{ch.name}</Text>
                    <Text style={styles.dropdownHandle}>
                      @{ch.name?.replace(/\s+/g, '') || ch._id}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Banner */}
        <Image source={{ uri: channel?.banner }} style={styles.banner} />

        {/* Avatar + Info */}
        <View style={styles.profileSection}>
          <Image source={{ uri: channel?.avatar }} style={styles.avatar} />

          <View style={styles.infoContainer}>
            <Text style={styles.channelName}>{channel?.name}</Text>
            <Text style={styles.handle}>{channel?.handle}</Text>

            <View style={styles.statsRow}>
              <TouchableOpacity 
                onPress={handleSubscription} 
                style={[styles.subscribeBtn, isSubscribed && styles.subscribedBtn]}
              >
                <Icon name="account-group" size={18} color="#fff" />
                <Text style={styles.subscribeText}>
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.subscribersText}>
                {subscribersCount.toLocaleString()} subscribers
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#10b981' }]} 
            onPress={() => setShowUploadModal(true)}
          >
            <Icon name="video-plus" size={18} color="#fff" />
            <Text style={styles.actionText}>Upload video</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#2563eb' }]} 
            onPress={() => setShowCreateModal(true)}
          >
            <Icon name="plus" size={18} color="#fff" />
            <Text style={styles.actionText}>Create channel</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {['Videos', 'Playlists', 'Posts'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Videos Grid */}
        {activeTab === 'Videos' && (
          <FlatList
            data={channel?.videos || []}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.videoGrid}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.videoCard} 
                onPress={() => handlePlayVideo(item)}
              >
                <Image
                  source={{ uri: getFullUrl(item.thumbnail) }}
                  style={styles.thumbnail}
                />
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {item.title || item.name}
                </Text>
                <Text style={styles.videoMeta}>
                  {(item.views || 0).toLocaleString()} views • {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No videos yet. Upload your first video!</Text>
            }
          />
        )}

        {/* Video Player Modal */}
        <Modal 
          visible={showVideoPlayer} 
          animationType="slide" 
          onRequestClose={() => setShowVideoPlayer(false)}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <View style={styles.playerHeader}>
              <Text style={styles.playerTitle}>
                {currentVideo?.title || currentVideo?.name}
              </Text>
              <TouchableOpacity onPress={() => setShowVideoPlayer(false)}>
                <Icon name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            {currentVideo && (
              <VideoView
                player={useVideoPlayer({ 
                  uri: `${BACKEND_URL}/${currentVideo.videofile || currentVideo.videoUrl}` 
                })}
                style={{ width: '100%', height: width * 0.5625 }}
                allowsFullscreen
                allowsPictureInPicture
              />
            )}
          </SafeAreaView>
        </Modal>

        {/* Create Channel Modal */}
        <Modal visible={showCreateModal} animationType="slide">
          <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
            <ScrollView style={{ padding: 20 }}>
              <Text style={styles.modalTitle}>Create a new channel</Text>
              {createError && <Text style={styles.errorText}>{createError}</Text>}

              <TextInput 
                style={styles.input} 
                placeholder="Channel name *" 
                value={newChannel.name} 
                onChangeText={(t) => setNewChannel({ ...newChannel, name: t })} 
              />
              <TextInput 
                style={[styles.input, { height: 80 }]} 
                placeholder="Description (optional)" 
                multiline 
                value={newChannel.channelDescription} 
                onChangeText={(t) => setNewChannel({ ...newChannel, channelDescription: t })} 
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Category *</Text>
                <Picker 
                  selectedValue={newChannel.category} 
                  onValueChange={(v) => setNewChannel({ ...newChannel, category: v })}
                >
                  <Picker.Item label="Select category" value="" />
                  {categories.map((cat) => (
                    <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
                  ))}
                </Picker>
              </View>


              <TouchableOpacity 
                style={styles.uploadBtn} 
                onPress={() => pickImage((uri) => setNewChannel({ ...newChannel, channelImageUri: uri }))}
              >
                <Text style={{ color: newChannel.channelImageUri ? '#10b981' : '#aaa' }}>
                  {newChannel.channelImageUri ? 'Avatar Selected' : 'Upload Avatar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.uploadBtn} 
                onPress={() => pickImage((uri) => setNewChannel({ ...newChannel, channelBannerUri: uri }))}
              >
                <Text style={{ color: newChannel.channelBannerUri ? '#10b981' : '#aaa' }}>
                  {newChannel.channelBannerUri ? 'Banner Selected' : 'Upload Banner'}
                </Text>
              </TouchableOpacity>

              <TextInput 
                style={styles.input} 
                placeholder="Contact email (optional)" 
                value={newChannel.contactemail} 
                onChangeText={(t) => setNewChannel({ ...newChannel, contactemail: t })} 
              />

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={() => {
                    setShowCreateModal(false);
                    setCreateError('');
                  }}
                >
                  <Text style={{ color: '#fff' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleCreateChannel}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create Channel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Upload Video Modal */}
        <Modal visible={showUploadModal} animationType="slide">
          <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>
            <ScrollView style={{ padding: 20 }}>
              <Text style={styles.modalTitle}>Upload Video</Text>
              {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}

              <TouchableOpacity style={styles.uploadBtn} onPress={pickVideo}>
                <Text style={{ color: videoUri ? '#10b981' : '#aaa' }}>
                  {videoUri ? 'Video Selected' : 'Select Video *'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.uploadBtn} 
                onPress={() => pickImage(setThumbnailUri)}
              >
                <Text style={{ color: thumbnailUri ? '#10b981' : '#aaa' }}>
                  {thumbnailUri ? 'Thumbnail Selected' : 'Select Thumbnail (optional)'}
                </Text>
              </TouchableOpacity>

              <TextInput 
                style={styles.input} 
                placeholder="Video Title *" 
                value={videoname} 
                onChangeText={setVideoname} 
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Category *</Text>
                <Picker 
                  selectedValue={videoCategory} 
                  onValueChange={setVideoCategory}
                >
                  <Picker.Item label="Select category" value="" />
                  {categories.map((cat) => (
                    <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
                  ))}
                </Picker>
              </View>

              <TextInput 
                style={[styles.input, { height: 80 }]} 
                placeholder="Description" 
                multiline 
                value={videoDescription} 
                onChangeText={setVideoDescription} 
              />

              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
                <Switch value={agreeTerms} onValueChange={setAgreeTerms} />
                <Text style={{ color: '#ccc', marginLeft: 10, flex: 1 }}>
                  I agree to Terms of Service and own this content.
                </Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={() => setShowUploadModal(false)}
                >
                  <Text style={{ color: '#fff' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.submitBtn} 
                  onPress={handleUploadVideo} 
                  disabled={uploading}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    {uploading ? 'Uploading...' : 'Upload Video'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  banner: { width: '100%', height: 200, resizeMode: 'cover' },
  profileSection: { flexDirection: 'row', padding: 16, marginTop: -50 },
  avatar: { width: 90, height: 90, borderRadius: 50, borderWidth: 4, borderColor: '#0f0f0f' },
  infoContainer: { marginLeft: 16, flex: 1 },
  channelName: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  handle: { color: '#aaa', fontSize: 16 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 },
  subscribeBtn: { 
    backgroundColor: '#ef4444', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 30, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  subscribedBtn: { backgroundColor: '#3f3f46' },
  subscribeText: { color: '#fff', fontWeight: '600' },
  subscribersText: { color: '#aaa' },
  actionButtons: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 16 },
  actionBtn: { 
    flex: 1, 
    backgroundColor: '#272727', 
    paddingVertical: 12, 
    borderRadius: 30, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8 
  },
  actionText: { color: '#fff', fontWeight: '600' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#333' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#fff' },
  tabText: { color: '#aaa', fontSize: 16 },
  activeTabText: { color: '#fff' },
  videoGrid: { padding: 8 },
  videoCard: { flex: 1, margin: 6 },
  thumbnail: { width: '100%', aspectRatio: 16 / 9, borderRadius: 12 },
  videoTitle: { color: '#fff', marginTop: 8, fontSize: 15, fontWeight: '500' },
  videoMeta: { color: '#888', fontSize: 13, marginTop: 4 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  errorText: { color: '#ff6b6b', marginBottom: 12 },
  input: { 
    backgroundColor: '#1a1a1a', 
    color: '#fff', 
    padding: 14, 
    borderRadius: 10, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  uploadBtn: { 
    backgroundColor: '#1a1a1a', 
    padding: 14, 
    borderRadius: 10, 
    marginBottom: 16, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  pickerContainer: { marginBottom: 16 },
  label: { color: '#aaa', marginBottom: 6 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 20 },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#444', borderRadius: 30 },
  submitBtn: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#2563eb', borderRadius: 30 },
  primaryBtn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 30, marginTop: 20 },
  playerHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#111' },
  playerTitle: { color: '#fff', fontSize: 18, flex: 1 },

  // Dropdown Styles
  channelSelector: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  channelSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  selectorHandle: {
    color: '#888',
    fontSize: 13,
  },
  dropdown: {
    position: 'absolute',
    top: 125,
    left: 16,
    right: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    zIndex: 1000,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 12,
  },
  dropdownItemActive: {
    backgroundColor: '#ef444430',
  },
  dropdownAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  dropdownName: {
    color: '#fff',
    fontWeight: '600',
  },
  dropdownHandle: {
    color: '#888',
    fontSize: 12,
  },
});
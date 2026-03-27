

// import React, { useState, useRef, useEffect, memo } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
// } from 'react-native';
// import { VideoView, useVideoPlayer } from 'expo-video';
// import Slider from '@react-native-community/slider';
// import { Ionicons } from '@expo/vector-icons';
// import * as ScreenOrientation from 'expo-screen-orientation';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const VIDEO_POOL = [
//   {
//     uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//     poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
//   },
//   {
//     uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
//     poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
//   },
//   {
//     uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//     poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
//   },
//   {
//     uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
//     poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
//   },
// ];

// const UP_NEXT = [
//   { id: 2, title: "Sintel – Short Fantasy Film", channel: "Blender Foundation", views: "4.2M", time: "2 days ago" },
//   { id: 3, title: "Elephants Dream – Surreal Animation", channel: "Blender Foundation", views: "1.8M", time: "1 week ago" },
//   { id: 4, title: "Tears of Steel – Post-Apocalyptic CGI", channel: "Blender Foundation", views: "3.1M", time: "5 days ago" },
// ];

// function getVideoEntry(id) {
//   const idx = (Number(id) || 1) % VIDEO_POOL.length;
//   return VIDEO_POOL[idx];
// }

// function formatTime(millis) {
//   if (!millis) return "0:00";
//   const min = Math.floor(millis / 60000);
//   const sec = ((millis % 60000) / 1000).toFixed(0);
//   return `${min}:${Number(sec).toString().padStart(2, '0')}`;
// }

// function VideoDetail({ route, navigation }) {
//   const { id, item } = route.params || {};
//   const videoData = item || { title: "Big Buck Bunny" };
//   const entry = getVideoEntry(id);

//   const player = useVideoPlayer(
//     { uri: entry.uri },
//     (player) => {
//       player.loop = false;
//       player.muted = false;
//       player.play();
//     }
//   );

//   const [showControls, setShowControls] = useState(true);
//   const [isBuffering, setIsBuffering] = useState(false);

//   // Optional: hide controls after few seconds
//   useEffect(() => {
//     if (!showControls) return;
//     const timer = setTimeout(() => setShowControls(false), 4500);
//     return () => clearTimeout(timer);
//   }, [showControls]);

//   useEffect(() => {
//     ScreenOrientation.unlockAsync();
//     return () => {
//       ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
//     };
//   }, []);

//   const togglePlayPause = () => {
//     if (player.playing) {
//       player.pause();
//     } else {
//       player.play();
//     }
//   };

//   const toggleMute = () => {
//     player.muted = !player.muted;
//   };

//   const onSliderComplete = (value) => {
//     player.currentTime = value * (player.duration ?? 0);
//   };

//   const progress = player.duration > 0 ? player.currentTime / player.duration : 0;

//   return (
//     <View style={styles.container}>
//       {/* Video Player */}
//       <View style={styles.videoContainer}>
//         <VideoView
//           player={player}
//           style={styles.video}
//           contentFit="contain"
//           nativeControls={false}           // we use custom controls
//           allowsPictureInPicture
//           startsPictureInPictureAutomatically={false}
//           poster={entry.poster}
//           onPlaybackStatusChange={(status) => {
//             setIsBuffering(status === 'buffering');
//           }}
//         />

//         {/* Custom Controls Overlay */}
//         {showControls && (
//           <TouchableOpacity
//             style={StyleSheet.absoluteFill}
//             activeOpacity={1}
//             onPress={() => setShowControls(true)} // tap to show again
//           >
//             <View style={styles.controlsOverlay}>
//               {/* Center Play/Pause */}
//               <TouchableOpacity style={styles.centerPlay} onPress={togglePlayPause}>
//                 {isBuffering ? (
//                   <ActivityIndicator size="large" color="white" />
//                 ) : player.playing ? (
//                   <Ionicons name="pause" size={60} color="white" />
//                 ) : (
//                   <Ionicons name="play" size={60} color="white" />
//                 )}
//               </TouchableOpacity>

//               {/* Bottom controls */}
//               <View style={styles.bottomControls}>
//                 <Text style={styles.timeText}>
//                   {formatTime(player.currentTime * 1000)} / {formatTime(player.duration * 1000)}
//                 </Text>

//                 <Slider
//                   style={styles.progressBar}
//                   minimumValue={0}
//                   maximumValue={1}
//                   value={progress}
//                   minimumTrackTintColor="#e50914"
//                   maximumTrackTintColor="#444"
//                   thumbTintColor="#e50914"
//                   onSlidingComplete={onSliderComplete}
//                 />

//                 <View style={styles.actionRow}>
//                   <TouchableOpacity onPress={toggleMute}>
//                     <Ionicons
//                       name={player.muted ? "volume-mute-sharp" : "volume-high-sharp"}
//                       size={28}
//                       color="white"
//                     />
//                   </TouchableOpacity>

//                   <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Ionicons name="close" size={32} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Video Info & Up Next */}
//       <View style={styles.infoContainer}>
//         <Text style={styles.title}>{videoData.title}</Text>
//         <Text style={styles.meta}>Blender Foundation • 12M views • 3 years ago</Text>

//         <Text style={styles.upNextTitle}>Up next</Text>

//         {UP_NEXT.map((vid) => (
//           <TouchableOpacity
//             key={vid.id}
//             style={styles.upNextItem}
//             onPress={() => navigation.navigate('VideoDetail', { id: vid.id, item: vid })}
//           >
//             <Image source={{ uri: getVideoEntry(vid.id).poster }} style={styles.thumbnail} />
//             <View style={styles.upNextInfo}>
//               <Text style={styles.upNextText} numberOfLines={2}>
//                 {vid.title}
//               </Text>
//               <Text style={styles.upNextMeta}>
//                 {vid.channel} • {vid.views} • {vid.time}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   videoContainer: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
//   video: { flex: 1 },
//   controlsOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.3)', // optional light overlay
//   },
//   centerPlay: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginLeft: -30,
//     marginTop: -30,
//   },
//   bottomControls: { padding: 16, backgroundColor: 'rgba(0,0,0,0.7)' },
//   progressBar: { width: '100%', height: 40 },
//   timeText: { color: 'white', fontSize: 14, marginBottom: 6 },
//   actionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   infoContainer: { padding: 16 },
//   title: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
//   meta: { color: '#aaa', fontSize: 14, marginBottom: 20 },
//   upNextTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 12, marginBottom: 12 },
//   upNextItem: { flexDirection: 'row', marginBottom: 16 },
//   thumbnail: { width: 140, height: 80, borderRadius: 6 },
//   upNextInfo: { flex: 1, marginLeft: 12 },
//   upNextText: { color: 'white', fontSize: 14, fontWeight: '500' },
//   upNextMeta: { color: '#aaa', fontSize: 12, marginTop: 4 },
// });

// export default memo(VideoDetail);

// import React, { useState, useEffect, memo } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
// } from 'react-native';
// import { VideoView, useVideoPlayer } from 'expo-video';
// import { useEvent } from 'expo';
// import Slider from '@react-native-community/slider';
// import { Ionicons } from '@expo/vector-icons';
// import * as ScreenOrientation from 'expo-screen-orientation';

// const VIDEO_POOL = [
//   {
//     uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//     poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
//   },
//   {
//     uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
//     poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
//   },
//   {
//     uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//     poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
//   },
//   {
//     uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
//     poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
//   },
// ];

// const UP_NEXT = [
//   { id: 2, title: "Sintel – Short Fantasy Film", channel: "Blender Foundation", views: "4.2M", time: "2 days ago" },
//   { id: 3, title: "Elephants Dream – Surreal Animation", channel: "Blender Foundation", views: "1.8M", time: "1 week ago" },
//   { id: 4, title: "Tears of Steel – Post-Apocalyptic CGI", channel: "Blender Foundation", views: "3.1M", time: "5 days ago" },
// ];

// function getVideoEntry(id) {
//   const idx = (Number(id) || 0) % VIDEO_POOL.length;
//   return VIDEO_POOL[idx];
// }

// // player se seconds aate hain, hum unhe "m:ss" format mein dikhate hain
// function formatTime(seconds) {
//   if (!seconds || isNaN(seconds)) return "0:00";
//   const min = Math.floor(seconds / 60);
//   const sec = Math.floor(seconds % 60);
//   return `${min}:${sec.toString().padStart(2, '0')}`;
// }

// function VideoDetail({ route, navigation }) {
//   const { id, item } = route.params || {};
//   const videoData = item || { title: "Big Buck Bunny" };
//   const entry = getVideoEntry(id);

//   // ---- mute ke liye alag state rakhni padti hai ----
//   const [isMuted, setIsMuted] = useState(false);
//   const [showControls, setShowControls] = useState(true);
//   const [isBuffering, setIsBuffering] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [isSeeking, setIsSeeking] = useState(false);

//   const player = useVideoPlayer(
//     { uri: entry.uri },
//     (p) => {
//       p.loop = false;
//       p.muted = false;
//       p.play();
//     }
//   );

//   // ---- expo-video ka sahi tarika: useEvent se status sunna ----
//   useEvent(player, 'playingChange', (payload) => {
//     setIsPlaying(payload.isPlaying);
//   });

//   useEvent(player, 'statusChange', (payload) => {
//     setIsBuffering(payload.status === 'loading');
//   });

//   // currentTime aur duration track karne ke liye timeUpdate event
//   useEvent(player, 'timeUpdate', (payload) => {
//     if (!isSeeking) {
//       setCurrentTime(payload.currentTime ?? 0);
//       setDuration(payload.duration ?? 0);
//     }
//   });

//   // Controls auto-hide
//   useEffect(() => {
//     if (!showControls) return;
//     const timer = setTimeout(() => setShowControls(false), 4500);
//     return () => clearTimeout(timer);
//   }, [showControls]);

//   // Orientation unlock on mount, relock on unmount
//   useEffect(() => {
//     ScreenOrientation.unlockAsync();
//     return () => {
//       ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
//     };
//   }, []);

//   const togglePlayPause = () => {
//     if (player.playing) {
//       player.pause();
//     } else {
//       player.play();
//     }
//   };

//   const toggleMute = () => {
//     const next = !isMuted;
//     player.muted = next;
//     setIsMuted(next);
//   };

//   const onSliderValueChange = () => {
//     setIsSeeking(true);
//   };

//   const onSliderComplete = (value) => {
//     const seekTo = value * (duration || 0);
//     player.currentTime = seekTo;
//     setCurrentTime(seekTo);
//     setIsSeeking(false);
//   };

//   const progress = duration > 0 ? currentTime / duration : 0;

//   return (
//     <ScrollView style={styles.container} bounces={false}>
//       {/* ---- Video Player ---- */}
//       <View style={styles.videoContainer}>
//         <VideoView
//           player={player}
//           style={styles.video}
//           contentFit="contain"
//           nativeControls={false}
//           allowsPictureInPicture
//           startsPictureInPictureAutomatically={false}
//         />

//         {/* Controls Overlay — tap se toggle */}
//         <TouchableOpacity
//           style={StyleSheet.absoluteFill}
//           activeOpacity={1}
//           onPress={() => setShowControls((prev) => !prev)}
//         >
//           {showControls && (
//             <View style={styles.controlsOverlay}>
//               {/* Center Play/Pause */}
//               <TouchableOpacity
//                 style={styles.centerPlay}
//                 onPress={(e) => {
//                   e.stopPropagation();
//                   togglePlayPause();
//                 }}
//               >
//                 {isBuffering ? (
//                   <ActivityIndicator size="large" color="white" />
//                 ) : isPlaying ? (
//                   <Ionicons name="pause" size={60} color="white" />
//                 ) : (
//                   <Ionicons name="play" size={60} color="white" />
//                 )}
//               </TouchableOpacity>

//               {/* Bottom Controls */}
//               <View style={styles.bottomControls}>
//                 <Text style={styles.timeText}>
//                   {formatTime(currentTime)} / {formatTime(duration)}
//                 </Text>

//                 <Slider
//                   style={styles.progressBar}
//                   minimumValue={0}
//                   maximumValue={1}
//                   value={progress}
//                   minimumTrackTintColor="#e50914"
//                   maximumTrackTintColor="#444"
//                   thumbTintColor="#e50914"
//                   onValueChange={onSliderValueChange}
//                   onSlidingComplete={onSliderComplete}
//                 />

//                 <View style={styles.actionRow}>
//                   <TouchableOpacity
//                     onPress={(e) => {
//                       e.stopPropagation();
//                       toggleMute();
//                     }}
//                   >
//                     <Ionicons
//                       name={isMuted ? "volume-mute-sharp" : "volume-high-sharp"}
//                       size={28}
//                       color="white"
//                     />
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     onPress={(e) => {
//                       e.stopPropagation();
//                       navigation.goBack();
//                     }}
//                   >
//                     <Ionicons name="close" size={32} color="white" />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* ---- Video Info & Up Next ---- */}
//       <View style={styles.infoContainer}>
//         <Text style={styles.title}>{videoData.title}</Text>
//         <Text style={styles.meta}>Blender Foundation • 12M views • 3 years ago</Text>

//         <Text style={styles.upNextTitle}>Up next</Text>

//         {UP_NEXT.map((vid) => (
//           <TouchableOpacity
//             key={vid.id}
//             style={styles.upNextItem}
//      onPress={() =>
//   navigation.navigate('VideoDetail', {
//     id: vid.id,
//     item: vid,
//   })}
//           >
//             <Image
//               source={{ uri: getVideoEntry(vid.id).poster }}
//               style={styles.thumbnail}
//             />
//             <View style={styles.upNextInfo}>
//               <Text style={styles.upNextText} numberOfLines={2}>
//                 {vid.title}
//               </Text>
//               <Text style={styles.upNextMeta}>
//                 {vid.channel} • {vid.views} • {vid.time}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   videoContainer: {
//     width: '100%',
//     aspectRatio: 16 / 9,
//     backgroundColor: '#000',
//   },
//   video: {
//     flex: 1,
//   },
//   controlsOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.35)',
//   },
//   centerPlay: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginLeft: -30,
//     marginTop: -30,
//   },
//   bottomControls: {
//     padding: 16,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },
//   progressBar: {
//     width: '100%',
//     height: 40,
//   },
//   timeText: {
//     color: 'white',
//     fontSize: 13,
//     marginBottom: 4,
//   },
//   actionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 6,
//   },
//   infoContainer: {
//     padding: 16,
//   },
//   title: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 6,
//   },
//   meta: {
//     color: '#aaa',
//     fontSize: 14,
//     marginBottom: 20,
//   },
//   upNextTitle: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 12,
//     marginBottom: 12,
//   },
//   upNextItem: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   thumbnail: {
//     width: 140,
//     height: 80,
//     borderRadius: 6,
//   },
//   upNextInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   upNextText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   upNextMeta: {
//     color: '#aaa',
//     fontSize: 12,
//     marginTop: 4,
//   },
// });

// export default memo(VideoDetail);



import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEvent } from 'expo';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

const VIDEO_POOL = [
  {
    uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
  },
  {
    uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
  },
  {
    uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
  },
  {
    uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
  },
];

const UP_NEXT = [
  { id: 2, title: 'Sintel – Short Fantasy Film', channel: 'Blender Foundation', views: '4.2M', time: '2 days ago' },
  { id: 3, title: 'Elephants Dream – Surreal Animation', channel: 'Blender Foundation', views: '1.8M', time: '1 week ago' },
  { id: 4, title: 'Tears of Steel – Post-Apocalyptic CGI', channel: 'Blender Foundation', views: '3.1M', time: '5 days ago' },
];

function getVideoEntry(id) {
  const idx = (Number(id) || 0) % VIDEO_POOL.length;
  return VIDEO_POOL[idx];
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || seconds <= 0) return '0:00';
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function VideoDetail({ route, navigation }) {
  const { id, item } = route.params || {};
  const videoData = item || { title: 'Big Buck Bunny' };
  const entry = getVideoEntry(id);

  const [isMuted, setIsMuted]           = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering]   = useState(true);
  const [currentTime, setCurrentTime]   = useState(0);
  const [duration, setDuration]         = useState(0);
  const [isPlaying, setIsPlaying]       = useState(false);

  // Refs — never go stale inside event callbacks
  const isSeekingRef  = useRef(false);
  const durationRef   = useRef(0);
  const isMountedRef  = useRef(true);

  // ─── Player ───────────────────────────────────────────────
  const player = useVideoPlayer(entry.uri, (p) => {
    p.loop   = false;
    p.muted  = false;
    p.play();
  });

  // Keep durationRef in sync so onSliderComplete never reads stale value
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  // Cleanup flag
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ─── Reload when "Up Next" is tapped (id changes) ─────────
  useEffect(() => {
    if (!player) return;
    try {
      player.replace(entry.uri);
      player.play();
    } catch (e) {
      console.warn('player.replace error:', e);
    }
    setCurrentTime(0);
    setDuration(0);
    durationRef.current   = 0;
    isSeekingRef.current  = false;
    setIsPlaying(true);
    setIsBuffering(true);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Orientation ──────────────────────────────────────────
  useEffect(() => {
    ScreenOrientation.unlockAsync().catch(() => {});
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      ).catch(() => {});
    };
  }, []);

  // ─── Controls auto-hide ───────────────────────────────────
  useEffect(() => {
    if (!showControls) return;
    const t = setTimeout(() => setShowControls(false), 4500);
    return () => clearTimeout(t);
  }, [showControls]);

  // ─── Player Events ────────────────────────────────────────
  useEvent(player, 'playingChange', (payload) => {
    if (isMountedRef.current) setIsPlaying(payload?.isPlaying ?? false);
  });

  useEvent(player, 'statusChange', (payload) => {
    if (isMountedRef.current) {
      const status = payload?.status;
      setIsBuffering(status === 'loading' || status === 'idle');
    }
  });

  useEvent(player, 'timeUpdate', (payload) => {
    if (!isMountedRef.current || isSeekingRef.current) return;
    const t = payload?.currentTime ?? 0;
    const d = payload?.duration   ?? 0;
    setCurrentTime(t);
    if (d > 0) {
      setDuration(d);
      durationRef.current = d;
    }
  });

  // ─── Handlers ─────────────────────────────────────────────
  const togglePlayPause = useCallback(() => {
    try {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
    } catch (e) {
      console.warn('togglePlayPause error:', e);
    }
  }, [player]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try { player.muted = next; } catch (e) {}
      return next;
    });
  }, [player]);

  const onSlidingStart = useCallback(() => {
    isSeekingRef.current = true;
  }, []);

  const onSliderComplete = useCallback((value) => {
    const seekTo = value * (durationRef.current || 0);
    try {
      player.currentTime = seekTo;
    } catch (e) {
      console.warn('Seek error:', e);
    }
    setCurrentTime(seekTo);
    isSeekingRef.current = false;
  }, [player]);

  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  // ─── Render ───────────────────────────────────────────────
  return (
    <ScrollView style={styles.container} bounces={false}>

      {/* ── Video Player ── */}
      <View style={styles.videoWrapper}>
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
          nativeControls={false}
          allowsPictureInPicture={false}
          startsPictureInPictureAutomatically={false}
        />

        {/* Tap area — toggles controls */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => setShowControls((p) => !p)}
        />

        {/* Controls overlay — sits on top of tap area */}
        {showControls && (
          <View style={styles.controlsOverlay} pointerEvents="box-none">

            {/* Center play/pause */}
            <TouchableOpacity
              style={styles.centerPlay}
              onPress={togglePlayPause}
              hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
            >
              {isBuffering
                ? <ActivityIndicator size="large" color="white" />
                : isPlaying
                  ? <Ionicons name="pause" size={56} color="white" />
                  : <Ionicons name="play"  size={56} color="white" />
              }
            </TouchableOpacity>

            {/* Bottom bar */}
            <View style={styles.bottomControls}>
              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>

              <Slider
                style={styles.progressBar}
                minimumValue={0}
                maximumValue={1}
                value={progress}
                minimumTrackTintColor="#e50914"
                maximumTrackTintColor="#555"
                thumbTintColor="#e50914"
                onSlidingStart={onSlidingStart}
                onSlidingComplete={onSliderComplete}
              />

              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={toggleMute}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons
                    name={isMuted ? 'volume-mute-sharp' : 'volume-high-sharp'}
                    size={26}
                    color="white"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* ── Info & Up Next ── */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{videoData.title}</Text>
        <Text style={styles.meta}>Blender Foundation • 12M views • 3 years ago</Text>

        <Text style={styles.upNextTitle}>Up next</Text>

        {UP_NEXT.map((vid) => (
          <TouchableOpacity
            key={vid.id}
            style={styles.upNextItem}
            activeOpacity={0.75}
            onPress={() =>
              navigation.push('VideoDetail', { id: vid.id, item: vid })
            }
          >
            <Image
              source={{ uri: getVideoEntry(vid.id).poster }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.upNextInfo}>
              <Text style={styles.upNextText} numberOfLines={2}>
                {vid.title}
              </Text>
              <Text style={styles.upNextMeta}>
                {vid.channel} • {vid.views} • {vid.time}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  // ── Use a fixed aspectRatio wrapper so video + overlay stack correctly
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    // overflow hidden so children don't bleed out
    overflow: 'hidden',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  centerPlay: {
    position: 'absolute',
    alignSelf: 'center',
    top: '35%',
  },
  bottomControls: {
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  progressBar: {
    width: '100%',
    height: 36,
    marginVertical: 2,
  },
  timeText: {
    color: '#ddd',
    fontSize: 12,
    marginBottom: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  meta: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 20,
  },
  upNextTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  upNextItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  thumbnail: {
    width: 130,
    height: 74,
    borderRadius: 6,
    backgroundColor: '#222',
  },
  upNextInfo: {
    flex: 1,
    marginLeft: 12,
  },
  upNextText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  upNextMeta: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
});

export default memo(VideoDetail);
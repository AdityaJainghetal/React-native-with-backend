// import React from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   FlatList,
//   StyleSheet,
// } from "react-native";

// const statsData = [
//   { id: "1", title: "Total Users", value: "120" },
//   { id: "2", title: "Total Orders", value: "45" },
//   { id: "3", title: "Revenue", value: "₹ 1,25,000" },
// ];

// const recentUsers = [
//   { id: "1", name: "Aditya", email: "aditya@gmail.com" },
//   { id: "2", name: "Rahul", email: "rahul@gmail.com" },
// ];

// const recentOrders = [
//   { id: "1", product: "Laptop", amount: "50000" },
//   { id: "2", product: "Mobile", amount: "20000" },
// ];

// export default function DashboardScreen() {
//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Admin Dashboard</Text>

//       {/* Stats Cards */}
//       <View style={styles.statsContainer}>
//         {statsData.map((item) => (
//           <View key={item.id} style={styles.card}>
//             <Text style={styles.cardTitle}>{item.title}</Text>
//             <Text style={styles.cardValue}>{item.value}</Text>
//           </View>
//         ))}
//       </View>

//       {/* Recent Users */}
//       <Text style={styles.sectionTitle}>Recent Users</Text>
//       <FlatList
//         data={recentUsers}
//         keyExtractor={(item) => item.id}
//         scrollEnabled={false}
//         renderItem={({ item }) => (
//           <View style={styles.listItem}>
//             <Text style={styles.listTitle}>{item.name}</Text>
//             <Text style={styles.listSubtitle}>{item.email}</Text>
//           </View>
//         )}
//       />

//       {/* Recent Orders */}
//       <Text style={styles.sectionTitle}>Recent Orders</Text>
//       <FlatList
//         data={recentOrders}
//         keyExtractor={(item) => item.id}
//         scrollEnabled={false}
//         renderItem={({ item }) => (
//           <View style={styles.listItem}>
//             <Text style={styles.listTitle}>{item.product}</Text>
//             <Text style={styles.listSubtitle}>₹ {item.amount}</Text>
//           </View>
//         )}
//       />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f8f9fa",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 12,
//     width: "30%",
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 14,
//     color: "#777",
//   },
//   cardValue: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 5,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 10,
//   },
//   listItem: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     elevation: 2,
//   },
//   listTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   listSubtitle: {
//     fontSize: 14,
//     color: "#555",
//   },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, Play, Plus, Info } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = SCREEN_WIDTH * 0.65;
const CARD_HEIGHT = CARD_WIDTH * 0.5625;
const SPACING = 12;

const romanticShows = [
  { id: 1, title: "Love in the Clouds", thumb: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=225&fit=crop" },
  { id: 2, title: "Hidden Love", thumb: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400&h=225&fit=crop" },
  { id: 3, title: "Queen of Tears", thumb: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=225&fit=crop" },
  { id: 4, title: "Inheritors", thumb: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop" },
  { id: 5, title: "When I Fly Towards You", thumb: "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=400&h=225&fit=crop" },
];

const kidsFilms = [
  { id: 101, title: "Chhota Bheem: The Crown", thumb: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&h=225&fit=crop" },
  { id: 102, title: "Motu Patlu: Kung Fu", thumb: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=225&fit=crop" },
  { id: 103, title: "Doraemon: Nobita", thumb: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=225&fit=crop" },
  { id: 104, title: "Oggy & Cockroaches", thumb: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=225&fit=crop" },
  { id: 105, title: "Shinchan Movie", thumb: "https://images.unsplash.com/photo-1606164587034-81b84c4e11d0?w=400&h=225&fit=crop" },
  { id: 106, title: "Tom & Jerry", thumb: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=225&fit=crop" },
];

const koreanContent = [
  { id: 201, title: "Vincenzo", thumb: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=225&fit=crop" },
  { id: 202, title: "Crash Landing on You", thumb: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=225&fit=crop" },
  { id: 203, title: "Squid Game", thumb: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400&h=225&fit=crop" },
  { id: 204, title: "Weak Hero Class 1", thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop" },
  { id: 205, title: "Moving", thumb: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=225&fit=crop" },
  { id: 206, title: "Sweet Home", thumb: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=225&fit=crop" },
];

const actionMovies = [
  { id: 301, title: "Extraction 2", thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop" },
  { id: 304, title: "Top Gun: Maverick", thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=225&fit=crop" },
];

const trendingShorts = [
  ...koreanContent.slice(0, 3),
  ...actionMovies.slice(0, 2),
  { id: 401, title: "Viral Dance", thumb: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop" },
  { id: 402, title: "Funny Reels", thumb: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=225&fit=crop" },
];

function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ChevronRight size={20} color="#aaa" />
    </View>
  );
}

function MovieCard({ item, onPress }) {
  const [pressed, setPressed] = useState(false);

  const progress = Math.floor(Math.random() * 60 + 40);

  return (
    <Pressable
      onPress={() => onPress(item)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={({ pressed: p }) => [
        styles.cardContainer,
        pressed && styles.cardPressed,
      ]}
    >
      <Image
        source={{ uri: item.thumb }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      {pressed && (
        <View style={styles.cardOverlay}>
          <View style={styles.cardControls}>
            <TouchableOpacity style={styles.iconButton}>
              <Play size={20} color="black" fill="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButtonOutline}>
              <Plus size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButtonOutline}>
              <Info size={20} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
      )}

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}% watched</Text>
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

export default function DashboardScreen() {
  const navigation = useNavigation();

  // const handleItemPress = (item) => {
  //   navigation.navigate({
  //     name: 'VideoDetail',
  //     params: {
  //       id: item.id || 1,
  //       item ,
  //     },
  //   });
  // };
const handleItemPress = (item) => {
  navigation.navigate('VideoDetail', {
    id: item.id,
    item,
  });
};

  const renderHorizontalList = (data) => (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingHorizontal: SPACING }}
      snapToInterval={CARD_WIDTH + SPACING}
      decelerationRate="fast"
      scrollEventThrottle={16}
      renderItem={({ item }) => (
        <View style={{ width: CARD_WIDTH, marginRight: SPACING }}>
          <MovieCard item={item} onPress={handleItemPress} />
        </View>
      )}
    />
  );

  const renderGrid = (data) => (
    <FlatList
      data={data}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={{ paddingHorizontal: SPACING, paddingBottom: 12 }}
      renderItem={({ item }) => (
        <View style={{ flex: 1 }}>
          <ShortItem item={item} onPress={handleItemPress} />
        </View>
      )}
    />
  );

  const sections = [
    { key: 'recommended', title: 'Recommended Videos', type: 'horizontal', data: romanticShows },
    { key: 'trending', title: 'Trending Videos', type: 'horizontal', data: koreanContent },
    { key: 'shorts-trending', title: 'Trending Shorts', type: 'grid', data: trendingShorts },
    { key: 'latest', title: 'Latest Videos', type: 'horizontal', data: kidsFilms },
    { key: 'subscription', title: 'Subscription Videos', type: 'horizontal', data: [
      ...romanticShows.slice(2),
      ...koreanContent.slice(1, 4),
      ...actionMovies,
    ]},
    { key: 'shorts-top', title: 'Top Shorts', type: 'grid', data: trendingShorts },
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
            {item.type === 'horizontal' ? renderHorizontalList(item.data) : renderGrid(item.data)}
          </View>
        )}
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING,
    marginBottom: 8,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  // Card (row items)
  cardContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#111',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  cardControls: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  iconButtonOutline: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  // Progress under card
  progressContainer: {
    marginTop: 6,
    paddingHorizontal: 2,
  },
  progressBg: {
    height: 3,
    backgroundColor: '#444',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e50914',
  },
  progressText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
  // Shorts grid
  shortItem: {
    marginBottom: 16,
  },
  shortImageContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
  },
  shortImage: {
    flex: 1,
  },
  rankBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rankText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  shortTitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
});
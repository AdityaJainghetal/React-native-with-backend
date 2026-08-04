import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const leaderboardData = {
  topCreators: [
    { rank: 1, name: "TechWithAdi", username: "@adiTech07", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400", followers: "1.2M", points: 9420 },
    { rank: 2, name: "CodeWithRohit", username: "@rohitcodes", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", followers: "874K", points: 8150 },
    { rank: 3, name: "UIQueen", username: "@uiqueen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", followers: "652K", points: 7630 },
    { rank: 4, name: "DevVibes", username: "@devvibesonly", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", followers: "421K", points: 5980 },
    { rank: 5, name: "PixelWizard", username: "@pixelwizard", avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400", followers: "298K", points: 5120 },
  ],
  topViews: [
    { rank: 1, title: "React 19 – Everything New", views: "2.4M", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800", creator: "@adiTech07" },
    { rank: 2, title: "Tailwind in 100 Seconds", views: "1.8M", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800", creator: "@tailwindfan" },
    { rank: 3, title: "Build Netflix Clone in 4 Hours", views: "1.5M", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800", creator: "@codewithrohit" },
    { rank: 4, title: "Framer Motion Magic", views: "987K", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800", creator: "@motionmaster" },
    { rank: 5, title: "Next.js 15 Deep Dive", views: "842K", thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800", creator: "@nextjsguru" },
  ],
};

const getRankStyle = (rank) => {
  if (rank === 1) return styles.rankGold;
  if (rank === 2) return styles.rankSilver;
  if (rank === 3) return styles.rankBronze;
  return styles.rankDefault;
};

const Leaderboard = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>LEADERBOARD</Text>
          <Text style={styles.subtitle}>
            Top Creators & Most Viewed Content • February 2026
          </Text>
        </View>

        {/* TOP CREATORS */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🏆  TOP CREATORS</Text>
          </View>

          {leaderboardData.topCreators.map((creator) => (
            <View key={creator.rank} style={styles.row}>
              <View style={[styles.rankBadge, getRankStyle(creator.rank)]}>
                <Text style={styles.rankText}>{creator.rank}</Text>
              </View>

              <Image source={{ uri: creator.avatar }} style={styles.avatar} />

              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {creator.name}
                </Text>
                <Text style={styles.username}>{creator.username}</Text>
              </View>

              <View style={styles.stats}>
                <Text style={styles.statValue}>{creator.followers}</Text>
                <Text style={styles.statLabel}>followers</Text>
              </View>

              <View style={styles.pointsBox}>
                <Text style={styles.points}>{creator.points.toLocaleString()}</Text>
                <Text style={styles.statLabel}>points</Text>
              </View>
            </View>
          ))}
        </View>

        {/* TOP VIEWS */}
        <View style={[styles.card, { marginTop: 24 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🔥  TOP VIEWS</Text>
          </View>

          {leaderboardData.topViews.map((item) => (
            <View key={item.rank} style={styles.row}>
              <View style={[styles.rankBadge, getRankStyle(item.rank)]}>
                <Text style={styles.rankText}>{item.rank}</Text>
              </View>

              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />

              <View style={styles.info}>
                <Text style={styles.videoTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.username}>{item.creator}</Text>
              </View>

              <View style={styles.stats}>
                <Text style={styles.views}>{item.views}</Text>
                <Text style={styles.statLabel}>views</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Keep creating fire content to reach the top! 🔥</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#dc2626',
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: 'rgba(127, 29, 29, 0.6)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(127, 29, 29, 0.5)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ef4444',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankGold: {
    backgroundColor: '#ca8a04',
    borderWidth: 2,
    borderColor: '#eab308',
  },
  rankSilver: {
    backgroundColor: '#6b7280',
    borderWidth: 2,
    borderColor: '#9ca3af',
  },
  rankBronze: {
    backgroundColor: '#b45309',
    borderWidth: 2,
    borderColor: '#d97706',
  },
  rankDefault: {
    backgroundColor: '#374151',
  },
  rankText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#374151',
    marginRight: 12,
  },
  thumbnail: {
    width: 72,
    height: 42,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#374151',
    marginRight: 12,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  videoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  username: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  stats: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  pointsBox: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  statValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  views: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  points: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '700',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 1,
  },
  footer: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 13,
    marginTop: 28,
  },
});

export default Leaderboard;
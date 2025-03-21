import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const TimeBasedHeader = ({ timeOfDay, userName }) => {
  const { colors } = useTheme();
  
  const getGreeting = () => {
    switch (timeOfDay) {
      case 'morning':
        return '좋은 아침이에요';
      case 'afternoon':
        return '점심 식사는 하셨나요';
      case 'evening':
        return '하루를 마무리할 시간';
      default:
        return '안녕하세요';
    }
  };

  const getSubText = () => {
    switch (timeOfDay) {
      case 'morning':
        return '아침에 도움이 될 경험들을 준비했어요';
      case 'afternoon':
        return '점심 브레이크에 읽기 좋은 경험담';
      case 'evening':
        return '오늘 하루의 인사이트를 정리해보세요';
      default:
        return '다양한 경험을 탐색해보세요';
    }
  };

  const getBackgroundColor = () => {
    switch (timeOfDay) {
      case 'morning':
        return '#FFF8E6';
      case 'afternoon':
        return '#F0F8FF';
      case 'evening':
        return '#F5F0FF';
      default:
        return '#F9F5FF';
    }
  };

  const getHeaderIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'sunny-outline';
      case 'afternoon':
        return 'cafe-outline';
      case 'evening':
        return 'moon-outline';
      default:
        return 'star-outline';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>
            {getGreeting()}, <Text style={{ color: colors.primary }}>{userName}</Text>님
          </Text>
          <Text style={styles.subText}>{getSubText()}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name={getHeaderIcon()} size={36} color={colors.primary} />
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>오늘의 챌린지</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>새로운 질문</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>150</Text>
          <Text style={styles.statLabel}>보유 포인트</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    color: '#666',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
});

export default TimeBasedHeader; 
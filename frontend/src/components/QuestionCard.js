import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Chip, Avatar, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/ko';

moment.locale('ko');

const QuestionCard = ({ question }) => {
  const { colors } = useTheme();

  const getStatusColor = () => {
    switch (question.status) {
      case 'open':
        return '#4CAF50';
      case 'answered':
        return '#2196F3';
      case 'closed':
        return '#9E9E9E';
      default:
        return '#4CAF50';
    }
  };

  const getStatusText = () => {
    switch (question.status) {
      case 'open':
        return '답변 대기중';
      case 'answered':
        return '답변 완료';
      case 'closed':
        return '종료됨';
      default:
        return '답변 대기중';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.authorInfo}>
            <Avatar.Image 
              size={24} 
              source={{ uri: question.author.profileImage }} 
              style={styles.avatar}
            />
            <Text style={styles.authorName}>{question.author.name}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv.{question.author.level}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{question.title}</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.content} numberOfLines={2}>
            {question.content}
          </Text>
        </View>

        <View style={styles.categoriesContainer}>
          {question.categories.map((category, index) => (
            <Chip 
              key={index} 
              style={styles.categoryChip}
              textStyle={styles.categoryText}
            >
              {category}
            </Chip>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Ionicons name="chatbubble-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{question.answerCount}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="eye-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{question.viewCount}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{moment(question.createdAt).fromNow()}</Text>
            </View>
          </View>
          {question.offeredPoints > 0 && (
            <View style={styles.pointsContainer}>
              <Ionicons name="star" size={14} color={colors.primary} />
              <Text style={[styles.pointsText, { color: colors.primary }]}>
                {question.offeredPoints} 포인트
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  levelBadge: {
    backgroundColor: '#6A3EA1',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  levelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    marginBottom: 12,
  },
  content: {
    fontSize: 14,
    color: '#444',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F0F0F0',
  },
  categoryText: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default QuestionCard; 
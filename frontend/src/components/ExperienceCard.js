import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card, Paragraph, Avatar, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/ko';

moment.locale('ko');

const ExperienceCard = ({ experience }) => {
  const { colors } = useTheme();

  const getExperienceTypeIcon = () => {
    switch (experience.experienceType) {
      case '직접 경험':
        return 'checkmark-circle';
      case '간접 경험':
        return 'eye';
      case '전문 지식':
        return 'school';
      default:
        return 'document-text';
    }
  };

  const getExperienceTypeColor = () => {
    switch (experience.experienceType) {
      case '직접 경험':
        return '#4CAF50';
      case '간접 경험':
        return '#FF9800';
      case '전문 지식':
        return '#2196F3';
      default:
        return '#9C27B0';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.experienceTypeContainer}>
          <View 
            style={[
              styles.experienceTypeBadge, 
              { backgroundColor: getExperienceTypeColor() }
            ]}
          >
            <Ionicons name={getExperienceTypeIcon()} size={12} color="white" />
            <Text style={styles.experienceTypeText}>{experience.experienceType}</Text>
          </View>
        </View>
        
        <Text style={styles.title} numberOfLines={2}>{experience.title}</Text>
        <Paragraph style={styles.content} numberOfLines={3}>
          {experience.content}
        </Paragraph>
        
        <View style={styles.metaContainer}>
          <View style={styles.authorContainer}>
            <Avatar.Image 
              size={24} 
              source={{ uri: experience.author.profileImage }} 
              style={styles.avatar}
            />
            <Text style={styles.authorName}>{experience.author.name}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv.{experience.author.level}</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.statText}>{experience.readTime}분</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={14} color="#666" />
              <Text style={styles.statText}>{experience.viewCount}</Text>
            </View>
            <Text style={styles.dateText}>
              {moment(experience.createdAt).fromNow()}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
    backgroundColor: 'white',
  },
  cardContent: {
    padding: 16,
  },
  experienceTypeContainer: {
    marginBottom: 12,
  },
  experienceTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  experienceTypeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
});

export default ExperienceCard;
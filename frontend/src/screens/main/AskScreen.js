import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Button, Card, Title, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AuthContext from '../../context/AuthContext';

const AskScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);

  const handleAskQuestion = () => {
    navigation.navigate('WriteQuestion');
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>질문 & 경험 공유</Text>
        <Text style={styles.headerSubtitle}>
          당신의 질문과 경험이 누군가에게 큰 도움이 됩니다
        </Text>
      </View>

      {/* 포인트 정보 */}
      <Card style={styles.pointCard}>
        <Card.Content style={styles.pointCardContent}>
          <View>
            <Text style={styles.pointLabel}>보유 포인트</Text>
            <Text style={[styles.pointValue, { color: colors.primary }]}>
              {user?.points?.available || 0} P
            </Text>
          </View>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('마이페이지', { screen: 'PointHistory' })}
            style={{ borderColor: colors.primary }}
            labelStyle={{ color: colors.primary }}
          >
            내역 보기
          </Button>
        </Card.Content>
      </Card>

      {/* 질문하기 카드 */}
      <Card 
        style={[styles.actionCard, { backgroundColor: colors.primary + '10' }]}
        onPress={handleAskQuestion}
      >
        <Card.Content style={styles.actionCardContent}>
          <View style={styles.actionCardLeft}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="help" size={28} color={colors.primary} />
            </View>
            <View style={styles.actionCardTextContainer}>
              <Title style={styles.actionCardTitle}>질문하기</Title>
              <Text style={styles.actionCardDescription}>
                궁금한 점을 질문하고 경험자들의 답변을 받아보세요
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </Card.Content>
      </Card>

      {/* 경험 공유하기 카드 */}
      <Card 
        style={[styles.actionCard, { backgroundColor: '#FF8FA310' }]}
        onPress={() => navigation.navigate('WriteExperience')}
      >
        <Card.Content style={styles.actionCardContent}>
          <View style={styles.actionCardLeft}>
            <View style={[styles.iconCircle, { backgroundColor: '#FF8FA320' }]}>
              <Ionicons name="document-text" size={28} color="#FF8FA3" />
            </View>
            <View style={styles.actionCardTextContainer}>
              <Title style={styles.actionCardTitle}>경험 공유하기</Title>
              <Text style={styles.actionCardDescription}>
                나의 경험을 공유하고 포인트도 받아보세요
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#FF8FA3" />
        </Card.Content>
      </Card>

      {/* 인포 섹션: 질문하기 */}
      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoTitle}>질문 포인트 가이드</Text>
        </View>
        <View style={styles.infoBulletContainer}>
          <Text style={styles.infoBullet}>• 질문 작성 시 포인트를 설정할 수 있습니다 (최소 10P)</Text>
          <Text style={styles.infoBullet}>• 답변을 받으면 포인트가 답변자에게 전달됩니다</Text>
          <Text style={styles.infoBullet}>• 질문은 카테고리별로 분류되어 노출됩니다</Text>
        </View>
      </View>

      {/* 인포 섹션: 경험 공유하기 */}
      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <Ionicons name="information-circle" size={20} color="#FF8FA3" />
          <Text style={[styles.infoTitle, { color: '#FF8FA3' }]}>경험 공유 포인트 가이드</Text>
        </View>
        <View style={styles.infoBulletContainer}>
          <Text style={styles.infoBullet}>• 경험담 작성 시 50P를 받습니다</Text>
          <Text style={styles.infoBullet}>• 프리미엄 경험담은 구매자마다 추가 포인트가 지급됩니다</Text>
          <Text style={styles.infoBullet}>• Lv.3 이상부터 프리미엄 경험담을 작성할 수 있습니다</Text>
        </View>
      </View>

      {/* 레벨업 안내 */}
      {user?.level < 5 && (
        <Card style={styles.levelUpCard}>
          <Card.Content>
            <Title style={styles.levelUpTitle}>레벨업 하고 더 많은 혜택을 받으세요!</Title>
            <Text style={styles.levelUpDescription}>
              현재 레벨: Lv.{user?.level || 1} | 다음 레벨까지 필요한 활동: {getLevelUpRequirement(user?.level || 1)}
            </Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${getLevelProgress(user?.level || 1)}%`,
                    backgroundColor: colors.primary 
                  }
                ]} 
              />
            </View>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

// 레벨업에 필요한 활동 수 반환
const getLevelUpRequirement = (level) => {
  switch(level) {
    case 1: return "질문 5개 또는 답변 3개";
    case 2: return "질문 15개 또는 답변 10개";
    case 3: return "질문 30개 또는 답변 20개";
    case 4: return "질문 50개 또는 답변 30개";
    default: return "";
  }
};

// 레벨 진행도 (퍼센트) 계산 - 실제로는 유저 활동에 따라 계산해야 함
const getLevelProgress = (level) => {
  // 임시 더미 데이터
  switch(level) {
    case 1: return 60;
    case 2: return 45;
    case 3: return 30;
    case 4: return 20;
    default: return 0;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  pointCard: {
    margin: 16,
    borderRadius: 12,
  },
  pointCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointLabel: {
    fontSize: 14,
    color: '#666',
  },
  pointValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  actionCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  actionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionCardTextContainer: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionCardDescription: {
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#6A3EA1',
  },
  infoBulletContainer: {
    marginLeft: 8,
  },
  infoBullet: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  levelUpCard: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#F9F5FF',
  },
  levelUpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  levelUpDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});

export default AskScreen; 
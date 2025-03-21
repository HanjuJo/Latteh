import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  RefreshControl,
  FlatList
} from 'react-native';
import { useTheme, Card, Title, Paragraph, Avatar, Button, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import AuthContext from '../../context/AuthContext';
import TimeContext from '../../context/TimeContext';
import ExperienceCard from '../../components/ExperienceCard';
import QuestionCard from '../../components/QuestionCard';
import TimeBasedHeader from '../../components/TimeBasedHeader';

// 임시 데이터 (나중에 API로 대체)
const mockExperiences = [
  {
    id: '1',
    title: '창업 초기에 투자 유치하는 방법',
    content: '창업 초기에 투자 유치를 위해 가장 중요한 것은 명확한 비즈니스 모델과 확장 가능성을 보여주는 것입니다. 제가 첫 스타트업에서 경험한 바로는...',
    author: {
      id: '101',
      name: '김창업',
      profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      level: 4
    },
    timeOfDay: 'morning',
    experienceType: '직접 경험',
    readTime: 5,
    viewCount: 243,
    createdAt: new Date('2023-09-15')
  },
  {
    id: '2',
    title: '개발자에서 프로덕트 매니저로 전환한 이야기',
    content: '10년간 개발자로 일하다가 프로덕트 매니저로 커리어를 전환했습니다. 이 과정에서 배운 점과 도전적이었던 순간들을 공유합니다.',
    author: {
      id: '102',
      name: '이개발',
      profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
      level: 3
    },
    timeOfDay: 'afternoon',
    experienceType: '직접 경험',
    readTime: 8,
    viewCount: 567,
    createdAt: new Date('2023-09-18')
  },
  {
    id: '3',
    title: '직장 내 갈등 관리: 리더의 관점에서',
    content: '팀 내 갈등은 불가피하지만, 이를 효과적으로 관리하는 방법이 있습니다. 15년간 팀장으로 일하며 경험한 갈등 해결 사례를 공유합니다.',
    author: {
      id: '103',
      name: '박리더',
      profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
      level: 5
    },
    timeOfDay: 'evening',
    experienceType: '직접 경험',
    readTime: 10,
    viewCount: 892,
    createdAt: new Date('2023-09-20')
  }
];

const mockQuestions = [
  {
    id: '101',
    title: '첫 해외여행 준비, 어떻게 하나요?',
    content: '다음 달에 처음으로 해외여행을 갑니다. 유럽 2주 일정인데, 어떤 준비를 해야 할지 전혀 모르겠습니다. 경험자분들의 조언 부탁드립니다.',
    author: {
      id: '201',
      name: '여행초보',
      profileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
      level: 1
    },
    categories: ['여행', '유럽', '초보'],
    answerCount: 5,
    viewCount: 123,
    offeredPoints: 50,
    createdAt: new Date('2023-09-22')
  },
  {
    id: '102',
    title: '30대 직장인 재테크, 어떻게 시작하나요?',
    content: '30대 초반 직장인입니다. 지금까지 그냥 적금만 들었는데, 재테크에 관심이 생겼습니다. 어떻게 시작하는 게 좋을까요?',
    author: {
      id: '202',
      name: '재테크입문',
      profileImage: 'https://randomuser.me/api/portraits/men/5.jpg',
      level: 2
    },
    categories: ['재테크', '투자', '20대'],
    answerCount: 8,
    viewCount: 345,
    offeredPoints: 100,
    createdAt: new Date('2023-09-21')
  }
];

const mockDailyChallenges = [
  {
    id: '1',
    title: '오늘의 경험 공유하기',
    description: '오늘 있었던 일 중 배움이 있었던 경험을 공유해보세요.',
    reward: '30포인트',
    completed: false
  },
  {
    id: '2',
    title: '질문에 답변하기',
    description: '최소 2개의 질문에 답변을 작성해보세요.',
    reward: '50포인트',
    completed: false
  }
];

const trendingQuestions = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: '김경험',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      level: 5
    },
    status: 'open',
    title: '대기업에서 스타트업으로 이직한 경험이 궁금합니다.',
    content: '현재 대기업에서 5년차 개발자로 일하고 있는데, 스타트업으로 이직을 고민하고 있습니다. 실제로 이직하신 분들의 경험과 조언을 듣고 싶습니다.',
    categories: ['커리어', '개발자', '이직'],
    points: 500,
    answers: 8,
    views: 245,
    createdAt: new Date('2023-05-15T09:30:00')
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: '이투자',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      level: 3
    },
    status: 'answered',
    title: '30대 초반, 지금부터 주식 투자를 시작해도 괜찮을까요?',
    content: '30대 초반 직장인입니다. 지금까지 적금만 들었는데, 슬슬 주식 투자에 관심이 생겼습니다. 지금부터 시작해도 괜찮을지, 어떤 방식으로 접근해야 할지 조언 부탁드립니다.',
    categories: ['재테크', '주식', '투자'],
    points: 300,
    answers: 12,
    views: 320,
    createdAt: new Date('2023-05-14T15:20:00')
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: '박창업',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      level: 4
    },
    status: 'closed',
    title: '첫 창업, 법인과 개인사업자 중 어떤 것이 유리할까요?',
    content: '곧 첫 창업을 앞두고 있습니다. 초기에는 법인으로 시작하는 것이 좋을지, 개인사업자로 시작하는 것이 좋을지 고민이 됩니다. 각각의 장단점과 실제 경험을 들려주세요.',
    categories: ['창업', '사업', '법률'],
    points: 1000,
    answers: 7,
    views: 189,
    createdAt: new Date('2023-05-13T11:45:00')
  }
];

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const { timeOfDay } = useContext(TimeContext);
  const [experiences, setExperiences] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // 시간대별 데이터 필터링
  const filterByTimeOfDay = (data) => {
    return data.filter(item => item.timeOfDay === timeOfDay || item.timeOfDay === 'any');
  };

  // 데이터 로딩 (나중에 API 호출로 대체)
  const loadData = () => {
    // 실제 구현 시 API 호출
    setExperiences(mockExperiences);
    setQuestions(mockQuestions);
    setDailyChallenges(mockDailyChallenges);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // 첫 렌더링 시 데이터 로딩
  useEffect(() => {
    loadData();
  }, []);

  // 화면 포커스 시 데이터 재로딩
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  // 시간대별 인사말
  const getGreeting = () => {
    switch(timeOfDay) {
      case 'morning':
        return '좋은 아침이에요';
      case 'afternoon':
        return '좋은 오후에요';
      case 'evening':
        return '좋은 저녁이에요';
      default:
        return '안녕하세요';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      {/* 시간대별 헤더 */}
      <TimeBasedHeader timeOfDay={timeOfDay} userName={user?.name || '게스트'} />
      
      {/* 일일 챌린지 섹션 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>오늘의 챌린지</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.primary }]}>전체보기</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.challengeContainer}>
          {dailyChallenges.map(challenge => (
            <Card key={challenge.id} style={styles.challengeCard}>
              <Card.Content>
                <Title style={styles.challengeTitle}>{challenge.title}</Title>
                <Paragraph style={styles.challengeDescription}>{challenge.description}</Paragraph>
                <Text style={styles.challengeReward}>보상: {challenge.reward}</Text>
              </Card.Content>
              <Card.Actions>
                <Button 
                  mode="contained" 
                  onPress={() => {}} 
                  style={{ backgroundColor: colors.primary }}
                >
                  시작하기
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </ScrollView>
      </View>

      {/* 추천 경험담 섹션 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{timeOfDay === 'morning' ? '아침에 읽기 좋은 경험담' : 
            timeOfDay === 'afternoon' ? '점심 브레이크에 추천해요' : '오늘 하루를 마무리하며'}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('탐색')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>전체보기</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {experiences.map(experience => (
            <TouchableOpacity 
              key={experience.id} 
              onPress={() => navigation.navigate('ExperienceDetail', { experienceId: experience.id })}
              style={styles.cardContainer}
            >
              <ExperienceCard experience={experience} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 인기 질문 섹션 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>실시간 인기 질문</Text>
          <TouchableOpacity onPress={() => navigation.navigate('탐색')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>전체보기</Text>
          </TouchableOpacity>
        </View>
        {questions.map(question => (
          <TouchableOpacity 
            key={question.id} 
            onPress={() => navigation.navigate('QuestionDetail', { questionId: question.id })}
            style={styles.questionCardContainer}
          >
            <QuestionCard question={question} />
          </TouchableOpacity>
        ))}
      </View>

      {/* 레벨 5 전문가 추천 섹션 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>레벨 5 전문가 추천</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.primary }]}>전체보기</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3, 4].map(id => (
            <TouchableOpacity 
              key={id}
              onPress={() => navigation.navigate('UserProfile', { userId: id })}
              style={styles.expertCardContainer}
            >
              <View style={styles.expertCard}>
                <Avatar.Image 
                  size={80} 
                  source={{ uri: `https://randomuser.me/api/portraits/${id % 2 ? 'men' : 'women'}/${id}.jpg` }} 
                  style={styles.expertAvatar}
                />
                <Text style={styles.expertName}>전문가 {id}</Text>
                <Text style={styles.expertField}>분야: {['창업', '개발', '마케팅', '인사관리'][id - 1]}</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Lv.5</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 트렌딩 질문 섹션 */}
      <View style={styles.questionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>실시간 인기 질문</Text>
          <Button 
            compact 
            mode="text" 
            onPress={() => navigation.navigate('탐색', { filter: 'trending' })}
          >
            더보기
          </Button>
        </View>
        
        <FlatList
          data={trendingQuestions}
          renderItem={({ item }) => (
            <QuestionCard 
              question={item} 
              onPress={() => navigation.navigate('QuestionDetail', { questionId: item.id })}
            />
          )}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>

      {/* 푸터 공간 */}
      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
  },
  cardContainer: {
    marginRight: 12,
    width: 280,
  },
  questionCardContainer: {
    marginBottom: 12,
  },
  challengeContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  challengeCard: {
    width: 250,
    marginRight: 12,
    elevation: 2,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  challengeDescription: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  challengeReward: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8FA3',
  },
  expertCardContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  expertCard: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  expertAvatar: {
    marginBottom: 8,
  },
  expertName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expertField: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  levelBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#6A3EA1',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    margin: 4,
  },
  levelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    height: 80,
  },
  questionsSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
});

export default HomeScreen; 
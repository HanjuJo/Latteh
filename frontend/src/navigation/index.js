import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';

import AuthContext from '../context/AuthContext';

// 인증 화면
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
// import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

// 메인 화면
import HomeScreen from '../screens/main/HomeScreen';
// import ExploreScreen from '../screens/main/ExploreScreen';
import AskScreen from '../screens/main/AskScreen';
// import NotificationScreen from '../screens/main/NotificationScreen';
// import ProfileScreen from '../screens/main/ProfileScreen';

// 세부 화면들
// import QuestionDetailScreen from '../screens/detail/QuestionDetailScreen';
// import ExperienceDetailScreen from '../screens/detail/ExperienceDetailScreen';
// import EbookDetailScreen from '../screens/detail/EbookDetailScreen';
// import UserProfileScreen from '../screens/detail/UserProfileScreen';
// import WriteExperienceScreen from '../screens/create/WriteExperienceScreen';
import WriteQuestionScreen from '../screens/create/WriteQuestionScreen';
// import WriteAnswerScreen from '../screens/create/WriteAnswerScreen';
// import PointHistoryScreen from '../screens/profile/PointHistoryScreen';
// import SettingsScreen from '../screens/profile/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ExploreStack = createStackNavigator();
const AskStack = createStackNavigator();
const NotificationStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// 임시 컴포넌트 생성
const TempScreen = ({ route }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>임시 화면: {route.name}</Text>
  </View>
);

// 인증 관련 화면 스택
const AuthStackScreen = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  useEffect(() => {
    // 온보딩 표시 여부 체크
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('@viewedOnboarding');
        
        if (value === 'true') {
          setShowOnboarding(false);
        }
      } catch (err) {
        console.log('Onboarding check error: ', err);
      }
    };
    
    checkOnboarding();
  }, []);

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {showOnboarding && (
        <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={TempScreen} />
    </AuthStack.Navigator>
  );
};

// 홈 화면 스택
const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="홈" component={HomeScreen} options={{ headerShown: false }} />
    <HomeStack.Screen name="QuestionDetail" component={TempScreen} options={{ title: '질문 상세' }} />
    <HomeStack.Screen name="ExperienceDetail" component={TempScreen} options={{ title: '경험담 상세' }} />
    <HomeStack.Screen name="EbookDetail" component={TempScreen} options={{ title: '전자책 상세' }} />
    <HomeStack.Screen name="UserProfile" component={TempScreen} options={{ title: '프로필' }} />
    <HomeStack.Screen name="WriteAnswer" component={TempScreen} options={{ title: '답변 작성' }} />
  </HomeStack.Navigator>
);

// 탐색 화면 스택
const ExploreStackScreen = () => (
  <ExploreStack.Navigator>
    <ExploreStack.Screen name="탐색" component={TempScreen} options={{ headerShown: false }} />
    <ExploreStack.Screen name="QuestionDetail" component={TempScreen} options={{ title: '질문 상세' }} />
    <ExploreStack.Screen name="ExperienceDetail" component={TempScreen} options={{ title: '경험담 상세' }} />
    <ExploreStack.Screen name="EbookDetail" component={TempScreen} options={{ title: '전자책 상세' }} />
    <ExploreStack.Screen name="UserProfile" component={TempScreen} options={{ title: '프로필' }} />
  </ExploreStack.Navigator>
);

// 질문하기 화면 스택
const AskStackScreen = () => (
  <AskStack.Navigator>
    <AskStack.Screen name="질문하기" component={AskScreen} options={{ headerShown: false }} />
    <AskStack.Screen name="WriteQuestion" component={WriteQuestionScreen} options={{ headerShown: false }} />
    <AskStack.Screen name="WriteExperience" component={TempScreen} options={{ title: '경험담 작성' }} />
  </AskStack.Navigator>
);

// 알림 화면 스택
const NotificationStackScreen = () => (
  <NotificationStack.Navigator>
    <NotificationStack.Screen name="알림" component={TempScreen} options={{ headerShown: false }} />
  </NotificationStack.Navigator>
);

// 프로필 화면 스택
const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="마이페이지" component={TempScreen} options={{ headerShown: false }} />
    <ProfileStack.Screen name="PointHistory" component={TempScreen} options={{ title: '포인트 내역' }} />
    <ProfileStack.Screen name="Settings" component={TempScreen} options={{ title: '설정' }} />
    <ProfileStack.Screen name="WriteExperience" component={TempScreen} options={{ title: '경험담 작성' }} />
  </ProfileStack.Navigator>
);

// 메인 탭 네비게이션
const TabNavigator = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === '홈') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === '탐색') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === '질문하기') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else if (route.name === '알림') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === '마이페이지') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="홈" component={HomeStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="탐색" component={ExploreStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="질문하기" component={AskStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="알림" component={NotificationStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="마이페이지" component={ProfileStackScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

// 메인 네비게이션
export default function Navigation() {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return null; // 로딩 중일 때는 아무것도 렌더링하지 않음 (앱 로딩 화면이 보임)
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStackScreen} />
      )}
    </Stack.Navigator>
  );
} 
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Navigation from './src/navigation';
import TimeContext from './src/context/TimeContext';
import AuthProvider from './src/context/AuthProvider';

// 테마 설정
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6A3EA1',
    accent: '#FF8FA3',
    background: '#FFFFFF',
    surface: '#F9F5FF',
    error: '#BA1A1A',
    text: '#1C1B1F',
    disabled: '#9C9C9C',
    placeholder: '#6C6C6C',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#FF8FA3',
  },
  roundness: 12,
};

// 시간대 결정 함수
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
};

// 앱 시작 화면
const AppLoader = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={{ marginTop: 10, color: theme.colors.primary, fontSize: 16 }}>
        라떼에 오신 것을 환영합니다...
      </Text>
    </View>
  );
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());

  // Apollo Client 설정
  const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql', // 실제 서버 URL로 변경 필요
  });

  const authLink = setContext(async (_, { headers }) => {
    // AsyncStorage에서 토큰을 가져옴
    const token = await AsyncStorage.getItem('@auth_token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

  // 시간에 따른 컨텐츠 변경을 위한 타이머
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeOfDay = getTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
      }
    }, 60000); // 1분마다 체크
    
    return () => clearInterval(interval);
  }, [timeOfDay]);

  // 앱 초기화
  useEffect(() => {
    const prepare = async () => {
      try {
        // 앱 초기화에 필요한 작업 수행
        // 예: 폰트 로드, 초기 데이터 가져오기 등
        
        // 시뮬레이션된 로딩 시간
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('앱 초기화 중 오류:', e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  if (!appIsReady) {
    return <AppLoader />;
  }

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <TimeContext.Provider value={{ timeOfDay }}>
          <PaperProvider theme={theme}>
            <SafeAreaProvider>
              <NavigationContainer>
                <Navigation />
                <StatusBar style="auto" />
              </NavigationContainer>
            </SafeAreaProvider>
          </PaperProvider>
        </TimeContext.Provider>
      </AuthProvider>
    </ApolloProvider>
  );
} 
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 실행 시 토큰 확인
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@auth_token');
        const userData = await AsyncStorage.getItem('@user_data');
        
        if (storedToken && userData) {
          setToken(storedToken);
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.log('토큰 복원 실패:', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // 로그인 함수
  const signIn = async (data) => {
    try {
      // 실제 구현에서는 API 호출 후 결과를 저장
      await AsyncStorage.setItem('@auth_token', data.token);
      await AsyncStorage.setItem('@user_data', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      
      return { success: true };
    } catch (e) {
      console.log('로그인 중 오류 발생:', e);
      return { success: false, error: e.message };
    }
  };

  // 회원가입 함수
  const signUp = async (data) => {
    try {
      // 실제 구현에서는 API 호출 후 결과를 저장
      await AsyncStorage.setItem('@auth_token', data.token);
      await AsyncStorage.setItem('@user_data', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      
      return { success: true };
    } catch (e) {
      console.log('회원가입 중 오류 발생:', e);
      return { success: false, error: e.message };
    }
  };

  // 로그아웃 함수
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@user_data');
      
      setToken(null);
      setUser(null);
      
      return { success: true };
    } catch (e) {
      console.log('로그아웃 중 오류 발생:', e);
      return { success: false, error: e.message };
    }
  };

  // 사용자 정보 업데이트 함수
  const updateUser = async (updatedData) => {
    try {
      const userData = { ...user, ...updatedData };
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (e) {
      console.log('사용자 정보 업데이트 중 오류 발생:', e);
      return { success: false, error: e.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        signIn,
        signOut,
        signUp,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 
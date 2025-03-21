import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthContext from '../../context/AuthContext';

// 검증 스키마
const schema = yup.object().shape({
  email: yup
    .string()
    .required('이메일은 필수입니다')
    .email('유효한 이메일을 입력하세요'),
  password: yup
    .string()
    .required('비밀번호는 필수입니다')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
});

const SignInScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { signIn } = useContext(AuthContext);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      // 실제 구현 시 API 호출
      setTimeout(() => {
        // 임시 테스트 데이터
        const userData = {
          token: 'test_token_' + Math.random().toString(36).substring(2),
          user: {
            id: '1',
            email: data.email,
            name: '테스트 사용자',
            nickname: '라떼러버',
            level: 2,
            points: {
              total: 250,
              available: 150
            }
          }
        };
        
        signIn(userData);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          {/* <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            // 임시 로고 (실제 애셋으로 대체 필요)
            defaultSource={require('../../assets/logo-placeholder.png')}
          /> */}
          <Text style={[styles.logoText, {fontSize: 40, marginBottom: 10}]}>로고</Text>
          <Text style={styles.logoText}>라떼</Text>
          <Text style={styles.tagline}>경험의 가치를 나누는 곳</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>로그인</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                label="이메일"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                left={<TextInput.Icon icon="email-outline" />}
                error={!!errors.email}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                label="비밀번호"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                secureTextEntry={secureTextEntry}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon 
                    icon={secureTextEntry ? "eye-off" : "eye"} 
                    onPress={toggleSecureEntry} 
                  />
                }
                error={!!errors.password}
                style={styles.input}
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
              비밀번호를 잊으셨나요?
            </Text>
          </TouchableOpacity>

          <Button 
            mode="contained" 
            onPress={handleSubmit(onSubmit)} 
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            로그인
          </Button>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialLoginContainer}>
            <TouchableOpacity style={[styles.socialButton, styles.kakaoButton]}>
              <Text style={styles.socialButtonText}>카카오로 시작하기</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.socialButton, styles.naverButton]}>
              <Text style={[styles.socialButtonText, styles.naverButtonText]}>네이버로 시작하기</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
              <Ionicons name="logo-google" size={18} color="#444" />
              <Text style={[styles.socialButtonText, styles.googleButtonText]}>Google로 시작하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>아직 계정이 없으신가요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={[styles.signUpText, { color: colors.primary }]}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
    backgroundColor: '#F9F5FF',
    borderRadius: 15,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  formContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  button: {
    paddingVertical: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#BA1A1A',
    fontSize: 12,
    marginBottom: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#666',
  },
  socialLoginContainer: {
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  kakaoButton: {
    backgroundColor: '#FAE100',
  },
  naverButton: {
    backgroundColor: '#03C75A',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  naverButtonText: {
    color: 'white',
  },
  googleButtonText: {
    color: '#444',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    marginRight: 8,
  },
  signUpText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SignInScreen; 
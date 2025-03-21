import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { TextInput, Button, useTheme, SegmentedButtons } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Ionicons } from '@expo/vector-icons';
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
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      '비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다'
    ),
  confirmPassword: yup
    .string()
    .required('비밀번호 확인은 필수입니다')
    .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다'),
  name: yup
    .string()
    .required('이름은 필수입니다')
    .min(2, '이름은 최소 2자 이상이어야 합니다'),
  nickname: yup
    .string()
    .required('닉네임은 필수입니다')
    .min(2, '닉네임은 최소 2자 이상이어야 합니다')
    .max(15, '닉네임은 최대 15자까지 가능합니다'),
});

const SignUpScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { signUp } = useContext(AuthContext);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('경험 탐색자');

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      nickname: '',
    },
  });

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const toggleConfirmSecureEntry = () => {
    setConfirmSecureTextEntry(!confirmSecureTextEntry);
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
            name: data.name,
            nickname: data.nickname,
            userType: userType,
            level: 1,
            points: {
              total: 50,
              available: 50
            }
          }
        };
        
        signUp(userData);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>회원가입</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.formContainer}>
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                label="비밀번호 확인"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                secureTextEntry={confirmSecureTextEntry}
                left={<TextInput.Icon icon="lock-check-outline" />}
                right={
                  <TextInput.Icon 
                    icon={confirmSecureTextEntry ? "eye-off" : "eye"} 
                    onPress={toggleConfirmSecureEntry} 
                  />
                }
                error={!!errors.confirmPassword}
                style={styles.input}
              />
            )}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                label="이름"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                left={<TextInput.Icon icon="account-outline" />}
                error={!!errors.name}
                style={styles.input}
              />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

          <Controller
            control={control}
            name="nickname"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                label="닉네임"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                left={<TextInput.Icon icon="account-badge-outline" />}
                error={!!errors.nickname}
                style={styles.input}
              />
            )}
          />
          {errors.nickname && <Text style={styles.errorText}>{errors.nickname.message}</Text>}

          <View style={styles.userTypeContainer}>
            <Text style={styles.userTypeLabel}>사용자 유형:</Text>
            <SegmentedButtons
              value={userType}
              onValueChange={setUserType}
              buttons={[
                {
                  value: '경험 탐색자',
                  label: '경험 탐색자',
                },
                {
                  value: '직접 경험자',
                  label: '직접 경험자',
                },
                {
                  value: '간접 경험자',
                  label: '간접 경험자',
                },
              ]}
              style={styles.segmentedButtons}
            />
            <Text style={styles.userTypeDescription}>
              {userType === '경험 탐색자' ? 
                '다른 사람들의 경험을 통해 배우고 싶어요.' : 
                userType === '직접 경험자' ? 
                '제가 직접 경험한 것을 나누고 싶어요.' : 
                '간접적으로 알게 된 경험과 지식을 나누고 싶어요.'}
            </Text>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              가입하면 라떼의 <Text style={{ color: colors.primary }}>이용약관</Text>, <Text style={{ color: colors.primary }}>개인정보 처리방침</Text>에 동의하게 됩니다.
            </Text>
          </View>

          <Button 
            mode="contained" 
            onPress={handleSubmit(onSubmit)} 
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            회원가입
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={[styles.signInText, { color: colors.primary }]}>로그인</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  userTypeContainer: {
    marginVertical: 16,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  userTypeDescription: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  termsContainer: {
    marginVertical: 16,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    marginRight: 8,
  },
  signInText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SignUpScreen; 
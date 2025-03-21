import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Chip, 
  HelperText, 
  Switch, 
  Avatar, 
  Divider,
  Appbar,
  useTheme 
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AuthContext from '../../context/AuthContext';

// 카테고리 목록
const categories = [
  '커리어', '취업', '이직', '투자', '창업', '주식',
  '부동산', '육아', '교육', '여행', '건강', '다이어트',
  '연애', '결혼', '인간관계', '취미', '스포츠', '문화',
  '예술', '심리', '자기계발', '금융', '법률', '세금',
  '기타'
];

// 유효성 검증 스키마
const schema = yup.object({
  title: yup
    .string()
    .required('제목은 필수입니다')
    .min(5, '제목은 최소 5자 이상 입력해주세요')
    .max(100, '제목은 최대 100자까지 입력 가능합니다'),
  content: yup
    .string()
    .required('내용은 필수입니다')
    .min(20, '내용은 최소 20자 이상 입력해주세요')
    .max(2000, '내용은 최대 2000자까지 입력 가능합니다'),
  selectedCategories: yup
    .array()
    .min(1, '최소 1개 이상의 카테고리를 선택해주세요')
    .max(3, '카테고리는 최대 3개까지 선택 가능합니다'),
  tags: yup
    .string()
    .matches(/^[가-힣a-zA-Z0-9\s,]*$/, '태그에는 특수문자를 사용할 수 없습니다'),
  points: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .min(10, '최소 10 포인트 이상 설정해주세요')
    .max(10000, '최대 10,000 포인트까지 설정 가능합니다')
});

const WriteQuestionScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isTimeLimit, setIsTimeLimit] = useState(false);
  const [timeLimit, setTimeLimit] = useState(24); // 시간 단위
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      selectedCategories: [],
      tags: '',
      points: 10
    }
  });

  const selectedCategories = watch('selectedCategories');
  const pointsValue = watch('points');

  // 카테고리 선택 토글
  const toggleCategory = (category) => {
    const currentCategories = [...selectedCategories];
    const index = currentCategories.indexOf(category);
    
    if (index > -1) {
      currentCategories.splice(index, 1);
    } else {
      if (currentCategories.length < 3) {
        currentCategories.push(category);
      } else {
        Alert.alert('카테고리 선택 제한', '카테고리는 최대 3개까지 선택 가능합니다.');
        return;
      }
    }
    
    setValue('selectedCategories', currentCategories);
  };

  // 이미지 선택
  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert('이미지 추가 제한', '이미지는 최대 5개까지 추가할 수 있습니다.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 접근 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  // 이미지 삭제
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // 태그 추가
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    // 태그 형식 검증 (공백, 쉼표 제거)
    const formattedTags = tagInput
      .trim()
      .split(/[\s,]+/)
      .filter(tag => tag.length > 0);
    
    if (formattedTags.length === 0) return;
    
    // 기존 태그와 중복 체크 및 최대 개수 확인
    const newTags = [...tags];
    
    formattedTags.forEach(tag => {
      if (!newTags.includes(tag) && newTags.length < 10) {
        newTags.push(tag);
      }
    });
    
    setTags(newTags);
    setTagInput('');
    setValue('tags', newTags.join(','));
  };

  // 태그 삭제
  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
    setValue('tags', newTags.join(','));
  };

  // 질문 등록 처리
  const onSubmit = async (data) => {
    // 포인트 검증
    if (data.points > (user?.points?.available || 0)) {
      Alert.alert('포인트 부족', '보유한 포인트보다 많은 포인트를 설정할 수 없습니다.');
      return;
    }

    setLoading(true);

    try {
      // 이미지 업로드 (실제 구현 시 서버에 업로드)
      const uploadedImages = images.map(uri => ({
        type: 'image',
        url: uri,
        caption: ''
      }));

      // 태그 처리
      const processedTags = tags;

      // 질문 데이터 구성
      const questionData = {
        title: data.title,
        content: data.content,
        categories: data.selectedCategories,
        tags: processedTags,
        media: uploadedImages,
        offeredPoints: parseInt(data.points),
        isAnonymous: isAnonymous,
        timeRestriction: {
          hasTimeLimit: isTimeLimit,
          expiresAt: isTimeLimit ? new Date(Date.now() + timeLimit * 60 * 60 * 1000) : null
        }
      };

      // 서버 전송 로직 - 실제 구현에서는 API 호출
      console.log('질문 데이터:', questionData);
      
      // 임시 지연 (서버 통신 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 성공 처리
      Alert.alert(
        '질문 등록 완료', 
        '질문이 성공적으로 등록되었습니다.\n답변이 달리면 알림을 보내드립니다.', 
        [{ text: '확인', onPress: () => navigation.navigate('홈') }]
      );
    } catch (error) {
      console.error('질문 등록 오류:', error);
      Alert.alert('오류 발생', '질문 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="질문 작성하기" />
        <Appbar.Action icon="check" onPress={handleSubmit(onSubmit)} disabled={loading} />
      </Appbar.Header>

      <ScrollView style={styles.container}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>질문 등록 중...</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          {/* 제목 입력 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>제목</Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="질문 제목을 입력하세요"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.title}
                  maxLength={100}
                />
              )}
            />
            {errors.title && (
              <HelperText type="error">{errors.title.message}</HelperText>
            )}
          </View>

          {/* 내용 입력 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>내용</Text>
            <Controller
              control={control}
              name="content"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.contentInput}
                  placeholder="질문 내용을 자세히 입력하세요"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.content}
                  multiline={true}
                  numberOfLines={8}
                  maxLength={2000}
                />
              )}
            />
            {errors.content && (
              <HelperText type="error">{errors.content.message}</HelperText>
            )}
          </View>

          {/* 이미지 첨부 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>이미지 첨부 (선택, 최대 5개)</Text>
            <View style={styles.imagesContainer}>
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Ionicons name="add" size={32} color="#666" />
              </TouchableOpacity>
              
              {images.map((uri, index) => (
                <View key={index} style={styles.imagePreviewContainer}>
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={20} color="white" />
                  </TouchableOpacity>
                  <Image source={{ uri }} style={styles.imagePreview} />
                </View>
              ))}
            </View>
          </View>

          {/* 카테고리 선택 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>카테고리 (1~3개 선택)</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((category, index) => (
                <Chip
                  key={index}
                  style={[
                    styles.categoryChip,
                    selectedCategories.includes(category) && { backgroundColor: colors.primary + '20' }
                  ]}
                  textStyle={selectedCategories.includes(category) ? { color: colors.primary } : {}}
                  onPress={() => toggleCategory(category)}
                  selected={selectedCategories.includes(category)}
                  mode="outlined"
                >
                  {category}
                </Chip>
              ))}
            </View>
            {errors.selectedCategories && (
              <HelperText type="error">{errors.selectedCategories.message}</HelperText>
            )}
          </View>

          {/* 태그 입력 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>태그 (선택, 최대 10개)</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="태그 입력 후 추가 (쉼표, 공백으로 구분 가능)"
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
              />
              <Button mode="contained" onPress={addTag} style={styles.addTagButton}>
                추가
              </Button>
            </View>
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  style={styles.tagChip}
                  onClose={() => removeTag(index)}
                  onPress={() => removeTag(index)}
                >
                  {tag}
                </Chip>
              ))}
            </View>
            {errors.tags && (
              <HelperText type="error">{errors.tags.message}</HelperText>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* 포인트 설정 */}
          <View style={styles.formGroup}>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>포인트 설정</Text>
              <Text style={styles.pointInfo}>
                보유: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{user?.points?.available || 0}P</Text>
              </Text>
            </View>
            <Controller
              control={control}
              name="points"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.pointsInput}
                  placeholder="10"
                  value={value ? value.toString() : ''}
                  onChangeText={(text) => {
                    const numValue = text ? parseInt(text.replace(/[^0-9]/g, '')) : '';
                    onChange(numValue);
                  }}
                  onBlur={onBlur}
                  error={!!errors.points}
                  keyboardType="numeric"
                  right={<TextInput.Affix text="P" />}
                />
              )}
            />
            {errors.points && (
              <HelperText type="error">{errors.points.message}</HelperText>
            )}
            <Text style={styles.pointsDescription}>
              설정한 포인트는 답변이 채택되면 답변자에게 지급됩니다.
            </Text>
          </View>

          {/* 익명 설정 */}
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Ionicons name="eye-off-outline" size={20} color="#666" />
              <Text style={styles.switchLabel}>익명으로 질문하기</Text>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              color={colors.primary}
            />
          </View>

          {/* 시간 제한 설정 */}
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.switchLabel}>시간 제한 설정</Text>
            </View>
            <Switch
              value={isTimeLimit}
              onValueChange={setIsTimeLimit}
              color={colors.primary}
            />
          </View>

          {isTimeLimit && (
            <View style={styles.timeLimitContainer}>
              <Text style={styles.timeLimitLabel}>제한 시간 선택:</Text>
              <View style={styles.timeLimitOptionsContainer}>
                {[6, 12, 24, 48, 72].map((hours) => (
                  <Chip
                    key={hours}
                    style={[
                      styles.timeLimitChip,
                      timeLimit === hours && { backgroundColor: colors.primary + '20' }
                    ]}
                    textStyle={timeLimit === hours ? { color: colors.primary } : {}}
                    onPress={() => setTimeLimit(hours)}
                    selected={timeLimit === hours}
                    mode="outlined"
                  >
                    {hours}시간
                  </Chip>
                ))}
              </View>
            </View>
          )}

          <Divider style={styles.divider} />

          {/* 작성자 정보 */}
          <View style={styles.authorInfoContainer}>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>작성자 정보</Text>
              {isAnonymous && (
                <Chip mode="outlined" style={styles.anonymousChip}>
                  익명으로 표시됨
                </Chip>
              )}
            </View>
            <View style={styles.authorProfile}>
              <Avatar.Image size={40} source={{ uri: user?.profileImage || 'https://ui-avatars.com/api/?name=User' }} />
              <View style={styles.authorDetails}>
                <Text style={styles.authorName}>{isAnonymous ? '익명' : user?.name || '사용자'}</Text>
                <Text style={styles.authorLevel}>Lv.{user?.level || 1} | {user?.expertise?.join(', ') || '분야 미설정'}</Text>
              </View>
            </View>
          </View>

          {/* 제출 버튼 */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
            labelStyle={styles.submitButtonLabel}
            loading={loading}
            disabled={loading}
          >
            질문 등록하기
          </Button>

          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6A3EA1',
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    marginBottom: 4,
  },
  contentInput: {
    backgroundColor: '#F5F5F5',
    marginBottom: 4,
    minHeight: 120,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  imagePreviewContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    zIndex: 1,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryChip: {
    margin: 4,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  addTagButton: {
    borderRadius: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    margin: 4,
  },
  divider: {
    marginVertical: 20,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointInfo: {
    fontSize: 14,
    color: '#666',
  },
  pointsInput: {
    backgroundColor: '#F5F5F5',
    marginBottom: 4,
  },
  pointsDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  timeLimitContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  timeLimitLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  timeLimitOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeLimitChip: {
    margin: 4,
  },
  authorInfoContainer: {
    marginBottom: 20,
  },
  anonymousChip: {
    height: 24,
  },
  authorProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  authorDetails: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  authorLevel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  submitButton: {
    padding: 8,
    marginVertical: 16,
  },
  submitButtonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
  bottomSpace: {
    height: 40,
  },
});

export default WriteQuestionScreen; 
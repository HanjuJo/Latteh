import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Dimensions, 
  TouchableOpacity, 
  FlatList,
  Animated
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../../assets/onboarding-1.png'),
    title: '경험의 가치를 발견하세요',
    subtitle: '라떼에서는 다양한 분야의 경험자들이 자신의 소중한 경험을 공유합니다. 새로운 통찰력을 얻어보세요.',
  },
  {
    id: '2',
    image: require('../../assets/onboarding-2.png'),
    title: '질문하고 배우세요',
    subtitle: '궁금한 점이 있다면 질문해보세요. 경험자들의 직접적인 답변을 받을 수 있습니다.',
  },
  {
    id: '3',
    image: require('../../assets/onboarding-3.png'),
    title: '경험을 나누고 보상받으세요',
    subtitle: '당신의 경험은 누군가에게 소중한 자산이 됩니다. 경험을 공유하고 포인트도 받아보세요.',
  },
  {
    id: '4',
    image: require('../../assets/onboarding-4.png'),
    title: 'AI로 더 빠른 답변',
    subtitle: '라떼의 AI는 경험자의 데이터를 학습해 유사한 질문에 빠르게 답변합니다. 사람과 AI의 완벽한 조화를 경험하세요.',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await AsyncStorage.setItem('@viewedOnboarding', 'true');
        navigation.navigate('SignIn');
      } catch (err) {
        console.log('Error @setItem: ', err);
      }
    }
  };

  const skip = async () => {
    try {
      await AsyncStorage.setItem('@viewedOnboarding', 'true');
      navigation.navigate('SignIn');
    } catch (err) {
      console.log('Error @setItem: ', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.skipContainer}>
        {currentIndex < slides.length - 1 ? (
          <TouchableOpacity onPress={skip}>
            <Text style={[styles.skipText, { color: colors.primary }]}>건너뛰기</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>

      <View style={styles.slidesContainer}>
        <FlatList 
          data={slides}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image 
                source={item.image} 
                style={styles.image}
                defaultSource={require('../../assets/placeholder.png')}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 20, 10],
              extrapolate: 'clamp',
            });
            
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            
            return (
              <Animated.View 
                style={[
                  styles.indicator, 
                  { 
                    width: dotWidth, 
                    opacity, 
                    backgroundColor: colors.primary 
                  }
                ]} 
                key={index} 
              />
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={scrollTo} 
            style={[styles.button, { backgroundColor: colors.primary }]}
            labelStyle={styles.buttonText}
          >
            {currentIndex === slides.length - 1 ? '시작하기' : '다음'}
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginTop: 40,
  },
  skipText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  slidesContainer: {
    flex: 3,
  },
  slide: {
    width,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  indicator: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen; 
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface WheelProgressProps {
  easyCompleted: number;
  easyTotal: number;
  mediumCompleted: number;
  mediumTotal: number;
  hardCompleted: number;
  hardTotal: number;
  onPress?: () => void;
}

const WheelProgress: React.FC<WheelProgressProps> = ({
  easyCompleted,
  easyTotal,
  mediumCompleted,
  mediumTotal,
  hardCompleted,
  hardTotal,
  onPress,
}) => {
  const totalCompleted = easyCompleted + mediumCompleted + hardCompleted;
  const totalLevels = easyTotal + mediumTotal + hardTotal;
  const overallProgress = totalLevels > 0 ? (totalCompleted / totalLevels) * 100 : 0;

  // Calculate individual progress percentages
  const easyProgress = easyTotal > 0 ? (easyCompleted / easyTotal) * 100 : 0;
  const mediumProgress = mediumTotal > 0 ? (mediumCompleted / mediumTotal) * 100 : 0;
  const hardProgress = hardTotal > 0 ? (hardCompleted / hardTotal) * 100 : 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.wheelContainer}>
        {/* Outer ring - Overall progress */}
        <View style={styles.outerRing}>
          <View 
            style={[
              styles.progressRing, 
              { 
                borderColor: '#4CAF50',
                transform: [{ rotate: `${(overallProgress * 3.6) - 90}deg` }]
              }
            ]} 
          />
        </View>
        
        {/* Inner content */}
        <View style={styles.innerContent}>
          <Text style={styles.progressText}>
            {totalCompleted}/{totalLevels}
          </Text>
          
          {/* Difficulty indicators */}
          <View style={styles.difficultyIndicators}>
            <View style={[styles.difficultyDot, { backgroundColor: easyProgress === 100 ? '#4CAF50' : '#374151' }]} />
            <View style={[styles.difficultyDot, { backgroundColor: mediumProgress === 100 ? '#FFC107' : '#374151' }]} />
            <View style={[styles.difficultyDot, { backgroundColor: hardProgress === 100 ? '#F44336' : '#374151' }]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelContainer: {
    width: 50,
    height: 50,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#4CAF50',
  },
  innerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  progressText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#F0F4F8',
    textAlign: 'center',
    marginBottom: 2,
  },
  difficultyIndicators: {
    flexDirection: 'row',
    gap: 2,
  },
  difficultyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default WheelProgress;

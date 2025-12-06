import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ScreenHeaderProps = {
  title: string;
  showBackButton?: boolean;
  has_add?: boolean;
  actual_link?: string;
};

export default function ScreenHeader({ title, showBackButton = true, has_add = false, actual_link = ""}: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      {showBackButton ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} /> 
      )}

      
      <Text style={styles.title}>{title}</Text>

      <>
      {has_add && actual_link != ""?
        <>
        <TouchableOpacity style={styles.iconButton_1}>
          <Ionicons name="add" size={24} color={Colors.text} onPress={()=>router.push(`/add-${actual_link}` as any)}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton_2}>
          <Ionicons name="notifications-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
        </>
        :
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      }
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: Platform.OS === 'ios' ? 50 : 60, 
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
    iconButton_1: {
    width: 40,
    height: 40,
    marginRight: -180,
    justifyContent: 'center',
    alignItems: 'center',
  },
    iconButton_2: {
    width: 40,
    height: 40,
    marginLeft: -180,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
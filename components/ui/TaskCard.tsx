import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type TaskStatus = 'Done' | 'In Progress' | 'To-do';

export type TaskCardProps = {
  title: string;
  assignedTo: string;
  time: string;
  status: TaskStatus;
};

const statusStyles: Record<TaskStatus, { backgroundColor: string; color: string }> = {
  'Done': { backgroundColor: '#dcfce7', color: '#166534' },
  'In Progress': { backgroundColor: '#fef9c3', color: '#854d0e' },
  'To-do': { backgroundColor: '#dbeafe', color: '#1e40af' },
};

export default function TaskCard({ title, assignedTo, time, status }: TaskCardProps) {
  const currentStatusStyle = statusStyles[status];

  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <Text style={styles.assignedTo}>Asignado a {assignedTo}</Text>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={16} color={Colors.text} />
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>

      <View style={styles.rightContent}>
        <View style={styles.categoryIconContainer}>
          <Text style={styles.categoryIcon}>🛍️</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: currentStatusStyle.backgroundColor }]}>
          <Text style={[styles.statusText, { color: currentStatusStyle.color }]}>{status}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  leftContent: {
    flex: 1, 
    gap: 6,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  assignedTo: {
    fontSize: 12,
    color: Colors.text,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  time: {
    fontSize: 14,
    color: Colors.text,
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffe4e6', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 18,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
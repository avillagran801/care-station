import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export type ActionOption = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isDestructive?: boolean;
  onPress: () => void;
};

type ActionSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  options: ActionOption[];
};

export default function ActionSheetModal({ visible, onClose, title, options }: ActionSheetModalProps) {
  const ERROR_COLOR = '#ef4444'; 
  const TEXT_COLOR = '#000000'; 

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
            <TouchableWithoutFeedback>
                <View style={styles.content}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    
                    {options.map((option, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.option} 
                        onPress={() => {
                            onClose(); 
                            option.onPress();
                        }}
                    >
                        <View style={styles.optionIcon}>
                            {option.icon && (
                                <Ionicons 
                                    name={option.icon} 
                                    size={24} 
                                    color={option.isDestructive ? ERROR_COLOR : TEXT_COLOR} 
                                />
                            )}
                        </View>
                        <Text style={[
                            styles.optionText, 
                            option.isDestructive && styles.destructiveText
                        ]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                    ))}

                    <View style={styles.separator} />
                    
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.grey,
    textAlign: 'center',
    marginBottom: 15,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionIcon: {
    width: 30,
    marginRight: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: Colors.text,
  },
  destructiveText: {
    color: '#ef4444', 
    fontWeight: 'bold',
  },
  separator: {
    height: 10,
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 15,
    marginTop: 10,
  },
  cancelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
});
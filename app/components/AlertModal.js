import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet , Dimensions} from 'react-native';

const AlertModal = ({ visible, title, message, onOk , onClose }) => {
  const handleOk = () => {
    onOk && onOk(); // Call onOk callback if provided
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}} // Do nothing on modal backdrop press
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          
          <View style={styles.options}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>いいえ</Text>
          </TouchableOpacity>  
          
          <TouchableOpacity onPress={handleOk}>
            <Text style={styles.okButton}>はい</Text>
          </TouchableOpacity>
          
          </View>
          
          
        </View>
      </View>
    </Modal>
  );
};


const sw = Dimensions.get('window').width;


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: sw*0.06,
    borderRadius: 10,
    alignItems: 'center',
    minWidth:sw*0.7,
  },
  modalTitle: {
    fontSize: sw*0.045,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: sw*0.035,
    marginBottom:sw*0.06,
  },
  closeButton: {
    fontSize: sw*0.04,
    color: '#70AD47',
    alignSelf:'flex-start',
    fontWeight:'bold',
  },
  
  okButton:{
    fontSize: sw*0.04,
    color: '#70AD47',
    alignSelf:'flex-end',
    fontWeight:'bold',
    
  },
  
  
 options:{
   flexDirection:'row',
   justifyContent:'space-between',
   alignItems:'flex-start',
   minWidth:sw*0.6,
 }
  
  
});



export default AlertModal;
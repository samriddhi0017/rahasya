import { useFonts , Poppins_400Regular } from '@expo-google-fonts/poppins';
import React from 'react';
import { View, Text, Modal, ActivityIndicator, Image , Dimensions} from 'react-native';



const LoadingModal = ({ isVisible }) => {
  
  let [fontsLoaded] = useFonts({
    Poppins_400Regular
  });
  const sw = Dimensions.get('window').width;
  
  
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={() => {}}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <View
          style={{
            backgroundColor: '#ff009d',
            padding: sw*0.1,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../assets/logo.png')}
            style={{ 
            width: sw*0.4, 
            height: sw*0.4, 
            marginBottom: sw*0.01}}
          />
          <ActivityIndicator size="large" color="#70AD47" />
          <Text 
          style={{
            color:'white',
            fontFamily:'Poppins_400Regular',
            fontSize:sw*0.04,
          }}
          >Logging In.</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;
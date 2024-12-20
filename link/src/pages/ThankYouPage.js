import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Lottie from 'lottie-react';
import checkAnimation from './../assets/thanks.json'; // You'll need to provide this JSON file
import { useNavigate } from 'react-router-dom';

const SentConfirmationPage = () => {
  const navigate = useNavigate(); 


  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-500 to-orange-500 flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <button 
         onClick={() => navigate(-1)}
        className="text-white mb-8">
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 h-48 mb-20 bg-white rounded-full">
            <Lottie 
              animationData={checkAnimation} 
              loop={true} 
              autoplay={true}
            />
          </div>
          <h1 className="text-white text-2xl font-bold mb-8">Sent!</h1>
          
          <p className="text-white text-sm mb-6">
            👇 360 people just tapped the button 👇
          </p>
          
          <button onClick={() => window.open('https://rahasya-official.web.app/', '_blank')}
           className="w-full bg-black text-white py-3 rounded-full font-semibold mb-4">
            Get your own messages!
          </button>
          
          <button 
            onClick={()=>navigate(-1)}  
            className="text-white underline">
            Send another message
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentConfirmationPage;
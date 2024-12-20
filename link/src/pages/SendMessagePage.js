import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import FirebaseService from '../services/FirebaseService';
import { Helmet } from 'react-helmet-async';

const SendMessagePage = () => {
  const { uid, questionId } = useParams();
  const [profilePic, setProfilePic] = useState("https://static.vecteezy.com/system/resources/previews/036/280/651/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg");
  const [questionText, setQuestionText] = useState('Send me anonymous messages!');
  const [bgColor, setBgColor] = useState(['#ec4899', '#f97316']);
  const [message, setMessage] = useState('');
  const [pushToken, setPushToken] = useState(null);
  const [ipAddress, setIpAddress] = useState('');
  const [deviceInfo, setDeviceInfo] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch user pic
        const picUrl = await FirebaseService.fetchUserPic(uid);
        setProfilePic(picUrl);

        const pusht = await FirebaseService.fetchUserToken(uid);
        setPushToken(pusht);

        // Fetch question
        const questionSnapshot = await FirebaseService.fetchQuestion(questionId);
        if (questionSnapshot) {
          setQuestionText(questionSnapshot.text);
          setBgColor(questionSnapshot.color);
        }
        FirebaseService.incrementVisitorCount(uid);

        // Fetch IP address
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);

        // Get device info
        setDeviceInfo(navigator.userAgent);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIpAddress('Unknown');
      }
    };

    loadData();
  }, [uid, questionId]);

  const randomNum = Math.floor(Math.random() * (500 - 100) + 100);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await FirebaseService.sendMessage(uid, message, questionText, bgColor, pushToken, ipAddress, deviceInfo);
      setMessage('');
      navigate('/thank-you');
    } else {
      console.log("Message cannot be empty");
    }
  };

  return (
    <>
      <Helmet>
        <title>Rahasya</title>
        <meta name="description" content={`Send a message to ${uid}`} />
      </Helmet>

      <div
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{
          background: `linear-gradient(to bottom right, ${bgColor[0]}, ${bgColor[1]})`
        }}
      >
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-gray-300 rounded-full">
                <img src={profilePic} alt="Profile" className="rounded-full" />
              </div>
              <div>
                <p className="font-semibold text-lg">@{uid}</p>
                <p className="text-sm text-gray-600">{questionText}</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-24 p-2 bg-pink-100 text-pink-800 rounded-lg resize-none border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="send me anonymous messages..."
            ></textarea>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Lock size={16} className="mr-1" />
              <span>anonymous q&a</span>
            </div>
            <button
              onClick={handleSendMessage}
              className="mt-4 w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800"
            >
              Send!
            </button>
          </div>
        </div>
        <div className="mt-4 text-white text-sm text-center">
          👇 {randomNum} people just tapped the button 👇
        </div>
        <button
          onClick={() => window.open('https://rahasya-official.web.app/', '_blank')}
          className="mt-2 w-full max-w-md bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-200"
        >
          Get your own messages!
        </button>
      </div>
    </>
  );
};

export default SendMessagePage;
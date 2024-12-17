import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, set, onValue, get, update, query, orderByKey, startAt } from 'firebase/database'; // Added 'update'

// Initialize Firebase only if it hasn't been initialized yet
const firebaseConfig = {
  apiKey: "AIzaSyBNDS03Kg0zxewQqAlTmncj0uWUeGATN68",
  authDomain: "rahasya-official.firebaseapp.com",
  projectId: "rahasya-official",
  storageBucket: "rahasya-official.appspot.com",
  messagingSenderId: "436345225901",
  appId: "1:436345225901:android:e112f5e8f85cd76243bc24",
  databaseURL: "https://rahasya-official-default-rtdb.firebaseio.com/" // Realtime Database URL
};

let app;
if (!getApps().length) {
  // Initialize the Firebase app only if it hasn't been initialized
  app = initializeApp(firebaseConfig);
} else {
  // Use the existing Firebase app
  app = getApps()[0];
}

const database = getDatabase(app);  // Initialize Realtime Database

// Helper function to get the unique key from the email (extract the part before '@')
const getUidFromEmail = (email) => {
  return email.split('@')[0];
}

// Function to get UID from AsyncStorage
const getUserUidFromStorage = async () => {
  try {
    const uid = await AsyncStorage.getItem('@user'); // Get uid from storage
    if (uid !== null) {
      return uid; // Return the UID if it exists
    } else {
      console.log('No UID found in storage');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving UID from AsyncStorage:', error);
    return null;
  }
}

// Function to save user data to Firebase Realtime Database
const saveUserToDatabase = async (userData) => {
  try {
    const uid = await getUserUidFromStorage(); // Fetch the UID from AsyncStorage
    if (!uid) return; // If no UID found, stop execution

    const userKey = getUidFromEmail(userData.email); // Get the key from email
    await set(ref(database, `Users/${userKey}`), {
      name: userData.name,
      email: userData.email,
      uid: userData.uid,
      token: userData.token,
      picture: userData.picture
    });
    console.log('User data saved successfully');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Function to fetch user statistics from Firebase Realtime Database
const fetchStatistics = async (email, callback) => {
  try {
    const uid = await getUserUidFromStorage(); // Fetch UID from AsyncStorage
    if (!uid) return; // If no UID found, stop execution

    const userRef = ref(database, `Users/${getUidFromEmail(email)}`); // Use a unique identifier for the email
    onValue(userRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Check if fields exist and create them with value 0 if they don't
        const visitors = data.visitors || 0;
        const message = data.message || 0;
        const shares = data.shares || 0;

        // Update the database if the fields were missing
        if (visitors === 0 && !data.hasOwnProperty('visitors')) {
          await set(ref(database, `Users/${getUidFromEmail(email)}/visitors`), 0);
        }
        if (message === 0 && !data.hasOwnProperty('message')) {
          await set(ref(database, `Users/${getUidFromEmail(email)}/message`), 0);
        }
        if (shares === 0 && !data.hasOwnProperty('shares')) {
          await set(ref(database, `Users/${getUidFromEmail(email)}/shares`), 0);
        }

        callback({
          visitors: visitors,
          message: message,
          shares: shares,
        });
      } else {
        // Create a new user entry with default values
        await set(userRef, {
          visitors: 0,
          message: 0,
          shares: 0,
        });
        callback({ visitors: 0, message: 0, shares: 0 }); // Default values if no data
      }
    });
  } catch (error) {
    console.error("Error fetching statistics", error);
  }
};

// Function to increase share count by 1
const incrementShareCount = async () => {
  try {
    const uuid = await getUserUidFromStorage(); // Fetch the UID from AsyncStorage
    let uid;

    if (uuid) {
      uid = getUidFromEmail(JSON.parse(uuid).email);
    }
    if (!uid) return; // If no UID found, stop execution

    const userRef = ref(database, `Users/${uid}/shares`);

    // Get the current share count
    const snapshot = await get(userRef);
    const currentShares = snapshot.val() || 0;

    // Increment the share count by 1
    await update(ref(database, `Users/${uid}`), {
      shares: currentShares + 1
    });

    console.log('Share count incremented by 1');
  } catch (error) {
    console.error('Error incrementing share count:', error);
  }
};

// Fetch questions from Firebase
const fetchQuestions = async () => {
  try {
    const questionsRef = ref(database, 'Questions/'); // Correctly reference the database
    const snapshot = await get(questionsRef); // Use 'get' function to retrieve data
    const data = snapshot.val();

    if (data) {
      console.log(data);
      const formattedQuestions = Object.entries(data).map(([id, question]) => ({
        id: question.id,
        text: question.text,
        color: question.color,
        name: id,
      }));
      return formattedQuestions;
    } else {
      ('No questions found');
      return [];
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
};

// Function to save questions to Firebase Realtime Database
const saveQuestionsToDatabase = async (questions) => {
  try {
    // Reference to the Questions node
    const questionsRef = ref(database, 'Questions');

    // Set the entire questions object at once
    await set(questionsRef, questions);
    console.log('Questions saved successfully:', questions);
  } catch (error) {
    console.error('Error saving questions:', error);
  }
};

// Example questions object to be stored
const questionsData = {
  hello: {
    id: "1",
    color: ["#FF6B6B", "#4ECDC4"],
    text: "Tell me what you REALLY think about me!"
  },
  opinion: {
    id: "2",
    color: ["#6B5B95", "#FF6B6B"],
    text: "What's your honest opinion of me?"
  },
  secret: {
    id: "3",
    color: ["#45B7D1", "#F8B195"],
    text: "Share a secret you've never told me."
  },
  thoughts: {
    id: "4",
    color: ["#F8B195", "#F67280"],
    text: "What are your thoughts on life?"
  },
  dreams: {
    id: "5",
    color: ["#C06C84", "#6B5B95"],
    text: "What dreams do you wish to accomplish?"
  }
};

// Call the function to save questions
// saveQuestionsToDatabase(questionsData);

// Fetch messages from Firebase within the last 24 hours
const fetchMessages = (userId, callback) => {
  const now = Date.now(); // Current timestamp in milliseconds
  const last24Hours = now - 24 * 60 * 60 * 1000; // 24 hours ago in milliseconds

  // Reference to the user's messages in Firebase, query for messages within the last 24 hours
  const messagesRef = query(
    ref(database, `Users/${userId}/messages`),
    orderByKey(),
    startAt(last24Hours.toString())
  );

  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const messages = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      callback(messages);
    } else {
      callback([]); // Return an empty array if no messages are found
    }
  });
};

// Function to mark a message as seen
const markMessageAsSeen = (userId, messageId) => {
  const messageRef = ref(database, `Users/${userId}/messages/${messageId}`);
  update(messageRef, { seen: true });
};

export { saveUserToDatabase, fetchStatistics, fetchQuestions, incrementShareCount, fetchMessages, markMessageAsSeen, saveQuestionsToDatabase };

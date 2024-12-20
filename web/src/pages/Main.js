import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Download, MessageCircle, Shield, Smartphone } from "lucide-react";

const RahasyaLandingPage = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      y: [0, Math.random() * 100 - 50],
      x: [0, Math.random() * 100 - 50],
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 10 + i * 0.5,
        ease: "easeInOut",
      },
    }));
  }, [controls]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-orange-500 text-white overflow-hidden">
      {/* Optimized animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 50 + 20}px`,
              height: `${Math.random() * 50 + 20}px`,
            }}
            animate={controls}
            custom={i}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="p-4 flex justify-center items-center">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img src="../logo.png" alt="Rahasya Logo" className="h-20 w-auto" />
          </motion.div>
        </header>

        <main className="flex-grow flex flex-col justify-center items-center p-4 text-center mt-4">
          <motion.p
            className="text-xl mb-8 max-w-md"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Express yourself freely. Connect authentically.
          </motion.p>

          <motion.div
            className="flex flex-col w-full max-w-xs space-y-4"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a
              href="https://www.dropbox.com/scl/fi/bp8rwbkhpglx2za82oij4/Rahasya.apk?rlkey=xbfcgxzwh1jklupzoku11buzv&st=ao60wswa&dl=1"
              className="bg-white text-pink-500 px-8 py-3 rounded-full font-semibold flex items-center justify-center hover:bg-pink-100 transition-colors"
            >
              <Download className="mr-2" /> Download for iOS
            </a>
            <a
              href="https://www.dropbox.com/scl/fi/bp8rwbkhpglx2za82oij4/Rahasya.apk?rlkey=xbfcgxzwh1jklupzoku11buzv&st=ao60wswa&dl=1"
              className="bg-black text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <Download className="mr-2" /> Download for Android
            </a>
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {[
              {
                icon: MessageCircle,
                title: "Anonymous",
                description: "Send messages without revealing your identity",
              },
              {
                icon: Shield,
                title: "Secure",
                description: "Your privacy is our top priority",
              },
              {
                icon: Smartphone,
                title: "Seamless",
                description: "Intuitive interface on any device",
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                <feature.icon className="w-12 h-12 mb-2" />
                <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </main>

        <footer className="p-4 text-center text-sm">
          <p>&copy; 2024 Rahasya. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default RahasyaLandingPage;

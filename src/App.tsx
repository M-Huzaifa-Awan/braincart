import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Trophy, Check, X, Volume2, VolumeX, Sparkles } from 'lucide-react';

const App = () => {
  const [screen, setScreen] = useState('splash');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [cart, setCart] = useState<any[]>([]);
  const [currentShop, setCurrentShop] = useState<number | null>(null);
  const [showRiddle, setShowRiddle] = useState(false);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentItem, setCurrentItem] = useState<{name: string; price: number; quantity: number; riddle: string; answers: string[]; emoji: string; coins: number} | null>(null);

  // PWA Install Handler
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPWAPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPWAPrompt(false);
      playSound('success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Register Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('ServiceWorker registered:', registration);
        } catch (err) {
          console.log('ServiceWorker registration failed:', err);
        }
      };
      registerSW();
    }
  }, []);

  const handlePWAInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPWAPrompt(false);
    }
    setDeferredPrompt(null);
  };

  // Sound Effects using Web Audio API
  const playSound = (type: string) => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
      case 'click':
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'success':
        oscillator.frequency.value = 523.25;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'error':
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case 'coin':
        oscillator.frequency.value = 1000;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.stop(audioContext.currentTime + 0.15);
        break;
    }
  };

  const shops = [
    { id: 1, name: 'FRUIT SHOP', level: 1, color: 'from-orange-400 to-red-400', icon: '🍎', bgColor: 'bg-orange-100' },
    { id: 2, name: 'VEGETABLE SHOP', level: 2, color: 'from-green-400 to-emerald-500', icon: '🥕', bgColor: 'bg-green-100' },
    { id: 3, name: 'TOY SHOP', level: 3, color: 'from-pink-400 to-rose-500', icon: '🧸', bgColor: 'bg-pink-100' },
    { id: 4, name: 'ELECTRONICS', level: 4, color: 'from-blue-400 to-indigo-500', icon: '📱', bgColor: 'bg-blue-100' },
    { id: 5, name: 'CLOTHING', level: 5, color: 'from-purple-400 to-violet-500', icon: '👕', bgColor: 'bg-purple-100' },
    { id: 6, name: 'STATIONARY', level: 6, color: 'from-yellow-400 to-amber-500', icon: '✏️', bgColor: 'bg-yellow-100' },
    { id: 7, name: 'PHARMACY', level: 7, color: 'from-red-400 to-pink-500', icon: '💊', bgColor: 'bg-red-100' },
    { id: 8, name: 'BAKERY', level: 8, color: 'from-amber-400 to-orange-500', icon: '🍰', bgColor: 'bg-amber-100' },
    { id: 9, name: 'GROCERY', level: 9, color: 'from-teal-400 to-cyan-500', icon: '🛒', bgColor: 'bg-teal-100' },
    { id: 10, name: 'SUPERMARKET', level: 10, color: 'from-purple-500 via-pink-500 to-rose-500', icon: '🏪', bgColor: 'bg-gradient-to-r from-purple-100 to-pink-100' }
  ];

  const shopItems = {
    1: [
      { name: 'Apples', price: 5, quantity: 2, riddle: "I'm red and round, growing on trees. Doctors say one a day keeps them away! If one costs 5Rs, what's the price?", answers: ['5'], emoji: '🍎', coins: 10 },
      { name: 'Bananas', price: 12, quantity: 4, riddle: "I'm yellow and curved! Count the letters in BANANA (6 letters) and multiply by 2. What do you get?", answers: ['12'], emoji: '🍌', coins: 15 },
      { name: 'Oranges', price: 8, quantity: 3, riddle: "I'm orange and juicy! If 4 + 4 = ?, what's my price?", answers: ['8'], emoji: '🍊', coins: 10 }
    ],
    2: [
      { name: 'Carrots', price: 6, quantity: 5, riddle: "Rabbits love me! I'm orange and crunchy. 3 + 3 = ?", answers: ['6'], emoji: '🥕', coins: 10 },
      { name: 'Tomatoes', price: 10, quantity: 3, riddle: "I'm red and round like a ball! 5 + 5 = ?", answers: ['10'], emoji: '🍅', coins: 12 },
      { name: 'Potatoes', price: 4, quantity: 6, riddle: "I grow underground and I'm brown! 2 + 2 = ?", answers: ['4'], emoji: '🥔', coins: 8 }
    ],
    3: [
      { name: 'Teddy Bear', price: 50, quantity: 1, riddle: "Soft and cuddly friend! 25 + 25 = ?", answers: ['50'], emoji: '🧸', coins: 25 },
      { name: 'Ball', price: 15, quantity: 2, riddle: "Round and bouncy fun! 10 + 5 = ?", answers: ['15'], emoji: '⚽', coins: 18 },
      { name: 'Puzzle', price: 30, quantity: 1, riddle: "I help you think and learn! 3 × 10 = ?", answers: ['30'], emoji: '🧩', coins: 20 }
    ],
    4: [
      { name: 'Tablet', price: 100, quantity: 1, riddle: "Touch screen magic! 50 × 2 = ?", answers: ['100'], emoji: '📱', coins: 30 },
      { name: 'Headphones', price: 40, quantity: 1, riddle: "Listen to music! 20 + 20 = ?", answers: ['40'], emoji: '🎧', coins: 22 },
      { name: 'Calculator', price: 25, quantity: 2, riddle: "I help with math! 5 × 5 = ?", answers: ['25'], emoji: '🔢', coins: 18 }
    ],
    5: [
      { name: 'T-Shirt', price: 35, quantity: 2, riddle: "Wear me on top! 30 + 5 = ?", answers: ['35'], emoji: '👕', coins: 20 },
      { name: 'Shoes', price: 60, quantity: 1, riddle: "Walk in style! 6 × 10 = ?", answers: ['60'], emoji: '👟', coins: 25 },
      { name: 'Cap', price: 20, quantity: 3, riddle: "Wear me on your head! 10 + 10 = ?", answers: ['20'], emoji: '🧢', coins: 15 }
    ],
    10: [
      { name: 'Apples', price: 5, quantity: 2, riddle: "Fresh fruit! What's 5?", answers: ['5'], emoji: '🍎', coins: 10 },
      { name: 'Milk', price: 20, quantity: 2, riddle: "White and healthy! 10 + 10 = ?", answers: ['20'], emoji: '🥛', coins: 15 },
      { name: 'Bread', price: 15, quantity: 3, riddle: "Fresh and soft! 7 + 8 = ?", answers: ['15'], emoji: '🍞', coins: 12 },
      { name: 'Toys', price: 25, quantity: 1, riddle: "Fun to play! 5 × 5 = ?", answers: ['25'], emoji: '🎮', coins: 18 },
      { name: 'Chocolate', price: 12, quantity: 5, riddle: "Sweet treat! 6 × 2 = ?", answers: ['12'], emoji: '🍫', coins: 15 }
    ]
  };

  const FloatingEmoji = ({ emoji, delay = 0 }: { emoji: string; delay?: number }) => (
    <div 
      className="absolute animate-float opacity-20 pointer-events-none"
      style={{ 
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 80 + 10}%`,
        animationDelay: `${delay}s`,
        fontSize: '3rem'
      }}
    >
      {emoji}
    </div>
  );

  const SplashScreen = () => {
    useEffect(() => {
      const timer = setTimeout(() => {
        setScreen('story');
        playSound('success');
      }, 3000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center relative overflow-hidden">
        <style>{`
          @keyframes bounce-in {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.5); }
            50% { box-shadow: 0 0 40px rgba(255,255,255,0.8); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
          }
          .animate-bounce-in { animation: bounce-in 0.8s ease-out; }
          .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
          .animate-float { animation: float 3s ease-in-out infinite; }
        `}</style>
        
        <FloatingEmoji emoji="🎮" delay={0} />
        <FloatingEmoji emoji="🎯" delay={0.5} />
        <FloatingEmoji emoji="⭐" delay={1} />
        <FloatingEmoji emoji="🎨" delay={1.5} />
        <FloatingEmoji emoji="🏆" delay={2} />
        
        <div className="text-center animate-bounce-in">
          <div className="bg-white rounded-full p-8 mb-6 animate-pulse-glow inline-block">
            <ShoppingCart className="w-32 h-32 text-purple-600" />
          </div>
          <h1 className="text-7xl font-black text-white mb-4 drop-shadow-2xl">
            BRAINCART
          </h1>
          <p className="text-3xl text-white font-bold animate-pulse">Loading Fun...</p>
          <div className="flex gap-2 justify-center mt-6">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  };

  const PWAPromptBanner = () => {
    if (!showPWAPrompt || isInstalled) return null;

    return (
      <div className="fixed top-4 left-4 right-4 z-50 animate-bounce-in">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2">
                <ShoppingCart className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Install BrainCart!</p>
                <p className="text-white text-sm opacity-90">Play anytime, anywhere!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePWAInstall}
                className="bg-white text-purple-600 font-bold px-6 py-2 rounded-full hover:bg-purple-100 transition-all"
              >
                Install
              </button>
              <button
                onClick={() => setShowPWAPrompt(false)}
                className="bg-white bg-opacity-20 text-white font-bold px-4 py-2 rounded-full hover:bg-opacity-30 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StoryScreen = () => (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-blue-200 to-purple-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <FloatingEmoji emoji="☁️" delay={0} />
      <FloatingEmoji emoji="🌟" delay={1} />
      <FloatingEmoji emoji="🎈" delay={2} />
      
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative animate-bounce-in">
        <div className="absolute -top-6 -right-6 bg-yellow-400 rounded-full p-4 animate-pulse-glow">
          <Star className="w-12 h-12 text-white fill-white" />
        </div>
        
        <h1 className="text-5xl font-black text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          BRAINCART
        </h1>
        <h2 className="text-3xl font-bold text-center mb-6 text-orange-500 animate-pulse">
          Let's Play! 🎮
        </h2>
        
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6 border-4 border-yellow-300 relative">
          <Sparkles className="absolute top-2 right-2 w-6 h-6 text-yellow-500 animate-pulse" />
          
          <div className="mb-4 flex items-start gap-3 animate-float">
            <div className="text-5xl">👩</div>
            <div className="flex-1 bg-white rounded-2xl p-3 shadow">
              <p className="text-lg font-semibold text-gray-800">
                Hi Ali! We need to buy groceries for the house today! 🏠
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="text-5xl">👦</div>
            <div className="flex-1 bg-white rounded-2xl p-3 shadow">
              <p className="text-lg text-gray-700">
                I have the list! Help me solve riddles and find prices. Ready to be my Math Hero? 🦸
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setScreen('levels');
            playSound('success');
          }}
          className="w-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-white font-black py-5 px-6 rounded-full text-2xl hover:from-green-500 hover:to-teal-600 transform hover:scale-105 transition-all shadow-lg relative overflow-hidden group"
        >
          <span className="relative z-10">LET'S GO! 🚀</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
      </div>
    </div>
  );

  const LevelSelectScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-300 p-6 relative overflow-hidden">
      <FloatingEmoji emoji="🎯" delay={0} />
      <FloatingEmoji emoji="🏆" delay={1} />
      <FloatingEmoji emoji="⭐" delay={2} />
      
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute top-4 right-4 flex gap-3">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSound('click');
            }}
            className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-all"
          >
            {soundEnabled ? <Volume2 className="w-6 h-6 text-purple-600" /> : <VolumeX className="w-6 h-6 text-gray-400" />}
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 animate-bounce-in">
          <h2 className="text-4xl font-black text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            SELECT A LEVEL
          </h2>
          
          <div className="flex items-center justify-around mb-4">
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <span className="text-xl font-bold text-yellow-700">Score: {totalScore}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
              <Star className="w-6 h-6 text-blue-600 fill-blue-600" />
              <span className="text-xl font-bold text-blue-700">{stars} Stars</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
              <span className="text-2xl">🪙</span>
              <span className="text-xl font-bold text-orange-700">{coins}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
            <button
              key={level}
              onClick={() => {
                if (unlockedLevels.includes(level)) {
                  setCurrentLevel(level);
                  setScreen('shopSelect');
                  playSound('click');
                }
              }}
              disabled={!unlockedLevels.includes(level)}
              className={`aspect-square rounded-2xl text-4xl font-black shadow-xl transform transition-all relative group ${
                unlockedLevels.includes(level)
                  ? 'bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 hover:scale-110 cursor-pointer text-white animate-pulse-glow'
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'
              }`}
            >
              <span className="relative z-10">{level}</span>
              {unlockedLevels.includes(level) && (
                <>
                  <Star className="absolute top-1 right-1 w-8 h-8 text-yellow-300 fill-yellow-300 animate-pulse" />
                  {level === Math.max(...unlockedLevels) && (
                    <Sparkles className="absolute bottom-1 left-1 w-6 h-6 text-white animate-pulse" />
                  )}
                </>
              )}
              {!unlockedLevels.includes(level) && (
                <div className="absolute inset-0 flex items-center justify-center text-6xl">🔒</div>
              )}
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-center text-white shadow-xl">
          <p className="text-2xl font-bold mb-2">Your Progress 🎯</p>
          <p className="text-4xl font-black">Level {Math.max(...unlockedLevels)} / 10</p>
          {Math.max(...unlockedLevels) === 10 && (
            <p className="text-xl mt-2 animate-pulse">🏆 MARKET MASTER! 🏆</p>
          )}
        </div>
      </div>
    </div>
  );

  const ShopSelectScreen = () => {
    const availableShops = shops.filter(shop => shop.level === currentLevel);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-300 to-pink-400 p-6 relative overflow-hidden">
        <FloatingEmoji emoji="🏪" delay={0} />
        <FloatingEmoji emoji="🛍️" delay={1} />
        <FloatingEmoji emoji="🎁" delay={2} />
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 animate-bounce-in">
            <h2 className="text-4xl font-black text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SELECT SHOP 🏪
            </h2>
            <p className="text-center text-gray-600 mt-2 text-lg font-bold">Level {currentLevel}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            {availableShops.map((shop, idx) => (
              <button
                key={shop.id}
                onClick={() => {
                  setCurrentShop(shop.id);
                  setCart([]);
                  setScreen('shopping');
                  playSound('success');
                }}
                className={`bg-gradient-to-br ${shop.color} rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all relative overflow-hidden group animate-bounce-in`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="text-8xl mb-4 text-center animate-float">{shop.icon}</div>
                <h3 className="text-white font-black text-2xl text-center drop-shadow-lg relative z-10">
                  {shop.name}
                </h3>
                <Sparkles className="absolute top-4 right-4 w-8 h-8 text-white opacity-50 animate-pulse" />
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setScreen('levels');
              playSound('click');
            }}
            className="w-full bg-white bg-opacity-90 text-purple-600 font-black py-4 px-6 rounded-full hover:bg-opacity-100 transition-all shadow-lg text-xl"
          >
            ← Back to Levels
          </button>
        </div>
      </div>
    );
  };

  const ShoppingScreen = () => {
    const items = (currentShop && shopItems[currentShop as keyof typeof shopItems]) || [];
    const shop = shops.find(s => s.id === currentShop);

    return (
      <div className={`min-h-screen bg-gradient-to-br ${shop?.color} to-white p-6 relative overflow-hidden`}>
        {items.map((item: any, idx: number) => (
          <FloatingEmoji key={idx} emoji={item.emoji} delay={idx * 0.5} />
        ))}
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 animate-bounce-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-purple-600">{shop?.name}</h2>
                <p className="text-gray-600 font-bold">Level {currentLevel}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-orange-100 px-4 py-3 rounded-full shadow-lg">
                  <ShoppingCart className="w-7 h-7 text-orange-600" />
                  <span className="font-black text-xl text-orange-600">{cart.length}</span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-100 px-4 py-3 rounded-full shadow-lg">
                  <span className="text-2xl">🪙</span>
                  <span className="font-black text-xl text-yellow-700">{coins}</span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white mb-6 text-center drop-shadow-lg animate-pulse">
            🛒 SHOPPING LIST 🛒
          </h3>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            {items.map((item: any, idx: number) => {
              const inCart = cart.find((c: any) => c.name === item.name);
              return (
                <div 
                  key={idx} 
                  className={`bg-white rounded-3xl p-6 shadow-xl transform transition-all hover:scale-102 animate-bounce-in ${inCart ? 'ring-4 ring-green-400' : ''}`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-7xl animate-float">{item.emoji}</div>
                      <div>
                        <h4 className="text-2xl font-black text-gray-800">{item.name}</h4>
                        <p className="text-xl text-gray-600 font-bold">Quantity: x{item.quantity}</p>
                        {inCart && (
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-2xl font-black text-green-600">Rs: {item.price}</p>
                            <Check className="w-6 h-6 text-green-600" />
                          </div>
                        )}
                        {!inCart && (
                          <div className="flex items-center gap-2 mt-2 bg-yellow-100 px-3 py-1 rounded-full">
                            <span className="text-lg">🪙</span>
                            <span className="text-yellow-700 font-bold">+{item.coins}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!inCart) {
                          setCurrentItem(item);
                          setShowRiddle(true);
                          setRiddleAnswer('');
                          playSound('click');
                        }
                      }}
                      disabled={!!inCart}
                      className={`px-8 py-4 rounded-full font-black text-xl shadow-lg transform transition-all ${
                        inCart
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 hover:scale-110 animate-pulse-glow'
                      }`}
                    >
                      {inCart ? (
                        <div className="flex items-center gap-2">
                          <Check className="w-7 h-7" />
                          <span>Added!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>Add</span>
                          <ShoppingCart className="w-6 h-6" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                              );
            })}
          </div>

          <button
            onClick={() => {
              setScreen('shopSelect');
              playSound('click');
            }}
            className="w-full bg-white bg-opacity-90 text-purple-600 font-black py-4 px-6 rounded-full hover:bg-opacity-100 transition-all shadow-lg text-xl"
          >
            ← Back to Shops
          </button>
        </div>

        {/* Riddle Modal */}
        {showRiddle && currentItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-bounce-in">
              <h3 className="text-3xl font-black text-center mb-4 text-purple-600">
                Solve the Riddle 🤔
              </h3>
              <p className="text-lg text-gray-700 font-bold mb-6 text-center">
                {currentItem.riddle}
              </p>

              <input
                type="number"
                value={riddleAnswer}
                onChange={(e) => setRiddleAnswer(e.target.value)}
                placeholder="Your Answer"
                className="w-full border-4 border-purple-300 rounded-full px-6 py-4 text-xl text-center font-black mb-6 focus:outline-none focus:border-purple-500"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (currentItem.answers.includes(riddleAnswer.trim())) {
                      setCart([...cart, currentItem]);
                      setTotalScore(totalScore + 10);
                      setStars(stars + 1);
                      setCoins(coins + currentItem.coins);
                      playSound('success');
                    } else {
                      playSound('error');
                    }
                    setShowRiddle(false);
                    setCurrentItem(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black py-4 rounded-full text-xl hover:scale-105 transition-all"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setShowRiddle(false);
                    setCurrentItem(null);
                    playSound('click');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 font-black py-4 rounded-full text-xl hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const LevelCompleteScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center animate-bounce-in max-w-md w-full">
        <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-4xl font-black text-green-600 mb-4">
          Level Complete! 🎉
        </h2>
        <p className="text-xl font-bold text-gray-700 mb-6">
          Great job! You earned stars and coins.
        </p>

        <div className="flex justify-center gap-6 mb-6">
          <div className="bg-yellow-100 px-6 py-3 rounded-full font-black text-xl">
            ⭐ {stars}
          </div>
          <div className="bg-orange-100 px-6 py-3 rounded-full font-black text-xl">
            🪙 {coins}
          </div>
        </div>

        <button
          onClick={() => {
            const next = currentLevel + 1;
            if (!unlockedLevels.includes(next) && next <= 10) {
              setUnlockedLevels([...unlockedLevels, next]);
            }
            setScreen('levels');
            playSound('success');
          }}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-5 rounded-full text-2xl hover:scale-105 transition-all"
        >
          Continue 🚀
        </button>
      </div>
    </div>
  );

  return (
    <>
      <PWAPromptBanner />

      {screen === 'splash' && <SplashScreen />}
      {screen === 'story' && <StoryScreen />}
      {screen === 'levels' && <LevelSelectScreen />}
      {screen === 'shopSelect' && <ShopSelectScreen />}
      {screen === 'shopping' && <ShoppingScreen />}
      {screen === 'complete' && <LevelCompleteScreen />}
    </>
  );
};

export default App;

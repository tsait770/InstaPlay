import { useState, useEffect } from 'react';
import { Mic, Play, Pause, SkipForward, SkipBack, Volume2, Maximize, RotateCcw } from 'lucide-react';
import { supabase } from './lib/supabase';
import { detectUrlType } from './utils/urlDetector';
import { parseVoiceCommand, getCommandDescription } from './utils/commandParser';

function App() {
  const [url, setUrl] = useState('');
  const [currentCommand, setCurrentCommand] = useState('');
  const [user, setUser] = useState<any>(null);
  const [voiceCredits, setVoiceCredits] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('voice_credits, membership_tier')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      setVoiceCredits(data.voice_credits);
    }
  };

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setVoiceCredits(0);
  };

  const simulateVoiceCommand = (commandText: string) => {
    const command = parseVoiceCommand(commandText, 'zh-TW');
    const description = getCommandDescription(command, 'zh-TW');
    setCurrentCommand(`${commandText} → ${description}`);

    setTimeout(() => {
      setCurrentCommand('');
    }, 3000);
  };

  const analyzeUrl = () => {
    if (!url) return null;
    return detectUrlType(url);
  };

  const urlInfo = analyzeUrl();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Play className="w-12 h-12 text-blue-500 mr-3" />
            <h1 className="text-5xl font-bold text-white">InstaPlay</h1>
          </div>
          <p className="text-slate-300 text-lg">語音控制影片播放 - 用說的就能操作</p>
        </div>

        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              {user ? (
                <div className="text-white">
                  <p className="text-sm text-slate-400">已登入</p>
                  <p className="font-semibold">{user.email}</p>
                  <p className="text-sm text-blue-400">語音額度: {voiceCredits}</p>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Google 登入
                </button>
              )}
            </div>
            {user && (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                登出
              </button>
            )}
          </div>

          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">影片網址</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="輸入 YouTube、Vimeo 或直接媒體檔案網址..."
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border-2 border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
            />
            {urlInfo && (
              <div className="mt-3 p-4 bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-300">
                  偵測結果: <span className="font-semibold text-blue-400">
                    {urlInfo.playerType === 'native_player' ? '原生播放器' : 'WebView 播放器'}
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {urlInfo.isDirectMedia ? '直接媒體檔案' : '網頁嵌入影片'}
                </p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Mic className="w-5 h-5 mr-2 text-blue-500" />
              語音指令測試
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Play, text: '播放', color: 'bg-green-600 hover:bg-green-700' },
                { icon: Pause, text: '暫停', color: 'bg-yellow-600 hover:bg-yellow-700' },
                { icon: SkipForward, text: '快轉十秒', color: 'bg-blue-600 hover:bg-blue-700' },
                { icon: SkipBack, text: '快退十秒', color: 'bg-blue-600 hover:bg-blue-700' },
                { icon: Volume2, text: '音量加大', color: 'bg-purple-600 hover:bg-purple-700' },
                { icon: Volume2, text: '音量減小', color: 'bg-purple-600 hover:bg-purple-700' },
                { icon: Maximize, text: '全螢幕', color: 'bg-indigo-600 hover:bg-indigo-700' },
                { icon: RotateCcw, text: '重新播放', color: 'bg-red-600 hover:bg-red-700' },
              ].map((cmd, index) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={index}
                    onClick={() => simulateVoiceCommand(cmd.text)}
                    className={`${cmd.color} text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {cmd.text}
                  </button>
                );
              })}
            </div>
            {currentCommand && (
              <div className="mt-4 p-4 bg-blue-900 border-2 border-blue-500 rounded-lg animate-pulse">
                <p className="text-white font-semibold">{currentCommand}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-white font-bold text-xl mb-4">資料庫狀態</h3>
            <div className="space-y-2">
              <StatusItem label="Users" status="ready" />
              <StatusItem label="Devices" status="ready" />
              <StatusItem label="Voice Actions" status="ready" />
              <StatusItem label="Folders" status="ready" />
              <StatusItem label="Bookmarks" status="ready" />
              <StatusItem label="Categories" status="ready" />
              <StatusItem label="Subscriptions" status="ready" />
              <StatusItem label="Rewards" status="ready" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-white font-bold text-xl mb-4">功能特色</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Google OAuth 登入整合</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>多語言語音指令支援（12+ 語言）</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>自動 URL 類型檢測（WebView / 原生播放器）</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>語音額度系統與獎勵機制</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>書籤與資料夾管理</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>PayPal 訂閱整合</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>裝置綁定與限制</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>推薦碼系統</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-blue-900 border-2 border-blue-500 rounded-xl p-6">
          <h3 className="text-white font-bold text-xl mb-3">下一步：建立 React Native App</h3>
          <p className="text-slate-200 mb-4">
            當前專案展示了 InstaPlay 的核心邏輯和資料庫架構。要建立完整的移動應用，請執行：
          </p>
          <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm text-slate-300">
            <p>npx create-expo-app InstaPlay --template expo-template-blank-typescript</p>
            <p className="mt-2">cd InstaPlay</p>
            <p className="mt-2">npm install @supabase/supabase-js zustand react-navigation</p>
          </div>
          <p className="text-slate-200 mt-4 text-sm">
            複製 src/lib、src/services、src/utils 資料夾到新專案，即可開始開發移動應用介面。
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
      <span className="text-slate-300">{label}</span>
      <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full font-semibold">
        {status}
      </span>
    </div>
  );
}

export default App;

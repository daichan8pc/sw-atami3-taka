import React, { useState, useEffect, useRef } from 'react';
import { Map, Home, Search, Calendar, Heart, ArrowRight, User, Navigation, Sparkles, Settings, Zap, Coffee, Accessibility, Star, Clock, MapPin, ChevronLeft, Share2, Phone, X, CheckCircle, PenTool, History, Filter, Play, Pause, Camera, Flag, Footprints, Save, BookOpen, ChevronRight, Users, TrendingUp, ArrowUpDown, MessageCircle, Trophy, ThumbsUp, Send, Plus } from 'lucide-react';

// --- データ定義 ---

const FEED_ITEMS = [
  { id: 1, type: 'news', title: "【速報】熱海海上花火大会、今夜開催！", time: "1時間前", img: "🎆", bg: "bg-indigo-600", text: "text-white" },
  { id: 2, type: 'promo', title: "熱海プリン、季節限定「いちご」登場", time: "3時間前", img: "🍓", bg: "bg-rose-100", text: "text-rose-600" },
  { id: 3, type: 'info', title: "駅前足湯、清掃終了しました", time: "5時間前", img: "♨️", bg: "bg-sky-100", text: "text-sky-600" },
];

const SHOPS = [
  { id: 1, name: "熱海プリン", category: "sweets", area: "駅前・平和通り", wait: "15分", desc: "とろける食感の温泉プリン。", rating: 4.8, x: 180, y: 320, color: "bg-rose-400" },
  { id: 2, name: "まぐろや", category: "food", area: "銀座商店街", wait: "空席", desc: "新鮮な海鮮丼ランチ。", rating: 4.5, x: 240, y: 400, color: "bg-orange-400" },
  { id: 3, name: "カフェ藍花", category: "cafe", area: "駅前", wait: "混雑", desc: "自家焙煎珈琲と和スイーツ。", rating: 4.2, x: 140, y: 250, color: "bg-amber-600" },
  { id: 4, name: "来宮神社 茶寮", category: "sweets", area: "来宮", wait: "通常", desc: "大楠パワーを感じるカフェ。", rating: 4.6, x: 100, y: 450, color: "bg-emerald-500" },
  { id: 5, name: "熱海銀座食堂", category: "food", area: "銀座商店街", wait: "10分", desc: "レトロなアジフライ定食。", rating: 4.3, x: 230, y: 380, color: "bg-orange-500" },
];

const ROUTE_MODES = {
  DEFAULT: { id: 'default', label: "おすすめ", icon: <Sparkles size={18} />, color: "#0ea5e9", time: "18分", dist: "1.2km", desc: "バランスの良い標準ルート" },
  SWEETS: { id: 'sweets', label: "スイーツ", icon: <Coffee size={18} />, color: "#f43f5e", time: "35分", dist: "1.8km", desc: "話題の甘味処を経由します" },
  LIVELY: { id: 'lively', label: "賑わい", icon: <Users size={18} />, color: "#f59e0b", time: "22分", dist: "1.4km", desc: "人通りが多く明るい道" },
  SHORTEST: { id: 'shortest', label: "最短", icon: <Zap size={18} />, color: "#ef4444", time: "14分", dist: "0.9km", desc: "急な階段を含みます" }
};

const PERSONAS = {
  RELAX: { id: 'relax', name: "まったり癒やし派", color: "from-rose-400 to-orange-300", icon: "🍮", routeColor: "#fb7185", desc: "坂道を避け、甘いものと温泉を重視する傾向があります。" },
  ACTIVE: { id: 'active', name: "健脚アクティブ派", color: "from-emerald-400 to-cyan-400", icon: "👟", routeColor: "#34d399", desc: "絶景のためなら階段も厭わず、効率よく名所を回る傾向があります。" }
};

// --- 初期データ (自分の記録) ---
const INITIAL_MY_TRIPS = [
  {
    id: 999,
    title: "春の熱海 桜満喫ツアー",
    date: "2024/03/15",
    logs: [
      { id: 1, name: "熱海駅", time: "10:00", category: "station", memo: "到着！いい天気。", photo: null },
      { id: 2, name: "来宮神社 茶寮", time: "11:30", category: "sweets", memo: "大楠の迫力がすごい...", photo: "https://images.unsplash.com/photo-1579619639535-64539cc02243?auto=format&fit=crop&w=300&q=80" }
    ],
    // 地図上の手書き風メモ
    mapMemos: [
      { id: 1, x: 120, y: 280, text: "ここからの眺め最高！" },
      { id: 2, x: 260, y: 380, text: "坂道きつい..." }
    ],
    stats: { dist: 2.5, spots: 2, photos: 1, calories: 150, steps: 3500 },
    isPublished: false 
  }
];

// --- 初期データ (コミュニティ投稿) ---
const INITIAL_COMMUNITY_POSTS = [
  {
    id: 101,
    title: "おすすめ！外さない定番ルート",
    author: "定番マン",
    avatar: "🤠",
    date: "2025/11/29",
    likes: 128,
    isMyPost: false,
    pathType: "standard",
    comment: "初めて熱海に来るなら絶対これ。駅→商店街→サンビーチの黄金ルートです。",
    tags: ["初心者", "景色"],
    mapMemos: [
      { id: 1, x: 150, y: 230, text: "ここは絶対寄るべき" },
      { id: 2, x: 220, y: 420, text: "夕日が綺麗でした" }
    ]
  },
  {
    id: 102,
    title: "やっちまった！彼女バイバイルート",
    author: "デート失敗男",
    avatar: "😭",
    date: "2024/10/30",
    likes: 56,
    isMyPost: false,
    pathType: "hard",
    comment: "地図だけ見て近道だと思ったら、地獄の急階段でした...。ヒールで歩かせて激怒されました。",
    tags: ["失敗談", "階段注意"],
    mapMemos: [
      { id: 1, x: 160, y: 320, text: "道まちがえた！" },
      { id: 2, x: 200, y: 360, text: "ここ階段地獄..." },
      { id: 3, x: 240, y: 400, text: "疲れたと言われる" }
    ]
  }
];

export default function AtamiGoApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [viewMode, setViewMode] = useState('main'); // main, shop_detail, post_detail, my_trip_detail

  // --- ルート検索機能 ---
  const [searchState, setSearchState] = useState('idle'); 
  const [origin, setOrigin] = useState("熱海駅");
  const [destination, setDestination] = useState("");
  const [selectedRouteMode, setSelectedRouteMode] = useState('default'); 

  // --- 旅ログ・保存機能 ---
  const [history, setHistory] = useState([]); 
  const [myTrips, setMyTrips] = useState(INITIAL_MY_TRIPS); // 自分の旅 (Activity)
  const [communityPosts, setCommunityPosts] = useState(INITIAL_COMMUNITY_POSTS); // みんなの旅 (Community)
  
  const [viewingTrip, setViewingTrip] = useState(null); 
  const [showSaveModal, setShowSaveModal] = useState(false); 
  const [tripTitle, setTripTitle] = useState(""); 

  // --- マップメモ機能（編集用）---
  const [editingMemos, setEditingMemos] = useState([]);

  // --- ユーザーデータ ---
  const [userPoints, setUserPoints] = useState(850); 
  const [totalStats, setTotalStats] = useState({ dist: 12.5, calories: 850, steps: 15000 });

  const [reviews, setReviews] = useState({}); 
  const [reviewText, setReviewText] = useState(""); 
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [userPos, setUserPos] = useState({ x: 140, y: 250 });
  const [isTracking, setIsTracking] = useState(false);
  const [walkPath, setWalkPath] = useState([]);
  const [userPersona, setUserPersona] = useState(null);
  const [aiMode, setAiMode] = useState('idle');
  const simulationRef = useRef(null);

  // --- コミュニティ詳細表示のハンドラ ---
  const [selectedPost, setSelectedPost] = useState(null);

  // --- ロジック ---

  // マップをクリックしてメモを追加する機能
  const handleDetailMapClick = (e, isEditing = false) => {
    if (!isEditing) return; // 編集モードでなければ何もしない（今回は常に編集可とする簡易実装）

    // 画像上のクリック座標を取得
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // 画像内の相対X座標
    const y = e.clientY - rect.top;  // 画像内の相対Y座標

    // 簡易プロンプトで入力（本来はモーダルが良い）
    const text = window.prompt("この場所へのメモを入力してください（例：坂道きつい！）", "");
    if (text) {
      const newMemo = { id: Date.now(), x, y, text };
      
      // 表示中の投稿または旅データのメモを更新
      if (viewMode === 'post_detail' && selectedPost) {
        // コミュニティ投稿のメモ更新（ローカル表示のみ更新）
        setSelectedPost(prev => ({...prev, mapMemos: [...(prev.mapMemos || []), newMemo]}));
      } else if (viewMode === 'my_trip_detail' && viewingTrip) {
        // 自分の旅のメモ更新
        setViewingTrip(prev => ({...prev, mapMemos: [...(prev.mapMemos || []), newMemo]}));
        // 元データも更新（永続化のため）
        setMyTrips(prev => prev.map(t => t.id === viewingTrip.id ? {...t, mapMemos: [...(t.mapMemos || []), newMemo]} : t));
      }
    }
  };

  // 1. 旅の保存 (Activityへ)
  const handleSaveTrip = () => {
    if (!tripTitle) return;
    const stats = { 
      dist: Number((walkPath.length * 0.01).toFixed(2)), 
      spots: history.length, 
      photos: history.filter(h => h.photo).length, 
      calories: Math.floor(walkPath.length * 0.5), 
      steps: Math.floor(walkPath.length * 15) 
    };

    const newTrip = {
      id: Date.now(),
      title: tripTitle,
      date: new Date().toLocaleDateString(),
      logs: [...history],
      stats: stats,
      isPublished: false,
      mapMemos: [] // 新規保存時はメモなし
    };

    setMyTrips([newTrip, ...myTrips]);
    setTotalStats(prev => ({
      dist: prev.dist + stats.dist,
      calories: prev.calories + stats.calories,
      steps: prev.steps + stats.steps
    }));

    setHistory([]); setWalkPath([]); setIsTracking(false); setShowSaveModal(false); setTripTitle("");
    alert("旅の記録を保存しました！\n「足跡」タブで詳細にメモを追加できます。");
    setActiveTab('activity');
  };

  // 2. コミュニティへ投稿 (Activity -> Community)
  const handlePublishTrip = (trip) => {
    if(trip.isPublished) return;
    
    const newPost = {
      ...trip,
      id: Date.now() + 1, 
      author: "自分",
      avatar: "😎",
      likes: 0,
      isMyPost: true,
      pathType: "relax",
      comment: "楽しかった熱海の旅をシェアします！",
      tags: ["旅の記録"],
      mapMemos: trip.mapMemos || [] // メモも引き継ぐ
    };

    setCommunityPosts([newPost, ...communityPosts]);
    setMyTrips(prev => prev.map(t => t.id === trip.id ? { ...t, isPublished: true } : t));
    
    setUserPoints(prev => prev + 50);
    alert("コミュニティに公開しました！\nポイントGET！ (+50pt)");
    setViewMode('main');
    setActiveTab('community');
  };

  const handleLike = (postId) => {
    setCommunityPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  // --- 以下、既存の地図・GPSロジック ---
  const checkGeofence = (pos) => {
    SHOPS.forEach(shop => {
      const distance = Math.sqrt(Math.pow(shop.x - pos.x, 2) + Math.pow(shop.y - pos.y, 2));
      const THRESHOLD = 30; 
      if (distance < THRESHOLD) {
        setHistory(prev => {
          const lastVisit = prev[prev.length - 1];
          if (lastVisit && lastVisit.shopId === shop.id) return prev;
          const uniqueId = `${Date.now()}-${shop.id}-${Math.random().toString(36).substr(2, 9)}`;
          return [...prev, { id: uniqueId, shopId: shop.id, name: shop.name, category: shop.category, time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }), x: shop.x, y: shop.y, auto: true, memo: "", photo: null }];
        });
      }
    });
  };

  useEffect(() => {
    if (isTracking) {
      const targetPoints = [{ x: 140, y: 250 }, { x: 180, y: 320 }, { x: 220, y: 320 }, { x: 240, y: 400 }, { x: 100, y: 450 }];
      let currentTargetIndex = 0;
      let progress = 0;
      simulationRef.current = setInterval(() => {
        const start = targetPoints[currentTargetIndex];
        const end = targetPoints[(currentTargetIndex + 1) % targetPoints.length];
        progress += 0.02;
        if (progress > 1) { progress = 0; currentTargetIndex = (currentTargetIndex + 1) % targetPoints.length; }
        const nextX = start.x + (end.x - start.x) * progress;
        const nextY = start.y + (end.y - start.y) * progress;
        const newPos = { x: nextX, y: nextY };
        setUserPos(newPos);
        setWalkPath(prev => [...prev, newPos]);
        checkGeofence(newPos);
      }, 50);
    } else {
      clearInterval(simulationRef.current);
    }
    return () => clearInterval(simulationRef.current);
  }, [isTracking]);

  const handleRouteSearch = () => { if(!origin || !destination) return; setSearchState('routed'); setShowDetailPanel(true); };
  const resetRouteSearch = () => { setSearchState('idle'); setDestination(""); setSelectedRouteMode('default'); setShowDetailPanel(false); };
  const handleShopClick = (shop) => { setSelectedShop(shop); setShowDetailPanel(true); };
  const handleMapClick = () => { if (selectedShop) { setSelectedShop(null); setShowDetailPanel(searchState === 'routed'); } };
  const startDiagnosis = () => setAiMode('diagnosing');
  const selectPersona = (type) => { setAiMode('analyzing'); setTimeout(() => { setUserPersona(PERSONAS[type]); setAiMode('result'); setShowDetailPanel(true); }, 1500); };
  const closeAiRoute = () => { setAiMode('idle'); setUserPersona(null); setShowDetailPanel(false); };
  const filteredShops = SHOPS.filter(shop => {
    const categoryMatch = filterCategory === "all" || shop.category === filterCategory;
    const queryMatch = shop.name.includes(searchQuery) || shop.desc.includes(searchQuery);
    return categoryMatch && queryMatch;
  });

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-700 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-slate-200 app-font">
      
      {/* ヘッダー */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm transition-all duration-300">
        {viewMode !== 'main' ? (
          <div className="flex items-center gap-2 w-full">
            <button onClick={() => { setViewMode('main'); setViewingTrip(null); setSelectedPost(null); setSelectedShop(null); }} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition"><ChevronLeft size={24} className="text-slate-600" /></button>
            <span className="font-bold text-lg text-slate-800 line-clamp-1">
              {viewMode === 'my_trip_detail' ? '記録詳細' : viewMode === 'post_detail' ? '投稿詳細' : selectedShop?.name || '詳細'}
            </span>
          </div>
        ) : (
          <>
            <div className="font-black text-2xl text-sky-600 flex items-center gap-2 tracking-tight">
              <span className="text-3xl filter drop-shadow-sm">♨️</span> 
              <span style={{fontFamily: "'Fredoka One', cursive", letterSpacing: '-0.5px'}}>Atami-now</span>
            </div>
            
            {activeTab === 'map' && (
              <div className="flex items-center gap-2">
                <button onClick={() => setIsTracking(!isTracking)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm text-xs font-bold transition ${isTracking ? 'bg-orange-100 text-orange-600 border-orange-200 animate-pulse' : 'bg-white text-slate-500 border-slate-200'}`}>
                  {isTracking ? <><Pause size={12}/> 記録中</> : <><Play size={12}/> 記録する</>}
                </button>
              </div>
            )}
            {/* 記録中の保存ボタン */}
            {activeTab === 'activity' && history.length > 0 && !viewingTrip && (
              <button onClick={() => setShowSaveModal(true)} className="text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-md px-4 py-2 rounded-full flex items-center gap-2 transition">
                <Save size={14} /> 記録を終了
              </button>
            )}
          </>
        )}
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scroll pb-24 bg-slate-50">
        
        {/* === TAB 4: 足跡 (自分だけの記録) === */}
        {activeTab === 'activity' && (
          <div className="p-6 animate-fade-in">
            {viewMode === 'my_trip_detail' && viewingTrip ? (
              // 自分の過去の旅の詳細
              <div className="animate-slide-up">
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 leading-tight">{viewingTrip.title}</h2>
                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-1"><Calendar size={14}/> {viewingTrip.date}</p>
                  </div>
                  {!viewingTrip.isPublished ? (
                    <button onClick={() => handlePublishTrip(viewingTrip)} className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 transition">
                      <Send size={14}/> みんなに公開
                    </button>
                  ) : (
                    <span className="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">公開済み</span>
                  )}
                </div>

                {/* 詳細地図 (メモ機能付き) */}
                <div className="bg-white p-1 rounded-2xl shadow-md border border-slate-100 mb-6 overflow-hidden relative">
                  <div className="h-64 bg-slate-200 relative shrink-0 group">
                    {/* 背景画像 */}
                    <img 
                      src="https://t4.ftcdn.net/jpg/00/99/99/09/360_F_99990959_X9br1OL3yzzK1ExqUINpG5BARe2Jchuz.jpg" 
                      alt="Map" 
                      className="w-full h-full object-cover opacity-80" 
                      // クリックでメモを追加するためのイベント
                      onClick={(e) => handleDetailMapClick(e, true)}
                    />
                    
                    {/* 地図クリックのヒント（ホバー時など） */}
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full pointer-events-none">
                      タップしてメモを追加
                    </div>

                    <svg className="absolute inset-0 w-full h-full pointer-events-none filter drop-shadow-md z-0">
                      {/* ダミールート描画 */}
                      <path d="M140,250 Q200,300 240,400" fill="none" stroke="#0ea5e9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="animate-ants-line opacity-80" />
                      <circle cx="140" cy="250" r="6" fill="white" stroke="#3b82f6" strokeWidth="3" />
                      <circle cx="240" cy="400" r="6" fill="white" stroke="#ef4444" strokeWidth="3" />
                      
                      {/* メモ（吹き出し）の描画 */}
                      {viewingTrip.mapMemos && viewingTrip.mapMemos.map((memo, i) => (
                        <g key={i} transform={`translate(${memo.x}, ${memo.y})`}>
                          <circle r="6" fill="#f97316" stroke="white" strokeWidth="2" className="animate-bounce-short"/>
                          <g transform="translate(0, -10)">
                            {/* 吹き出しの背景 */}
                            <rect x="-60" y="-35" width="120" height="30" rx="8" fill="white" className="drop-shadow-lg" stroke="#f97316" strokeWidth="1"/>
                            {/* 三角（吹き出しの足） */}
                            <path d="M-5,-5 L0,5 L5,-5 Z" fill="white" stroke="#f97316" strokeWidth="0"/>
                            {/* テキスト */}
                            <text x="0" y="-17" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155" style={{fontFamily: "'Noto Sans JP', sans-serif"}}>{memo.text}</text>
                          </g>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* ログ一覧 */}
                <div className="space-y-0">
                  {viewingTrip.logs.map((log, i) => (
                    <div key={log.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 ${log.photo ? 'bg-orange-500 border-orange-200' : 'bg-slate-300 border-slate-100'} z-10`}></div>
                        {i !== viewingTrip.logs.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>}
                      </div>
                      <div className="flex-1 pb-8">
                        <span className="text-xs font-bold text-slate-400 block mb-1">{log.time}</span>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                          <h3 className="font-bold text-slate-700 mb-1">{log.name}</h3>
                          {log.memo && <p className="text-sm text-slate-500">{log.memo}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // 自分の一覧画面 (省略せず記述)
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Trophy className="text-yellow-500"/> マイデータ</h2>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                      <p className="text-[10px] text-slate-400 font-bold mb-1">総距離</p>
                      <p className="text-xl font-black text-slate-700">{totalStats.dist.toFixed(1)}<span className="text-xs font-normal ml-0.5">km</span></p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                      <p className="text-[10px] text-slate-400 font-bold mb-1">総カロリー</p>
                      <p className="text-xl font-black text-orange-500">{totalStats.calories}<span className="text-xs font-normal ml-0.5">kcal</span></p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm text-center">
                      <p className="text-[10px] text-slate-400 font-bold mb-1">旅の数</p>
                      <p className="text-xl font-black text-sky-500">{myTrips.length}<span className="text-xs font-normal ml-0.5">回</span></p>
                    </div>
                  </div>
                </div>

                {history.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><Footprints className="text-orange-500"/> 記録中</h2>
                    <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-xs font-bold text-orange-400 tracking-wider">RECORDING</span>
                        </div>
                        <span className="text-xs text-slate-400">{history.length} スポット</span>
                      </div>
                      <button onClick={() => {
                        setViewingTrip({
                          title: "現在の旅 (編集中)",
                          date: new Date().toLocaleDateString(),
                          logs: history,
                          stats: { dist: (walkPath.length * 0.01).toFixed(2), spots: history.length, photos: history.filter(h=>h.photo).length, calories: Math.floor(walkPath.length * 0.5), steps: Math.floor(walkPath.length * 15) },
                          isPublished: false
                        });
                        setViewMode('my_trip_detail');
                      }} className="w-full py-2 bg-white border border-orange-200 text-orange-600 rounded-xl text-sm font-bold hover:bg-orange-100 transition">
                        詳細・編集する
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><BookOpen className="text-sky-500"/> 過去の旅ログ</h2>
                  <div className="space-y-3">
                    {myTrips.map(trip => (
                      <div key={trip.id} onClick={() => { setViewingTrip(trip); setViewMode('my_trip_detail'); }} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition">📒</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-700 text-sm">{trip.title}</h3>
                          <div className="text-xs text-slate-400 mt-1 flex gap-3">
                            <span>{trip.date}</span>
                            {trip.isPublished && <span className="text-sky-500 font-bold flex items-center gap-0.5"><Users size={10}/> 公開済</span>}
                          </div>
                        </div>
                        <ChevronRight className="text-slate-300" size={20} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === TAB 5: コミュニティ (みんなの旅路) === */}
        {activeTab === 'community' && viewMode === 'main' && (
          <div className="p-5 animate-fade-in">
            {/* ポイントカード (省略せず記述) */}
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-5 rounded-2xl shadow-lg text-white mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-xs font-bold text-sky-100 mb-1">現在のポイント</p>
                  <div className="text-4xl font-black font-mono">{userPoints}<span className="text-sm font-bold ml-1">pt</span></div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-sky-100 mb-1">今月のいいね獲得</div>
                  <div className="bg-white/20 backdrop-blur px-4 py-1 rounded-full font-bold flex items-center gap-1"><ThumbsUp size={16}/> 124</div>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Users className="text-sky-500"/> みんなの旅路</h2>
            
            <div className="space-y-4">
              {communityPosts.map(post => (
                <div key={post.id} onClick={() => { setSelectedPost(post); setViewMode('post_detail'); }} className={`bg-white p-4 rounded-2xl shadow-sm border transition-all cursor-pointer hover:shadow-md active:scale-98 ${post.isMyPost ? 'border-l-4 border-l-orange-400 border-y-slate-100 border-r-slate-100' : 'border-slate-100'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-lg">{post.avatar}</div>
                      <div>
                        <div className="text-xs font-bold text-slate-500">{post.author}</div>
                        <div className="text-[10px] text-slate-400">{post.date}</div>
                      </div>
                    </div>
                    {post.isMyPost && <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">自分</span>}
                  </div>
                  
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{post.title}</h3>
                  <div className="flex gap-2 mb-3">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md">#{tag}</span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                      className="flex items-center gap-1 text-slate-400 text-xs hover:text-rose-500 transition"
                    >
                      <Heart size={14} className={post.likes > 0 ? "fill-rose-100 text-rose-500" : ""} /> {post.likes}
                    </button>
                    <span className="text-xs text-sky-500 font-bold flex items-center gap-1">詳細 <ChevronRight size={14}/></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === 投稿詳細ページ (地図つき・メモ表示) === */}
        {viewMode === 'post_detail' && selectedPost && (
          <div className="h-full flex flex-col bg-white animate-fade-in">
            <div className="h-64 bg-slate-200 relative shrink-0">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://t4.ftcdn.net/jpg/00/99/99/09/360_F_99990959_X9br1OL3yzzK1ExqUINpG5BARe2Jchuz.jpg" 
                  alt="Map" 
                  className="w-full h-full object-cover opacity-80" 
                  // 投稿詳細でも（もし自分なら）編集できるが、今回は閲覧のみとする
                  // onClick={(e) => handleDetailMapClick(e, selectedPost.isMyPost)}
                />
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none filter drop-shadow-md z-0">
                <path d={selectedPost.pathType === 'hard' ? "M140,250 L120,300 L160,350 L100,400 L240,400" : "M140,250 Q200,300 240,400"} fill="none" stroke={selectedPost.pathType === 'hard' ? "#ef4444" : "#0ea5e9"} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="animate-ants-line opacity-80" />
                <circle cx="140" cy="250" r="6" fill="white" stroke="#3b82f6" strokeWidth="3" /><circle cx="240" cy="400" r="6" fill="white" stroke="#ef4444" strokeWidth="3" />
                
                {/* 投稿のメモ（吹き出し）表示 */}
                {selectedPost.mapMemos && selectedPost.mapMemos.map((memo, i) => (
                  <g key={i} transform={`translate(${memo.x}, ${memo.y})`}>
                    <circle r="6" fill={selectedPost.pathType === 'hard' ? "#ef4444" : "#0ea5e9"} stroke="white" strokeWidth="2" className="animate-bounce-short"/>
                    <g transform="translate(0, -10)">
                      <rect x="-60" y="-35" width="120" height="30" rx="8" fill="white" className="drop-shadow-lg" stroke={selectedPost.pathType === 'hard' ? "#ef4444" : "#0ea5e9"} strokeWidth="1"/>
                      <path d="M-5,-5 L0,5 L5,-5 Z" fill="white" strokeWidth="0"/>
                      <text x="0" y="-17" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#334155" style={{fontFamily: "'Noto Sans JP', sans-serif"}}>{memo.text}</text>
                    </g>
                  </g>
                ))}
              </svg>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">{selectedPost.avatar}</div>
                <div><div className="font-bold text-slate-800">{selectedPost.author}</div><div className="text-xs text-slate-400">{selectedPost.date}</div></div>
                <button className="ml-auto bg-rose-50 text-rose-500 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-rose-100 transition"><Heart size={16} /> {selectedPost.likes}</button>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-3">{selectedPost.title}</h1>
              <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 leading-relaxed border border-slate-100 mb-6">{selectedPost.comment}</div>
              <h3 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2"><Footprints size={16}/> 立ち寄りスポット</h3>
              <div className="space-y-4 border-l-2 border-slate-100 pl-4 ml-2">
                {selectedPost.logs && selectedPost.logs.length > 0 ? selectedPost.logs.map((log, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                    <p className="text-xs text-slate-400 mb-1">{log.time}</p>
                    <p className="font-bold text-sm text-slate-700">{log.name}</p>
                  </div>
                )) : <p className="text-xs text-slate-400">ログデータなし</p>}
              </div>
            </div>
          </div>
        )}

        {/* ... 他のタブ (Home, Search, Map) は既存のまま ... */}
        {showSaveModal && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"><div className="bg-white rounded-2xl p-6 w-full shadow-2xl"><h2 className="text-xl font-bold text-slate-800 mb-2">旅を終了しますか？</h2><p className="text-sm text-slate-500 mb-6">この旅に名前を付けて保存しましょう。<br/>後で「足跡」タブから振り返れます。</p><div className="mb-6"><label className="text-xs font-bold text-slate-400 block mb-2">旅のタイトル</label><input type="text" placeholder="例: 週末熱海癒やし旅" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 font-bold text-slate-700" value={tripTitle} onChange={(e) => setTripTitle(e.target.value)} autoFocus /></div><div className="flex gap-3"><button onClick={() => setShowSaveModal(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50">キャンセル</button><button onClick={handleSaveTrip} disabled={!tripTitle} className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg ${tripTitle ? 'bg-sky-600 hover:bg-sky-700' : 'bg-slate-300'}`}>保存する</button></div></div></div>
        )}
        {viewMode === 'review_modal' && (<div className="absolute inset-0 z-50 bg-white p-6 animate-fade-in"><div className="mb-6 text-center"><div className="text-4xl mb-2">{selectedShop.category === 'sweets' ? '🍮' : '🐟'}</div><h2 className="font-bold text-xl">{selectedShop.name}</h2><p className="text-sm text-slate-400">あなたの体験を教えてください</p></div><textarea className="w-full h-40 p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none resize-none bg-slate-50 text-slate-700" placeholder="感想を入力..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} /><button onClick={handleSubmitReview} className={`w-full mt-6 py-4 rounded-xl text-white font-bold shadow-lg flex items-center justify-center gap-2 transition ${reviewText ? 'bg-sky-600 hover:bg-sky-700' : 'bg-slate-300 cursor-not-allowed'}`} disabled={!reviewText}><PenTool size={18} /> 投稿する</button></div>)}
        {viewMode === 'shop_detail' && selectedShop && (<div className="absolute inset-0 z-40 bg-white animate-fade-in overflow-y-auto pb-24"><div className="w-full h-64 bg-slate-200 relative"><div className="absolute inset-0 flex items-center justify-center text-6xl bg-slate-100 text-slate-300">{selectedShop.category === 'sweets' ? '🍮' : selectedShop.category === 'food' ? '🐟' : '☕'}</div><div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/70 to-transparent"></div><div className="absolute bottom-6 left-6 text-white"><div className="flex items-center gap-2 mb-2"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 backdrop-blur border border-white/30">{selectedShop.category.toUpperCase()}</span>{history.some(h => h.shopId === selectedShop.id) && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500 text-white flex items-center gap-1"><CheckCircle size={10} /> 訪問済み</span>}</div><div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}<span className="text-white ml-1">{selectedShop.rating}</span></div></div></div><div className="p-6 space-y-6"><div><h1 className="text-2xl font-bold text-slate-800 mb-2">{selectedShop.name}</h1><p className="text-slate-500 text-sm leading-relaxed">{selectedShop.desc}</p></div><div className="pt-4 border-t border-slate-100"><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800">みんなの口コミ</h3><button onClick={() => setViewMode('review_modal')} className="text-sm text-sky-600 font-bold hover:underline">投稿する</button></div><div className="space-y-4">{(reviews[selectedShop.id] || []).length > 0 ? (reviews[selectedShop.id].map((rev, i) => (<div key={i} className="bg-slate-50 p-4 rounded-xl"><div className="flex justify-between text-xs text-slate-400 mb-2"><span className="font-bold text-slate-600">{rev.user}</span><span>{rev.date}</span></div><p className="text-sm text-slate-700">{rev.text}</p></div>))) : (<p className="text-xs text-slate-400 text-center py-4">まだ口コミはありません。</p>)}</div></div></div></div>)}
        {activeTab === 'home' && ( <div className="p-5 space-y-8 animate-fade-in"><div className="w-full h-52 rounded-3xl bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 shadow-lg relative overflow-hidden flex items-end p-5 text-white"><div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/800x600/?japan,street,food')] bg-cover opacity-40 mix-blend-overlay"></div><div className="relative z-10"><h2 className="text-2xl font-bold">熱海銀座商店街<br/>食べ歩き完全ガイド</h2></div></div><div className="space-y-4">{FEED_ITEMS.map((item) => (<div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${item.bg} ${item.text}`}>{item.img}</div><div className="flex-1"><h4 className="font-bold text-sm text-slate-700">{item.title}</h4><p className="text-xs text-slate-400 mt-1">{item.time}</p></div></div>))}</div></div> )}
        {activeTab === 'search' && ( <div className="p-5 animate-fade-in flex flex-col h-full pb-20"><div className="mb-6 sticky top-0 bg-slate-50 pt-2 pb-2 z-10"><h2 className="font-bold text-xl mb-4 text-slate-800 tracking-tight">お店を探す</h2><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="店名やキーワードで検索..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none bg-white shadow-sm transition" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div><div className="flex gap-2 mt-4 overflow-x-auto hide-scroll pb-2"><button onClick={() => setFilterCategory('all')} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition whitespace-nowrap ${filterCategory === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}>すべて</button><button onClick={() => setFilterCategory('sweets')} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition whitespace-nowrap ${filterCategory === 'sweets' ? 'bg-rose-500 text-white' : 'bg-white text-slate-600'}`}>スイーツ</button><button onClick={() => setFilterCategory('food')} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition whitespace-nowrap ${filterCategory === 'food' ? 'bg-orange-500 text-white' : 'bg-white text-slate-600'}`}>食事</button></div></div><div className="space-y-4 overflow-y-auto pb-4">{filteredShops.length > 0 ? (filteredShops.map((shop) => (<div key={shop.id} onClick={() => { setActiveTab('map'); handleShopClick(shop); }} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-5 hover:shadow-md transition-all cursor-pointer group"><div className={`w-20 h-20 rounded-2xl shrink-0 flex items-center justify-center text-3xl shadow-inner ${shop.color} text-white`}>{shop.category === 'sweets' ? '🍮' : '🐟'}</div><div className="flex-1 py-1"><div className="flex justify-between items-start"><h3 className="font-bold text-slate-800 text-lg">{shop.name}</h3></div><p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1"><MapPin size={12} /> {shop.area}</p><p className="text-sm text-slate-600 mt-2 line-clamp-1">{shop.desc}</p></div></div>))) : (<div className="text-center py-10 text-slate-400"><Search size={48} className="mx-auto mb-4 opacity-20" /><p>条件に合うお店が見つかりませんでした</p></div>)}</div></div> )}
        {activeTab === 'map' && viewMode === 'main' && (
          <div className="h-full flex flex-col relative animate-fade-in">
            <div className="flex-1 bg-slate-200 relative overflow-hidden" onClick={handleMapClick}>
              <div className="absolute inset-0 z-0">
                <img src="https://t4.ftcdn.net/jpg/00/99/99/09/360_F_99990959_X9br1OL3yzzK1ExqUINpG5BARe2Jchuz.jpg" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"; }} alt="Map Background" className="w-full h-full object-cover filter brightness-110 saturate-50 opacity-80" style={{ objectPosition: '50% 60%' }} />
                <div className="absolute inset-0 bg-blue-50/20 mix-blend-multiply pointer-events-none"></div>
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none filter drop-shadow-md z-0">
                {searchState === 'routed' && (
                  <>
                    <path d={selectedRouteMode === 'default' ? "M140,250 Q200,300 240,400" : selectedRouteMode === 'sweets' ? "M140,250 Q100,350 180,320 T240,400" : selectedRouteMode === 'lively' ? "M140,250 Q220,300 230,380 T240,400" : "M140,250 L240,400"} fill="none" stroke={ROUTE_MODES[selectedRouteMode.toUpperCase()].color} strokeWidth="8" strokeLinecap="round" strokeDasharray={selectedRouteMode === 'shortest' ? "0" : "12 6"} className="animate-ants-line opacity-80" />
                    <circle cx="140" cy="250" r="8" fill="white" stroke="#3b82f6" strokeWidth="4" /><circle cx="240" cy="400" r="8" fill="white" stroke="#ef4444" strokeWidth="4" />
                  </>
                )}
                {walkPath.length > 1 && <path d={`M ${walkPath.map(p => `${p.x},${p.y}`).join(' L ')}`} fill="none" stroke="#f97316" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="opacity-90" />}
                <g style={{ transform: `translate(${userPos.x}px, ${userPos.y}px)` }} className="transition-all duration-75 ease-linear"><circle r="12" fill="#3b82f6" fillOpacity="0.2" className="animate-ping" /><circle r="6" fill="#3b82f6" stroke="white" strokeWidth="2" /></g>
              </svg>
              <div className="absolute inset-0 z-10">
                {SHOPS.map(shop => {
                  const isVisited = history.some(h => h.shopId === shop.id);
                  return (
                    <button key={shop.id} onClick={(e) => { e.stopPropagation(); handleShopClick(shop); }} className={`absolute w-12 h-12 -ml-6 -mt-12 transform transition-all duration-300 ${selectedShop?.id === shop.id ? 'scale-125 z-20' : 'scale-100 z-10 hover:scale-110'}`} style={{ left: shop.x, top: shop.y }}>
                       <div className={`w-full h-full rounded-full shadow-lg border-2 border-white flex items-center justify-center text-xl relative ${isVisited ? 'bg-orange-500 text-white' : (selectedShop?.id === shop.id ? 'bg-slate-800 text-white' : `${shop.color} text-white`)}`}>{isVisited ? <CheckCircle size={20} /> : (shop.category === 'sweets' ? '🍮' : shop.category === 'food' ? '🐟' : '☕')}
                         {selectedShop?.id === shop.id && <div className="absolute -bottom-1 w-2 h-2 bg-slate-800 rotate-45"></div>}
                       </div>
                    </button>
                  );
                })}
              </div>
              {searchState === 'idle' && !selectedShop && (<div className="absolute bottom-24 right-4 z-20"><button onClick={() => setSearchState('searching')} className="bg-white p-4 rounded-full shadow-xl text-sky-600 font-bold border border-sky-100 hover:scale-105 active:scale-95 transition flex items-center gap-2"><Navigation className="animate-pulse" /> <span className="text-xs">ルート検索</span></button></div>)}
            </div>
            <div className={`bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 transition-all duration-500 absolute bottom-0 left-0 right-0 ${showDetailPanel ? 'translate-y-0' : 'translate-y-[85%]'}`}>
              <div className="w-full flex justify-center pt-4 pb-2 cursor-pointer" onClick={() => setShowDetailPanel(!showDetailPanel)}><div className="w-14 h-1.5 bg-slate-200 rounded-full"></div></div>
              {selectedShop ? (
                <div className="p-6 pb-28">
                  <div className="flex gap-4">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-inner ${selectedShop.color} text-white shrink-0`}>{selectedShop.category === 'sweets' ? '🍮' : '🐟'}</div>
                    <div className="flex-1"><h2 className="font-bold text-xl text-slate-800 mb-1">{selectedShop.name}</h2><div className="flex items-center gap-1 text-yellow-400 text-sm font-bold mb-2"><Star size={14} fill="currentColor" /> <span className="text-slate-400 ml-1">{selectedShop.rating}</span></div>{history.some(h => h.shopId === selectedShop.id) && <span className="text-xs text-orange-500 font-bold">訪問済み</span>}</div>
                  </div>
                  <button onClick={() => setViewMode('shop_detail')} className="w-full mt-5 py-3.5 rounded-xl bg-slate-800 text-white font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition">詳細を見る <ArrowRight size={16} /></button>
                </div>
              ) : searchState === 'routed' ? (
                <div className="p-6 pb-28">
                  <div className="flex justify-between items-center mb-4">
                    <div><div className="text-xs text-slate-400 font-bold mb-1">到着予想</div><div className="flex items-end gap-2"><span className="text-3xl font-bold text-slate-800 leading-none">{ROUTE_MODES[selectedRouteMode.toUpperCase()].time}</span><span className="text-sm font-medium text-slate-500">{ROUTE_MODES[selectedRouteMode.toUpperCase()].dist}</span></div></div>
                    <button onClick={resetRouteSearch} className="text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">終了</button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-6">{Object.values(ROUTE_MODES).map((mode) => (<button key={mode.id} onClick={() => setSelectedRouteMode(mode.id)} className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${selectedRouteMode === mode.id ? `bg-slate-800 text-white border-slate-800 shadow-md transform scale-105` : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'}`}><div className={`mb-1 ${selectedRouteMode === mode.id ? 'text-white' : ''}`} style={{color: selectedRouteMode !== mode.id ? mode.color : undefined}}>{mode.icon}</div><span className="text-[10px] font-bold">{mode.label}</span></button>))}</div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4"><p className="text-sm text-slate-600 font-medium"><span className="block text-xs font-bold text-slate-400 mb-1 uppercase">Route Info</span>{ROUTE_MODES[selectedRouteMode.toUpperCase()].desc}</p></div>
                  <button className="w-full py-4 rounded-2xl bg-sky-600 text-white font-bold text-lg shadow-xl shadow-sky-200 flex items-center justify-center gap-3 active:scale-95 transition"><Navigation size={20} /> 案内スタート</button>
                </div>
              ) : (<div className="p-6 pb-28 text-center"><p className="text-slate-400 text-sm font-bold">地図上のピンをタップするか、<br/>ルート検索を試してみてください。</p></div>)}
            </div>
          </div>
        )}

      </main>

      {/* ボトムナビゲーション (5タブ構成に変更) */}
      <nav className="h-24 bg-white/90 backdrop-blur-lg border-t border-slate-100 flex justify-around items-start pt-4 px-2 fixed bottom-0 w-full max-w-md z-40 shadow-sm">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1.5 w-16 group ${activeTab === 'home' ? 'text-sky-500' : 'text-slate-400'}`}><Home size={24} /><span className="text-[10px] font-bold">ホーム</span></button>
        <button onClick={() => setActiveTab('search')} className={`flex flex-col items-center gap-1.5 w-16 group ${activeTab === 'search' ? 'text-sky-500' : 'text-slate-400'}`}><Search size={24} /><span className="text-[10px] font-bold">探す</span></button>
        <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center gap-1.5 w-16 group ${activeTab === 'map' ? 'text-sky-500' : 'text-slate-400'}`}><Map size={24} /><span className="text-[10px] font-bold">マップ</span></button>
        <button onClick={() => setActiveTab('activity')} className={`flex flex-col items-center gap-1.5 w-16 group ${activeTab === 'activity' ? 'text-sky-500' : 'text-slate-400'}`}><History size={24} /><span className="text-[10px] font-bold">足跡</span></button>
        <button onClick={() => setActiveTab('community')} className={`flex flex-col items-center gap-1.5 w-16 group ${activeTab === 'community' ? 'text-sky-500' : 'text-slate-400'}`}><Users size={24} /><span className="text-[10px] font-bold">みんな</span></button>
      </nav>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Fredoka+One&display=swap'); .app-font { font-family: 'Noto Sans JP', sans-serif; } @keyframes dash { to { stroke-dashoffset: -40; } } .animate-ants-line { animation: dash 1s linear infinite; } @keyframes fade-in { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } } .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.2, 1, 0.5, 1); } @keyframes bounce-short { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } } .animate-bounce-short { animation: bounce-short 0.5s ease-in-out infinite; } @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } } .custom-scroll::-webkit-scrollbar { display: none; } .hide-scroll::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useState, useEffect } from 'react';
import { useGameStore } from '../store';
import { 
  Users, Trophy, Play, Clock, Info, ListOrdered, 
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Box, Circle, Hexagon, Bot, Sparkles, Gem, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const UI = () => {
  const { connected, players, queue, activePlayer, turnEndTime, myId, join, joinQueue, gameOver } = useGameStore();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  const DISALLOW_LIST = new Set([
    'ASS', 'CUM', 'FAG', 'FUK', 'FUQ', 'GAY', 'JEW', 'JIZ', 'KKK', 'SEX', 'TIT', 'VAG', 'WAP', 'WTF', 'WTG', 'DIK', 'COK', 'FUC', 'FUX', 'NIG', 'NGR', 'BCH', 'BIT', 'HOE', 'SLT', 'CUN', 'KYS'
  ]);

  const handleJoin = () => {
    const finalName = name.toUpperCase();
    if (finalName.length !== 3) {
      setNameError('Name must be exactly 3 letters');
      return;
    }
    if (!/^[A-Z]{3}$/.test(finalName)) {
      setNameError('Name must contain only letters');
      return;
    }
    if (DISALLOW_LIST.has(finalName)) {
      setNameError('This name is not allowed');
      return;
    }
    setNameError('');
    join(finalName);
  };
  const [activeTab, setActiveTab] = useState<'play' | 'leaderboard' | 'legend'>('play');

  const me = players[myId || ''];
  const isActive = activePlayer === myId && myId !== null;
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touch);
    
    const timer = setTimeout(() => {
      if (!me && name === '') {
        const randomName = 'PLY' + Math.floor(Math.random() * 9);
        join(randomName);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [me, join, name]);

  const handleJoinQueue = () => {
    if (!me) {
      const randomName = 'PLY' + Math.floor(Math.random() * 9);
      join(randomName);
      setTimeout(() => joinQueue(), 100);
    } else {
      joinQueue();
    }
  };

  const triggerMobileMove = (dir: string, active: boolean) => {
    window.dispatchEvent(new CustomEvent('mobile_move', { detail: { dir, active } }));
  };

  const triggerDrop = () => {
    window.dispatchEvent(new CustomEvent('force_drop'));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (activePlayer && turnEndTime) {
        setTimeLeft(Math.max(0, Math.ceil((turnEndTime - Date.now()) / 1000)));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [activePlayer, turnEndTime]);

  if (!connected) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white font-sans z-[100]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-[#4285F4] border-t-transparent rounded-full animate-spin" />
          <p className="font-bold tracking-tight text-xl">Connecting to Arcade...</p>
        </motion.div>
      </div>
    );
  }

  if (!me) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-md z-50 p-4"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] max-w-md w-full border border-white/20 text-center"
        >
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100 italic font-black text-3xl text-[#4285F4]">
            G
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2 tracking-tighter">NEON CLAW</h1>
          <p className="text-gray-500 font-medium mb-8">Master the machine. Claim your prizes.</p>
          
          <div className="mb-8 group">
            <input 
              type="text" 
              placeholder="AAA" 
              className={`w-full bg-gray-50 text-gray-900 px-6 py-5 rounded-[1.5rem] focus:outline-none focus:ring-4 font-black text-center text-3xl uppercase tracking-[0.4em] border transition-all ${nameError ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-400 group-hover:border-gray-300'}`}
              value={name}
              onChange={e => {
                setName(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3));
                setNameError('');
              }}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              maxLength={3}
            />
            {nameError && <p className="text-red-500 text-xs font-bold mt-3 animate-pulse">{nameError}</p>}
          </div>

          <button 
            onClick={handleJoin}
            className="w-full bg-[#4285F4] text-white font-black py-5 rounded-[1.5rem] hover:bg-[#3367D6] hover:shadow-[0_20px_40px_rgba(66,133,244,0.3)] transition-all active:scale-[0.97] flex items-center justify-center gap-3 text-lg"
          >
            <Play size={24} fill="currentColor" /> GET STARTED
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none p-4 sm:p-8 flex flex-col justify-between font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2rem] p-4 sm:p-6 pointer-events-auto w-full sm:w-96 border border-white/50 flex justify-between items-center group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center font-black text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform">
              {me.name[0]}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tighter leading-none mb-1">NEON CLAW</h1>
              <div className="flex items-center gap-2 text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <Users size={12} className="text-[#4285F4]" /> {Object.keys(players).length} Players
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-black">{isActive ? 'Session' : 'All Time'}</div>
            <div className="text-3xl sm:text-4xl font-black text-[#34A853] leading-none tabular-nums">
              {isActive ? (me.currentScore || 0) : me.score}
            </div>
          </div>
        </motion.div>

        {/* Action Panel */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2rem] p-4 sm:p-6 w-full sm:w-96 pointer-events-auto border border-white/50 flex flex-col max-h-[50vh] sm:max-h-[calc(100vh-64px)] ${isActive && isTouch ? 'hidden sm:flex' : 'flex'}`}
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-4 bg-gray-100/30 p-1.5 rounded-[1.2rem] border border-gray-100">
            {[
              { id: 'play', icon: Play, label: 'Play', color: 'text-blue-500' },
              { id: 'leaderboard', icon: Trophy, label: 'Leaders', color: 'text-yellow-500' },
              { id: 'legend', icon: Info, label: 'Guide', color: 'text-green-500' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 text-[11px] sm:text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-white shadow-xl text-gray-900 scale-105' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}`}
              >
                <tab.icon size={14} className={activeTab === tab.id ? tab.color : ''} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 'leaderboard' && (
                <motion.div 
                  key="leaderboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2 sm:space-y-4"
                >
                  <div className="flex justify-between items-center px-1 mb-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Player</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Points</span>
                  </div>
                  {Object.values(players).sort((a: any, b: any) => b.score - a.score).slice(0, 10).map((p: any, i) => (
                    <div key={p.id} className={`flex justify-between items-center p-3 rounded-2xl transition-colors ${p.id === myId ? 'bg-blue-50/50 border border-blue-100' : 'hover:bg-gray-50/50'}`}>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-lg ${i < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                          {i+1}
                        </span>
                        <span className="font-black text-sm tracking-tight" style={{ color: p.id === myId ? '#4285F4' : p.color }}>
                          {p.name} {p.id === myId && <span className="text-[8px] sm:text-[9px] bg-[#4285F4] text-white px-2 py-0.5 rounded-full ml-2 font-black uppercase tracking-wider">You</span>}
                        </span>
                      </div>
                      <span className="font-black text-gray-900 tabular-nums">{p.score}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'play' && (
                <motion.div 
                  key="play"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col h-full gap-4"
                >
                  {activePlayer ? (
                    <div className="p-6 sm:p-8 bg-blue-50/30 rounded-[2rem] border border-blue-100/50 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Play size={120} />
                      </div>
                      <div className="text-[11px] text-blue-400 mb-1 font-black uppercase tracking-[0.2em] relative z-10">Live Turn</div>
                      <div className="font-black text-6xl sm:text-7xl text-[#4285F4] mb-3 tracking-tighter relative z-10 tabular-nums">{timeLeft}s</div>
                      <div className="text-xs sm:text-sm font-bold text-blue-600/60 mb-6 text-center relative z-10">Grab as many high-rarity items as possible!</div>
                      
                      {!isTouch && (
                        <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl text-[10px] font-black text-gray-400 border border-blue-50 shadow-sm flex items-center gap-3 relative z-10">
                          <span className="bg-gray-100 px-2 py-1 rounded-lg text-gray-600">WASD</span> MOVE
                          <span className="w-1 h-1 bg-gray-200 rounded-full" />
                          <span className="bg-gray-100 px-2 py-1 rounded-lg text-gray-600">SPACE</span> DROP
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-gray-50/30 rounded-[2rem] border border-gray-100">
                      <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-gray-50"
                      >
                        <Clock size={40} className="text-[#4285F4]" />
                      </motion.div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter">Ready for Glory?</h3>
                      <p className="text-sm text-gray-500 mb-8 font-medium max-w-[200px] mx-auto">Jump into the queue and secure the highest score on the board.</p>
                      <button 
                        onClick={handleJoinQueue}
                        className="w-full bg-[#4285F4] text-white font-black py-5 rounded-2xl hover:bg-[#3367D6] hover:shadow-[0_20px_40px_rgba(66,133,244,0.3)] transition-all active:scale-[0.97] flex items-center justify-center gap-3 text-lg"
                      >
                        <Play size={20} fill="currentColor" /> ENTER QUEUE
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'legend' && (
                <motion.div 
                  key="legend"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8 p-1 pb-4"
                >
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={16} className="text-yellow-500" />
                      <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Rarity Multipliers</h2>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-yellow-50/50 border border-yellow-100">
                        <div className="flex items-center gap-3 font-black text-sm text-yellow-700">
                          <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-white shadow-lg animate-pulse">
                            <Gem size={20} />
                          </div>
                          Epic
                        </div>
                        <span className="font-black text-yellow-600 bg-white px-3 py-1 rounded-lg shadow-sm">x5</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-200">
                        <div className="flex items-center gap-3 font-black text-sm text-slate-700">
                          <div className="w-10 h-10 rounded-xl bg-slate-400 flex items-center justify-center text-white shadow-lg">
                            <Sparkles size={20} />
                          </div>
                          Rare
                        </div>
                        <span className="font-black text-slate-600 bg-white px-3 py-1 rounded-lg shadow-sm">x2</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                        <div className="flex items-center gap-3 font-black text-sm text-gray-700">
                          <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500">
                            <Layers size={20} />
                          </div>
                          Common
                        </div>
                        <span className="font-black text-gray-500 bg-white px-3 py-1 rounded-lg shadow-sm">x1</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <ListOrdered size={16} className="text-blue-500" />
                      <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Prizes & Shapes</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Bot, name: 'Droid', val: '100 pts', color: 'bg-green-50 text-green-600 border-green-100' },
                        { icon: Hexagon, name: 'Dodeca', val: 'x3 Multi', color: 'bg-purple-50 text-purple-600 border-purple-100' },
                        { icon: Circle, name: 'Sphere', val: 'x2 Multi', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                        { icon: Box, name: 'Box', val: 'x1 Multi', color: 'bg-orange-50 text-orange-600 border-orange-100' }
                      ].map(item => (
                        <div key={item.name} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center ${item.color}`}>
                          <item.icon size={24} />
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-wider opacity-60 leading-tight">{item.name}</div>
                            <div className="text-xs font-black leading-tight">{item.val}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Mobile Controls Overlay */}
      <AnimatePresence>
        {isActive && isTouch && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="pointer-events-none fixed bottom-0 left-0 right-0 h-[45vh] flex justify-between items-end p-8 sm:p-12 gap-6 z-50 overflow-visible"
          >
            {/* D-Pad */}
            <div className="pointer-events-auto relative w-56 h-56 bg-white/20 backdrop-blur-2xl rounded-full border-4 border-white/40 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden active:scale-95 transition-transform touch-none select-none">
              <div className="grid grid-cols-3 grid-rows-3 gap-3 p-4 w-full h-full">
                <div />
                <button 
                  className="bg-white/90 rounded-[1.5rem] flex items-center justify-center active:bg-[#4285F4] active:text-white transition-all shadow-xl group select-none touch-none active:scale-90"
                  onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); triggerMobileMove('up', true); }}
                  onPointerUp={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); triggerMobileMove('up', false); }}
                  onPointerCancel={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); triggerMobileMove('up', false); }}
                >
                  <ChevronUp size={44} className="group-active:scale-125 transition-transform" />
                </button>
                <div />
                <button 
                  className="bg-white/90 rounded-[1.5rem] flex items-center justify-center active:bg-[#4285F4] active:text-white transition-all shadow-xl group select-none touch-none active:scale-90"
                  onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); triggerMobileMove('left', true); }}
                  onPointerUp={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); triggerMobileMove('left', false); }}
                  onPointerCancel={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); triggerMobileMove('left', false); }}
                >
                  <ChevronLeft size={44} className="group-active:scale-125 transition-transform" />
                </button>
                <div className="bg-white/30 rounded-2xl flex items-center justify-center border border-white/20">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-5 h-5 bg-[#4285F4] rounded-full shadow-[0_0_15px_rgba(66,133,244,0.5)]" 
                  />
                </div>
                <button 
                  className="bg-white/90 rounded-[1.5rem] flex items-center justify-center active:bg-[#4285F4] active:text-white transition-all shadow-xl group select-none touch-none active:scale-90"
                  onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); triggerMobileMove('right', true); }}
                  onPointerUp={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); triggerMobileMove('right', false); }}
                  onPointerCancel={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); triggerMobileMove('right', false); }}
                >
                  <ChevronRight size={44} className="group-active:scale-125 transition-transform" />
                </button>
                <div />
                <button 
                  className="bg-white/90 rounded-[1.5rem] flex items-center justify-center active:bg-[#4285F4] active:text-white transition-all shadow-xl group select-none touch-none active:scale-90"
                  onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); triggerMobileMove('down', true); }}
                  onPointerUp={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); triggerMobileMove('down', false); }}
                  onPointerCancel={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); triggerMobileMove('down', false); }}
                >
                  <ChevronDown size={44} className="group-active:scale-125 transition-transform" />
                </button>
                <div />
              </div>
            </div>

            {/* Action Button */}
            <div className="pointer-events-auto flex flex-col items-center gap-6">
               <motion.div 
                 animate={{ scale: timeLeft < 10 ? [1, 1.1, 1] : 1 }}
                 transition={{ repeat: timeLeft < 10 ? Infinity : 0, duration: 0.5 }}
                 className={`bg-white/90 backdrop-blur-md px-8 py-4 rounded-[2rem] font-black text-3xl shadow-2xl border-2 tabular-nums transition-colors ${timeLeft < 10 ? 'text-[#EA4335] border-[#EA4335]/20 animate-pulse' : 'text-[#4285F4] border-white/20'}`}
               >
                 {timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
               </motion.div>
               <button 
                onClick={triggerDrop}
                className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-[#EA4335] to-[#D62516] text-white rounded-full flex items-center justify-center font-black text-2xl tracking-tighter shadow-[0_32px_64px_-12px_rgba(234,67,53,0.5)] active:scale-[0.85] transition-all border-8 border-white/30 active:border-white/10 select-none touch-none"
              >
                DROP
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-xl pointer-events-auto p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.4)] max-w-md w-full text-center border border-white/20 overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-red-400 to-green-400" />
              <h2 className="text-6xl font-black mb-2 text-gray-900 tracking-tighter">
                FINISH!
              </h2>
              <p className="text-xl text-gray-500 mb-8 font-black uppercase tracking-widest bg-gray-50 py-3 rounded-2xl">
                SCORE: <span className="text-[#34A853] text-3xl ml-1">{gameOver.winner?.currentScore || 0}</span>
              </p>
              
              <div className="space-y-3 mb-10 text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-2">Final Standings</p>
                {gameOver.players.slice(0, 5).map((p: any, i: number) => (
                  <div key={p.id} className={`flex justify-between items-center p-3.5 rounded-[1.2rem] transition-all ${p.id === myId ? 'bg-blue-50 border border-blue-100 scale-105 shadow-sm' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-black w-7 h-7 flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 ${i === 0 ? 'text-yellow-500' : 'text-gray-400'}`}>
                        {i === 0 ? <Trophy size={14} fill="currentColor" /> : i + 1}
                      </span> 
                      <span className="font-black text-sm tracking-tight text-gray-800">
                        {p.name} {p.id === myId ? <span className="text-[8px] uppercase font-black bg-blue-500 px-2 py-0.5 rounded-full text-white ml-2">YOU</span> : ''}
                      </span>
                    </div>
                    <span className="text-gray-900 font-extrabold tabular-nums">{p.score}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => useGameStore.setState({ gameOver: null })}
                className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-black transition-all active:scale-[0.97] shadow-2xl"
              >
                BACK TO ARCADE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

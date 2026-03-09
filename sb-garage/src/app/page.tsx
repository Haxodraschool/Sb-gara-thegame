'use client';

import { useEffect } from "react";
import { useGameStore } from "@/stores/useGameStore";
import { LoginScreen } from "@/components";

export default function Home() {
  const currentScreen = useGameStore((state) => state.currentScreen);
  const user = useGameStore((state) => state.user);
  const logout = useGameStore((state) => state.logout);
  const initializeStore = useGameStore((state) => state.initializeStore);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      {currentScreen === 'login' && <LoginScreen />}
      
      {currentScreen === 'lobby' && (
        <div style={{ padding: '2rem', color: 'white' }}>
          <h1>Sảnh Chờ (Lobby)</h1>
          <p>Chào mừng, {user?.username}!</p>
          <p>Level: {user?.level} | Ngày: {user?.currentDay}</p>
          <button 
            onClick={logout}
            style={{ padding: '0.5rem 1rem', marginTop: '1rem', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Đăng xuất
          </button>
        </div>
      )}

      {/* Các màn hình khác sẽ gắn vào đây ở các công đoạn sau */}
    </main>
  );
}

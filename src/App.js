import React, { useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import "./App.css";

function App() {
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);
  const [userId, setUserId] = useState(null);

  // 사용자 ID 생성 또는 로드
  React.useEffect(() => {
    let storedUserId = localStorage.getItem('chatkit_user_id');
    if (!storedUserId) {
      storedUserId = `user_${Math.random().toString(36).substr(2, 8)}`;
      localStorage.setItem('chatkit_user_id', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // 설정을 window에서 로드
  React.useEffect(() => {
    if (window.CHATKIT_CONFIG) {
      setConfig(window.CHATKIT_CONFIG);
    }
  }, []);

  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        try {
          if (existing) {
            // 기존 세션이 있으면 세션 갱신 로직 구현 가능
            console.log("ChatKit: Session refresh not implemented, creating new session");
          }
          
          console.log("ChatKit: Requesting client secret...");
          const res = await fetch('/api/chatkit/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const { client_secret } = await res.json();
          console.log("ChatKit: Client secret received successfully");
          setError(null);
          return client_secret;
        } catch (err) {
          console.error("ChatKit: Error getting client secret:", err);
          setError(err.message);
          throw err;
        }
      },
    },
    ...config,
  });

  return (
    <div className="app-container">
      <div className="chatkit-container">
        <ChatKit control={control} className="chatkit" />
      </div>
      <div className="copyright">
        <strong><a href="https://openai-agent.aicastle.school" target="_blank" rel="noopener noreferrer">OpenAI Agent School</a></strong>
        {' | Copyright © '}
        <a href="https://aicastle.com" target="_blank" rel="noopener noreferrer">(주) 에이아이캐슬</a>
      </div>
    </div>
  );
}

export default App;

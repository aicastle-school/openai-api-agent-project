import React, { useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";

function App() {
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);

  // 설정을 서버에서 로드
  React.useEffect(() => {
    fetch("/api/chatkit/config")
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Config load error:", err));
  }, []);

  const { control } = useChatKit({
    api: {
      async getClientSecret() {
        try {
          console.log("ChatKit: Requesting client secret...");
          
          const res = await fetch("/api/chatkit/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device_id: "user123" }),
          });
          
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const data = await res.json();
          console.log("ChatKit: Client secret received successfully");
          setError(null);
          
          return data.client_secret;
        } catch (err) {
          console.error("ChatKit: Error getting client secret:", err);
          setError(err.message);
          throw err;
        }
      },
    },
    startScreen: {
      greeting: config?.greeting || "안녕하세요! 무엇을 도와드릴까요?",
    },
    composer: {
      placeholder: config?.placeholder || "궁금한 것이 있으면 여기에 메시지를 입력하세요...",
      attachments: {
        enabled: true,
        maxSize: 10 * 1024 * 1024, // 10MB
        maxCount: 1, 
        accept: {
          "image/*": [".png", ".jpg", ".jpeg"]
        }
      },
    },
  });

  // 설정 로딩 중이면 로딩 화면 표시
  if (!config) {
    return (
      <div style={{ 
        position: "fixed", 
        top: "50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)",
        padding: "20px", 
        fontSize: "18px"
      }}>
        ChatKit 설정 로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        position: "fixed", 
        top: "50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)",
        padding: "20px", 
        backgroundColor: "#fee", 
        border: "1px solid #f88", 
        borderRadius: "8px" 
      }}>
        <h3 style={{ color: "#c33" }}>ChatKit 에러:</h3>
        <p style={{ color: "#c33" }}>{error}</p>
      </div>
    );
  }

  return (
    <ChatKit control={control} style={{ height: "100vh", width: "100vw" }} />
  );
}

export default App;

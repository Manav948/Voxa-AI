import React, { useState, useEffect, useMemo } from "react";
import useVoice from "../hooks/useVoice.js";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [assistantName, setAssistantName] = useState("");
  const [assistantAvatar, setAssistantAvatar] = useState("");

  // Load assistant prefs
  useEffect(() => {
    const name = localStorage.getItem("assistantName");
    const avatar = localStorage.getItem("assistantAvatar");
    if (name && avatar) {
      setAssistantName(name);
      setAssistantAvatar(avatar);
      return;
    }
    if (user && user.assistantName && user.assistantAvatar) {
      setAssistantName(user.assistantName);
      setAssistantAvatar(user.assistantAvatar);
      localStorage.setItem("assistantName", user.assistantName);
      localStorage.setItem("assistantAvatar", user.assistantAvatar);
    }
  }, [user]);

  // derive wake word
  const wakeWord = useMemo(
    () => (assistantName ? assistantName.toLowerCase() : "assistant"),
    [assistantName]
  );
  const { isListening, command, speak } = useVoice(wakeWord);

  // send command to backend (only once)
  useEffect(() => {
    if (!command) return;
    const sendCommand = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8001/api/user/ask",
          { command },
          { withCredentials: true }
        );
        const data = res.data;
        speak(data.response);
        if (data.url && typeof data.url === "string" && data.url.startsWith("http")) {
          window.open(data.url, "_blank", "noopener,noreferrer");
        }
      } catch (err) {
        console.error("Assistant error:", err);
        speak("Sorry, something went wrong.");
      }
    };
    sendCommand();
  }, [command, speak]);

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(125%_125%_at_50%_10%,#0f0c29_30%,#1a1a2e_70%,#000000_100%)]"></div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[length:24px_24px]"></div>

      {/* Main Dashboard Card */}
      <div className="glass-card p-12 rounded-[2.5rem] flex flex-col items-center max-w-2xl w-full relative group">
        {/* Status Indicator */}
        <div className="absolute top-6 right-8 flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${isListening ? "bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" : "bg-gray-600"}`}></div>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            {isListening ? "System Active" : "Standby"}
          </span>
        </div>

        <h1 className="text-5xl font-black text-gradient mb-2 text-center tracking-tighter">
          Voxa AI
        </h1>
        <p className="text-gray-400 mb-10 text-sm font-medium tracking-wide uppercase">
          Your Personal Audio Interface
        </p>

        {/* Avatar Section with Pulse */}
        <div className={`relative h-56 w-56 rounded-full p-1 transition-all duration-500 ${isListening ? "voice-pulse scale-105" : "scale-100"}`}>
          <div className="absolute inset-0 rounded-full border border-white/10"></div>
          <div className="rainbow-ring absolute inset-0 rounded-full group-hover:opacity-100 opacity-50 transition-opacity"></div>
          
          <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-white/5 shadow-2xl">
            {assistantAvatar ? (
              <img
                src={assistantAvatar}
                alt="Voxa Assistant"
                className={`h-full w-full object-cover transition-transform duration-700 ${isListening ? "scale-110 rotate-3" : "scale-100"}`}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-500">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold bg-white bg-clip-text text-transparent">
            {assistantName || "Voxa Assistant"}
          </h2>
          <p className="text-cyan-400/80 text-sm mt-3 font-medium flex items-center justify-center gap-2">
            {isListening ? (
              <span className="flex items-center gap-2">
                <span className="animate-bounce">●</span> Listening for "{wakeWord}"
              </span>
            ) : (
              `Say "${wakeWord}" to activate`
            )}
          </p>
        </div>

        {/* Action Tips */}
        <div className="mt-10 grid grid-cols-2 gap-4 w-full">
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center">
            <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Capabilities</p>
            <p className="text-xs text-gray-300">Natural Voice Chat</p>
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center">
            <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Response</p>
            <p className="text-xs text-gray-300">Ultra-Low Latency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

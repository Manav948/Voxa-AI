import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen w-full bg-black">
          <App />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              className: "glass-card text-white border-white/10",
              style: {
                background: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(12px)",
                color: "#fff",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              },
            }}
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

"use client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from '@/contexts/UserContext';
import ChatPage from "./chat/page";
import HistoryPage from "./history/page";
import RequestPage from "./request/page";
import TicketsPage from "./tickets/page";
import { Redirect } from "next";
import ConversationsPageAttendant from "./attendant-chat/page";

function App() {
  
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/request" element={<RequestPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/attendant-chat" element={<ConversationsPageAttendant />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
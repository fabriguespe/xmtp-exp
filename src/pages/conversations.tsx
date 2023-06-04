import React from "react";
import BottomNav from "../components/BottomNav";
import Link from "next/link";
import styles from "./Conversations.module.css";

// Mock data
const conversations = [
  {
    id: 1,
    title: "Conversation 1",
    lastMessage: "Hello there!",
    unreadCount: 2,
  },
  { id: 2, title: "fabri.lens", lastMessage: "What's up?", unreadCount: 0 },
  {
    id: 3,
    title: "0x937C0d4a6294cdfa575de17382c7076b579DC176",
    lastMessage: "Bye!",
    unreadCount: 1,
  },
  // Add more conversations as needed
];
export default function Conversations() {
  return (
    <div>
      <div className={styles.conversations}>
        <h1>Conversations</h1>
        {conversations.map((conversation) => (
          <ConversationBox
            key={conversation.id}
            id={conversation.id}
            name={conversation.title}
            secondaryText="Last Message..."
            href={`/chat/${conversation.id}`}
          />
        ))}
      </div>
      <BottomNav />
    </div>
  );
}

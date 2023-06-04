// Contacts.tsx

import React from "react";
import BottomNav from "../components/BottomNav";
import Link from "next/link";
import ConversationBox from "../components/ConversationBox";
import styles from "./Contacts.module.css";

const contacts = [
  {
    id: 1,
    name: "John Doe",
    wallet: "0x937C0d4a6294cdfa575de17382c7076b579DC176",
  },
  {
    id: 2,
    name: "Jane Smith",
    wallet: "0x937C0d4a6294cdfa575de17382c7076b579DC176",
  },
  {
    id: 3,
    name: "James Brown",
    wallet: "0x937C0d4a6294cdfa575de17382c7076b579DC176",
  },
  // add as many contacts as needed
];

export default function Contacts() {
  return (
    <div>
      <div className={styles.contacts}>
        <h1>Contacts</h1>
        {contacts.map((contact) => (
          <ConversationBox
            key={contact.id}
            id={contact.id}
            name={contact.name}
            secondaryText={contact.wallet}
            href={`/chat/${contact.id}`}
          />
        ))}
      </div>
      <BottomNav />
    </div>
  );
}

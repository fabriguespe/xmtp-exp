import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import styles from "./BottomNav.module.css";

function BottomNav() {
  const router = useRouter();

  return (
    <div className={styles.bottomNav}>
      <Link
        href="/contacts"
        className={router.pathname === "/contacts" ? styles.active : ""}>
        <span role="img" aria-label="contacts">
          👥
        </span>
      </Link>
      <Link
        href="/conversations"
        className={router.pathname === "/conversations" ? styles.active : ""}>
        <span role="img" aria-label="messages">
          ✉️
        </span>
      </Link>
      <Link
        href="/chat"
        className={router.pathname === "/chat" ? styles.active : ""}>
        <span role="img" aria-label="chat">
          💬
        </span>
      </Link>
      <Link
        href="/settings"
        className={router.pathname === "/settings" ? styles.active : ""}>
        <span role="img" aria-label="settings">
          ⚙️
        </span>
      </Link>
    </div>
  );
}

export default BottomNav;

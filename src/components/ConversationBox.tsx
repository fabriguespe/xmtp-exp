// ConversationBox.tsx

import React from "react";
import Link from "next/link";
import styles from "../styles/ConversationBox.module.css";

const ConversationBox = ({ id, name, secondaryText, href }) => {
  return (
    <Link key={id} href={href}>
      <div className={styles.box}>
        <div>
          <div className={styles.name}>{name}</div>
          <div className={styles.secondary}>{secondaryText}</div>
        </div>
      </div>
    </Link>
  );
};

export default ConversationBox;

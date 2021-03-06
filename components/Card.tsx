import React from "react";
import styles from "../styles/Card.module.css";

export const Card: React.FC = ({ children }) => {
  return (
    <div className={styles.card}>
      <div className={styles.container}>{children}</div>
    </div>
  );
};

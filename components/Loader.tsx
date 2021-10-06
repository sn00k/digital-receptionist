import React from "react";
import styles from "../styles/Loader.module.css";

type LoaderProps = {
  show: boolean;
};

export const Loader: React.FC<LoaderProps> = ({ show }) => {
  return show ? <div className={styles.loader}></div> : null;
};

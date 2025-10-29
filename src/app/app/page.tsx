"use client";
import dynamic from "next/dynamic";
import styles from "./page.module.scss";

const Map = dynamic(() => import("@/components/Map/Map"), { ssr: false });

export default function App() {
  return (
    <div className={styles.page}>
      <Map />
    </div>
  );
}

import Image from "next/image";
import { Minesweeper } from "@/components/Minesweeper";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <Minesweeper />
    </main>
  );
}

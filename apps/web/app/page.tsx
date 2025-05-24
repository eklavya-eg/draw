"use client"

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";


export default function Home() {
  const [slug, setSlug] = useState("");
  const router = useRouter();
  return (
    <div>
      <div className={styles.page}>
        <input value={slug} type="text" placeholder="slug" onChange={(e) => {
          setSlug(e.target.value)
        }}></input>
        <button onClick={() => {
          router.push(`/room/${slug}`)
        }}>
          Join Room
        </button>
      </div>
    </div>
  )
}

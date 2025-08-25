import Image from "next/image";
import styles from "./page.module.css";
import { Button, Typography } from "@mui/material";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Typography variant="h1">Hello World</Typography>
        <Button variant="contained">Get Started</Button>
      </main>
      <footer className={styles.footer}>
        <Typography variant="body1">&copy; {new Date().getFullYear()} MovieWeb</Typography>
      </footer>
    </div>
  );
}

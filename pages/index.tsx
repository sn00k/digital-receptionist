import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Card from "../components/Card";

const mainContent: { [key: string]: any } = {
  en: {
    title: "Digital Receptionist",
    greeting: "Hi, welcome to the digital receptionist!",
  },
  sv: {
    title: "Digital Receptionist",
    greeting: "Hej, välkommen till den digitala receptionisten!",
  },
};

const employees: object[] = [
  {
    name: "Robin Nilsson",
    email: "robin.nilsson@capgemini.com",
  },
  {
    name: "Tanja Georgsson",
    email: "tanja.georgsson@capgemini.com",
  },
];

const Home: NextPage = () => {
  const { locale, locales, defaultLocale, asPath } = useRouter();
  const [start, setStart] = useState(false);
  if (!locale) {
    return null;
  }

  const { title, greeting } = mainContent[locale];
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;1,100&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={styles.container}>
        {start ? (
          <Card>
            <p>YOU HAVE STARTED! YAY :)</p>
          </Card>
        ) : (
          <Card>
            <p>{greeting}</p>
            <button onClick={() => setStart(true)}>START</button>
          </Card>
        )}
      </div>
    </>
  );
};

export default Home;

import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Card from "../components/Card";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Logo from "../components/Logo";
import { textContent } from "../utils/sv_us";

const employees: object[] = [
  {
    firstName: "Robin",
    lastName: "Nilsson",
    email: "robin.nilsson@capgemini.com",
  },
  {
    firstName: "Tanja",
    lastName: "Georgsson",
    email: "tanja.georgsson@capgemini.com",
  },
];

const Home: NextPage = () => {
  const { locale, locales, defaultLocale, asPath } = useRouter();
  const { register, handleSubmit } = useForm();
  const [start, setStart] = useState(false);
  if (!locale) {
    return null;
  }

  console.log("textContent: ", textContent);
  const { landingTitle, greeting, startButton, form } = textContent[locale];

  const onSubmit = (data: any) => {
    console.log("data: ", data);
  };
  return (
    <>
      <Head>
        <title>{landingTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;1,100&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={styles.container}>
        {start ? (
          <Card>
            <Logo />
            <h3>{form.title}</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                {...register("firstname")}
                type="text"
                placeholder={form.firstName}
              />
              <input
                {...register("lastname")}
                type="text"
                placeholder={form.lastName}
              />
              <input
                {...register("email")}
                type="email"
                placeholder={form.email}
              />
              <input
                {...register("company")}
                type="text"
                placeholder={form.company}
              />
              <button className={styles.formButton} type="submit">
                {form.submit}
              </button>
            </form>
          </Card>
        ) : (
          <Card>
            <div>
              <Logo />
            </div>
            <div className={styles.flags}>
              <Link passHref href={asPath} locale="en">
                <div
                  className={`${styles.usFlag} ${
                    locale === "en" ? styles.activeLocale : ""
                  }`}
                >
                  <Image src="/us.svg" width="33" height="33" alt="US flag" />
                </div>
              </Link>
              <Link passHref href={asPath} locale="sv">
                <div
                  className={`${styles.sweFlag} ${
                    locale === "sv" ? styles.activeLocale : ""
                  }`}
                >
                  <Image
                    src="/se.svg"
                    width="33"
                    height="33"
                    alt="Swedish flag"
                  />
                </div>
              </Link>
            </div>
            <h2>{greeting}</h2>
            <button className={styles.btnStart} onClick={() => setStart(true)}>
              {startButton}
            </button>
          </Card>
        )}
      </div>
    </>
  );
};

export default Home;

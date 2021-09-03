import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Card from "../components/Card";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import Logo from "../components/Logo";
import { textContent } from "../utils/sv_us";
import FormInput from "../components/FormInput";

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

type IFormInputTypes = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
};

const Home: NextPage = () => {
  const { locale, locales, defaultLocale, asPath } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputTypes>({ mode: "onBlur" });
  const [start, setStart] = useState(false);
  if (!locale) {
    return null;
  }

  const { landingTitle, greeting, startButton, form } = textContent[locale];

  const onSubmit: SubmitHandler<IFormInputTypes> = (data) => console.log(data);

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
        <Card>
          <Logo />
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
          {start ? (
            <>
              <h3>{form.title}</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                  inputType="firstName"
                  locale={locale}
                  register={register}
                  errors={errors}
                  validation={{
                    required: true,
                    minLength: 2,
                    maxLength: 50,
                  }}
                />
                <FormInput
                  inputType="lastName"
                  locale={locale}
                  register={register}
                  errors={errors}
                  validation={{
                    required: true,
                    minLength: 2,
                    maxLength: 50,
                  }}
                />
                <FormInput
                  inputType="email"
                  locale={locale}
                  register={register}
                  errors={errors}
                  validation={{
                    required: true,
                    minLength: 6,
                    maxLength: 70,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  }}
                />
                <FormInput
                  inputType="company"
                  locale={locale}
                  register={register}
                  errors={errors}
                  validation={{
                    minLength: 2,
                    maxLength: 70,
                  }}
                />
                <button className={styles.formButton} type="submit">
                  {form.submit}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>{greeting}</h2>
              <button
                className={styles.btnStart}
                onClick={() => setStart(true)}
              >
                {startButton}
              </button>
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default Home;

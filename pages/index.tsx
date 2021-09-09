import type { InferGetServerSidePropsType } from "next";
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
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { getOrCreateConnection } from "../utils/db";
import { Employee } from "../models/Employee";

export async function getServerSideProps() {
  const conn = await getOrCreateConnection();
  const employeeRepo = conn.getRepository<Employee>("Employee");

  const employees = await (
    await employeeRepo.find()
  ).map((e) => JSON.stringify(e));

  return {
    props: { employees },
  };
}

type FormInputTypes = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
};

export default function Home({
  employees,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputTypes>({ mode: "onBlur" });
  const { locale, locales, defaultLocale, asPath } = useRouter();
  const employeeObjs = employees.map((e) => JSON.parse(e) as Employee);
  const [start, setStart] = useState(false);
  const [contactInfo, setContactInfo] = useState({});
  const [nextStep, setNextStep] = useState(false);
  const [enableNotifyBtn, setEnableNotifyBtn] = useState(false);
  const [notifyTo, setNotifyTo] = useState({});

  if (!locale) {
    return null;
  }

  const {
    landingTitle,
    greeting,
    startButton,
    form,
    nextStepTitle,
    notifyButton,
    searchPlaceholder,
    noBookedAppointment,
  } = textContent[locale];

  const onSubmit: SubmitHandler<FormInputTypes> = (data) => {
    const { firstName, lastName, email, company } = data;
    setContactInfo({
      firstName,
      lastName,
      email,
      company,
    });
    setNextStep(true);
  };

  const handleCheckbox = ({ target }: { target: any }) => {
    setEnableNotifyBtn(target.checked);
  };

  const handleNotifyAppointment = () => {
    //
  };

  const handleOnSearch = (input: string, results: object[]) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(input, results);
    setEnableNotifyBtn(false);
  };

  const handleOnHover = (result: object) => {
    // the item hovered
    console.log("Hovered");
    console.log(result);
  };

  const handleOnSelect = (item: object) => {
    // the item selected
    console.log("Selected: ", item);
    setNotifyTo(item);
    setEnableNotifyBtn(true);
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const formatResult = (item: string) => {
    console.log("item: ", item);
    return (
      <p
        dangerouslySetInnerHTML={{
          __html: '<strong className="search-result">' + item + "</strong>",
        }}
      ></p>
    );
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
          {start && !nextStep && (
            <>
              <h3>{form.title}</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                  inputName="firstName"
                  inputType="text"
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
                  inputName="lastName"
                  inputType="text"
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
                  inputName="email"
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
                  inputName="company"
                  inputType="text"
                  locale={locale}
                  register={register}
                  errors={errors}
                  validation={{
                    minLength: 2,
                    maxLength: 70,
                  }}
                />
                <button className={styles.formButton} type="submit">
                  {form.nextStep}
                </button>
              </form>
            </>
          )}
          {!start && !nextStep && (
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
          {nextStep && (
            <>
              <h2>{nextStepTitle}</h2>
              <ReactSearchAutocomplete
                items={employeeObjs}
                onSearch={handleOnSearch}
                autoFocus
                formatResult={formatResult}
                onHover={handleOnHover}
                onSelect={handleOnSelect}
                onFocus={handleOnFocus}
                onClear={() => setEnableNotifyBtn(false)}
                maxResults={3}
                inputDebounce={500}
                placeholder={searchPlaceholder}
              />
              <div className={styles["no-appointment-container"]}>
                <FormInput
                  inputName="office-admin"
                  inputType="checkbox"
                  locale={locale}
                  register={register}
                  onClick={handleCheckbox}
                />
                <label htmlFor="office-admin">
                  <i>{noBookedAppointment}</i>
                </label>
              </div>
              <button disabled={!enableNotifyBtn}>{notifyButton}</button>
            </>
          )}
        </Card>
      </div>
    </>
  );
}

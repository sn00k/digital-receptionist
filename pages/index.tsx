import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Card } from "../components/Card";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { Logo } from "../components/Logo";
import { textContent } from "../utils/sv_us";
import { FormInput } from "../components/FormInput";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { getOrCreateConnection } from "../utils/db";
import { Employee } from "../entities/Employee";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Loader } from "../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndoAlt } from "@fortawesome/free-solid-svg-icons";

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
    formState: { errors, isValid, isDirty },
  } = useForm<FormInputTypes>({ mode: "all" });
  const router = useRouter();
  const { locale, locales, defaultLocale, asPath } = router;
  const employeeObjs = employees.map((e) => JSON.parse(e) as Employee);
  const [start, setStart] = useState(false);
  const [contactInfo, setContactInfo] = useState({});
  const [nextStep, setNextStep] = useState(false);
  const [enableNotifyBtn, setEnableNotifyBtn] = useState(false);
  const [notifyTo, setNotifyTo] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const swal = withReactContent(Swal);

  if (!locale) {
    return null;
  }

  // i18n
  const {
    landingTitle,
    greeting,
    gdpr,
    startButton,
    form,
    nextStepTitle,
    notifyButton,
    searchPlaceholder,
    noBookedAppointment,
    alertTitle,
    alertBody,
    alertClosing,
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

  const handleCheckbox = ({ target }: { target: HTMLInputElement }) => {
    setEnableNotifyBtn(target.checked);
    setNotifyTo(
      target.checked ? employeeObjs.filter((e) => e.office_admin) : []
    );
  };

  const handleNotifyAppointment = async () => {
    if (notifyTo.length) {
      setLoading(true);
      try {
        await fetch("/api/mail", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            visitor: contactInfo,
            notifyEmployees: notifyTo,
          }),
        });

        let timerInterval: number;
        const tenSeconds: number = 10000;
        swal
          .fire({
            title: alertTitle,
            html: alertBody + alertClosing,
            timer: tenSeconds,
            timerProgressBar: true,
            didOpen: () => {
              swal.showLoading();
              const b = swal.getHtmlContainer()?.querySelector("b");

              timerInterval = window.setInterval(() => {
                // @ts-ignore: Object is (not) possibly undefined
                b.textContent = (swal.getTimerLeft() / 1000).toFixed();
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          })
          .then((result) => {
            if (result.dismiss === swal.DismissReason.timer) {
              router.reload();
            }
          });
      } catch (error) {
        console.error("Sweet alert 2 error: ", error);
      }
    }
    setLoading(false);
  };

  const handleOnSelect = (item: Employee) => {
    setNotifyTo([item]);
    setEnableNotifyBtn(true);
  };

  const formatResult = (item: string) => {
    return (
      <p
        className={styles["search-result"]}
        dangerouslySetInnerHTML={{
          __html: '<strong">' + item + "</strong>",
        }}
      ></p>
    );
  };

  return (
    <>
      <Head>
        <title>{landingTitle}</title>
      </Head>
      <div className={styles.container}>
        <Card>
          <div className={styles.restart}>
            <FontAwesomeIcon
              icon={faUndoAlt}
              size="1x"
              width="32"
              onClick={() => router.reload()}
            />
          </div>
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
                <button
                  className={styles.formButton}
                  type="submit"
                  disabled={!isDirty || (isDirty && !isValid)}
                >
                  {form.nextStep}
                </button>
              </form>
            </>
          )}
          {!start && !nextStep && (
            <>
              <h2>{greeting}</h2>
              <p>
                <i className={styles.gdpr}>{gdpr}</i>
              </p>
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
                onSearch={() => setEnableNotifyBtn(false)}
                autoFocus
                formatResult={formatResult}
                onSelect={handleOnSelect}
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
              <button
                disabled={!enableNotifyBtn || loading}
                onClick={handleNotifyAppointment}
              >
                <Loader show={loading} />
                {!loading && notifyButton}
              </button>
            </>
          )}
        </Card>
      </div>
    </>
  );
}

import { FormInput } from "../components/FormInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { textContent } from "../utils/sv_us";
import { FormInputTypes } from "../types/FormInput";
import styles from "../styles/Home.module.css";

type FormProps = {
  callback: SubmitHandler<FormInputTypes>;
  locale: string;
};

export const Form: React.FC<FormProps> = ({ callback, locale = "en" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<FormInputTypes>({ mode: "all" });

  const { form } = textContent[locale];

  return (
    <form onSubmit={handleSubmit(callback)}>
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
  );
};

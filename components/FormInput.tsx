import React from "react";
import styles from "../styles/FormInput.module.css";
import { textContent } from "../utils/sv_us";

type IFormInput = {
  inputType: string;
  locale: string;
  register: Function;
  errors: { [key: string]: string | any };
  validation: object;
};

const FormInput = ({
  inputType,
  locale,
  register,
  errors,
  validation,
}: IFormInput) => {
  const { form } = textContent[locale];

  return (
    <>
      <input
        {...register(inputType, {
          ...validation,
        })}
        type="text"
        placeholder={form[inputType]}
      />
      {errors[inputType] && (
        <span className={styles.error}>
          {`${form[inputType]} ${form.validation[errors[inputType].type]}
          `}
        </span>
      )}
    </>
  );
};

export default FormInput;

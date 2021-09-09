import React, { InputHTMLAttributes } from "react";
import styles from "../styles/FormInput.module.css";
import { textContent } from "../utils/sv_us";

interface IFormInput extends InputHTMLAttributes<HTMLInputElement> {
  inputName: string;
  inputType: string;
  locale: string;
  register: Function;
  errors?: { [key: string]: string | any };
  validation?: object;
  attrs?: any;
}

const FormInput: React.FC<IFormInput> = ({
  inputName,
  inputType,
  locale,
  register,
  errors,
  validation,
  ...attrs
}) => {
  const { form } = textContent[locale];

  return (
    <>
      <input
        {...register(inputName, {
          ...validation,
        })}
        type={inputType}
        placeholder={form[inputName]}
        {...attrs}
      />
      {errors && errors[inputName] && (
        <span className={styles.error}>
          {`${form[inputName]} ${form.validation[errors[inputName].type]}
          `}
        </span>
      )}
    </>
  );
};

export default FormInput;

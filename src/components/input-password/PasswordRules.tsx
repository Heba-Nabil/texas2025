import { useEffect } from "react";
import { useTranslations } from "next-intl";
import cn from "@/utils/cn";
import {
  LOWER_CASE_REGEX,
  MIN_NUMBER_REGEX,
  NO_SPACES_REGEX,
  PASSWORD_SPECIAL_CHARACTER_REGEX,
  UPPER_CASE_REGEX,
} from "@/utils/constants";
// Types
import { PasswordValidationsProps } from "@/types";

const CheckListItem = ({
  isValid,
  text,
}: {
  isValid: boolean;
  text: string;
}) => (
  <li
    className={cn("flex w-full items-start gap-2 py-1 text-sm rtl:text-base", {
      "text-gray-600": !isValid,
      "text-green-600": isValid,
    })}
  >
    <img
      src={
        isValid
          ? "/images/icons/correct-mark.svg"
          : "/images/icons/wrong-mark.svg"
      }
      alt={isValid ? "correct" : "wrong"}
      width={16}
      height={16}
      loading="lazy"
      className="mt-1 shrink-0 object-contain"
    />

    {text}
  </li>
);

type PasswordRulesProps = {
  password: string;
  passwordValidaity: PasswordValidationsProps;
  setPasswordValidaity: (values: PasswordValidationsProps) => void;
};

export default function PasswordRules(props: PasswordRulesProps) {
  const { password, passwordValidaity, setPasswordValidaity } = props;

  const t = useTranslations();

  useEffect(() => {
    setPasswordValidaity({
      minLength: password?.trim()?.length >= 8,
      lowerCase: LOWER_CASE_REGEX.test(password),
      upperCase: UPPER_CASE_REGEX.test(password),
      specialCharacter: PASSWORD_SPECIAL_CHARACTER_REGEX.test(password),
      minNumbers: MIN_NUMBER_REGEX.test(password),
      noSpaces: !NO_SPACES_REGEX.test(password),
    });
  }, [password, setPasswordValidaity]);

  return (
    <div>
      <div className="bg-gray-100 px-3 py-2">
        <h3 className="font-medium capitalize rtl:text-xl">
          {t("password_requirements")}
        </h3>
      </div>

      <ul className="p-3">
        <CheckListItem
          isValid={passwordValidaity?.minLength}
          text={t("pass_req_min_length")}
        />

        <CheckListItem
          isValid={passwordValidaity?.lowerCase}
          text={t("pass_req_lower_case")}
        />

        <CheckListItem
          isValid={passwordValidaity?.upperCase}
          text={t("pass_req_uppercase")}
        />

        <CheckListItem
          isValid={passwordValidaity?.specialCharacter}
          text={t("pass_req_special_characters")}
        />

        <CheckListItem
          isValid={passwordValidaity?.minNumbers}
          text={t("pass_req_min_number")}
        />

        <CheckListItem
          isValid={passwordValidaity?.noSpaces}
          text={t("pass_req_nospaces")}
        />
      </ul>
    </div>
  );
}

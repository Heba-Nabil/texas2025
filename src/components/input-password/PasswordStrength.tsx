import { useTranslations } from "next-intl";

type PasswordStrengthProps = {
  totalScore: number;
  score: number;
};

export default function PasswordStrength({
  totalScore,
  score,
}: PasswordStrengthProps) {
  const t = useTranslations();

  const createPassLabel = () => {
    switch (score) {
      case 0:
      case 1:
      case 2:
      case 3:
        return t("weak");

      case 4:
      case 5:
        return t("fair");

      case 6:
        return t("good");
      default:
        return "";
    }
  };

  const funcProgressColor = () => {
    switch (score) {
      case 0:
        return "#9a3324";
      case 1:
      case 2:
      case 3:
        return "#f6b318";
      case 4:
      case 5:
        return "#165865";
      case 6:
        return "#198754";
      default:
        return "#e5e7eb";
    }
  };

  return (
    <div className="relative mt-3 pt-2">
      <ul className="flex w-full max-w-xs items-center gap-1.5 overflow-hidden rounded-lg">
        {Array(totalScore)
          .fill(null)
          .map((_, index) => (
            <li
              key={index}
              className="h-1.5 flex-1 rounded-lg"
              style={{
                backgroundColor:
                  index <= score - 1 ? `${funcProgressColor()}` : "#e5e7eb",
              }}
            ></li>
          ))}
      </ul>

      <span
        className="mt-1 block w-full max-w-xs px-1 text-end text-xs capitalize"
        style={{ color: `${funcProgressColor()}` }}
      >
        {createPassLabel()}
      </span>
    </div>
  );
}

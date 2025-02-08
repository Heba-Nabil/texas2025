"use client";

import { CustomSlider } from "@/components/ui/custom-slider";

type PointsFilterationProps = {
  locale: string;
  range: number[];
  handleRangeChange: (newRange: number[]) => void;
  min: number;
  max: number;
};

export default function PointsFilteration(props: PointsFilterationProps) {
  const { locale, range, handleRangeChange, min, max } = props;

  return (
    <CustomSlider
      // defaultValue={[0, max]}
      max={max}
      min={min}
      // step={50}
      value={range}
      onValueChange={handleRangeChange}
      className="py-4"
      dir={locale === "ar" ? "rtl" : "ltr"}
    />
  );
}

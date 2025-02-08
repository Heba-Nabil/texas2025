import cn from "@/utils/cn";

type TradeMarkProps = {
  label: string;
  className?: string;
  tradeClassName?: string;
};

export default function TradeMark(props: TradeMarkProps) {
  const { label, className, tradeClassName } = props;

  return (
    <bdi className={cn("trade-mark", className)}>
      {label}
      <sup className={tradeClassName}>&trade;</sup>
    </bdi>
  );
}

// For Backend
{
  /* <bdi class="trade-mark">Texas Chicken<sup>&trade;</sup></bdi> */
  /* <bdi class="trade-mark">دجاج تكساس<sup>&trade;</sup></bdi> */
}

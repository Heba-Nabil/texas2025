import NextImage from "@/components/global/NextImage";
// Types
import { PaymentsProps } from "@/types/api";

type TrackOrderPaymentProps = {
  data: PaymentsProps[];
  resources: { paymentMethod: string };
};
export default function TrackOrderPayment(props: TrackOrderPaymentProps) {
  const { resources, data } = props;

  const completedPayments = data?.filter((item) => item.IsCompleted);

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <h3 className="shrink-0 text-xl font-semibold capitalize">
        {resources["paymentMethod"]}
      </h3>

      {/* {completedPayments?.map((item, index) => ( */}
        <div className="flex-center gap-1">
          <NextImage
            src={completedPayments[0]?.LogoURL}
            alt={completedPayments[0]?.PaymentMethodName || "texas"}
            width={30}
            height={30}
            className="smooth shrink-0 object-contain"
          />

          {completedPayments[0]?.PaymentMethodName}
        </div>
      {/* ))} */}
    </div>
  );
}

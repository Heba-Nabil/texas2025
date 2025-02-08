import BillCartItem from "./BillCartItem";
// Types
import { BillDealProps } from "@/types";
import { UserDealsResponseProps } from "@/types/api";

type SummaryWithDealProps = {
  dealData: UserDealsResponseProps;
  cartDealWithList: BillDealProps | null;
  currency: string;
};

export default function SummaryWithDeal(props: SummaryWithDealProps) {
  const { dealData, cartDealWithList, currency } = props;

  return (
    <div className="bg-main/20 p-5">
      <div className="flex-between gap-2">
        <div className="flex-grow">
          {dealData?.Title && (
            <span className="text-xl font-bold uppercase leading-none text-alt">
              {dealData?.Title}
            </span>
          )}

          <h3 className="font-semibold capitalize leading-none">
            {dealData?.Name?.trim()}
          </h3>

          <span className="text-sm leading-tight text-gray-500">
            {dealData?.Description?.trim()}
          </span>
        </div>

        <div className="flex-center flex-col text-center">
          <img
            src="/images/icons/deals-with-star.svg"
            alt="deals with star"
            width={70}
            height={20}
            className="object-contain"
            loading="lazy"
          />

          {/* {cartDealSubTotal && (
            <p className="mt-1">
              {cartDealSubTotal} {CurrencyName}
            </p>
          )} */}
        </div>
      </div>

      {cartDealWithList && (
        <ul className="w-full">
          {cartDealWithList?.Lines?.map((item, index) => (
            <BillCartItem
              key={index}
              data={item}
              currency={currency}
              className="my-0 border-b-0"
            />
          ))}
        </ul>
      )}
    </div>
  );
}

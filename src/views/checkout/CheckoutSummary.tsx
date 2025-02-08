import { SetStateAction } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useData } from "@/providers/DataProvider";
import { elementsIds } from "@/utils/constants";
import BillCartItem from "@/components/items/BillCartItem";
import SummarySubtotal from "@/views/cart/SummarySubTotal";
import SummaryWithDeal from "@/components/items/SummaryWithDeal";
import SummaryButton from "@/components/global/SummaryButton";
// Types
import { CheckoutPageResourcesProps } from "@/types/resources";
import { CartProps, UserDealsResponseProps } from "@/types/api";
import { BillLineCookieProps, CaptchaRefProps } from "@/types";

type CheckoutSummaryProps = {
  resources: CheckoutPageResourcesProps;
  data: CartProps | BillLineCookieProps;
  handleCheckout: () => void;
  showCaptcha: boolean;
  captchaError: string;
  handleCaptchaChange: (token: string | null) => void;
  handleCaptchaRef: (e: SetStateAction<CaptchaRefProps>) => void;
  locale: string;
  userDeals?: UserDealsResponseProps[] | null;
};

export default function CheckoutSummary(props: CheckoutSummaryProps) {
  const {
    resources,
    data,
    handleCheckout,
    showCaptcha,
    captchaError,
    handleCaptchaChange,
    handleCaptchaRef,
    locale,
    userDeals,
  } = props;

  const {
    Data: { CurrencyName, IsTaxInclusive },
  } = useData();

  const dealHeaderID = data?.DealHeaderID;

  const currentDeal = userDeals?.find((item) => item.ID === dealHeaderID);

  const cartDealWithList = data?.Deals ? data?.Deals[0] : null;

  // const cartDealSubTotal = cartDealWithList?.Lines?.reduce(
  //   (acc, cur) => (acc += cur.SubTotal),
  //   0,
  // );

  return (
    <div className="top-32 z-10 lg:sticky">
      <div className="overflow-hidden rounded-lg bg-white">
        <div className="flex-between gap-1 border-b-2 p-5">
          <h2 className="text-xl font-semibold capitalize">
            {resources["orderSummary"]}
          </h2>
        </div>

        {/* <div className="bg-accent px-5 py-2 text-sm text-white">
          <span className="text-base uppercase">Please note:</span> Prices or
          description of items in your past orders may have changed.
        </div> */}

        {data && (
          <>
            <div className="max-h-[40vh] overflow-y-auto">
              {currentDeal && (
                <SummaryWithDeal
                  dealData={currentDeal}
                  cartDealWithList={cartDealWithList}
                  currency={CurrencyName}
                />
              )}

              <div className="px-5">
                {data?.Lines?.map((item, index) => (
                  <BillCartItem
                    key={index}
                    data={item}
                    currency={CurrencyName}
                  />
                ))}
              </div>
            </div>

            <div className="px-5">
              <SummarySubtotal
                data={data}
                resources={{
                  deliveryFees: resources["deliveryFees"],
                  discount: resources["discount"],
                  subTotal: resources["subTotal"],
                  tax: resources["tax"],
                  promoCodeDiscount: resources["promoCodeDiscount"],
                  dealsDiscount: resources["dealsDiscount"],
                  total: resources["total"],
                  allPricesAreVatInclusive:
                    resources["allPricesAreVatInclusive"],
                }}
                currency={CurrencyName}
                hasPromoCode={!!data?.PromoCode}
                hasDeal={!!data?.DealHeaderID}
                IsTaxInclusive={IsTaxInclusive}
              />
            </div>

            {showCaptcha && (
              <div
                className="my-4 block justify-center px-4"
                id={elementsIds.checkoutCaptchaWrapper}
              >
                <ReCAPTCHA
                  ref={handleCaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_CAPTCHA_CLIENT_KEY!}
                  onChange={handleCaptchaChange}
                  // size="compact"
                  className="captcha-wrapper"
                />
                {captchaError && (
                  <p className="block text-sm text-alt">{captchaError}</p>
                )}
              </div>
            )}

            <SummaryButton
              quantity={data?.TotalQuantity}
              price={data?.Total}
              currency={CurrencyName}
              resources={{
                item: resources["item"],
                items: resources["items"],
              }}
              label={resources["selectPaymentMode"]}
              onClick={() => handleCheckout()}
              locale={locale}
            />
          </>
        )}
      </div>
    </div>
  );
}
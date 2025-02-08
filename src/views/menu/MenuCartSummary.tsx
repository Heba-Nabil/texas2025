"use client";

import { ArrowRightCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "@/navigation";
import { useData } from "@/providers/DataProvider";
import useCart from "@/hooks/useCart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { mutatePath } from "@/server/actions";
import { fixedKeywords } from "@/utils/constants";
import DefaultCartItem from "@/components/items/cart-item/DefaultCartItem";
import SummaryButton from "@/components/global/SummaryButton";
import EmptyCart from "@/components/emptyStates/EmptyCart";
import CartDealItemWithList from "../cart/CartDealItemWithList";
import CartDealItemWithoutList from "../cart/CartDealItemWithoutList";
import { Button } from "@/components/ui/button";
// Types
import { MenuLayoutResourcesProps } from "@/types/resources";
import { UserDealsResponseProps } from "@/types/api";

type MenuCartSummaryProps = {
  resources: MenuLayoutResourcesProps;
  locale: string;
  userDeals?: UserDealsResponseProps[] | null;
};

export default function MenuCartSummary(props: MenuCartSummaryProps) {
  const { resources, locale, userDeals } = props;

  const router = useRouter();
  const pathname = usePathname();

  const {
    Data: { CurrencyName, IsCartOrderTypeRequired },
  } = useData();

  const {
    cartItemsQty,
    cartLines,
    SubTotalAfterDiscount,
    cartData,
    handleRemoveDeal,
  } = useCart();

  const currentDealId = cartData?.DealHeaderID;
  const currentDeal = userDeals?.find((item) => item.ID === currentDealId);

  const isDealContainsList =
    cartData?.IsHeaderContainsLists &&
    cartData?.Deals &&
    cartData?.Deals?.length > 0;

  const { selectedOrderTypeId, orderLocation } = useAppSelector(
    (state) => state.order,
  );
  const dispatch = useAppDispatch();

  const handleOpenClearCartModal = () => {
    dispatch(
      toggleModal({
        clearCartModal: {
          isOpen: true,
          data: {
            orderTypeId: selectedOrderTypeId,
            ...orderLocation,
          },
          cb: null,
        },
      }),
    );
  };

  const removeDealFromClient = async (id: string) => {
    if (!id) return;

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      dispatch(toggleModal({ loadingModal: { isOpen: true } }));

      const response = await handleRemoveDeal(locale, id);

      if (response?.hasError) {
        return response?.errors?.forEach((item) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      await mutatePath(pathname);

      toaster.success({ message: resources["dealRemoveSuccess"] });
    } catch (error) {
      console.log("Error from add deal", (error as Error).message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <>
      <div className="sticky top-40 z-10 hidden lg:col-span-4 lg:block">
        <div className="overflow-hidden rounded-lg bg-white">
          {cartItemsQty < 1 ? (
            <EmptyCart
              resources={{
                cartEmpty: resources["cartEmpty"],
                cartEmptyDesc: resources["cartEmptyDesc"],
              }}
              locale={locale}
            />
          ) : (
            <>
              <div className="flex-between gap-1 border-b-2 p-5">
                <h2 className="text-xl font-semibold capitalize">
                  {resources["myCart"]}
                </h2>

                <Button
                  variant="link"
                  className="h-auto p-0 font-normal hover:bg-transparent hover:text-alt"
                  onClick={handleOpenClearCartModal}
                >
                  <TrashIcon className="size-5 shrink-0" />{" "}
                  {resources["removeAll"]}
                </Button>
              </div>

              {/* <div className="bg-accent px-5 py-2 text-sm text-white">
                <span className="text-base uppercase">reorder!</span> Please
                double-check the prices and descriptions, as there may be some
                changes.
              </div> */}

              <div className="h-[50vh] overflow-y-auto overflow-x-hidden @container">
                {currentDeal && (
                  <div className="bg-main/20 p-4">
                    <div className="flex-between mb-4">
                      <h2>
                        <img
                          src="/images/icons/deals-with-star.svg"
                          alt="deals with star"
                          width={70}
                          height={20}
                          className="object-contain"
                          loading="lazy"
                        />
                        <span className="sr-only">deals with star</span>
                      </h2>

                      {isDealContainsList && (
                        <Button
                          variant="link"
                          type="button"
                          className="h-auto gap-2 p-0 font-semibold text-alt"
                          onClick={() =>
                            router.push(
                              `/dashboard/deals?${fixedKeywords.activeDealId}=${currentDeal?.ID}`,
                            )
                          }
                        >
                          {resources["editDeal"]}{" "}
                          <ArrowRightCircleIcon className="size-4 rtl:-scale-x-100" />
                        </Button>
                      )}
                    </div>

                    {isDealContainsList ? (
                      <CartDealItemWithList
                        currentDeal={currentDeal}
                        cartData={cartData}
                        currency={CurrencyName}
                        resources={{
                          edit: resources["edit"],
                          removeDeal: resources["removeDeal"],
                          whatYouNeedToCustomize:
                            resources["whatYouNeedToCustomize"],
                          free: resources["free"],
                        }}
                        removeDealFromClient={removeDealFromClient}
                      />
                    ) : (
                      <CartDealItemWithoutList
                        data={currentDeal}
                        resources={{ removeDeal: resources["removeDeal"] }}
                        showDeleteButton
                        removeDealFromClient={removeDealFromClient}
                      />
                    )}
                  </div>
                )}

                <div className="p-4">
                  {cartLines?.map((item, index) => (
                    <DefaultCartItem
                      key={index}
                      data={item}
                      currency={CurrencyName}
                      IsCartOrderTypeRequired={IsCartOrderTypeRequired}
                      resources={{
                        edit: resources["edit"],
                        customized: resources["customized"],
                      }}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>

              <SummaryButton
                quantity={cartItemsQty}
                price={SubTotalAfterDiscount}
                currency={CurrencyName}
                resources={{
                  item: resources["item"],
                  items: resources["items"],
                }}
                label={resources["viewCart"]}
                onClick={() => router.push(`/cart`)}
                locale={locale}
              />
            </>
          )}
        </div>
      </div>

      <div className="lg:hidden">
        <SummaryButton
          className="max-lg:bottom-[70px]"
          quantity={cartItemsQty}
          price={SubTotalAfterDiscount}
          currency={CurrencyName}
          resources={{ item: resources["item"], items: resources["items"] }}
          label={resources["viewCart"]}
          onClick={() => router.push(`/cart`)}
          locale={locale}
        />
      </div>
    </>
  );
}

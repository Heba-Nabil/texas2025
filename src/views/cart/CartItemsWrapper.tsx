"use client";

import { toggleModal } from "@/store/features/global/globalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PageHeader from "@/components/global/PageHeader";
import { Button } from "@/components/ui/button";
import DeleteIcon from "@/components/icons/DeleteIcon";
import DefaultCartItem from "@/components/items/cart-item/DefaultCartItem";
import CartDealItemWithList from "./CartDealItemWithList";
import CartDealItemWithoutList from "./CartDealItemWithoutList";
import CartUserDeals from "./CartUserDeals";
// Types
import { CartPageResourcesProps } from "@/types/resources";
import { CartProps, UserDealsResponseProps } from "@/types/api";

type CartItemWrapperProps = {
  data: CartProps;
  resources: CartPageResourcesProps;
  currency: string;
  IsCartOrderTypeRequired: boolean;
  locale: string;
  userDeals?: UserDealsResponseProps[] | null;
  currentDeal?: UserDealsResponseProps;
  removeDealFromClient: (id: string) => Promise<void>;
};

export default function CartItemsWrapper(props: CartItemWrapperProps) {
  const {
    data,
    resources,
    currency,
    IsCartOrderTypeRequired,
    locale,
    userDeals,
    currentDeal,
    removeDealFromClient,
  } = props;

  const { selectedOrderTypeId, orderLocation } = useAppSelector(
    (state) => state.order,
  );

  const dispatch = useAppDispatch();

  const isDealContainsList =
    data?.IsHeaderContainsLists && data?.Deals && data?.Deals?.length > 0;

  return (
    <>
      <PageHeader title={resources["cart"]} className="p-4">
        <Button
          variant="link"
          className="h-auto p-0 font-normal hover:bg-transparent hover:text-alt"
          onClick={() =>
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
            )
          }
        >
          {resources["removeAll"]} <DeleteIcon className="size-4 shrink-0" />
        </Button>
      </PageHeader>

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
          </div>

          {isDealContainsList ? (
            <CartDealItemWithList
              currentDeal={currentDeal}
              cartData={data}
              currency={currency}
              resources={{
                edit: resources["edit"],
                removeDeal: resources["removeDeal"],
                whatYouNeedToCustomize: resources["whatYouNeedToCustomize"],
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

      {data?.Lines?.length > 0 && (
        <ul className="p-4 @container">
          {data?.Lines?.map((item) => (
            <li key={item?.ID}>
              <DefaultCartItem
                data={item}
                currency={currency}
                IsCartOrderTypeRequired={IsCartOrderTypeRequired}
                resources={{
                  edit: resources["edit"],
                  customized: resources["customized"],
                }}
                locale={locale}
              />
            </li>
          ))}
        </ul>
      )}

      {userDeals && userDeals?.length > 0 && (
        <CartUserDeals
          data={userDeals}
          locale={locale}
          resources={resources}
          currentDeal={currentDeal}
          removeDealFromClient={removeDealFromClient}
        />
      )}
    </>
  );
}

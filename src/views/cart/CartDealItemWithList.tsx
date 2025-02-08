import { ArrowRightCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogContentWrapper,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import DeleteIcon from "@/components/icons/DeleteIcon";
// Types
import { CartProps, UserDealsResponseProps } from "@/types/api";
import NextLink from "@/components/global/NextLink";

type CartDealItemWithListProps = {
  currentDeal: UserDealsResponseProps;
  cartData: CartProps;
  currency: string;
  resources: {
    edit: string;
    removeDeal: string;
    whatYouNeedToCustomize: string;
    free: string;
  };
  removeDealFromClient: (id: string) => Promise<void>;
};

export default function CartDealItemWithList(props: CartDealItemWithListProps) {
  const { currentDeal, cartData, currency, resources, removeDealFromClient } =
    props;

  const cartDealData = cartData?.Deals ? cartData?.Deals[0] : null;

  if (!cartDealData) return null;

  return (
    <div className="flex w-full overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="flex-center w-full max-w-32 bg-gray-100">
        <img
          src={
            currentDeal?.IconURL
              ? currentDeal?.IconURL
              : "/images/reward-img.png"
          }
          alt={currentDeal?.Name?.trim()}
          width={110}
          height={110}
          loading="lazy"
          className="max-w-full object-contain"
        />
      </div>

      <div className="flex-grow p-3">
        {currentDeal?.Title && (
          <span className="text-xl font-bold uppercase leading-none text-alt">
            {currentDeal?.Title}
          </span>
        )}

        <h3 className="text-lg font-semibold">{currentDeal?.Name?.trim()}</h3>

        <p className="text-sm leading-tight text-gray-500">
          {currentDeal?.Description?.trim()}
        </p>

        {cartDealData?.Lines?.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="link"
                type="button"
                className="h-auto gap-2 p-0 font-semibold text-alt"
              >
                {resources["edit"]}{" "}
                <ArrowRightCircleIcon className="size-4 rtl:-scale-x-100" />
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader title={resources["whatYouNeedToCustomize"]} />

              <DialogContentWrapper>
                <DialogDescription className="sr-only">
                  {resources["whatYouNeedToCustomize"]}
                </DialogDescription>

                <ul className="w-full space-y-2">
                  {cartDealData?.Lines?.map((item) => (
                    <li key={item.ID} className="w-full">
                      <div className="relative flex w-full overflow-hidden rounded-[7px] shadow-md hover:shadow-lg md:rounded-[10px]">
                        <DialogClose asChild>
                          <NextLink
                            href={`/menu/${item.MenuItem.CategoryNameUnique}/${item.MenuItem.NameUnique}?cid=${item.ID}&did=${cartDealData.ID}`}
                            className="flex-center w-full max-w-28 bg-gray-100"
                            aria-label={item.MenuItem.Name.trim()}
                            scroll={false}
                          >
                            <img
                              src={item.MenuItem.IconURL}
                              alt={item.MenuItem.Name.trim()}
                              width={100}
                              height={100}
                              loading="lazy"
                              className="max-w-full object-contain"
                            />
                          </NextLink>
                        </DialogClose>

                        <div className="flex-grow p-3">
                          <DialogClose asChild>
                            <NextLink
                              href={`/menu/${item.MenuItem.CategoryNameUnique}/${item.MenuItem.NameUnique}?cid=${item.ID}&did=${cartDealData.ID}`}
                              className="flex w-max"
                              scroll={false}
                            >
                              <h2 className="smooth w-fit text-lg font-semibold capitalize hover:text-main">
                                {item.MenuItem.Name.trim()}
                              </h2>
                            </NextLink>
                          </DialogClose>

                          <p className="text-sm leading-tight text-gray-500">
                            {item.MenuItem.CustomizationDescription
                              ? item.MenuItem.CustomizationDescription
                              : item.MenuItem.Description}
                          </p>

                          <DialogClose asChild>
                            <NextLink
                              href={`/menu/${item.MenuItem.CategoryNameUnique}/${item.MenuItem.NameUnique}?cid=${item.ID}&did=${cartDealData.ID}`}
                              className="mt-1 flex items-center gap-1 font-semibold capitalize text-alt"
                              scroll={false}
                            >
                              {resources["edit"]}{" "}
                              <ArrowRightCircleIcon className="size-4 rtl:-scale-x-100" />{" "}
                            </NextLink>
                          </DialogClose>

                          {item?.SubTotalAfterDiscount > 0 ? (
                            <div className="flex flex-wrap items-center gap-x-1">
                              <strong className="text-lg font-bold text-dark">
                                {item.SubTotalAfterDiscount?.toFixed(2)}{" "}
                                {currency}
                              </strong>

                              {item?.SubTotalAfterDiscount !==
                                item?.SubTotal && (
                                <span className="text-xs text-gray-500 line-through">
                                  {item?.SubTotal?.toFixed(2)} {currency}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex-center absolute end-0 top-0 z-10 gap-1 bg-accent px-2 py-0.5 text-xs text-white">
                              <StarIcon className="size-3" />
                              <span>{resources["free"]}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </DialogContentWrapper>
            </DialogContent>
          </Dialog>
        )}

        <div className="mt-1 flex w-full flex-wrap">
          <Button
            variant="link"
            className="ms-auto h-auto p-0 text-sm font-normal hover:text-alt"
            onClick={() => removeDealFromClient(currentDeal?.ID)}
          >
            {resources["removeDeal"]}
            <DeleteIcon className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

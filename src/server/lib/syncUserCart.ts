import { getCountryData } from "@/server/services/globalService";
import {
  getCartItems,
  transferCartService,
} from "@/server/services/cartService";
import getRequestHeaders from "./getRequestHeaders";
import { setServerCookie } from "@/server/actions/serverCookie";
import {
  cookiesExpireTime,
  ORDER_LOCATION,
  ORDER_TYPE_ID,
} from "@/utils/constants";

export async function syncUserCart(
  locale: string,
  userToken: string,
  guestToken?: string | null,
) {
  try {
    await transferCartService(locale, guestToken, userToken);

    const [countryData, cartResponse] = await Promise.all([
      getCountryData(locale, "Sync User Cart"),
      getCartItems(locale, userToken),
    ]);

    const userCartData = cartResponse?.data;

    if (userCartData && countryData?.data) {
      const cartOrderType = countryData?.data?.OrderTypes?.find(
        (item) => item.ID === userCartData?.OrderTypeID,
      );

      const { orderLocation } = getRequestHeaders(locale);

      let newOrderLocation = { ...orderLocation };

      cartOrderType?.Cities?.forEach((city) => {
        const store = city.Stores?.find(
          (item) => item.ID === userCartData?.StoreID,
        );

        if (store) {
          newOrderLocation.storeId = store.ID;
          newOrderLocation.cityId = store.CityID;
          newOrderLocation.areaId = store.AreaID;
        }

        if (userCartData?.AddressInformation) {
          const userAddressInfo = userCartData?.AddressInformation;

          newOrderLocation.addressId = userAddressInfo?.AddressID;
          newOrderLocation.apartment = userAddressInfo?.Apartment;
          newOrderLocation.areaId = userAddressInfo?.AreaID;
          newOrderLocation.block = userAddressInfo?.Block;
          newOrderLocation.building = userAddressInfo?.Building;
          newOrderLocation.cityId = userAddressInfo?.CityID;
          newOrderLocation.floor = userAddressInfo?.Floor;
          newOrderLocation.landmark = userAddressInfo?.Landmark;
          newOrderLocation.lat = userAddressInfo?.Latitude;
          newOrderLocation.lng = userAddressInfo?.Longitude;
          newOrderLocation.street = userAddressInfo?.Street;

          newOrderLocation.storeId = userCartData?.StoreID;
        }
      });

      await setServerCookie([
        {
          name: ORDER_TYPE_ID,
          value: userCartData?.OrderTypeID!,
          // value: cartOrderType?.ID!,
          expiration: new Date(Date.now() + cookiesExpireTime),
        },
        {
          name: ORDER_LOCATION,
          value: JSON.stringify(newOrderLocation),
          expiration: new Date(Date.now() + cookiesExpireTime),
        },
      ]);
    }
  } catch (error) {
    return;
  }
}

import { createSlice } from "@reduxjs/toolkit";
import { cartInitialState } from "@/utils/constants";
import {
  addToCartThunk,
  applyDealThunk,
  applyPromoCodeThunk,
  initializeCartThunk,
  quickAddToCartThunk,
  quickUpdateCartLineThunk,
  removeCartLineThunk,
  removeDealThunk,
  removePromoCodeThunk,
  updateCartLineThunk,
} from "./cartThunk";
// Types
import type { PayloadAction } from "@reduxjs/toolkit";
import { CartProps } from "@/types/api";

type InitialStateProps = CartProps;

const initialState: InitialStateProps = cartInitialState;

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCart: (state, action: PayloadAction<CartProps>) => action.payload,
  },
  extraReducers: (builder) => {
    builder
      // Initialize Client Cart and Clear Client Cart
      .addCase(initializeCartThunk.fulfilled, (state, { payload }) => {
        if (payload && !payload?.hasError) {
          if (typeof payload.data === "string") {
            state.DealHeaderID = initialState.DealHeaderID;
            state.Deals = initialState.Deals;
            state.DeliveryChargeAmount = initialState.DeliveryChargeAmount;
            state.DiscountAmount = initialState.DiscountAmount;
            state.ExpiredDate = initialState.ExpiredDate;
            state.ID = initialState.ID;
            state.IsHeaderContainsLists = initialState.IsHeaderContainsLists;
            state.Lines = initialState.Lines;
            state.OrderTypeID = initialState.OrderTypeID;
            state.PromoCode = initialState.PromoCode;
            state.StoreID = initialState.StoreID;
            state.SubTotal = initialState.SubTotal;
            state.SubTotalAfterDiscount = initialState.SubTotalAfterDiscount;
            state.TaxAmount = initialState.TaxAmount;
            state.Total = initialState.Total;
            state.TotalQuantity = initialState.TotalQuantity;
            state.AddressInformation = initialState.AddressInformation;
          }
        }
      })
      // Update Client Cart After Add Item
      .addCase(addToCartThunk.fulfilled, (state, { payload }) => {
        if (!payload?.hasError && payload?.data) {
          const {
            data: { Cart, Line },
          } = payload;

          state.SubTotal = Cart.SubTotal;
          state.DiscountAmount = Cart.DiscountAmount;
          state.SubTotalAfterDiscount = Cart.SubTotalAfterDiscount;
          state.DeliveryChargeAmount = Cart.DeliveryChargeAmount;
          state.TaxAmount = Cart.TaxAmount;
          state.Total = Cart.Total;
          state.TotalQuantity = Cart.TotalQuantity;

          state.Lines.push(Line);
        }
      })
      // Update Client Cart After Quick Add Item
      .addCase(quickAddToCartThunk.fulfilled, (state, { payload }) => {
        if (!payload?.hasError && payload?.data) {
          const {
            data: { Cart, Line },
          } = payload;

          state.SubTotal = Cart.SubTotal;
          state.DiscountAmount = Cart.DiscountAmount;
          state.SubTotalAfterDiscount = Cart.SubTotalAfterDiscount;
          state.DeliveryChargeAmount = Cart.DeliveryChargeAmount;
          state.TaxAmount = Cart.TaxAmount;
          state.Total = Cart.Total;
          state.TotalQuantity = Cart.TotalQuantity;

          state.Lines.push(Line);
        }
      })
      // Update Client Cart After Update Item
      .addCase(updateCartLineThunk.fulfilled, (state, { payload }) => {
        if (!payload?.hasError && payload?.data) {
          const {
            data: { Cart, Line },
          } = payload;

          state.SubTotal = Cart.SubTotal;
          state.DiscountAmount = Cart.DiscountAmount;
          state.SubTotalAfterDiscount = Cart.SubTotalAfterDiscount;
          state.DeliveryChargeAmount = Cart.DeliveryChargeAmount;
          state.TaxAmount = Cart.TaxAmount;
          state.Total = Cart.Total;
          state.TotalQuantity = Cart.TotalQuantity;

          const lineIndex = state.Lines.findIndex(
            (item) => item.ID === Line.ID,
          );

          state.Lines[lineIndex] = Line;

          const DealHeaderID = payload?.data?.Line?.DealHeaderID;
          const DealDetailsID = payload?.data?.Line?.DealDetailsID;

          if (DealDetailsID && DealHeaderID) {
            if (state.Deals) {
              const dealIndex = state.Deals?.findIndex(
                (item) => item.ID === DealHeaderID,
              );
              const dealLineIndex = state.Deals[dealIndex]?.Lines?.findIndex(
                (item) => item.ID === payload.data?.Line.ID,
              );

              if (dealIndex !== -1 && dealLineIndex !== -1) {
                state.Deals[dealIndex].Lines[dealLineIndex] =
                  payload.data?.Line;
              }
            }
          }
        }
      })
      // Update Client Cart After Quick Update Item
      .addCase(quickUpdateCartLineThunk.fulfilled, (state, { payload }) => {
        if (!payload?.hasError && payload?.data) {
          const {
            data: { Cart, Line },
          } = payload;

          state.SubTotal = Cart.SubTotal;
          state.DiscountAmount = Cart.DiscountAmount;
          state.SubTotalAfterDiscount = Cart.SubTotalAfterDiscount;
          state.DeliveryChargeAmount = Cart.DeliveryChargeAmount;
          state.TaxAmount = Cart.TaxAmount;
          state.Total = Cart.Total;
          state.TotalQuantity = Cart.TotalQuantity;

          const lineIndex = state.Lines.findIndex(
            (item) => item.ID === Line.ID,
          );

          state.Lines[lineIndex] = Line;
        }
      })
      // Update Client Cart After Remove Item
      .addCase(
        removeCartLineThunk.fulfilled,
        (state, { payload, meta: { arg } }) => {
          if (!payload?.hasError && payload?.data) {
            const {
              data: { Cart },
            } = payload;

            state.SubTotal = Cart.SubTotal;
            state.DiscountAmount = Cart.DiscountAmount;
            state.SubTotalAfterDiscount = Cart.SubTotalAfterDiscount;
            state.DeliveryChargeAmount = Cart.DeliveryChargeAmount;
            state.TaxAmount = Cart.TaxAmount;
            state.Total = Cart.Total;
            state.TotalQuantity = Cart.TotalQuantity;

            state.Lines = state.Lines.filter((item) => item.ID !== arg.LineID);
          }
        },
      )
      // Update Client Cart After Apply Promocode
      .addCase(applyPromoCodeThunk.fulfilled, (state, { payload }) => {
        if (!payload?.hasError && payload?.data) {
          state.TotalQuantity = payload.data?.TotalQuantity;
          state.Lines = payload.data.Lines;
          state.Deals = payload.data.Deals;
          state.SubTotalAfterDiscount = payload.data.SubTotalAfterDiscount;
          state.PromoCode = payload.data.PromoCode;
          state.DealHeaderID = payload.data.DealHeaderID;
          state.IsHeaderContainsLists = payload.data.IsHeaderContainsLists;
          state.ExpiredDate = payload.data.ExpiredDate;
          state.StoreID = payload.data.StoreID;
          state.OrderTypeID = payload.data.OrderTypeID;
          state.SubTotal = payload.data.SubTotal;
          state.DiscountAmount = payload.data.DiscountAmount;
          state.DeliveryChargeAmount = payload.data.DeliveryChargeAmount;
          state.TaxAmount = payload.data.TaxAmount;
          state.Total = payload.data.Total;
          state.ID = payload.data.ID;
        }
      })
      // Update Client Cart After Remove Promocode
      .addCase(removePromoCodeThunk.fulfilled, (state, { payload }) => {
        if (!payload?.hasError && payload?.data) {
          state.TotalQuantity = payload.data?.TotalQuantity;
          state.Lines = payload.data.Lines;
          state.Deals = payload.data.Deals;
          state.SubTotalAfterDiscount = payload.data.SubTotalAfterDiscount;
          state.PromoCode = payload.data.PromoCode;
          state.DealHeaderID = payload.data.DealHeaderID;
          state.IsHeaderContainsLists = payload.data.IsHeaderContainsLists;
          state.ExpiredDate = payload.data.ExpiredDate;
          state.StoreID = payload.data.StoreID;
          state.OrderTypeID = payload.data.OrderTypeID;
          state.SubTotal = payload.data.SubTotal;
          state.DiscountAmount = payload.data.DiscountAmount;
          state.DeliveryChargeAmount = payload.data.DeliveryChargeAmount;
          state.TaxAmount = payload.data.TaxAmount;
          state.Total = payload.data.Total;
          state.ID = payload.data.ID;
        }
      })
      // Update Client Cart After Apply Deal
      .addCase(applyDealThunk.fulfilled, (state, { payload }) => {
        if (!payload?.hasError && payload?.data) {
          state.TotalQuantity = payload.data?.TotalQuantity;
          state.Lines = payload.data.Lines;
          state.Deals = payload.data.Deals;
          state.SubTotalAfterDiscount = payload.data.SubTotalAfterDiscount;
          state.PromoCode = payload.data.PromoCode;
          state.DealHeaderID = payload.data.DealHeaderID;
          state.IsHeaderContainsLists = payload.data.IsHeaderContainsLists;
          state.ExpiredDate = payload.data.ExpiredDate;
          state.StoreID = payload.data.StoreID;
          state.OrderTypeID = payload.data.OrderTypeID;
          state.SubTotal = payload.data.SubTotal;
          state.DiscountAmount = payload.data.DiscountAmount;
          state.DeliveryChargeAmount = payload.data.DeliveryChargeAmount;
          state.TaxAmount = payload.data.TaxAmount;
          state.Total = payload.data.Total;
          state.ID = payload.data.ID;
        }
      })
      // Update Client Cart After Remove Deal
      .addCase(removeDealThunk.fulfilled, (state, { payload }) => {
        if (!payload?.hasError && payload?.data) {
          state.TotalQuantity = payload.data?.TotalQuantity;
          state.Lines = payload.data.Lines;
          state.Deals = payload.data.Deals;
          state.SubTotalAfterDiscount = payload.data.SubTotalAfterDiscount;
          state.PromoCode = payload.data.PromoCode;
          state.DealHeaderID = payload.data.DealHeaderID;
          state.IsHeaderContainsLists = payload.data.IsHeaderContainsLists;
          state.ExpiredDate = payload.data.ExpiredDate;
          state.StoreID = payload.data.StoreID;
          state.OrderTypeID = payload.data.OrderTypeID;
          state.SubTotal = payload.data.SubTotal;
          state.DiscountAmount = payload.data.DiscountAmount;
          state.DeliveryChargeAmount = payload.data.DeliveryChargeAmount;
          state.TaxAmount = payload.data.TaxAmount;
          state.Total = payload.data.Total;
          state.ID = payload.data.ID;
        }
      });
  },
});

export const { loadCart } = cartSlice.actions;

export default cartSlice.reducer;

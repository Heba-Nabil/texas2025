import { createSlice } from "@reduxjs/toolkit";
import {
  guestTokenizeThunk,
  userDeleteAccountThunk,
  userLoginThunk,
  userLogoutThunk,
  userSignupThunk,
} from "./authThunk";
import { clearGuestSession } from "@/utils/getSessionHandler";
// Types
import type { PayloadAction } from "@reduxjs/toolkit";
import { ClientSessionProps, UserSessionDataProps } from "@/types";

const DefaultClientSession = {
  isLoggedIn: false,
  isUser: false,
  isGuest: false,
  info: undefined,
  picture: undefined,
};

type InitialStateProps = {
  session: ClientSessionProps;
};

const initialState: InitialStateProps = {
  session: DefaultClientSession,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateSession: (state, action: PayloadAction<ClientSessionProps>) => {
      state.session = action.payload;
    },
    updateSessionInfo: (
      state,
      action: PayloadAction<UserSessionDataProps | undefined>,
    ) => {
      state.session.info = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Guest client session
    builder
      .addCase(guestTokenizeThunk.fulfilled, (state, { payload }) => {
        if (!payload?.hasError) {
          state.session.isGuest = true;
          state.session.isLoggedIn = true;
          state.session.isUser = false;
          state.session.info = undefined;
          state.session.picture = undefined;
        }
      })
      // User login
      .addCase(userLoginThunk.fulfilled, (state, { payload }) => {
        if (!payload?.hasError) {
          state.session.isGuest = false;
          state.session.isLoggedIn = true;
          state.session.isUser = true;
          state.session.info = {
            firstName: payload?.data?.Profile?.FirstName || "",
            lastName: payload?.data?.Profile?.LastName || "",
            email: payload?.data?.Profile?.Email || "",
            phone: payload?.data?.Profile?.Phone || "",
          };
          state.session.picture = payload?.data?.Profile?.ProfileImageURL;
          clearGuestSession();
        }
      })
      // User signup
      .addCase(userSignupThunk.fulfilled, (state, { payload }) => {
        if (!payload?.hasError) {
          state.session.isGuest = false;
          state.session.isLoggedIn = true;
          state.session.isUser = true;
          state.session.info = {
            firstName: payload?.data?.Profile?.FirstName || "",
            lastName: payload?.data?.Profile?.LastName || "",
            email: payload?.data?.Profile?.Email || "",
            phone: payload?.data?.Profile?.Phone || "",
          };
          state.session.picture = payload?.data?.Profile?.ProfileImageURL;
          clearGuestSession();
        }
      })
      // Update user profile
      // .addCase(updateUserProfileThunk.fulfilled, (state, { payload }) => {
      //   if (!payload?.hasError) {
      //     state.session.info = {
      //       firstName: payload?.data?.FirstName || "",
      //       lastName: payload?.data?.LastName || "",
      //       email: payload?.data?.Email || "",
      //       phone: payload?.data?.Phone || "",
      //     };
      //   }
      // })
      // User logout
      .addCase(userLogoutThunk.fulfilled, (state, { payload }) => {
        if (!payload?.hasError) {
          state.session.isGuest = false;
          state.session.isLoggedIn = false;
          state.session.isUser = false;
          state.session.info = undefined;
          state.session.picture = undefined;
          clearGuestSession();
        }
      })
      // Delete Account
      .addCase(userDeleteAccountThunk.fulfilled, (state, { payload }) => {
        if (!payload?.hasError) {
          state.session.isGuest = false;
          state.session.isLoggedIn = false;
          state.session.isUser = false;
          state.session.info = undefined;
          state.session.picture = undefined;
        }
      });
  },
  selectors: {
    getClientSession: (state) => state.session,
  },
});

export const { updateSession, updateSessionInfo } = authSlice.actions;

export const { getClientSession } = authSlice.selectors;

export default authSlice.reducer;

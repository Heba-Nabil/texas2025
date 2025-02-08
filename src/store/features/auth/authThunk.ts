import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientSideFetch } from "@/utils";
import { routeHandlersKeys } from "@/utils/constants";
// Types
import { GenericResponse } from "@/types";
import {
  ApplicationUserResponseProps,
  GuestTokenResponseProps,
} from "@/types/api";

// Guest
type GuestTokenizeThunkDataProps = {
  RecaptchaToken: string;
  AllowTracking: string;
  locale: string;
};

export const guestTokenizeThunk = createAsyncThunk(
  "auth/guestTokenizeStatus",
  async (data: GuestTokenizeThunkDataProps) => {
    const { locale, ...rest } = data;

    const response = await clientSideFetch<
      GenericResponse<GuestTokenResponseProps>
    >(
      `${process.env.NEXT_PUBLIC_API}/${data?.locale}${routeHandlersKeys.createGuest}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
        }),
      },
    );

    return response;
  },
);

// User login
type UserLoginThunkDataProps = {
  locale: string;
  UserName: string;
  Password: string;
  ReCaptchaToken: string;
};

export const userLoginThunk = createAsyncThunk(
  "auth/userLoginStatus",
  async (data: UserLoginThunkDataProps) => {
    const { locale, ...rest } = data;

    const response = await clientSideFetch<
      GenericResponse<ApplicationUserResponseProps>
    >(
      `${process.env.NEXT_PUBLIC_API}/${data?.locale}${routeHandlersKeys.userLogin}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
        }),
      },
    );

    return response;
  },
);

// User signup
type UserSignupThunkDataProps = {
  locale: string;
  ReCaptchaToken: string;
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  Password: string;
  IsSubscribedMarketing?: boolean;
  IsSubscribedNotification?: boolean;
};

export const userSignupThunk = createAsyncThunk(
  "auth/userSignupStatus",
  async (data: UserSignupThunkDataProps) => {
    const { locale, ...rest } = data;

    const response = await clientSideFetch<
      GenericResponse<ApplicationUserResponseProps>
    >(
      `${process.env.NEXT_PUBLIC_API}/${data?.locale}${routeHandlersKeys.userSignup}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
        }),
      },
    );

    return response;
  },
);

// User forget password
type UserForgetPasswordThunkDataProps = {
  locale: string;
  Email: string;
  Phone: string;
};

export const userForgetPasswordThunk = createAsyncThunk(
  "auth/userForgetPasswordStatus",
  async (data: UserForgetPasswordThunkDataProps) => {
    const { locale, ...rest } = data;

    const response = await clientSideFetch<GenericResponse<string>>(
      `${process.env.NEXT_PUBLIC_API}/${data?.locale}${routeHandlersKeys.forgetPassword}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
        }),
      },
    );

    return response;
  },
);

// Update logout
type UserLogOutThunkDataProps = {
  locale: string;
};

export const userLogoutThunk = createAsyncThunk(
  "auth/userLogoutStatus",
  async (data: UserLogOutThunkDataProps) => {
    const response = await clientSideFetch<
      GenericResponse<ApplicationUserResponseProps>
    >(
      `${process.env.NEXT_PUBLIC_API}/${data?.locale}${routeHandlersKeys.userLogout}`,
      {
        method: "POST",
      },
    );

    return response;
  },
);

// Delete Account
type UserDeleteAccountThunkDataProps = {
  locale: string;
};

export const userDeleteAccountThunk = createAsyncThunk(
  "auth/userDeleteAccountStatus",
  async (data: UserDeleteAccountThunkDataProps) => {
    const response = await clientSideFetch<GenericResponse<string>>(
      `${process.env.NEXT_PUBLIC_API}/${data?.locale}${routeHandlersKeys.userDeleteAccount}`,
      {
        method: "POST",
      },
    );

    return response;
  },
);

// Update user profile
type UpdateUserProfileThunkDataProps = {
  locale: string;
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  IsSubscribedMarketing?: boolean;
  IsSubscribedNotification?: boolean;
};

export const updateUserProfileThunk = createAsyncThunk(
  "auth/updateUserProfileStatus",
  async (data: UpdateUserProfileThunkDataProps) => {
    const { locale, ...rest } = data;

    const response = await clientSideFetch<GenericResponse<string>>(
      `${process.env.NEXT_PUBLIC_API}/${data?.locale}${routeHandlersKeys.updateUserProfile}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
        }),
      },
    );

    return response;

    // return {
    //   ...response,
    //   data: {
    //     FirstName: rest.FirstName,
    //     LastName: rest.LastName,
    //     Phone: rest.Phone,
    //     Email: rest.Email,
    //   },
    // };
  },
);

// Change user password
type ChangeUserPasswordThunkDataProps = {
  locale: string;
  OldPassword: string;
  NewPassword: string;
};

export const changeUserPasswordThunk = createAsyncThunk(
  "auth/changeUserPasswordStatus",
  async (data: ChangeUserPasswordThunkDataProps) => {
    const { locale, ...rest } = data;

    const response = await clientSideFetch<GenericResponse<string>>(
      `${process.env.NEXT_PUBLIC_API}/${data?.locale}${routeHandlersKeys.changeUserPassword}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
        }),
      },
    );

    return response;
  },
);

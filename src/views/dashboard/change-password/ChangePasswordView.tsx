"use client";

import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordFormSchema } from "@/utils/formSchema";
import { sanitizeInputs } from "@/utils";
import { useAppDispatch } from "@/store/hooks";
import { toggleModal } from "@/store/features/global/globalSlice";
import { changeUserPasswordThunk } from "@/store/features/auth/authThunk";
import DashBoardPagesWrapper from "../DashBoardPagesWrapper";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
// Types
import { ChangePasswordPageResourcesProps } from "@/types/resources";

const DynamicInputPassword = dynamic(
  () => import("@/components/input-password/InputPassword"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-10 w-full" />,
  },
);

type ChangePasswordViewProps = {
  locale: string;
  resources: ChangePasswordPageResourcesProps;
};

type ChangePasswordFormProps = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const defaultValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordView(props: ChangePasswordViewProps) {
  const { resources, locale } = props;

  const dispatch = useAppDispatch();

  const formResources = {
    requiredPass: resources["requiredPass"],
    maxLength: resources["maxLength"],
    character: resources["character"],
    passwordNotValid: resources["passwordNotValid"],
    passNotMatch: resources["passNotMatch"],
  };

  const form = useForm({
    resolver: async (data, context, options) => {
      const formSchema = await changePasswordFormSchema(formResources);

      return zodResolver(formSchema)(data, context, options);
    },
    defaultValues,
  });

  const handleChangePasswordSubmit = async (
    values: ChangePasswordFormProps,
  ) => {
    const valuesWithoutHack = sanitizeInputs(values);

    dispatch(toggleModal({ loadingModal: { isOpen: true } }));

    try {
      const toaster = (await import("@/components/global/Toaster")).toaster;

      const formData = {
        locale,
        OldPassword: valuesWithoutHack.currentPassword,
        NewPassword: valuesWithoutHack.newPassword,
      };

      const response = await dispatch(
        changeUserPasswordThunk(formData),
      ).unwrap();

      if (response?.hasError) {
        form.reset();

        return response?.errors?.forEach((item: any) =>
          toaster.error({
            title: item.Title,
            message: item.Message,
          }),
        );
      }

      form.reset();
      toaster.success({ message: resources["passChangedSuccess"] });
    } catch (error) {
      console.error("Error in signing the user", (error as Error)?.message);
    } finally {
      dispatch(toggleModal({ loadingModal: { isOpen: false } }));
    }
  };

  return (
    <DashBoardPagesWrapper label={resources["changePassword"]}>
      <Form {...form}>
        <form
          className="w-full px-5"
          onSubmit={form.handleSubmit(handleChangePasswordSubmit)}
          noValidate
          autoComplete="off"
        >
          <div className="mb-4">
            <DynamicInputPassword
              form={form}
              name="currentPassword"
              id="currentPassword"
              label={resources["currentPassword"]}
              // showStrength={true}
              // showValidationRules={true}
            />
          </div>

          <div className="mb-4">
            <DynamicInputPassword
              form={form}
              name="newPassword"
              id="newPassword"
              label={resources["newPassword"]}
              showStrength={true}
              showValidationRules={true}
            />
          </div>

          <div className="mb-4">
            <DynamicInputPassword
              form={form}
              name="confirmPassword"
              id="confirmPassword"
              label={resources["confirmPassword"]}
              // showStrength={true}
              // showValidationRules={true}
            />
          </div>

          {/* <div className="mb-4">
            <NextLink
              href="/forgetpassword"
              className="smooth text-sm capitalize underline hover:text-main"
            >
              {resources["forgetPass"]}
            </NextLink>
          </div> */}

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="light"
              className="min-w-[120px] max-sm:flex-1"
              disabled={!form.formState.isDirty}
              onClick={() => form.reset()}
            >
              {resources["cancel"]}
            </Button>

            <Button type="submit" className="min-w-[120px] max-sm:flex-1">
              {resources["saveUpdates"]}
            </Button>
          </div>
        </form>
      </Form>
    </DashBoardPagesWrapper>
  );
}

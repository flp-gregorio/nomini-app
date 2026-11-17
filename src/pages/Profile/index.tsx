import { useState } from "react";
import { useForm } from "react-hook-form";
import ButtonComponent from "../../components/ButtonComponent";
import InputComponent from "../../components/InputComponent";
import { useAuth } from "../../hooks/useAuth";
import api from "../../lib/api";

interface IFormInput {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  const { user } = useAuth();
  const username = user?.username ?? "";
  const [successMessage, setSuccessMessage] = useState<string>("");

  const onSubmit = async (data: IFormInput) => {
    setSuccessMessage("");
    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      await api.put("/auth/change-password", {
        currentPassword: data.password,
        newPassword: data.newPassword,
      });
      setSuccessMessage("Password updated successfully");
      reset();
    } catch (error) {
      console.error("Error updating password:", error);
      const err = error as { response?: { data?: { error?: string } } };
      const errorMessage =
        err.response?.data?.error || "Failed to update password";
      if (errorMessage.toLowerCase().includes("current password")) {
        setError("password", { type: "manual", message: errorMessage });
      } else {
        setError("root", { type: "manual", message: errorMessage });
      }
    }
  };

  return (
    <div className="flex justify-center items-start py-6 sm:py-10 px-4">
      <div className="bg-zinc-900 p-6 sm:p-8 shadow-md max-w-2xl w-full mx-auto overflow-visible border border-zinc-800/80">
        <div>
          <div className="text-white text-xl mb-6 font-semibold text-center">
            Hello, {username && <span className="text-orange-700">{username}</span>}!
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="text-white text-2xl mt-8 font-bold uppercase transition-colors">
            Change Password
          </p>
          {successMessage && (
            <p className="text-green-500 mt-2">{successMessage}</p>
          )}
          {errors.root && (
            <p className="text-red-500 mt-2">{errors.root.message}</p>
          )}
          <div className="mt-4">
            <InputComponent
              label="CURRENT PASSWORD"
              type="password"
              placeholder=""
              {...register("password", { required: "Current password is required" })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="mt-4">
            <InputComponent
              label="NEW PASSWORD"
              type="password"
              placeholder=""
              {...register("newPassword", { required: "New password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
            />
            {errors.newPassword && (
              <span className="text-red-500 text-sm">
                {errors.newPassword.message}
              </span>
            )}
          </div>
          <div className="mt-4">
            <InputComponent
              label="CONFIRM NEW PASSWORD"
              type="password"
              placeholder=""
              {...register("confirmPassword", { required: "Confirm password is required" })}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <div className="mt-6">
            <ButtonComponent text="SAVE CHANGES" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

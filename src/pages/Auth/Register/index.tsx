import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ButtonComponent from "../../../components/ButtonComponent";
import InputComponent from "../../../components/InputComponent";
import LayoutAuthComponent from "../../../components/Layouts/LayoutAuthComponent";
import api from "../../../lib/api";
import { AxiosError } from "axios";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const { register, handleSubmit } = useForm<IFormInput>();
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: IFormInput) => {


    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await api.post("/auth/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      nav("/login");
    } catch (error) {
      if (error instanceof AxiosError) {
        const msg = error.response?.data?.error ?? "Something went wrong";
        console.log("Error registering:", msg);
        setError(msg);
      }
    }
  };

  return (
    <LayoutAuthComponent
      src="https://media.wired.com/photos/6516df152a96d14834d98190/master/w_1920,c_limit/EA-FC-Is-Just-FIFA-Culture.jpg"
      title="Register"
      description="Create an account to get started"
    >
      <form className="font-montserrat" onSubmit={handleSubmit(onSubmit)}>
        <InputComponent
          label="Username"
          type="text"
          placeholder="Your Username"
          {...register("username")}
        />
        <div className="mt-6"></div>
        <InputComponent
          label="Email"
          type="email"
          placeholder="Your Email"
          {...register("email")}
        />
        <div className="mt-6"></div>
        <InputComponent
          label="Password"
          type="password"
          placeholder="Your Password"
          {...register("password")}
        />
        <div className="mt-6"></div>
        <InputComponent
          label="Confirm Password"
          type="password"
          placeholder="Confirm Your Password"
          {...register("confirmPassword")}
        />
        {error && (
          <p className="mt-6 text-center text-red-500 text-sm">{error}</p>
        )}
        <div className="mt-6 w-40 mx-auto">
          <ButtonComponent text="Register" type="submit" />
        </div>
      </form>
      <p className="mt-6 text-sm text-center text-gray-400">
        Already have an account?{" "}
        <Link
          to={"/login"}
          className="text-orange-500 focus:outline-none focus:underline hover:underline"
        >
          Sign in
        </Link>
        .
      </p>
    </LayoutAuthComponent>
  );
};

export default Register;

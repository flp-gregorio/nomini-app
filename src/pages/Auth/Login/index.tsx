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
  password: string;
}

const Login = () => {
  const { register, handleSubmit } = useForm<IFormInput>();
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: IFormInput) => {
    try {
      const response = await api.post("/auth/login", data);
      localStorage.setItem("jwt", response.data.token);
      nav("/nominees");
    } catch (error) {
      if (error instanceof AxiosError) {
        const msg = error.response?.data?.error ?? "Something went wrong";
        console.log("Login error:", msg);
        setError(msg);
      }
    }
  };

  return (
    <LayoutAuthComponent
      src="https://media.wired.com/photos/6516df152a96d14834d98190/master/w_1920,c_limit/EA-FC-Is-Just-FIFA-Culture.jpg"
      title="Login"
      description="Sign in to access your account"
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
          label="Password"
          type="password"
          placeholder="Your Password"
          {...register("password")}
        />
        {error && (
          <p className="mt-6 text-center text-red-500 text-sm">{error}</p>
        )}
        <div className="mt-6 w-40 mx-auto">
          <ButtonComponent text="Login" type="submit" />
        </div>
      </form>
      <p className="mt-6 text-sm text-center text-gray-400">
        Don&#x27;t have an account yet?{" "}
        <Link
          to={"/register"}
          className="text-orange-500 focus:outline-none focus:underline hover:underline"
        >
          Sign up
        </Link>
        .
      </p>

    </LayoutAuthComponent>
  );
};

export default Login;

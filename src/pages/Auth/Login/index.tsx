import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideHero from "../../../components/SideHero";
import ButtonComponent from "../../../components/ButtonComponent";
import InputComponent from "../../../components/InputComponent";
import LayoutAuthComponent from "../../../components/Layouts/LayoutAuthComponent";
import api from "../../../lib/api";
import { dataService } from "../../../services/dataService";
import { AxiosError } from "axios";
import { useAuth } from "../../../hooks/useAuth";

interface IFormInput {
  username: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit } = useForm<IFormInput>();
  const nav = useNavigate();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: IFormInput) => {
    try {
      const response = await api.post("/auth/login", data);
      localStorage.setItem("jwt", response.data.token);

      // Warm public categories catalog and user context in parallel without blocking navigation
      void dataService.getCategoriesWithNominees().catch(() => {});
      void refreshUser();

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
      sideContent={
        <SideHero
          title={
            <h1 className="text-7xl lg:text-9xl font-black font-barlow text-white tracking-tighter leading-none uppercase">
              Enter <br />
              The Arena
            </h1>
          }
          subtitle="Log in. Vote. Dominate The Game Awards 2026 season."
        />
      }
      title="Login"
      description="Sign in to access your account"
    >
      <form className="font-montserrat" onSubmit={handleSubmit(onSubmit)}>
        <InputComponent
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="Your Username"
          {...register("username")}
        />
        <div className="mt-6"></div>
        <InputComponent
          label="Password"
          type="password"
          autoComplete="current-password"
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

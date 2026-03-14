
import { Button, Form, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { tokenContext } from "../../Context/AuthContextprovider/AuthContextprovider";

/* ================= ZOD SCHEMA ================= */

const schema = z.object({
  email: z.string().email("Please enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
});

/* ================= COMPONENT ================= */

export default function Login() {

  const { getUserData } = useContext(tokenContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* ================= LOGIN FUNCTION ================= */

  async function sendUserLogin(data) {
    setIsLoading(true);
    setApiError("");

    try {
      const response = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        data
      );
      localStorage.setItem("token", response.data.data.token);

      getUserData()

      navigate("/Post");

    } catch (error) {
      setApiError(
        error?.response?.data?.message ||
        "Incorrect email or password"
      );
    }

    setIsLoading(false);
  }

  /* ================= UI ================= */

  return (
    <Form
      onSubmit={handleSubmit(sendUserLogin)}
      className="w-full max-w-xl mt-9 bg-white border-2 border-gray-300
      p-6 rounded-3xl shadow-2xl mx-auto flex flex-col gap-4"
    >

      {/* Tabs */}
      <div className="flex w-full gap-2 bg-gray-200 rounded-xl p-1">
        <NavLink
          to="/Login"
          className={({ isActive }) =>
            `text-xl font-semibold text-center w-1/2 py-2 rounded-xl transition ${
              isActive ? "bg-white shadow" : ""
            }`
          }
        >
          Login
        </NavLink>

        <NavLink
          to="/Register"
          className={({ isActive }) =>
            `text-xl font-semibold text-center w-1/2 py-2 rounded-xl transition ${
              isActive ? "bg-white shadow" : ""
            }`
          }
        >
          Register
        </NavLink>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold">
          Log in to Route Posts
        </h2>
        <b>Log in and continue your social journey.</b>
      </div>

      {/* Email */}
      <Input
        label="Email"
        type="email"
        {...register("email")}
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        labelPlacement="outside"
        placeholder="Enter your email"
      />

      {/* Password */}
      <Input
        type="password"
        label="Password"
        {...register("password")}
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        labelPlacement="outside"
        placeholder="Enter your password"
      />

      {/* Button */}
      <Button
        color="primary"
        className="w-full"
        type="submit"
        isLoading={isLoading}
      >
        Login
      </Button>

      {/* API Error */}
      {apiError && (
        <p className="
          text-red-500
          bg-red-100/40
          border border-red-300/60
          text-center
          py-3
          w-full
          rounded-xl
        ">
          {apiError}
        </p>
      )}

    </Form>
  );
}
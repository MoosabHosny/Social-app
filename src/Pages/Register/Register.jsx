import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";

/* ================= ZOD SCHEMA ================= */

const schema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .regex(/[a-zA-Z][a-zA-Z ]{3,20}/, "Enter valid name"),

    username: z.string().optional(),

    email: z.string().email("Please enter a valid email"),

    dateOfBirth: z.coerce.date().transform(function (value) {
      return value.toLocaleDateString("en-CA");
    }),

    gender: z.enum(["male", "female"], {
      required_error: "Gender is required",
    }),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must include uppercase, lowercase, number and symbol",
      ),

    rePassword: z.string(),
  })
  .refine(
    function ({ password, rePassword }) {
      if (password == rePassword) {
        return true;
      }
      return false;
    },
    {
      error: "Please confirm your password",
      path: ["rePassword"],
    },
  );

/* ================= COMPONENT ================= */

export default function Register() {
  const myNavigate = useNavigate()
  const [apiError, setApiError] = useState("");
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
  });

  async function sendUserRegister(data) {
    setIsLoading(true)
    setApiError("");
    try {
      const response = await axios.post("https://route-posts.routemisr.com/users/signup", data);
      
      // localStorage.setItem("token", response.data.data.token);
      
      // setToken(response.data.data.token);
      
      myNavigate('/Login')
    }
    catch (error) {
        setApiError(
        error?.response?.data?.message ||
        "Unable to connect to API at https://route-posts.routemisr.com. Please check backend availability."
      );
    // console.log("Error ❌:", error.response);   
  }
    setIsLoading(false)
  }
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Form
      onSubmit={handleSubmit(sendUserRegister)}
      className="w-full max-w-xl mt-9 bg-white border-2 border-gray-500 p-5 rounded-4xl shadow-2xl mx-auto flex flex-col gap-4"
    >
      
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

      <h2 className="text-2xl font-bold">Create a new account</h2>
 

      {/* NAME */}
      <Input
        label="Full Name"
        {...register("name")}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        labelPlacement="outside"
      />

      {/* USERNAME */}
      <Input
        label="Username"
        {...register("username")}
        labelPlacement="outside"
      />

      {/* EMAIL */}
      <Input
        label="Email"
        type="email"
        {...register("email")}
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        labelPlacement="outside"
      />

      {/* DATE */}
      <Input
        type="date"
        label="Date Of Birth"
        {...register("dateOfBirth")}
        isInvalid={!!errors.dateOfBirth}
        errorMessage={errors.dateOfBirth?.message}
        labelPlacement="outside"
      />

      {/* GENDER SELECT */}
      <Controller
        name="gender"
        control={control}
        render={(x) => (
          <Select
            label="Gender"
            {...x.field}
            labelPlacement="outside"
            selectedKeys={[x.field.value]}
            // onSelectionChange={(keys) => x.field.onChange(Array.from(keys)[0])}
            isInvalid={!!errors.gender}
            errorMessage={errors.gender?.message}
          >
            <SelectItem key="male">Male</SelectItem>
            <SelectItem key="female">Female</SelectItem>
          </Select>
        )}
      />

      {/* PASSWORD */}
      <Input
        type="password"
        label="Password"
        {...register("password")}
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        labelPlacement="outside"
      />

      {/* CONFIRM PASSWORD */}
      <Input
        type="password"
        label="Confirm Password"
        {...register("rePassword")}
        isInvalid={!!errors.rePassword}
        errorMessage={errors.rePassword?.message}
        labelPlacement="outside"
      />
      <Button color="primary" className="w-full" type="submit" isLoading={isLoading}>
        Create New Account
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



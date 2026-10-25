
import { useForm } from "react-hook-form";
import { RegisterSchema, type RegisterSchemaType } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {

const navigate = useNavigate();
const [apiError, setapiError] = useState(null)
const [isLoading, setisLoading] = useState(false)

  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(RegisterSchema),
  });

  const { register, handleSubmit, formState } = form;

  function handleRegister(Values: RegisterSchemaType) {
    // console.log("Form Values:", Values);
    setisLoading(true)

    axios
      .post("https://route-posts.routemisr.com/users/signup", Values)
      .then((res) => {
       if(res.data.success){
        alert(res.data.message);
navigate("/login");
       }
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setapiError(err.response.data.message);
      }).finally(() => {
        setisLoading(false)
      })
  }

  return (
    <>
      <h1 className="text-center text-5xl font-bold">
        Register Now
      </h1>

{apiError && <p className="bg-red-500 text-white text-center font-bold p-2 rounded-sm  w-[300px] mx-auto "> {apiError}</p>}


      <form
        onSubmit={handleSubmit(
          handleRegister,
          (errors) => console.log("Validation Errors:", errors)
        )}
        className="max-w-md mx-auto my-5"
      >
        {/* Name */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("name")}
            type="text"
            id="name"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />

          <label
            htmlFor="name"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Enter your Name
          </label>

          {formState.errors.name?.message &&
            formState.touchedFields.name && (
              <p className="text-red-700 font-bold text-sm mt-2">
                {formState.errors.name.message}
              </p>
            )}
        </div>

        {/* Email */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("email")}
            type="email"
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />

          <label
            htmlFor="email"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Enter your Email
          </label>

          {formState.errors.email?.message &&
            formState.touchedFields.email && (
              <p className="text-red-700 font-bold text-sm mt-2">
                {formState.errors.email.message}
              </p>
            )}
        </div>

        {/* Date of Birth */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("dateOfBirth")}
            type="date"
            id="dateOfBirth"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />

          <label
            htmlFor="dateOfBirth"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Enter your Birthday
          </label>

          {formState.errors.dateOfBirth?.message &&
            formState.touchedFields.dateOfBirth && (
              <p className="text-red-700 font-bold text-sm mt-2">
                {formState.errors.dateOfBirth.message}
              </p>
            )}
        </div>

        {/* Password */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("password")}
            type="password"
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />

          <label
            htmlFor="password"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Enter your Password
          </label>

          {formState.errors.password?.message &&
            formState.touchedFields.password && (
              <p className="text-red-700 font-bold text-sm mt-2">
                {formState.errors.password.message}
              </p>
            )}
        </div>

        {/* Confirm Password */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("rePassword")}
            type="password"
            id="rePassword"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />

          <label
            htmlFor="rePassword"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Confirm your Password
          </label>

          {formState.errors.rePassword?.message && (
            <p className="text-red-700 font-bold text-sm mt-2">
              {formState.errors.rePassword.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="flex items-center gap-3">
          <div className="flex items-center mb-4">
            <input
              {...register("gender")}
              id="country-option-1"
              type="radio"
              value="male"
              className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
            />

            <label
              htmlFor="country-option-1"
              className="select-none ms-2 text-sm font-medium text-heading"
            >
              Male
            </label>
          </div>

          <div className="flex items-center mb-4">
            <input
              {...register("gender")}
              id="country-option-2"
              type="radio"
              value="female"
              className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
            />

            <label
              htmlFor="country-option-2"
              className="select-none ms-2 text-sm font-medium text-heading"
            >
              Female
            </label>
          </div>
        </div>

        {formState.errors.gender?.message && (
          <p className="text-red-700 font-bold text-sm mb-3">
            {formState.errors.gender.message}
          </p>
        )}

      
        <button
disabled={isLoading}
          type="submit"
          className="disabled:bg-slate-900 disabled:text-white disabled:cursor-not-allowed   text-white bg-blue-500 w-full rounded-lg cursor-pointer hover:bg-blue-700 transition-all border border-transparent focus:ring-4 shadow-xs font-medium text-sm px-4 py-2.5 focus:outline-none"
        >
          {isLoading ?  "Loading..." : "Register"}
        </button>

<div className="flex justify-center my-2 text-blue-600 font-bold underline cursor-pointer">

<Link to ={"/login"} >Do You Have An Account? GO Login </Link>

</div>


      </form>
    </>
  );
}

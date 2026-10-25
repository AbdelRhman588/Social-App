
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginSchemaType } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [apiError, setapiError] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState(false);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("Login must be inside AuthContextProvider");
  }

  const { setuserLogin } = authContext;

  const form = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const { register, handleSubmit, formState } = form;

  function handleLogin(values: LoginSchemaType) {
    setisLoading(true);
    setapiError(null);

    axios
      .post("https://route-posts.routemisr.com/users/signin", values)
      .then((res) => {
        if (res.data.success) {
          const token = res.data.data.token;

          localStorage.setItem("userToken", token);
          setuserLogin(token);

          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err.response?.data?.message);
        setapiError(
          err.response?.data?.message ?? "Something went wrong"
        );
      })
      .finally(() => {
        setisLoading(false);
      });
  }

  return (
    <>
      <h1 className="text-center text-5xl font-bold">
        Login Now
      </h1>

      {apiError && (
        <p className="bg-red-500 text-white text-center font-bold p-2 rounded-sm w-[300px] mx-auto">
          {apiError}
        </p>
      )}

      <form
        noValidate
        onSubmit={handleSubmit(handleLogin)}
        className="max-w-md mx-auto my-5"
      >
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

          {formState.errors.email?.message && (
            <p className="text-red-700 font-bold text-sm mt-2">
              {formState.errors.email.message}
            </p>
          )}
        </div>

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

          {formState.errors.password?.message && (
            <p className="text-red-700 font-bold text-sm mt-2">
              {formState.errors.password.message}
            </p>
          )}
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="disabled:bg-slate-900 disabled:text-white disabled:cursor-not-allowed text-white bg-blue-500 w-full rounded-lg cursor-pointer hover:bg-blue-700 transition-all border border-transparent focus:ring-4 shadow-xs font-medium text-sm px-4 py-2.5 focus:outline-none"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>

        <div className="flex justify-center my-2 text-blue-600 font-bold underline cursor-pointer">
          <Link to="/register">
            Don't You Have An Account? GO Register
          </Link>
        </div>
      </form>
    </>
  );
}

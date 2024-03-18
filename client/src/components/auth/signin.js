import axios from "axios";
import React, { useContext } from "react";
import { useForm, useFormState } from "react-hook-form";
import instance from "../../services/api/api.service";
import AuthContext from "../../store/auth-context";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    control,
  } = useForm({
    defaultValues: {
      name: "mohammad",
      password: 18,
    },
  });

  const { isSubmitted, isSubmitting } = useFormState({
    control,
  });

  const handleSuccess = async (data) => {
    try {
      const response = await instance({
        url: "users/signin",
        method: "POST",
        data: data,
        withCredentials: true,
      });

      auth.login(response.data);
      navigate("/");
    } catch (err) {
      setError("root.serverError", {
        message: err.response.data?.errors[0]?.message,
      });
    }
  };
  console.log(errors.root);
  const handleErrors = (errorsDetails) => {
    console.log(errorsDetails);
  };

  return (
    <div className="  bg-gradient-to-t from-yellow-200 to-yellow-300  h-3/4 w-1/3 min-w-96 mt-10 rounded-md    shadow-md  shadow-zinc-200 gap-8 flex flex-col items-center    ">
      <h2 className="text-2xl text-white font-bold  mt-8 ">Signin</h2>

      {errors.root?.serverError?.message && (
        <h1 className=" text-white bg-red-700 p-4  rounded-md shadow-md shadow-zinc-200">
          {errors.root?.serverError?.message}
        </h1>
      )}

      {errors.name && <h1>{errors?.name.message}</h1>}
      {isSubmitting ? (
        <div className="flex flex-col w-full items-center text-white">
          <h1>Helllo</h1>
        </div>
      ) : (
        <form
          className="flex flex-col w-full   gap-4 items-center mt-10 text-indigo-500"
          onSubmit={handleSubmit(handleSuccess, handleErrors)}
        >
          <div className="mb-4 text-left w-1/2 min-w-80">
            <label className="text-white  mb-2   [text-shadow:_0_1px_0_cyan] ml-1 block">
              name
            </label>
            <input
              className=" text-cyan-600  border border-gray-300 w-full   outline-none hover:border-gray-500
              focus-within:border-gray-500  focus:border-2  rounded px-4 py-2"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-red-500 mb-2"> name is required.</p>
            )}
            {errors.name?.types?.serverMessage && (
              <p className="text-red-500 mb-2">
                {" "}
                {errors.name?.types?.serverMessage}
              </p>
            )}
          </div>
          <div className="mb-4 text-left w-1/2 min-w-80">
            <label className="text-white [text-shadow:_0_1px_0_cyan] mb-2 ml-1 block">
              password
            </label>

            <input
              className=" text-cyan-600 w-full border border-gray-300  outline-none
               hover:border-gray-500
                focus-within:border-gray-500  focus:border-2 rounded px-4 py-2"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 mb-2">
                Please enter number for password.
              </p>
            )}
          </div>

          <input
            className="px-4 py-2 mt-20 rounded-md shadow-sky-900 shadow-md hover:bg-cyan-400 hover:cursor-pointer bg-cyan-600 text-white"
            type="submit"
            value="submit"
          ></input>
        </form>
      )}
    </div>
  );
};

export default Signin;

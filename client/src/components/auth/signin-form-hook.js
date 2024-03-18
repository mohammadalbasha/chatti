import React from "react";
import { useForm, useFormState } from "react-hook-form";

const Signin = () => {
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
      age: 18,
    },
  });

  const { dirtyFields, isDirty, isSubmitted, isSubmitting } = useFormState({
    control,
  });

  console.log(dirtyFields, isDirty, isSubmitting);

  const handleSuccess = async (data) => {
    console.log(data);
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 10000);
    });
    setError(
      "customError",
      { message: "name dublicated" },
      { shouldFocus: true }
    );

    setError("name", {
      types: {
        serverMessage: "server message",
      },
    });

    setTimeout(() => {
      reset();
    }, 1000);
  };
  const handleErrors = (errorsDetails) => {
    console.log(errorsDetails);
  };

  console.log(errors.name);
  return (
    <div className="bg-primary h-screen gap-4 flex flex-col items-center justify-center ">
      {isSubmitted && <h1>Yeeeeh</h1>}
      {errors.customError && <h1>{errors?.customError.message}</h1>}
      <h2 className="text-2xl font-bold mb-4">Signin</h2>
      {isSubmitting ? (
        <div className="flex flex-col w-full items-center text-white">
          <h1>Helllo</h1>
        </div>
      ) : (
        <form
          className="flex flex-col w-full  gap-4 items-center"
          onSubmit={handleSubmit(handleSuccess, handleErrors)}
        >
          <div className="mb-4 w-full">
            <input
              className="border border-gray-300 w-1/2 min-w-80 rounded px-4 py-2"
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
          <div className="mb-4 w-full">
            <input
              className="border border-gray-300 w-1/2 min-w-80 rounded px-4 py-2"
              {...register("age", { pattern: /\d+/ })}
            />
            {errors.age && (
              <p className="text-red-500 mb-2">Please enter number for age.</p>
            )}
          </div>

          <input type="submit" value="submit"></input>
        </form>
      )}
    </div>
  );
};

export default Signin;

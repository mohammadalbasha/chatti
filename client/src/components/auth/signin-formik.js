import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Signin = () => {
  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 10000);
    });

    console.log(values);

    // setSubmitting(false);
    //    resetForm();
    // Call the API endpoint to sign in the user
    // You can access the form values from the `values` parameter
    // You can use the `setSubmitting` function to control the form submission state
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Please enter your email"),
    password: Yup.string().required("Please enter your password"),
  });

  return (
    <div className="bg-primary h-screen gap-4 flex flex-col items-center justify-center ">
      <h2 className="text-2xl font-bold mb-4">Signin</h2>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        className="w-full"
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => {
          return isSubmitting ? (
            <div className="flex flex-col w-full items-center text-white">
              <h1>Helllo</h1>
            </div>
          ) : (
            <Form className="flex flex-col w-full  gap-4 items-center">
              <div className="mb-4 w-full">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="border border-gray-300 w-1/2 min-w-80 rounded px-4 py-2"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 mb-2"
                />
              </div>
              <div className="mb-4 w-full">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="border border-gray-300 w-1/2 min-w-80 rounded px-4 py-2"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 mb-2"
                />
              </div>
              <button
                className={`${
                  isSubmitting ? "bg-blue-100" : "bg-blue-500"
                } text-white px-4 py-2 rounded`}
                type="submit"
                disabled={isSubmitting}
              >
                Sign In
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Signin;

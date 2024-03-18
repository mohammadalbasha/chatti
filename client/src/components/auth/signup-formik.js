import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Signup = () => {
  const handleFormSubmit = (values, { setSubmitting }) => {
    // Call the API endpoint to sign up the user
    // You can access the form values from the `values` parameter
    // You can use the `setSubmitting` function to control the form submission state
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Please enter your name"),
    password: Yup.string().required("Please enter your password"),
    picture: Yup.mixed().required("Please select a picture"),
  });

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <Formik
        initialValues={{ name: "", password: "", picture: null }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        <Form className="flex flex-col items-center">
          <div className="mb-4">
            <Field
              type="text"
              name="name"
              placeholder="Name"
              className="border border-gray-300 rounded px-4 py-2"
            />
            <ErrorMessage
              name="name"
              component="p"
              className="text-red-500 mb-2"
            />
          </div>
          <div className="mb-4">
            <Field
              type="password"
              name="password"
              placeholder="Password"
              className="border border-gray-300 rounded px-4 py-2"
            />
            <ErrorMessage
              name="password"
              component="p"
              className="text-red-500 mb-2"
            />
          </div>
          <div className="mb-4">
            <Field
              type="file"
              name="picture"
              placeholder="Picture"
              className="border border-gray-300 rounded px-4 py-2"
            />
            <ErrorMessage
              name="picture"
              component="p"
              className="text-red-500 mb-2"
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            type="submit"
          >
            Signup
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Signup;

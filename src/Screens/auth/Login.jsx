import React, { useState } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import authSvg from "../../assets/login.svg";
import { authenticate, isAuth } from "../../helpers/auth";

const Login = ({ history }) => {
  const [formData, setFormData] = useState({
    student_number: "",
    password: "",
  });

  const { student_number, password } = formData;

  // Handle change from inputs
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  // Submit data to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    if (student_number && password) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/login`, {
          student_number,
          password: password,
        })
        .then((res) => {
          authenticate(res, () => {
            setFormData({
              ...formData,
              student_number: "",
              password: "",
            });
          });

          // if authenticated but not admin redirect to /private
          isAuth() && isAuth().role === "admin"
            ? history.push("/dashboard")
            : history.push("/dashboard");
          toast.success(`Hey ${res.data.user.name}, welcome back.`);
        })
        .catch((err) => {
          toast.error(err.response.data.error);
        });
    } else {
      toast.error("Please fill all fields");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {isAuth() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Log into Account
            </h1>
            <form
              className="w-full flex-1 mt-8 text-indigo-500"
              onSubmit={handleSubmit}
            >
              <div className="mx-auto max-w-xs relative">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="student_number"
                  placeholder="Student Number"
                  onChange={handleChange("student_number")}
                  value={student_number}
                  autoComplete="on"
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange("password")}
                  value={password}
                />
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  Login
                </button>
                <Link
                  to="/users/password/forget"
                  className="no-underline hover:underline text-indigo-500 text-md text-right absolute right-0 mt-2"
                >
                  Forgot password?
                </Link>
                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform transform translate-y-1/2">
                    <a href="/register" target="_self">
                      Or Sign Up
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${authSvg})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Login;

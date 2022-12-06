import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";

import authSvg from "../../assets/auth.svg";
import { /*authenticate,*/ isAuth } from "../../helpers/auth";
import NoticeMessage from "../../Components/NoticeMessage";

const Register = ({ history }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    pref_first_name: "",
    student_number: "",
    password1: "",
    password2: "",
  });

  const [registerState, setRegister] = useState({
    registered: false,
  });

  const {
    student_number,
    first_name,
    last_name,
    pref_first_name,
    password1,
    password2,
  } = formData;

  const { registered } = registerState;

  // Handle change from inputs
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  // Submit data to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    if (first_name && last_name && student_number && password1) {
      let regex = /^n00[0-9]{6}$/i;
      let validStudentNumber = regex.test(student_number);
      if (
        // student_number != "suwelfare" ||
        // student_number != "sueducation" ||
        // student_number != "supresident" ||
        !validStudentNumber
      ) {
        console.log("match?", validStudentNumber);
        return toast.error("Enter a valid student number.");
      }
      if (password1 === password2) {
        axios
          .post(`${process.env.REACT_APP_API_URL}/register`, {
            first_name,
            last_name,
            pref_first_name:
              pref_first_name !== "" ? pref_first_name : first_name,
            student_number,
            password: password1,
          })
          .then((res) => {
            setFormData({
              ...formData,
              first_name: "",
              last_name: "",
              pref_first_name: "",
              student_number: "",
              password1: "",
              password2: "",
            });

            setRegister({
              registered: true,
            });
          })
          .catch((err) => {
            toast.error(err.response.data.error);
            console.log(err.response.data.error);
          });
      } else {
        toast.error("Passwords must match");
      }
    } else {
      toast.error("Please fill all required fields");
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        {isAuth() ? <Redirect to="/" /> : null}
        <ToastContainer />
        <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="mt-4 flex flex-col items-center">
              <Link to="/" className="text-xl xl:text-xl text-center ">
                {"<"} Home
              </Link>
              <div className="mx-auto max-w-xs relative text-center text-blue-700 mt-6">
                <p>Thank you for registering!</p>
                <p className="pt-6">
                  Check your student email for a link to activate your account.
                  Please check your&nbsp;<strong>Junk Mail</strong>&nbsp;folder.
                </p>
                <p className="pt-6 text-red-700">
                  If you do not receive it after 5 minutes, please email&nbsp;
                  <strong>help.iadtsu@gmail.com</strong>&nbsp;from your student
                  account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {isAuth() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-4 flex flex-col items-center">
            <Link to="/" className="text-xl xl:text-xl text-center ">
              {"<"} Home
            </Link>
            <NoticeMessage style={"my-6"} />
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Sign up for an Account
            </h1>
            <form
              className="w-full flex-1 mt-8 text-indigo-500"
              onSubmit={handleSubmit}
            >
              <div className="mx-auto max-w-xs relative">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="First Name"
                  onChange={handleChange("first_name")}
                  value={first_name}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="text"
                  placeholder="Preferred Name (leave blank if same)"
                  onChange={handleChange("pref_first_name")}
                  value={pref_first_name}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="text"
                  placeholder="Last Name"
                  onChange={handleChange("last_name")}
                  value={last_name}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="student_number"
                  placeholder="Student Number"
                  onChange={handleChange("student_number")}
                  value={student_number}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange("password1")}
                  value={password1}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Confirm Password"
                  onChange={handleChange("password2")}
                  value={password2}
                />
                <div className="w-full px-8 py-4 font-medium text-sm mt-5">
                  An activation link will be sent to your student email.&nbsp;
                  <strong>Make sure your student number is correct.</strong>
                </div>
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  Register
                </button>
              </div>
              <div className="flex flex-col items-center">
                <a
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
                  href="/login"
                  target="_self"
                >
                  <i className="fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500" />
                  <span className="ml-4">Sign In</span>
                </a>
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

export default Register;

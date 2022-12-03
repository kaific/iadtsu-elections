import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import jwt from "jsonwebtoken";

import authSvg from "../../assets/welcome.svg";
import { authenticate, isAuth } from "../../helpers/auth";

const Activate = ({ match }) => {
  const [formData, setFormData] = useState({
    user: "",
    token: "",
    show: true,
    activated: false,
    error: false,
    errorMessage: "",
  });

  useEffect(() => {
    /* 
      get token from params like /activate/token
      then decode token and get name
    */
    let token = match.params.token;
    let user = jwt.decode(token);

    if (token) {
      setFormData({ ...formData, user, token });
    }
  }, [match.params]);

  const { user, token, activated, error, errorMessage } = formData;

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_URL}/activation`, {
        token,
      })
      .then((res) => {
        setFormData({ ...formData, activated: true, error: false });
        toast.success(res.data.message);
      })
      .catch((err) => {
        setFormData({
          ...formData,
          activated: false,
          error: true,
          errorMessage: err.response.data.error,
        });
        toast.error(err.response.data.error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {isAuth() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <Link to="/" className="text-xl xl:text-xl text-center ">
              {"<"} Home
            </Link>
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Welcome {user.pref_first_name}
            </h1>

            {activated ? (
              <React.Fragment>
                <p className="py-4 text-green-600">
                  Success! Your account has been activated. <br />
                  You can now sign in.
                </p>
                <Link
                  to="/login"
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                  <span className="ml-3">Sign In</span>
                </Link>
              </React.Fragment>
            ) : !error ? (
              <React.Fragment>
                <form
                  className="w-full flex-1 mt-8 text-indigo-500"
                  onSubmit={handleSubmit}
                >
                  <button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    Activate your account
                  </button>
                </form>
              </React.Fragment>
            ) : null}

            {error ? (
              <React.Fragment>
                <p className="text-red-600 py-4">
                  There was an error with activating your account:
                </p>
                <p className="text-red-600">{errorMessage}</p>
              </React.Fragment>
            ) : null}
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

export default Activate;

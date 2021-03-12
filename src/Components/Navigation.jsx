import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

import { isAuth, getCookie, signout } from "../helpers/auth";

const Navigation = (props) => (
  <>
    <div className="my-12 border-b text-center">
      <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
        User Panel
      </div>
    </div>
    <div className="mx-auto max-w-xs relative ">
      {props.role === "admin" ? (
        <Link
          to="/admin"
          className="mt-5 tracking-wide font-semibold bg-green-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
        >
          <i className="fas fa-sign-in-alt  w-6  -ml-2" />
          <span className="ml-3">Admin Dashboard</span>
        </Link>
      ) : null}
      <Link
        to="/dashboard"
        className="mt-5 tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
      >
        <i className="fas fa-sign-in-alt  w-6  -ml-2" />
        <span className="ml-3">Dashboard</span>
      </Link>
      <Link
        to="/nominations"
        className="mt-5 tracking-wide font-semibold bg-orange-500 text-gray-100 w-full py-4 rounded-lg hover:bg-orange-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
      >
        <i className="fas fa-sign-in-alt  w-6  -ml-2" />
        <span className="ml-3">Nominations</span>
      </Link>
      {/* <Link
        to="/elections"
        className="mt-5 tracking-wide font-semibold bg-purple-500 text-gray-100 w-full py-4 rounded-lg hover:bg-purple-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
      >
        <i className="fas fa-sign-in-alt  w-6  -ml-2" />
        <span className="ml-3">Dashboard</span>
      </Link> */}
      <button
        onClick={() => {
          signout(() => {
            toast.success("Signed out successfully");
            props.history.push("/");
          });
        }}
        className="mt-5 tracking-wide font-semibold bg-pink-500 text-gray-100 w-full py-4 rounded-lg hover:bg-pink-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
      >
        <i className="fas fa-sign-out-alt  w-6  -ml-2" />
        <span className="ml-3">Sign Out</span>
      </button>
    </div>
  </>
);

export default Navigation;

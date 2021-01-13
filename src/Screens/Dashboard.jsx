import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import authSvg from "../assets/update.svg";
import { updateUser, isAuth, getCookie, signout } from "../helpers/auth";

const Dashboard = ({ history }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    pref_first_name: "",
    student_number: "",
    textChange: "Update",
    role: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    const token = getCookie("token");
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/${isAuth()._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const {
          role,
          first_name,
          last_name,
          pref_first_name,
          student_number,
        } = res.data;
        setFormData({
          ...formData,
          role,
          first_name,
          last_name,
          pref_first_name,
          student_number,
        });
      })
      .catch((err) => {
        toast.error(`Error To Your Information ${err.response.statusText}`);
        if (err.response.status === 401) {
          signout(() => {
            history.push("/login");
          });
        }
      });
  };

  const {
    last_name,
    pref_first_name,
    student_number,
    textChange,
    role,
  } = formData;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-8/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <Link to="/" className="text-xl xl:text-xl text-center ">
              {"<"} Home
            </Link>
            <div className="w-full flex-1 mt-8 text-gray-700">
              <div className="mx-auto max-w-xs relative text-center text-blue-700">
                If you encounter any issues with the system, please email{" "}
                <strong>welfareiadt@gmail.com</strong>.
              </div>
              <div className="my-6 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Your information
                </div>
              </div>
              <div className="mx-auto max-w-xs relative text-center">
                Student number: {student_number}
                <br />
                Name: {pref_first_name} {last_name}
                <br />
              </div>
              <div className="my-6 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Select destination
                </div>
              </div>
              <div className="mx-auto max-w-xs relative ">
                {role == "admin" ? (
                  <Link
                    to="/admin"
                    className="mt-5 tracking-wide font-semibold bg-green-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                    <span className="ml-3">Admin Dashboard</span>
                  </Link>
                ) : null}
                <Link
                  to="/nominations"
                  className="mt-5 tracking-wide font-semibold bg-orange-500 text-gray-100 w-full py-4 rounded-lg hover:bg-orange-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                  <span className="ml-3">Nominations</span>
                </Link>
                <button
                  onClick={() => {
                    signout(() => {
                      toast.success("Signed out successfully");
                      history.push("/");
                    });
                  }}
                  className="mt-5 tracking-wide font-semibold bg-pink-500 text-gray-100 w-full py-4 rounded-lg hover:bg-pink-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <i className="fas fa-sign-out-alt  w-6  -ml-2" />
                  <span className="ml-3">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

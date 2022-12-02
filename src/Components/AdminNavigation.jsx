import React from "react";
import { Link } from "react-router-dom";

const AdminNavigation = (props) => (
  <>
    <div className="my-12 border-b text-center">
      <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
        Admin Panel
      </div>
    </div>
    <div className="mx-auto max-w-xs relative ">
      {props.history.location.pathname !== "/admin" ? (
        <Link
          to="/admin"
          className="mt-5 tracking-wide font-semibold bg-green-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
        >
          <i className="fas fa-sign-in-alt  w-6  -ml-2" />
          <span className="ml-3">Admin Dashboard</span>
        </Link>
      ) : null}
      {props.history.location.pathname !== "/admin/users" ? (
        <Link
          to="/admin/users"
          className="mt-5 tracking-wide font-semibold bg-pink-600 text-gray-100 w-full py-4 rounded-lg hover:bg-pink-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
        >
          <i className="fas fa-sign-in-alt  w-6  -ml-2" />
          <span className="ml-3">Manage Users</span>
        </Link>
      ) : null}
      {props.history.location.pathname !== "/admin/nominations" ? (
        <Link
          to="/admin/nominations"
          className="mt-5 tracking-wide font-semibold bg-orange-500 text-gray-100 w-full py-4 rounded-lg hover:bg-orange-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
        >
          <i className="fas fa-sign-in-alt  w-6  -ml-2" />
          <span className="ml-3">Manage Nominations</span>
        </Link>
      ) : null}
      {props.history.location.pathname !== "/admin/elections" ? (
        <Link
          to="/admin/elections"
          className="mt-5 tracking-wide font-semibold bg-purple-600 text-gray-100 w-full py-4 rounded-lg hover:bg-purple-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
        >
          <i className="fas fa-sign-in-alt  w-6  -ml-2" />
          <span className="ml-3">Manage Elections</span>
        </Link>
      ) : null}
    </div>
  </>
);

export default AdminNavigation;

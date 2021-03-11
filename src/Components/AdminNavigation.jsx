import React from "react";
import { Link } from "react-router-dom";

const AdminNavigation = ({ component: Component, ...rest }) => (
  <>
    <div className="my-12 border-b text-center">
      <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
        Admin Panel
      </div>
    </div>
    <div className="mx-auto max-w-xs relative ">
      <Link
        to="/admin"
        className="mt-5 tracking-wide font-semibold bg-green-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
      >
        <i className="fas fa-sign-in-alt  w-6  -ml-2" />
        <span className="ml-3">Admin Dashboard</span>
      </Link>
      <Link
        to="/admin/nominations"
        className="mt-5 tracking-wide font-semibold bg-orange-500 text-gray-100 w-full py-4 rounded-lg hover:bg-orange-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
      >
        <i className="fas fa-sign-in-alt  w-6  -ml-2" />
        <span className="ml-3">Manage Nominations</span>
      </Link>
    </div>
  </>
);

export default AdminNavigation;

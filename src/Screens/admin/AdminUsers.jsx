import React, { useState, useEffect, Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import AdminNavigation from "../../Components/AdminNavigation";
import Navigation from "../../Components/Navigation";
import NoticeMessage from "../../Components/NoticeMessage";

import { updateUser, isAuth, getCookie, signout } from "../../helpers/auth";
import { isEmpty } from "../../helpers/basic";

class AdminUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      role: "",
      first_name: "",
      last_name: "",
      pref_first_name: "",
      student_number: "",
      loaded: false,
      pendingUsers: [],
      hideCan: true,
    };
  }

  componentDidMount() {
    this.setState({ token: getCookie("token") }, async () => {
      await this.loadProfile();
      await this.loadPendingUsers();
    });
  }

  render() {
    const {
      first_name,
      last_name,
      pref_first_name,
      student_number,
      textChange,
      role,
      loaded,
      pendingUsers,
      hideCan,
    } = this.state;

    const { history } = this.props;

    let puCanColor = true;

    if (!loaded) {
      return "Loading...";
    }

    console.log(pendingUsers);

    return (
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <ToastContainer />
        <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-8/12 p-6 sm:p-12">
            <div className="mt-12 flex flex-col items-center">
              <Link to="/" className="text-xl xl:text-xl text-center ">
                {"<"} Home
              </Link>
              <div className="w-full flex-1 mt-8 text-indigo-500">
                <NoticeMessage />

                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Users
                  </div>
                </div>
                <div className="mx-auto max-w-md relative flex flex-col w-full text-gray-700">
                  <div className="-mx-3 mb-2 justify-center">
                    <div className="mt-2" id="pending-users">
                      <table className="shadow-lg mb-4 mx-auto">
                        <thead>
                          <tr>
                            <th
                              className="bg-purple-300 border text-center px-4 py-4"
                              colSpan="5"
                            >
                              <div className="block">
                                <div className="inline-block">
                                  Users Pending Account Activation:
                                </div>
                                <div className="inline-block ml-3">
                                  <button
                                    className="tracking-wide font-semibold bg-purple-600 text-gray-100 py-1 rounded-sm hover:bg-purple-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                    onClick={(e) => {
                                      this.hideElement(e, "pending-users");
                                    }}
                                  >
                                    <span className="px-1 text-xs">
                                      {hideCan ? "Unhide" : "Hide"}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </th>
                          </tr>
                          {hideCan ? (
                            ""
                          ) : (
                            <tr>
                              <th className="bg-purple-300 border text-center px-2 py-1">
                                Name
                              </th>
                              <th className="bg-purple-300 border text-center px-2 py-1">
                                Number
                              </th>
                              <th className="bg-purple-300 border text-center px-2 py-1">
                                Activate
                              </th>
                            </tr>
                          )}
                        </thead>
                        <tbody>
                          {isEmpty(pendingUsers) && !hideCan ? (
                            <tr>
                              <td>
                                <span>No pending users.</span>
                              </td>
                            </tr>
                          ) : hideCan ? (
                            ""
                          ) : isEmpty(pendingUsers) ? (
                            ""
                          ) : (
                            pendingUsers.map((u, i) => {
                              puCanColor = !puCanColor;
                              return (
                                <tr
                                  key={i}
                                  className={puCanColor ? "bg-purple-200" : ""}
                                >
                                  <td className="border text-left px-2 py-1">
                                    {u.pref_first_name}{" "}
                                    {u.pref_first_name !== u.first_name
                                      ? `(${first_name}) `
                                      : ""}
                                    {u.last_name}
                                  </td>
                                  <td className="border text-left px-2 py-1">
                                    {u.student_number}
                                  </td>
                                  <td className="border text-center justify-center px-2 py-1 w-12">
                                    <a
                                      href={`http://localhost:3000/users/activate/${u.activationToken}`}
                                      className="button my-2 tracking-wide font-semibold bg-purple-600 text-gray-100 py-1 rounded-sm hover:bg-purple-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                      target="_blank"
                                    >
                                      <span className="px-2 py-1 text-xs">
                                        Activate Manually
                                      </span>
                                    </a>
                                    {/* <button
                                      className="tracking-wide font-semibold bg-purple-600 text-gray-100 py-1 rounded-sm hover:bg-purple-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                      onClick={(e) => {
                                        this.activateUser();
                                      }}
                                    >
                                      <span className="px-1 text-xs">
                                        Activate Manually
                                      </span>
                                    </button> */}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <AdminNavigation history={history} />

                <Navigation role={role} history={history} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  loadProfile = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/${isAuth()._id}`, {
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      })
      .then((res) => {
        const { role, first_name, last_name, pref_first_name, student_number } =
          res.data;
        this.setState({
          role,
          first_name,
          last_name,
          pref_first_name,
          student_number,
          loaded: true,
        });
      })
      .catch((err) => {
        toast.error(`Error To Your Information ${err.response.statusText}`);
        if (err.response.status === 401) {
          signout(() => {
            this.props.history.push("/login");
          });
        }
      });
  };

  loadPendingUsers = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/admin/pending`, {
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      })
      .then((res) => {
        const pendingUsers = res.data;
        this.setState({
          pendingUsers,
        });
      })
      .catch((err) => {
        toast.error(
          `Could not retrieve pending user data; ${err.response.statusText}`
        );
      });
  };

  hideElement = (e, elementName) => {
    e.preventDefault();
    let { hideCan } = this.state;
    switch (elementName) {
      case "pending-users":
        this.setState({ hideCan: !hideCan });
        break;
      default:
        return;
    }
  };
}

export default AdminUsers;

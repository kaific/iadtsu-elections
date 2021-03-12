import React, { useState, useEffect, Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import AdminNavigation from "../../Components/AdminNavigation";
import Navigation from "../../Components/Navigation";
import NoticeMessage from "../../Components/NoticeMessage";

import { updateUser, isAuth, getCookie, signout } from "../../helpers/auth";
import { isEmpty } from "../../helpers/basic";

class AdminNominations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      role: "",
      first_name: "",
      last_name: "",
      pref_first_name: "",
      student_number: "",
      nominees: [],
      nominations: [],
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState({ token: getCookie("token") }, async () => {
      await this.loadProfile();
      await this.loadNominees();
      await this.loadNominations();
    });
  }

  loadProfile = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/${isAuth()._id}`, {
        headers: {
          Authorization: `Bearer ${this.state.token}`,
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
        this.setState({
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
            this.props.history.push("/login");
          });
        }
      });
  };

  loadNominees = async () => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/nomination/nominees`, {
        year: 2021,
      })
      .then((res) => {
        this.setState({ nominees: res.data });
      })
      .catch((err) => {
        toast.error(`Could not retrieve nominees data.`);
      });
  };

  loadNominations = async () => {
    const { token } = this.state;

    await axios
      .get(`${process.env.REACT_APP_API_URL}/nomination/all`)
      .then((res) => {
        this.setState({ nominations: res.data, loaded: true });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        this.setState({ loaded: true });
      });
  };

  render() {
    const {
      first_name,
      last_name,
      pref_first_name,
      student_number,
      textChange,
      role,
      loaded,
    } = this.state;

    if (!loaded) {
      return "Loading...";
    }

    const { nominees, nominations } = this.state;
    return (
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <ToastContainer />
        <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-8/12 p-6 sm:p-12">
            <div className="mt-12 flex flex-col items-center">
              <Link to="/admin" className="text-xl xl:text-xl text-center ">
                {"<"} Admin Dashboard
              </Link>
              <div className="w-full flex-1 mt-8 text-indigo-500">
                <NoticeMessage />
                <AdminNavigation />

                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Nominations
                  </div>
                </div>
                <div className="mx-auto px-auto max-w-xl relative text-center">
                  {!isEmpty(nominees)
                    ? nominees.map((n, i) => {
                        return (
                          <React.Fragment key={i}>
                            <table className="shadow-lg mb-4 mx-auto">
                              <tr>
                                <th
                                  className="bg-blue-100 border text-center px-8 py-4"
                                  colSpan="3"
                                >
                                  {n.user.pref_first_name} {n.user.last_name} -{" "}
                                  {n.user.student_number} ({n.role}) -
                                  Nominations
                                </th>
                              </tr>
                              <tr>
                                <th className="border text-left px-8 py-2"></th>
                                <th className="border text-left px-8 py-2">
                                  Name
                                </th>
                                <th className="border text-left px-8 py-2">
                                  Student Number
                                </th>
                              </tr>
                              {!isEmpty(
                                nominations.filter(
                                  (nom) =>
                                    nom.nominee && nom.nominee._id == n._id
                                )
                              ) ? (
                                nominations
                                  .filter(
                                    (nom) =>
                                      nom.nominee && nom.nominee._id == n._id
                                  )
                                  .map((nom, i) => {
                                    return (
                                      <tr key={i}>
                                        <td className="border text-left px-8 py-2">
                                          {i + 1}
                                        </td>
                                        <td className="border text-left px-8 py-2">
                                          {nom.signature.pref_first_name}{" "}
                                          {nom.signature.last_name}
                                        </td>
                                        <td className="border text-left px-8 py-2">
                                          {nom.signature.student_number}
                                        </td>
                                      </tr>
                                    );
                                  })
                              ) : (
                                <tr>
                                  <td
                                    className="border text-left px-8 py-2"
                                    colSpan="3"
                                  >
                                    This nominee does not have any signatures.
                                  </td>
                                </tr>
                              )}
                            </table>
                          </React.Fragment>
                        );
                      })
                    : "There are no nominees."}
                </div>
                <Navigation role={role} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminNominations;

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
      nomPeriods: [],
      activePeriods: [],
      nominees: [],
      nominations: [],
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState({ token: getCookie("token") }, async () => {
      await this.loadProfile();
      await this.loadNomPeriods();
      await this.loadActives();
      await this.loadNominees();
      await this.loadNominations();
    });
  }

  loadNomPeriods = async () => {
    console.log(this.state.token);
    await axios
      .get(`${process.env.REACT_APP_API_URL}/nomination/period`, {
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      })
      .then((res) => {
        this.setState({ nomPeriods: res.data });
      })
      .catch((err) => {
        toast.error(`Could not retrieve nomination period data.`);
      });
  };

  loadActives = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/active`)
      .then((res) => {
        this.setState({
          activePeriods: res.data.filter((a) => a.type == "nomination"),
        });
      })
      .catch((err) => {
        toast.error(err);
      });
  };

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
    const { nomPeriods } = this.state;
    let nomPeriodId = nomPeriods[0]._id;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/nomination/nominees`, {
        nominationPeriod: nomPeriodId,
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
        toast.error(err);
        this.setState({ loaded: true });
      });
  };

  closePeriod = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/active/${id}`, {
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
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
      activePeriods,
      loaded,
    } = this.state;
    let { nomPeriods } = this.state;
    const { history } = this.props;

    if (!loaded) {
      return "Loading...";
    }

    nomPeriods = nomPeriods.map((p, i) => {
      let year = p.startDate.substring(0, 4);
      p.year = year;

      activePeriods.map((a, i) => {
        if (p._id == a.refId) {
          p.active = true;
        } else {
          p.active = false;
        }
      });

      return p;
    });
    console.log("all", nomPeriods);
    console.log("active", activePeriods);

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
                <AdminNavigation history={history} />

                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Nominations
                  </div>
                </div>

                <div className="mx-auto px-auto max-w-xl relative text-center">
                  <table className="shadow-lg mb-12 mx-auto text-orange-800">
                    <thead>
                      <tr>
                        <th
                          className="bg-orange-200 border text-center px-8 py-4"
                          colSpan="4"
                        >
                          Nomination Periods
                        </th>
                      </tr>
                      <tr>
                        <th className="border text-left px-8 py-2">Type</th>
                        <th className="border text-left px-8 py-2">Year</th>
                        <th className="border text-left px-8 py-2">Active</th>
                        <th className="border text-left px-8 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nomPeriods.map((nomPeriod, i) => {
                        return (
                          <tr key={i}>
                            <td className="border text-left px-8 py-2">
                              {nomPeriod.byElection
                                ? "By-Election"
                                : "Main Election"}
                            </td>
                            <td className="border text-left px-8 py-2">
                              {nomPeriod.year}
                            </td>
                            <td className="border text-left px-8 py-2">
                              {nomPeriod.active ? "Active" : "Inactive"}
                            </td>
                            <td className="border text-left px-8 py-2">
                              {nomPeriod.active ? (
                                <button
                                  onClick={() => {
                                    this.closePeriod(nomPeriod._id);
                                  }}
                                  className="font-semibold bg-red-500 text-gray-100 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                >
                                  <span className="mx-3">Close</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {}}
                                  className="font-semibold bg-green-500 text-gray-100 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                >
                                  <span className="mx-3">Open</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mx-auto px-auto max-w-xl relative text-center">
                  {!isEmpty(nominees)
                    ? nominees.map((n, i) => {
                        return (
                          <React.Fragment key={i}>
                            <table className="shadow-lg mb-4 mx-auto">
                              <thead>
                                <tr>
                                  <th
                                    className="bg-blue-100 border text-center px-8 py-4"
                                    colSpan="3"
                                  >
                                    {n.user.pref_first_name} {n.user.last_name}{" "}
                                    - {n.user.student_number} ({n.role}) -
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
                              </thead>
                              <tbody>
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
                              </tbody>
                            </table>
                          </React.Fragment>
                        );
                      })
                    : "There are no nominees."}
                </div>
                <Navigation role={role} history={history} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminNominations;

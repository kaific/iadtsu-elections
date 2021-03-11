import React, { useState, useEffect, Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import authSvg from "../assets/update.svg";
import { updateUser, isAuth, getCookie, signout } from "../helpers/auth";
import { isEmpty } from "../helpers/basic";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      first_name: "",
      last_name: "",
      pref_first_name: "",
      student_number: "",
      textChange: "Update",
      role: "",
      nominees: [],
      nominations: [],
      election: {},
      candidates: [],
      referenda: [],
      loaded: false,
    };
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
      .get(`${process.env.REACT_APP_API_URL}/nomination/nominees`)
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
        this.setState({ nominations: res.data });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  loadElection = async () => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/election/year`, { year: "2021" })
      .then((res) => {
        this.setState({ election: res.data[0] });
      })
      .catch((err) => {
        toast.error(`Could not retrieve election data.`);
      });
  };

  loadCandidates = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/election/${this.state.election._id}/candidates`
      )
      .then((res) => {
        this.setState({ candidates: res.data });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  loadReferenda = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/election/${this.state.election._id}/referenda`
      )
      .then((res) => {
        this.setState({ referenda: res.data });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  loadBallots = async () => {
    console.log(this.state.election._id);
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/election/${this.state.election._id}/ballots`
      )
      .then((res) => {
        this.setState({ ballots: res.data, loaded: true });
      })
      .catch((err) => {
        console.log("errorrrr", err);
        toast.error(err.response.data.message);
        this.setState({ loaded: true });
      });
  };

  componentDidMount() {
    this.setState({ token: getCookie("token") }, async () => {
      await this.loadProfile();
      await this.loadNominees();
      await this.loadNominations();
      await this.loadElection();
      await this.loadCandidates();
      await this.loadReferenda();
      await this.loadBallots();
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
    } = this.state;

    if (!loaded) {
      return "Loading...";
    }

    const {
      nominees,
      nominations,
      election,
      candidates,
      referenda,
      ballots,
    } = this.state;
    console.log("election", election);
    console.log("candidates", candidates);
    console.log("referenda", referenda);
    console.log("ballots", ballots);
    const roles = ["mature", "socs"];

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
                <div className="mx-auto max-w-xs relative text-center text-blue-700">
                  If you encounter any issues with the system, please email{" "}
                  <strong>welfareiadt@gmail.com</strong>.
                </div>
                {/* <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Election Results
                  </div>
                </div>
                <div className="mx-auto px-auto max-w-xl relative text-center">
                  <table className="shadow-lg mb-4 mx-auto">
                    <thead>
                      <tr>
                        <th className="border text-left px-8 py-2">Role</th>
                        <th className="border text-left px-8 py-2">
                          Student Number
                        </th>
                        <th className="border text-left px-8 py-2">Name</th>
                        <th className="border text-left px-8 py-2">Votes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((c, i) => {
                        let count = 0;
                        return (
                          <tr key={i}>
                            <td className="border text-left px-8 py-2">
                              {c.role}
                            </td>
                            <td className="border text-left px-8 py-2">
                              {c.user.student_number}
                            </td>
                            <td className="border text-left px-8 py-2">
                              {c.user.pref_first_name} {c.user.last_name}
                            </td>
                            <td className="border text-left px-8 py-2">
                              {ballots.map((b, i) => {
                                return b.candidateVotes.map((v, i) => {
                                  if (c._id == v.candidate) {
                                    count++;
                                  }
                                });
                              })}
                              {count}
                            </td>
                          </tr>
                        );
                      })}

                      {/* 
                    
                    HARDCODED - REMOVE !!!!!! 
                    
                    
                      {roles.map((r, i) => {
                        let count = 0;
                        return (
                          <React.Fragment key={i}>
                            <tr>
                              <td className="border text-left px-8 py-2">
                                {r}
                              </td>
                              <td
                                className="border text-left px-8 py-2"
                                colSpan={2}
                              >
                                Reopen Nominations
                              </td>
                              <td className="border text-left px-8 py-2">
                                {ballots.map((b, i) => {
                                  return b.reopenNominations.map((v, i) => {
                                    if (v && v.role == r) {
                                      count++;
                                    }
                                  });
                                })}
                                {count}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                  <table className="shadow-lg mb-4 mx-auto">
                    <thead>
                      <tr>
                        <th
                          className="border text-left px-8 py-2 text-center"
                          colSpan={3}
                        >
                          Referenda
                        </th>
                      </tr>
                      <tr>
                        <th className="border text-left px-8 py-2">Title</th>
                        <th className="border text-left px-8 py-2">
                          Votes For
                        </th>
                        <th className="border text-left px-8 py-2">
                          Votes Against
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {referenda.map((r, i) => {
                        let countFor = 0;
                        let countAgainst = 0;
                        return (
                          <tr key={i}>
                            <td className="border text-left px-8 py-2">
                              {r.title}
                            </td>
                            <td className="border text-left px-8 py-2">
                              {ballots.map((b, i) => {
                                b.referenda.map((ref, i) => {
                                  if (r._id == ref.referendum && ref.votedFor) {
                                    countFor++;
                                  }
                                });
                              })}
                              {countFor}
                            </td>
                            <td className="border text-left px-8 py-2">
                              {ballots.map((b, i) => {
                                b.referenda.map((ref, i) => {
                                  if (
                                    r._id == ref.referendum &&
                                    !ref.votedFor
                                  ) {
                                    countAgainst++;
                                  }
                                });
                              })}
                              {countAgainst}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div> */}
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
                                  .filter((nom) => nom.nominee._id == n._id)
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
                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Select destination
                  </div>
                </div>
                <div className="mx-auto max-w-xs relative ">
                  <Link
                    to="/dashboard"
                    className="mt-5 tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                    <span className="ml-3">Dashboard</span>
                  </Link>
                  <Link
                    to="/nominations"
                    className="mt-5 tracking-wide font-semibold bg-orange-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                    <span className="ml-3">Nominations</span>
                  </Link>
                  <button
                    onClick={() => {
                      signout(() => {
                        toast.success("Signed out successfully");
                        this.props.history.push("/");
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
  }
}

export default Admin;

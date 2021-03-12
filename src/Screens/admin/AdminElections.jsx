import React, { useState, useEffect, Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import AdminNavigation from "../../Components/AdminNavigation";
import Navigation from "../../Components/Navigation";
import NoticeMessage from "../../Components/NoticeMessage";

import { updateUser, isAuth, getCookie, signout } from "../../helpers/auth";
import { isEmpty } from "../../helpers/basic";

class AdminElections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      role: "",
      first_name: "",
      last_name: "",
      pref_first_name: "",
      student_number: "",
      election: {},
      candidates: [],
      referenda: [],
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState({ token: getCookie("token") }, async () => {
      await this.loadProfile();
      await this.loadElection();
      await this.loadCandidates();
      await this.loadReferenda();
      await this.loadBallots();
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

    const { history } = this.props;

    if (!loaded) {
      return "Loading...";
    }

    const { election, candidates, referenda, ballots } = this.state;
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
                <NoticeMessage />
                <AdminNavigation />
                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Elections
                  </div>
                </div>
                <div className="mx-auto max-w-xs relative ">
                  Under Construction.
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
                <Navigation role={role} history={history} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminElections;

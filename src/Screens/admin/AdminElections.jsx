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
      elections: [],
      chosenElectionId: "",
      candidates: [],
      hideCan: true,
      referenda: [],
      actives: [],
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState({ token: getCookie("token") }, async () => {
      await this.loadProfile();
      await this.loadElections();
      await this.loadCandidates();
      // await this.loadReferenda();
      await this.loadActives();
      await this.loadBallots();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.chosenElectionId !== prevState.chosenElectionId) {
      this.setState({ candidates: [] }, async () => {
        await this.loadCandidates();
        await this.loadBallots();
      });
    }

    if (this.state.activeChange) {
      this.setState({ activeChange: false }, async () => {
        await this.loadActives();
      });
    }
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

  loadElections = async () => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/election/year`, { year: "2021" })
      .then((res) => {
        this.setState({
          elections: res.data,
          chosenElectionId: res.data[res.data.length - 1]._id,
        });
      })
      .catch((err) => {
        toast.error(`Could not retrieve election data.`);
      });
  };

  loadCandidates = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/election/${this.state.chosenElectionId}/candidates`
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

  loadActives = async () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/active`)
      .then((res) => {
        this.setState({ actives: res.data });
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  loadBallots = async () => {
    console.log(this.state.chosenElectionId);
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}/election/${this.state.chosenElectionId}/ballots`
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

  openElection = async () => {
    const { chosenElectionId } = this.state;

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/active`,
        { refId: chosenElectionId, type: "election" },
        {
          headers: {
            Authorization: `Bearer ${this.state.token}`,
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        console.log(res.data);
        this.setState({ activeChange: true });
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  closeElection = async () => {
    const { chosenElectionId } = this.state;

    await axios
      .delete(`${process.env.REACT_APP_API_URL}/active/${chosenElectionId}`, {
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      })
      .then((res) => {
        toast.success(res.data.message);
        console.log(res.data);
        this.setState({ activeChange: true });
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  hideElement = (e, element) => {
    e.preventDefault();
    let { hideCan } = this.state;
    switch (element) {
      case "candidates":
        this.setState({ hideCan: !hideCan });
        break;
      default:
        return;
    }
    console.log(this.state.hideCan);
  };

  handleChange = (elId, e) => (e) => {
    switch (elId) {
      default:
        this.setState({ [elId]: e.target.value });
        break;
    }
  };

  render() {
    const { chosenElectionId, hideCan, role, loaded } = this.state;

    const { history } = this.props;

    if (!loaded) {
      return "Loading...";
    }

    const { elections, candidates, actives, referenda, ballots } = this.state;

    let elecs = elections.map((e, i) => {
      let year = new Date(e.startDate).getFullYear();
      return {
        _id: e._id,
        year,
        byElection: e.byElection,
        startDate: e.startDate,
        endDate: e.endDate,
      };
    });

    let canColor = true;

    console.log("elections", elecs);
    console.log("chosen election", chosenElectionId);

    console.log("candidates", candidates);
    // console.log("referenda", referenda);
    console.log("ballots", ballots);
    console.log("actives", actives);
    const roles = [
      "president",
      "welfare",
      "education",
      "lgbtq",
      "disability",
      "mature",
      "ents",
      "socs",
      "gaeilge",
    ];

    let renominations = [];
    roles.map((r) => {
      renominations[r] = [];
      return ballots.map((b) => {
        if (!isEmpty(b.reopenNominations)) {
          b.reopenNominations
            .filter((renom) => renom.role === r)
            .map((rn) => renominations[r].push(rn));
        }
        return;
      });
    });
    // console.log("renoms", renominations);

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
                  <Link
                    to="/admin/elections/new"
                    className="tracking-wide font-semibold bg-green-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <i className="fas fa-plus  w-6  -ml-2" />
                    <span className="ml-3">Create Election</span>
                  </Link>
                </div>

                <div className="mx-auto max-w-md relative flex flex-col w-full text-gray-700">
                  <div className="-mx-3 xl:flex my-6 justify-center">
                    <div className="xl:w-1/2 px-3 mb-0 xl:mb-0">
                      <label
                        className="uppercase tracking-wide text-gray-600 text-xs font-bold mb-2"
                        htmlFor="nomPeriod"
                      >
                        Choose Election
                      </label>
                      <div className="">
                        <select
                          className="w-full bg-gray-200 border border-gray-200 text-gray-700 text-s py-3 px-4 pr-8 mb-3 rounded"
                          id="chosenElectionId"
                          onChange={this.handleChange("chosenElectionId")}
                          value={chosenElectionId}
                        >
                          {elecs.map((e, i) => (
                            <option value={e._id} key={i}>
                              {e.byElection ? "By-Election" : "Main Election"}{" "}
                              {e.year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Selected Election
                  </div>
                </div>

                <div className="mx-auto max-w-md relative flex flex-col w-full text-gray-700">
                  <div className="-mx-3 mb-2 justify-center">
                    <div>
                      <label
                        className="uppercase tracking-wide text-gray-600 text-xs font-bold mb-2"
                        htmlFor="status"
                      >
                        Status
                      </label>
                      <div className="mt-2" id="status">
                        {!actives ? (
                          ""
                        ) : isEmpty(
                            actives.filter((a) => a.refId === chosenElectionId)
                          ) ? (
                          <>
                            <span className="text-red-600">Inactive</span>
                            <button
                              className="tracking-wide font-semibold bg-green-600 text-gray-100 py-1 rounded-sm hover:bg-green-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                              onClick={this.openElection}
                            >
                              <span className="px-1 text-xs">
                                Open Election
                              </span>
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-green-600">Active</span>
                            <button
                              className="tracking-wide font-semibold bg-red-600 text-gray-100 py-1 rounded-sm hover:bg-red-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                              onClick={this.closeElection}
                            >
                              <span className="px-1 text-xs">
                                Close Election
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="-mx-3 mb-2 justify-center">
                    <div>
                      <label
                        className="uppercase tracking-wide text-gray-600 text-xs font-bold mb-2"
                        htmlFor="candidates"
                      >
                        Candidates for Selected Election
                      </label>
                      <div className="mt-2" id="candidates">
                        <table className="shadow-lg mb-4 mx-auto">
                          <thead>
                            <tr>
                              <th
                                className="bg-purple-300 border text-center px-4 py-4"
                                colSpan="5"
                              >
                                <div className="block">
                                  <div className="inline-block">
                                    Candidates for{" "}
                                    {elecs.map((e, i) => {
                                      if (e._id === chosenElectionId) {
                                        return (
                                          <React.Fragment key={i}>
                                            {e.byElection
                                              ? "By-Election"
                                              : "Main Election"}{" "}
                                            {e.year}
                                          </React.Fragment>
                                        );
                                      }
                                    })}
                                  </div>
                                  <div className="inline-block ml-3">
                                    <button
                                      className="tracking-wide font-semibold bg-purple-600 text-gray-100 py-1 rounded-sm hover:bg-purple-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                      onClick={(e) => {
                                        this.hideElement(e, "candidates");
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
                                  Position
                                </th>
                                <th className="bg-purple-300 border text-center px-2 py-1">
                                  Name
                                </th>
                                <th className="bg-purple-300 border text-center px-2 py-1">
                                  Student Number
                                </th>
                                <th className="bg-purple-300 border text-center px-2 py-1">
                                  Photo
                                </th>

                                <th className="bg-purple-300 border text-center px-2 py-1">
                                  Votes
                                </th>
                              </tr>
                            )}
                          </thead>
                          <tbody>
                            {isEmpty(candidates) && !hideCan ? (
                              <tr>
                                <td>
                                  <span>No candidates added.</span>
                                </td>
                              </tr>
                            ) : hideCan ? (
                              ""
                            ) : (
                              roles.map((r, index) => {
                                let roleCandidates = candidates.filter(
                                  (c) => r == c.role
                                );
                                if (isEmpty(roleCandidates)) return "";
                                let count = 0;
                                canColor = !canColor;
                                return (
                                  <React.Fragment key={index}>
                                    {candidates.map((c, i) => {
                                      if (r == c.role) {
                                        canColor = !canColor;
                                        count = 0;
                                        return (
                                          <tr
                                            key={i}
                                            className={
                                              canColor ? "bg-purple-200" : ""
                                            }
                                          >
                                            <td className="border text-left px-2 py-1">
                                              {c.role}
                                            </td>

                                            <td className="border text-left px-2 py-1">
                                              {c.user.pref_first_name}{" "}
                                              {c.user.last_name}
                                            </td>

                                            <td className="border text-left px-2 py-1">
                                              {c.user.student_number}
                                            </td>

                                            <td className="border text-center justify-center px-2 py-1 w-12">
                                              {c.photo ? (
                                                <img src={c.photo} />
                                              ) : (
                                                <>No photo.</>
                                              )}
                                            </td>
                                            <td className="border text-center px-2 py-1">
                                              {ballots.map((b, i) => {
                                                return b.candidateVotes.map(
                                                  (v, i) => {
                                                    if (c._id == v.candidate) {
                                                      count++;
                                                    }
                                                  }
                                                );
                                              })}
                                              {count}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    })}
                                    <tr
                                      className={
                                        !canColor ? "bg-purple-200" : ""
                                      }
                                    >
                                      <td className="border text-left px-2 py-1">
                                        {r}
                                      </td>

                                      <td
                                        className="border text-left px-2 py-1"
                                        colSpan="3"
                                      >
                                        <strong>Renominations</strong>
                                      </td>
                                      <td className="border text-center px-2 py-1">
                                        {renominations[r].length}
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
                                    if (
                                      r._id == ref.referendum &&
                                      ref.votedFor
                                    ) {
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

export default AdminElections;

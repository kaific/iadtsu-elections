import React, { useState, useEffect, Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import AdminNavigation from "../../../Components/AdminNavigation";
import Navigation from "../../../Components/Navigation";
import NoticeMessage from "../../../Components/NoticeMessage";

import { updateUser, isAuth, getCookie, signout } from "../../../helpers/auth";
import { isEmpty, timeToMilliseconds } from "../../../helpers/basic";

class CreateElection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      role: "",
      nomPeriods: [],
      chosenPeriodId: "",
      nominees: [],
      candidates: [],
      startDate: "",
      startDateDate: "",
      startDateTime: "",
      endDate: "",
      byElection: false,
      hideNom: true,
      hideCan: false,
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState(
      {
        token: getCookie("token"),
        startDateDate: new Date().toISOString().split("T")[0],
        startDateTime: new Date().toLocaleTimeString(),
        startDate: new Date().toISOString(),
        endDateDate: new Date(
          new Date().getTime() + timeToMilliseconds("48:00")
        )
          .toISOString()
          .split("T")[0],
        endDateTime: new Date(
          new Date().getTime() + timeToMilliseconds("48:00")
        ).toLocaleTimeString(),
        endDate: new Date(
          new Date().getTime() + timeToMilliseconds("48:00")
        ).toISOString(),
      },
      async () => {
        // console.log(this.state.startDate);
        // console.log(this.state.endDate);
        await this.loadProfile();
        await this.loadNomPeriods();
        await this.loadNominees();
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.chosenPeriodId !== prevState.chosenPeriodId) {
      this.setState({ nominees: [] }, async () => {
        await this.loadNominees();
      });
    }
  }

  render() {
    const {
      role,
      nomPeriods,
      chosenPeriodId,
      nominees,
      candidates,
      startDateDate,
      startDateTime,
      endDateDate,
      endDateTime,
      byElection,
      loaded,
    } = this.state;

    const { hideNom, hideCan } = this.state;
    const { history } = this.props;
    const { isCandidateAdded } = this;
    let nomColor = true;
    let canColor = true;

    if (!loaded) {
      return "Loading...";
    }

    // console.log(this.state.startDate);

    let periods = nomPeriods.map((p, i) => {
      let year = new Date(p.startDate).getFullYear();
      return { _id: p._id, year, byElection: p.byElection };
    });

    periods.push({ _id: "0000", year: 2021, byElection: true });

    // console.log("all periods", periods);
    // console.log("chosen period id", chosenPeriodId);
    // console.log("nominees", nominees);
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
                <AdminNavigation history={history} />
                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Create an Election
                  </div>
                </div>

                <form
                  className="mx-auto max-w-md relative flex flex-col w-full text-gray-700"
                  onSubmit={this.handleSubmit}
                >
                  <div className="-mx-3 xl:flex mb-2 justify-center">
                    <div className="xl:w-1/2 px-3 mb-6 xl:mb-0">
                      <label
                        className="uppercase tracking-wide text-gray-600 text-xs font-bold mb-2"
                        htmlFor="nomPeriod"
                      >
                        Choose Nomination Period
                      </label>
                      <div className="">
                        <select
                          className="w-full bg-gray-200 border border-gray-200 text-gray-700 text-s py-3 px-4 pr-8 mb-3 rounded"
                          id="nomPeriod"
                          onChange={this.handleChange("nomPeriod")}
                        >
                          {periods.map((p, i) => (
                            <option value={p._id} key={i}>
                              {p.byElection ? "By-Election" : "Main Election"}{" "}
                              {p.year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="-mx-3 xl:flex mb-2 justify-center">
                    {/* <div className="xl:w-1/2 px-3 mb-6 mb-xl:0"> */}
                    <div>
                      <label
                        className="uppercase tracking-wide text-gray-600 text-xs font-bold mb-2"
                        htmlFor="nominees"
                      >
                        Add Nominees to Election
                      </label>
                      <div className="mt-2" id="nominees">
                        <table className="shadow-lg mb-4 mx-auto">
                          <thead>
                            <tr>
                              <th
                                className="bg-orange-300 border text-center px-4 py-4"
                                colSpan="5"
                              >
                                <div className="block">
                                  <div className="inline-block">
                                    Nominees for{" "}
                                    {periods.map((p, i) => {
                                      if (p._id === chosenPeriodId) {
                                        return (
                                          <React.Fragment key={i}>
                                            {p.byElection
                                              ? "By-Election"
                                              : "Main Election"}{" "}
                                            {p.year}
                                          </React.Fragment>
                                        );
                                      }
                                    })}
                                  </div>
                                  <div className="inline-block ml-3">
                                    <button
                                      className="tracking-wide font-semibold bg-orange-600 text-gray-100 py-1 rounded-sm hover:bg-orange-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                      onClick={(e) => {
                                        this.hideElement(e, "nominees");
                                      }}
                                    >
                                      <span className="px-1 text-xs">
                                        {hideNom ? "Unhide" : "Hide"}
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </th>
                            </tr>
                            {hideNom ? (
                              ""
                            ) : (
                              <tr>
                                <th className="bg-orange-300 border text-center px-2 py-1">
                                  Position
                                </th>
                                <th className="bg-orange-300 border text-center px-2 py-1">
                                  Name
                                </th>
                                <th className="bg-orange-300 border text-center px-2 py-1">
                                  Student Number
                                </th>
                                <th className="bg-orange-300 border text-center px-2 py-1">
                                  Signatures
                                </th>
                                <th className="bg-orange-300 border text-center px-2 py-1">
                                  Actions
                                </th>
                              </tr>
                            )}
                          </thead>
                          <tbody>
                            {isEmpty(nominees) ? (
                              <tr>Loading...</tr>
                            ) : hideNom ? (
                              ""
                            ) : (
                              nominees.map((n, i) => {
                                nomColor = !nomColor;
                                return (
                                  <tr
                                    key={i}
                                    className={nomColor ? "bg-orange-200" : ""}
                                  >
                                    <td className="border text-left px-2 py-1">
                                      {n.role}
                                    </td>
                                    <td className="border text-left px-2 py-1">
                                      {n.user.pref_first_name}{" "}
                                      {n.user.last_name}
                                    </td>
                                    <td className="border text-center px-2 py-1">
                                      {n.user.student_number}
                                    </td>
                                    <td className="border text-center px-2 py-1"></td>
                                    <td className="border text-center px-2 py-1">
                                      {isCandidateAdded(n.user._id) ? (
                                        "Added"
                                      ) : (
                                        <button
                                          className="tracking-wide font-semibold bg-green-500 text-gray-100 w-full md:w-32 py-1 rounded-sm hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                          onClick={() => {
                                            this.addCandidate(n);
                                          }}
                                        >
                                          <span>Add to Election</span>
                                        </button>
                                      )}
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

                  <div className="-mx-3 xl:flex mb-2 justify-center">
                    {/* <div className="xl:w-1/2 px-3 mb-6 mb-xl:0"> */}
                    <div>
                      <label
                        className="uppercase tracking-wide text-gray-600 text-xs font-bold mb-2"
                        htmlFor="candidates"
                      >
                        Candidates Added
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
                                    {periods.map((p, i) => {
                                      if (p._id === chosenPeriodId) {
                                        return (
                                          <React.Fragment key={i}>
                                            {p.byElection
                                              ? "By-Election"
                                              : "Main Election"}{" "}
                                            {p.year}
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
                                  Actions
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
                              candidates.map((c, i) => {
                                canColor = !canColor;
                                return (
                                  <tr
                                    key={i}
                                    className={canColor ? "bg-purple-200" : ""}
                                  >
                                    <td className="border text-left px-2 py-1">
                                      {c.role}
                                    </td>

                                    <td className="border text-left px-2 py-1">
                                      {
                                        nominees.filter(
                                          (n) => n.user._id === c.user
                                        )[0].user.pref_first_name
                                      }{" "}
                                      {
                                        nominees.filter(
                                          (n) => n.user._id === c.user
                                        )[0].user.last_name
                                      }
                                    </td>

                                    <td className="border text-left px-2 py-1">
                                      {
                                        nominees.filter(
                                          (n) => n.user._id === c.user
                                        )[0].user.student_number
                                      }
                                    </td>

                                    <td className="border text-center justify-center px-2 py-1">
                                      {c.photo && !c.editingPhoto ? (
                                        <>
                                          <img src={c.photo} />
                                          <button
                                            className="tracking-wide font-semibold bg-red-500 text-gray-100 w-full md:w-32 py-1 rounded-sm hover:bg-red-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none text-xs"
                                            onClick={(e) => {
                                              this.remPhoto(c);
                                            }}
                                          >
                                            Remove Photo
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <input
                                            id="canPhoto"
                                            type="text"
                                            onChange={this.handleChange(
                                              "canPhoto",
                                              c.user
                                            )}
                                            value={
                                              candidates.filter(
                                                (can) => can.user === c.user
                                              )[0].photo
                                            }
                                            placeholder="Image URL"
                                          />{" "}
                                          <button
                                            className="tracking-wide font-semibold bg-green-500 text-gray-100 w-full md:w-32 py-1 rounded-sm hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none text-xs"
                                            onClick={() => {
                                              this.confirmPhoto(c);
                                            }}
                                          >
                                            Add Photo
                                          </button>
                                        </>
                                      )}
                                    </td>

                                    <td className="border text-center px-2 py-1">
                                      <button
                                        className="tracking-wide font-semibold bg-red-500 text-gray-100 w-full md:w-32 py-1 rounded-sm hover:bg-red-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                        onClick={() => {
                                          this.remCandidate(c);
                                        }}
                                      >
                                        <span>Remove</span>
                                      </button>
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

                  <div className="-mx-3 xl:flex mb-2 justify-center">
                    {/* <div className="xl:w-1/2 px-3 mb-6 mb-xl:0"> */}
                    <div>
                      <label
                        className="uppercase tracking-wide text-gray-600 text-xs font-bold mb-2"
                        htmlFor="startDate"
                      >
                        Start Date
                      </label>
                      <input
                        className="w-full bg-gray-200 text-gray-600 border border-gray-200 rounded py-3 px-4 mb-3"
                        id="startDate"
                        type="date"
                        placeholder="startDate"
                        value={startDateDate}
                        onChange={this.handleChange("startDate")}
                      />
                      <input
                        className="w-full bg-gray-200 text-gray-600 border border-gray-200 rounded py-3 px-4 mb-3"
                        id="startDateTime"
                        type="time"
                        placeholder="startDateTime"
                        value={startDateTime}
                        onChange={this.handleChange("startDateTime")}
                      />
                    </div>
                  </div>

                  <div className="-mx-3 xl:flex mb-2 justify-center">
                    {/* <div className="xl:w-1/2 px-3 mb-6 mb-xl:0"> */}
                    <div>
                      <label
                        className="uppercase tracking-wide text-gray-600 text-xs font-bold mb-2"
                        htmlFor="endDate"
                      >
                        Start Date
                      </label>
                      <input
                        className="w-full bg-gray-200 text-gray-600 border border-gray-200 rounded py-3 px-4 mb-3"
                        id="endDate"
                        type="date"
                        placeholder="endDate"
                        value={endDateDate}
                        onChange={this.handleChange("endDate")}
                      />
                      <input
                        className="w-full bg-gray-200 text-gray-600 border border-gray-200 rounded py-3 px-4 mb-3"
                        id="endDateTime"
                        type="time"
                        placeholder="endDateTime"
                        value={endDateTime}
                        onChange={this.handleChange("endDateTime")}
                      />
                    </div>
                  </div>

                  <div className="-mx-3 xl:flex mb-2 justify-center">
                    {/* <div className="xl:w-1/2 px-3 mb-6 mb-xl:0"> */}
                    <div>
                      <label
                        className="uppercase tracking-wide text-gray-600 text-xs font-bold mb-2"
                        htmlFor="byElection"
                      >
                        By-Election?
                      </label>
                      <select
                        className="w-full bg-gray-200 border border-gray-200 text-gray-700 text-s py-3 px-4 pr-8 mb-3 rounded"
                        id="byElection"
                        value={byElection}
                        onChange={this.handleChange("byElection")}
                      >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </select>
                    </div>
                  </div>

                  <button
                    className="mt-5 tracking-wide font-semibold bg-purple-600 text-gray-100 w-full py-4 rounded-lg hover:bg-purple-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    type="submit"
                  >
                    <i className="fas fa-plus  w-6  -ml-2" />
                    <span className="ml-3">Create Election</span>
                  </button>
                </form>
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

  loadNomPeriods = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/nomination/period`, {
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      })
      .then((res) => {
        this.setState({
          nomPeriods: res.data,
          chosenPeriodId: res.data[0]._id,
          year: new Date(res.data[0].startDate).getFullYear(),
          byElection: res.data[0].byElection,
        });
        console.log(res.data);
      })
      .catch((err) => {
        toast.error(`Could not retrieve nomination period data.`);
      });
  };

  loadNominees = async () => {
    const { chosenPeriodId } = this.state;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/nomination/nominees`, {
        nominationPeriod: chosenPeriodId,
      })
      .then((res) => {
        this.setState({ nominees: res.data, loaded: true });
        console.log(res.data);
      })
      .catch((err) => {
        toast.error(`Could not retrieve nominees data.`);
      });
  };

  addCandidate = (nominee) => {
    let candidate = {
      user: nominee.user._id,
      role: nominee.role,
      election: "",
      photo: "",
    };
    let { candidates } = this.state;
    candidates.push(candidate);
    this.setState({ candidates });
  };

  remCandidate = (candidate) => {
    let { candidates } = this.state;
    candidates = candidates.filter((e) => e.user !== candidate.user);
    this.setState({ candidates });
  };

  confirmPhoto = (candidate) => {
    let { candidates } = this.state;
    candidates.map((c) => {
      if (c.user === candidate.user) {
        return delete c.editingPhoto;
      }
    });
    this.setState({ candidates }, () => {
      console.log(this.state.candidates);
    });
  };

  remPhoto = (candidate) => {
    let { candidates } = this.state;
    candidates.map((c) => {
      if (c.user === candidate.user) {
        c.photo = "";
        return;
      }
    });
    this.setState({ candidates }, () => {
      console.log(this.state.candidates);
    });
  };

  isCandidateAdded = (id) => {
    const { candidates } = this.state;
    let added = false;

    candidates.map((c) => {
      if (id === c.user) {
        added = true;
      }
    });

    return added;
  };

  hideElement = (e, element) => {
    e.preventDefault();
    let { hideNom, hideCan } = this.state;
    switch (element) {
      case "nominees":
        this.setState({ hideNom: !hideNom });
        break;
      case "candidates":
        this.setState({ hideCan: !hideCan });
        break;
      default:
        return;
    }
    console.log(this.state.hideCan);
  };

  dateIsValid = (date) => !Number.isNaN(new Date(date).getTime());

  handleChange = (elId, id) => (e) => {
    let { candidates, startDateTime, startDateDate, endDateTime, endDateDate } =
      this.state;
    let startDate, endDate;
    switch (elId) {
      case "nomPeriod":
        this.setState({ chosenPeriodId: e.target.value });
        break;

      case "canPhoto":
        candidates.map((c) => {
          if (c.user === id) {
            c.photo = e.target.value;
            c.editingPhoto = true;
          }
        });
        this.setState({ candidates });
        break;

      case "startDate":
        if (!this.dateIsValid(e.target.value)) {
          return console.log(e.target.value);
        }
        startDateDate = new Date(e.target.value).toISOString().split("T")[0];
        // console.log("startDateDate", startDateDate);
        startDate = new Date(startDateDate);
        // console.log("startDate", startDate);
        // console.log("startDateTime", startDateTime);
        startDate = new Date(
          startDate.getTime() + timeToMilliseconds(startDateTime)
        );
        // console.log("startDate", startDate);
        this.setState(
          {
            startDateDate,
            startDate: startDate.toISOString(),
          },
          () => console.log("startDate changed:", this.state.startDate)
        );
        break;

      case "startDateTime":
        // console.log("new Date", new Date().getTime());
        // console.log("time", e.target.value);
        startDate = new Date(startDateDate);
        startDate = new Date(
          startDate.getTime() + timeToMilliseconds(e.target.value)
        );
        this.setState(
          {
            startDateTime: e.target.value,
            startDate: startDate.toISOString(),
          },
          () => console.log("startDate changed:", this.state.startDate)
        );
        break;

      case "endDate":
        if (!this.dateIsValid(e.target.value)) {
          return console.log(e.target.value);
        }
        endDateDate = new Date(e.target.value).toISOString().split("T")[0];
        endDate = new Date(endDateDate);
        endDate = new Date(endDate.getTime() + timeToMilliseconds(endDateTime));
        this.setState(
          {
            endDateDate,
            endDate: endDate.toISOString(),
          },
          () => console.log("endDate changed:", this.state.endDate)
        );
        break;

      case "endDateTime":
        endDate = new Date(endDateDate);
        endDate = new Date(
          endDate.getTime() + timeToMilliseconds(e.target.value)
        );
        this.setState(
          {
            endDateTime: e.target.value,
            endDate: endDate.toISOString(),
          },
          () => console.log("endDate changed:", this.state.endDate)
        );
        break;

      default:
        this.setState({ [elId]: e.target.value });
        break;
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    let { candidates, startDate, endDate, byElection } = this.state;
    const { history } = this.props;
    let election = {
      startDate,
      endDate,
      byElection,
    };
    console.log(election);

    let electionId,
      cont = false;

    if (isEmpty(candidates)) {
      return toast.error("An election must have candidates.");
    } else if (!startDate) {
      return toast.error("An election must have a start date.");
    } else if (!endDate) {
      return toast.error("An election must have an end date.");
    } else {
      console.log(candidates);
      await axios
        .post(`${process.env.REACT_APP_API_URL}/election`, election, {
          headers: {
            Authorization: `Bearer ${this.state.token}`,
          },
        })
        .then((res) => {
          toast.success(res.data.message);
          console.log(res.data);
          electionId = res.data.election._id;
        })
        .catch((err) => {
          toast.error(err.response.data.error);
          return;
        });

      await (async () => {
        candidates.map((c) => {
          c.election = electionId;
        });
        // console.log(candidates);
        cont = true;
      })();

      if (cont) {
        await axios
          .post(
            `${process.env.REACT_APP_API_URL}/election/candidates/multiple`,
            { candidates, election },
            {
              headers: {
                Authorization: `Bearer ${this.state.token}`,
              },
            }
          )
          .then((res) => {
            toast.success(res.data.message);
            console.log(res.data);
            history.push("/admin/elections");
          })
          .catch((err) => {
            toast.error(err.response.data.error);
          });
      }
    }
  };
}

export default CreateElection;

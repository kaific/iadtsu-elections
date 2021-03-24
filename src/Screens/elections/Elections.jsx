import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";

import Navigation from "../../Components/Navigation";
import NoticeMessage from "../../Components/NoticeMessage";

import { isAuth, getCookie, signout } from "../../helpers/auth";
import { isEmpty } from "../../helpers/basic";

class Elections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      first_name: "",
      last_name: "",
      pref_first_name: "",
      student_number: "",
      actives: [],
      election: {},
      candidates: [],
      referenda: [],
      president: "",
      welfare: "",
      education: "",
      lgbtq: "",
      disability: "",
      mature: "",
      ents: "",
      socs: "",
      gaeilge: "",
      referendum: "",
      voted: false,
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState({ token: getCookie("token") }, async () => {
      await this.loadProfile();
      await this.loadActives();
      await this.loadElection();
      await this.loadCandidates();
      // await this.loadReferenda();
      await this.loadVotes();
    });
  }

  // Handle change from inputs
  handleChange = (text) => (e) => {
    this.setState({ [text]: e.target.value }, () => {
      // console.log(this.state[text]);
    });
  };

  // Submit data to backend
  handleSubmit = (e) => {
    e.preventDefault();

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

    const roleNames = {
      president: "President",
      welfare: "VP for Welfare & Equality",
      education: "VP for Education",
      lgbtq: "LGBTQ+ Officer",
      disability: "Disability Rights Officer",
      mature: "Mature Students Officer",
      ents: "Entertainments Officer",
      socs: "Clubs & Societies Officer",
      gaeilge: "Oifigeach na Gaeilge",
    };

    const { token, candidates, referendum, voted } = this.state;
    const { history } = this.props;
    const {
      president,
      welfare,
      education,
      lgbtq,
      disability,
      mature,
      ents,
      socs,
      gaeilge,
    } = this.state;
    const election = this.state.election._id;

    let activeRoles = [];

    if (voted) {
      return toast.error("You have already voted in this election!");
    }

    roles.map((role) => {
      let roleCands = candidates.filter((c) => c.role === role);
      if (!isEmpty(roleCands)) {
        return activeRoles.push(role);
      } else {
        return;
      }
    });

    if (!president && activeRoles.includes("president")) {
      return toast.error(
        `You must vote for the ${roleNames["president"]} role.`
      );
    }

    if (!welfare && activeRoles.includes("welfare")) {
      toast.error(`You must vote for the ${roleNames["welfare"]} role.`);
    }

    if (!education && activeRoles.includes("education")) {
      toast.error(`You must vote for the ${roleNames["education"]} role.`);
    }

    if (!lgbtq && activeRoles.includes("lgbtq")) {
      toast.error(`You must vote for the ${roleNames["lgbtq"]} role.`);
    }

    if (!disability && activeRoles.includes("disability")) {
      toast.error(`You must vote for the ${roleNames["disability"]} role.`);
    }

    if (!mature && activeRoles.includes("mature")) {
      toast.error(`You must vote for the ${roleNames["mature"]} role.`);
    }

    if (!ents && activeRoles.includes("ents")) {
      toast.error(`You must vote for the ${roleNames["ents"]} role.`);
    }

    if (!socs && activeRoles.includes("socs")) {
      toast.error(`You must vote for the ${roleNames["socs"]} role.`);
    }

    if (!gaeilge && activeRoles.includes("gaeilge")) {
      toast.error(`You must vote for the ${roleNames["gaeilge"]} role.`);
    }

    const ballot = {
      token,
      election,
      candidateVotes: [],
      reopenNominations: [],
      referenda: [],
    };

    if (president === "reopen") {
      ballot.reopenNominations.push({ role: "president" });
    } else if (activeRoles.includes("president")) {
      ballot.candidateVotes.push({ candidate: president, role: "president" });
    }

    if (welfare === "reopen") {
      ballot.reopenNominations.push({ role: "welfare" });
    } else if (activeRoles.includes("welfare")) {
      ballot.candidateVotes.push({ candidate: welfare, role: "welfare" });
    }

    if (education === "reopen") {
      ballot.reopenNominations.push({ role: "education" });
    } else if (activeRoles.includes("education")) {
      ballot.candidateVotes.push({ candidate: education, role: "education" });
    }

    if (lgbtq === "reopen") {
      ballot.reopenNominations.push({ role: "lgbtq" });
    } else if (activeRoles.includes("lgbtq")) {
      ballot.candidateVotes.push({ candidate: lgbtq, role: "lgbtq" });
    }

    if (disability === "reopen") {
      ballot.reopenNominations.push({ role: "disability" });
    } else if (activeRoles.includes("disability")) {
      ballot.candidateVotes.push({ candidate: disability, role: "disability" });
    }
    if (mature === "reopen") {
      ballot.reopenNominations.push({ role: "mature" });
    } else if (activeRoles.includes("mature")) {
      ballot.candidateVotes.push({ candidate: mature, role: "mature" });
    }
    if (ents === "reopen") {
      ballot.reopenNominations.push({ role: "ents" });
    } else if (activeRoles.includes("ents")) {
      ballot.candidateVotes.push({ candidate: ents, role: "ents" });
    }

    if (socs === "reopen") {
      ballot.reopenNominations.push({ role: "socs" });
    } else if (activeRoles.includes("socs")) {
      ballot.candidateVotes.push({ candidate: socs, role: "socs" });
    }

    if (gaeilge === "reopen") {
      ballot.reopenNominations.push({ role: "gaeilge" });
    } else if (activeRoles.includes("gaeilge")) {
      ballot.candidateVotes.push({ candidate: gaeilge, role: "gaeilge" });
    }

    console.log(ballot);

    axios
      .post(`${process.env.REACT_APP_API_URL}/election/vote`, ballot)
      .then((res) => {
        toast.success(res.data.message);
        history.push("/dashboard");
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };

  loadActives = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/active`)
      .then((res) => {
        this.setState({ actives: res.data });
      })
      .catch((err) => {
        toast.error(`Could not retrieve active elections data.`);
      });
  };

  loadElection = async () => {
    if (isEmpty(this.state.actives)) return;

    let activeElectionId = this.state.actives.filter(
      (a) => a.type === "election"
    )[0].refId;

    await axios
      .get(`${process.env.REACT_APP_API_URL}/election/${activeElectionId}`)
      .then((res) => {
        this.setState({ election: res.data });
      })
      .catch((err) => {
        toast.error(`Could not retrieve election data.`);
      });
  };

  loadCandidates = async () => {
    if (isEmpty(this.state.election)) return;
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

  loadVotes = async () => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/election/votes/mine`, {
        token: this.state.token,
        election: this.state.election._id,
      })
      .then((res) => {
        if (!isEmpty(res.data)) {
          this.setState({ voted: true, loaded: true });
        } else {
          this.setState({ voted: false, loaded: true });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        this.setState({ loaded: true });
      });
  };

  loadProfile = async () => {
    const token = getCookie("token");
    await axios
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

  render() {
    const {
      first_name,
      last_name,
      pref_first_name,
      student_number,
      role,
      election,
      actives,
      candidates,
      referenda,
      loaded,
      voted,
    } = this.state;

    const { history } = this.props;

    if (!loaded) {
      return "Loading...";
    }

    // __________________________________________
    //
    // HARD CODED MANIPULATION, GET RID OF IT!!!
    // __________________________________________
    // let refDesc = referenda[0].description.split("\n");

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

    const roleNames = {
      president: "President",
      welfare: "VP for Welfare & Equality",
      education: "VP for Education",
      lgbtq: "LGBTQ+ Officer",
      disability: "Disability Rights Officer",
      mature: "Mature Students Officer",
      ents: "Entertainments Officer",
      socs: "Clubs & Societies Officer",
      gaeilge: "Oifigeach na Gaeilge",
    };

    let currentTime = new Date().getTime();
    let electionTime = new Date(election.startDate).getTime();
    let electionEnd = new Date(election.endDate).getTime();
    let electionOpen = currentTime >= electionTime && currentTime < electionEnd;

    console.log(currentTime);
    console.log(electionEnd);
    // console.log("actives", actives);
    // console.log("candidates", candidates);
    // console.log("election", election);

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
                  <div className="leading-none px-2 inline-block text-sm text-red-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    IMPORTANT INFORMATION
                  </div>
                </div>
                <div className="mx-auto max-w-xs relative text-center font-medium text-gray-800">
                  Hi {pref_first_name}! Welcome to IADTSU Elections 2021.
                  <br />
                  {/* Voting is now closed. Thank you for your participation. */}
                  Please fill out your digital ballot carefully.{" "}
                  <span className="text-red-600">
                    Once submitted, your votes are final.
                  </span>
                  <br />
                  <br />
                  You may vote separately for each role subject to this
                  election, as well as any referenda. Choose your candidate for
                  each, or vote to reopen nominations. Referenda can be voted
                  for or against.
                  <br />
                  <br />
                  To cast your vote, simply ensure that the box corresponding to
                  your choice is selected.
                </div>
                {voted && electionOpen ? (
                  <>
                    <div className="my-12 border-b text-center">
                      <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                        Message
                      </div>
                    </div>
                    <div className="mx-auto max-w-xs relative text-center mt-6 font-medium text-gray-800">
                      Your ballot has been submitted. Thank you for voting! :)
                    </div>
                  </>
                ) : isEmpty(candidates) ? (
                  ""
                ) : !electionOpen && currentTime < electionTime ? (
                  <div className="mx-auto max-w-xs relative text-center mt-6 font-medium text-gray-800">
                    Elections will open at 10:00 on 24th March 2021!
                  </div>
                ) : !(currentTime < electionEnd) ? (
                  ""
                ) : (
                  <>
                    <div className="mx-auto max-w-xs relative text-center mt-6 font-medium text-gray-800">
                      Elections will close at 17:00 on 25th March 2021!
                    </div>
                    <form
                      className="w-full flex-1 mt-8 text-indigo-500"
                      onSubmit={this.handleSubmit}
                    >
                      {roles.map((role, index) => {
                        let roleCands = candidates.filter(
                          (c) => c.role === role
                        );
                        if (isEmpty(roleCands)) return;

                        return (
                          <React.Fragment key={index}>
                            <div className="my-12 border-b text-center">
                              <div className="leading-none px-2 inline-block text-md text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                {roleNames[role]}
                              </div>
                            </div>
                            <div className="mx-auto max-w-xs relative">
                              <div className="text-gray-800 ml-2">
                                <table className="shadow-lg mb-4 mx-auto">
                                  <tbody>
                                    {candidates
                                      .filter((c) => c.role === role)
                                      .map((c) => {
                                        return (
                                          <tr>
                                            {c.photo ? (
                                              <td className="border text-left px-2 py-1 md:w-48">
                                                <img src={c.photo} />
                                              </td>
                                            ) : (
                                              ""
                                            )}

                                            <td
                                              className="border text-left pl-2 py-1 md:w-48"
                                              colSpan={c.photo ? "1" : "2"}
                                            >
                                              <div className="flex items-center my-4">
                                                <input
                                                  id={
                                                    c.user.pref_first_name +
                                                    c.user.last_name
                                                  }
                                                  type="radio"
                                                  name={role}
                                                  value={c._id}
                                                  className="hidden"
                                                  onChange={this.handleChange(
                                                    role
                                                  )}
                                                />
                                                <label
                                                  htmlFor={
                                                    c.user.pref_first_name +
                                                    c.user.last_name
                                                  }
                                                  className="flex items-center cursor-pointer"
                                                >
                                                  <span className="w-8 h-8 inline-block mr-2 border border-grey flex-no-shrink"></span>
                                                  {c.user.pref_first_name}{" "}
                                                  {c.user.last_name}
                                                </label>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    <tr>
                                      <td
                                        className="border text-left px-2 py-1"
                                        colSpan="2"
                                      >
                                        <div className="flex items-center mr-4 my-4">
                                          <input
                                            id={"reopen_" + role}
                                            type="radio"
                                            name={role}
                                            value="reopen"
                                            className="hidden"
                                            onChange={this.handleChange(role)}
                                          />
                                          <label
                                            htmlFor={"reopen_" + role}
                                            className="flex items-center cursor-pointer"
                                          >
                                            <span className="w-8 h-8 inline-block mr-2 border border-grey flex-no-shrink"></span>
                                            Reopen Nominations
                                          </label>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}

                      <div className="my-12 border-b text-center">
                        <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                          Submit your ballot
                        </div>
                      </div>
                      <div className="mx-auto max-w-xs relative">
                        <button
                          onClick={this.handleSubmit}
                          className="mt-5 tracking-wide font-semibold bg-red-600 text-gray-100 w-full py-4 rounded-lg hover:bg-red-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                        >
                          <i className="fas fa-sign-out-alt  w-6  -ml-2" />
                          <span className="ml-3">Submit Ballot</span>
                        </button>
                      </div>
                    </form>
                  </>
                )}
                {!electionOpen && currentTime >= electionEnd ? (
                  <div className="mx-auto max-w-xs relative text-center mt-6 font-medium text-gray-800">
                    Elections are now closed! Thank you for your participation!
                  </div>
                ) : (
                  ""
                )}
                <Navigation role={role} history={history} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Elections;

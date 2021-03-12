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
      election: {},
      candidates: [],
      referenda: [],
      socs: "",
      mature: "",
      referendum: "",
      voted: false,
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState({ token: getCookie("token") }, async () => {
      await this.loadProfile();
      await this.loadElection();
      await this.loadCandidates();
      await this.loadReferenda();
      this.loadVotes();
    });
  }

  // Handle change from inputs
  handleChange = (text) => (e) => {
    this.setState({ [text]: e.target.value }, () => {
      // console.log(this.state[text]);
    });
  };

  // Submit data to backend
  // handleSubmit = (e) => {
  //   e.preventDefault();

  //   const { token, socs, mature, referendum, voted } = this.state;
  //   const election = this.state.election._id;

  //   if (voted) {
  //     return toast.error("You have already voted in this election!");
  //   }

  //   if (!socs) {
  //     return toast.error(
  //       "You must cast a vote for the Clubs & Societies role."
  //     );
  //   }

  //   if (!mature) {
  //     return toast.error("You must cast a vote for the Mature Student role.");
  //   }

  //   if (!referendum) {
  //     return toast.error("You must cast a vote for the referendum.");
  //   }

  //   const ballot = {
  //     token,
  //     election,
  //     candidateVotes: [],
  //     reopenNominations: [],
  //     referenda: [
  //       { referendum: this.state.referenda[0]._id, votedFor: referendum },
  //     ],
  //   };

  //   if (socs === "reopen") {
  //     ballot.reopenNominations.push({ role: "socs" });
  //   } else {
  //     ballot.candidateVotes.push({ candidate: socs, role: "socs" });
  //   }

  //   if (mature === "reopen") {
  //     ballot.reopenNominations.push({ role: "mature" });
  //   } else {
  //     ballot.candidateVotes.push({ candidate: mature, role: "mature" });
  //   }

  //   axios
  //     .post(`${process.env.REACT_APP_API_URL}/election/vote`, ballot)
  //     .then((res) => {
  //       toast.success(res.data.message);
  //     })
  //     .catch((err) => {
  //       toast.error(err.response.data.error);
  //     });
  // };

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
      candidates,
      referenda,
      loaded,
    } = this.state;

    const { history } = this.props;

    if (!loaded) {
      return "Loading...";
    }

    // __________________________________________
    //
    // HARD CODED MANIPULATION, GET RID OF IT!!!
    // __________________________________________
    let refDesc = referenda[0].description.split("\n");

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
                  Hi {pref_first_name}! Welcome to IADTSU By-Elections 2021.
                  <br />
                  Voting is now closed. Thank you for your participation.
                  {/* Please fill out your digital ballot carefully. Once submitted,
                  your votes are final.
                  <br />
                  <br />
                  You may vote separately for each role subject to this
                  election, as well as any referenda. Choose your candidate for
                  each, or vote to reopen nominations. Referenda can be voted
                  for or against.
                  <br />
                  <br />
                  To cast your vote, simply ensure that the box corresponding to
                  your choice is selected. */}
                </div>
                {/* <form
                  className="w-full flex-1 mt-8 text-indigo-500"
                  onSubmit={this.handleSubmit}
                >
                  <div className="my-12 border-b text-center">
                    <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                      Clubs & Societies Officer
                    </div>
                  </div>
                  <div className="mx-auto max-w-xs relative">
                    <div className="text-gray-800 ml-2">
                      <div className="flex items-center mr-4 mb-4">
                        <input
                          id="ryan"
                          type="radio"
                          name="socs"
                          value={candidates[1]._id}
                          className="hidden"
                          onChange={this.handleChange("socs")}
                        />
                        <label
                          htmlFor="ryan"
                          className="flex items-center cursor-pointer"
                        >
                          <span className="w-8 h-8 inline-block mr-2 border border-grey flex-no-shrink"></span>
                          {candidates[1].user.pref_first_name}{" "}
                          {candidates[1].user.last_name}
                        </label>
                      </div>

                      <div className="flex items-center mr-4 mb-4">
                        <input
                          id="reopen_socs"
                          type="radio"
                          name="socs"
                          value="reopen"
                          className="hidden"
                          onChange={this.handleChange("socs")}
                        />
                        <label
                          htmlFor="reopen_socs"
                          className="flex items-center cursor-pointer"
                        >
                          <span className="w-8 h-8 inline-block mr-2 border border-grey flex-no-shrink"></span>
                          Reopen Nominations
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="my-12 border-b text-center">
                    <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                      Mature Student Officer
                    </div>
                  </div>
                  <div className="mx-auto max-w-xs relative">
                    <div className="text-gray-800 ml-2">
                      <div className="flex items-center mr-4 mb-4">
                        <input
                          id="neil"
                          type="radio"
                          name="mature"
                          value={candidates[0]._id}
                          className="hidden"
                          onChange={this.handleChange("mature")}
                        />
                        <label
                          htmlFor="neil"
                          className="flex items-center cursor-pointer"
                        >
                          <span className="w-8 h-8 inline-block mr-2 border border-grey flex-no-shrink"></span>
                          {candidates[0].user.pref_first_name}{" "}
                          {candidates[0].user.last_name}
                        </label>
                      </div>

                      <div className="flex items-center mr-4 mb-4">
                        <input
                          id="reopen_mature"
                          type="radio"
                          name="mature"
                          value="reopen"
                          className="hidden"
                          onChange={this.handleChange("mature")}
                        />
                        <label
                          htmlFor="reopen_mature"
                          className="flex items-center cursor-pointer"
                        >
                          <span className="w-8 h-8 inline-block mr-2 border border-grey flex-no-shrink"></span>
                          Reopen Nominations
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="my-12 border-b text-center">
                    <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                      Referendum
                    </div>
                  </div>
                  <div className="mx-auto max-w-xs relative">
                    <div className="mb-4 text-gray-800 font-medium text-center">
                      {referenda[0].title}
                    </div>
                    <div className="text-gray-800 mb-4">{refDesc[0]}</div>
                    <div className="text-gray-800 ml-4 mb-1">{refDesc[1]}</div>
                    <div className="text-gray-800 ml-4 mb-1">{refDesc[3]}</div>
                    <div className="text-gray-800 ml-4 mb-4">{refDesc[4]}</div>
                    <div className="text-gray-800 ml-2">
                      <div className="flex items-center mr-4 mb-4">
                        <input
                          id="refFor"
                          type="radio"
                          name="referendum"
                          value={true}
                          className="hidden"
                          onChange={this.handleChange("referendum")}
                        />
                        <label
                          htmlFor="refFor"
                          className="flex items-center cursor-pointer"
                        >
                          <span className="w-8 h-8 inline-block mr-2 border border-grey flex-no-shrink"></span>
                          For
                        </label>
                      </div>

                      <div className="flex items-center mr-4 mb-4">
                        <input
                          id="refAgainst"
                          type="radio"
                          name="referendum"
                          value={false}
                          className="hidden"
                          onChange={this.handleChange("referendum")}
                        />
                        <label
                          htmlFor="refAgainst"
                          className="flex items-center cursor-pointer"
                        >
                          <span className="w-8 h-8 inline-block mr-2 border border-grey flex-no-shrink"></span>
                          Against
                        </label>
                      </div>

                      {/* <div className="flex items-center mr-4 mb-4">
                        <input
                          id="radio3"
                          type="radio"
                          name="radio"
                          className="hidden"
                        />
                        <label
                          htmlFor="radio3"
                          className="flex items-center cursor-pointer text-xl"
                        >
                          <span className="w-8 h-8 inline-block mr-2 rounded-full border border-grey flex-no-shrink"></span>
                          Third choice
                        </label>
                      </div>
                    </div>
                  </div>
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
                </form> */}
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

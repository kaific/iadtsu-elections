import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";

import { isAuth, getCookie, signout } from "../../helpers/auth";
import { isEmpty } from "../../helpers/basic";

// const Nominations = ({ history }) => {
class Nominations extends Component {
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
      nominees: {},
      loaded: false,
      nominations: {},
      signatures: {},
    };
  }

  componentDidMount() {
    this.setState({ token: getCookie("token") }, async () => {
      await this.loadProfile();
      await this.loadNominations();
      await this.loadSignatures();
      this.loadNominees();
    });
  }

  loadNominees = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/nomination/nominees`)
      .then((res) => {
        this.setState({ nominees: res.data, loaded: true });
      })
      .catch((err) => {
        toast.error(`Could not retrieve nominees data.`);
        this.setState({ loaded: true });
      });
  };

  loadNominations = async () => {
    const { token } = this.state;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/nomination/signee/mine`, {
        token,
      })
      .then((res) => {
        this.setState({ nominations: res.data });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  loadSignatures = async () => {
    const { token } = this.state;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/nomination/nominee/mine`, {
        token,
      })
      .then((res) => {
        this.setState({ signatures: res.data });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
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
      textChange,
      role,
      nominees,
      nominations,
      signatures,
      loaded,
    } = this.state;

    if (!loaded) {
      return "Loading...";
    }

    let nominated = false;
    nominees.map((n) => {
      if (n.user.student_number == this.state.student_number) {
        return (nominated = true);
      }
    });
    console.log("nominated: " + nominated);

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
                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Choose nominee to sign nomination
                  </div>
                </div>
                <div className="mx-auto max-w-xs relative ">
                  {!isEmpty(nominees)
                    ? nominees.map((n, i) => {
                        if (
                          n.user.student_number == this.state.student_number
                        ) {
                          return (
                            <a
                              key={i}
                              className="mt-5 tracking-wide font-semibold bg-gray-600 text-gray-100 w-full py-4 rounded-lg hover:bg-gray-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                              onClick={() =>
                                toast.error(
                                  "You can't sign your own nomination."
                                )
                              }
                            >
                              <i className="fas fa-user  w-6  -ml-2" />
                              <span className="ml-1">
                                <strike>
                                  {n.user.pref_first_name} {n.user.last_name}{" "}
                                  for {n.role}
                                </strike>
                              </span>
                            </a>
                          );
                        } else if (!isEmpty(nominations)) {
                          return nominations.map((nomination) => {
                            if (n._id == nomination.nominee._id) {
                              return (
                                <a
                                  key={i}
                                  className="mt-5 tracking-wide font-semibold bg-gray-600 text-gray-100 w-full py-4 rounded-lg hover:bg-gray-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                  onClick={() =>
                                    toast.error(
                                      "You have already nominated this person."
                                    )
                                  }
                                >
                                  <i className="fas fa-user  w-6  -ml-2" />
                                  <span className="ml-1">
                                    <strike>
                                      {n.user.pref_first_name}{" "}
                                      {n.user.last_name} for {n.role}
                                    </strike>
                                  </span>
                                </a>
                              );
                            }
                          });
                        } else {
                          return (
                            <Link
                              to={{
                                pathname: `/nominations/nominate/${n._id}`,
                                state: { nominee: n },
                              }}
                              key={i}
                              className="mt-5 tracking-wide font-semibold bg-gray-600 text-gray-100 w-full py-4 rounded-lg hover:bg-gray-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                            >
                              <i className="fas fa-user  w-6  -ml-2" />
                              <span className="ml-1">
                                {n.user.pref_first_name} {n.user.last_name} for{" "}
                                {n.role}
                              </span>
                            </Link>
                          );
                        }
                      })
                    : "No nominees yet."}
                </div>
                {/* If not a nominee */}
                {!nominated ? (
                  <React.Fragment>
                    <div className="my-12 border-b text-center">
                      <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                        Nominate yourself
                      </div>
                    </div>
                    <div className="mx-auto max-w-xs relative text-center">
                      <Link
                        to="/nominations/enter"
                        className="mt-5 tracking-wide font-semibold bg-purple-600 text-gray-100 w-full py-4 rounded-lg hover:bg-purple-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                      >
                        <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                        <span className="ml-3">Enter Nominations</span>
                      </Link>
                    </div>
                  </React.Fragment>
                ) : null}

                {/* If a nominee */}
                {nominated ? (
                  <React.Fragment>
                    <div className="mt-12 mb-4 border-b text-center">
                      <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                        {!nominated ? "Nominate yourself" : "Your signatures"}
                      </div>
                    </div>
                    <div className="mx-auto max-w-xs relative text-center">
                      {isEmpty(signatures) ? (
                        <div>You have no signatures yet.</div>
                      ) : (
                        signatures.map((s, i) => {
                          return (
                            <React.Fragment key={i}>
                              <div>
                                {i + 1}. {s.signature.pref_first_name}{" "}
                                {s.signature.last_name}
                              </div>
                            </React.Fragment>
                          );
                        })
                      )}
                    </div>
                  </React.Fragment>
                ) : null}
                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Select destination
                  </div>
                </div>
                <div className="mx-auto max-w-xs relative ">
                  {role === "admin" ? (
                    <Link
                      to="/admin"
                      className="mt-5 tracking-wide font-semibold bg-green-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                      <span className="ml-3">Admin Dashboard</span>
                    </Link>
                  ) : null}
                  <Link
                    to="/dashboard"
                    className="mt-5 tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <i className="fas fa-sign-in-alt  w-6  -ml-2" />
                    <span className="ml-3">Dashboard</span>
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

export default Nominations;

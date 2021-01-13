import React, { Component } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import authSvg from "../../assets/auth.svg";
import { /*authenticate, isAuth,*/ getCookie } from "../../helpers/auth";
import { isEmpty } from "../../helpers/basic";

class EnterNomination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: {
        disability: "Disability",
        mature: "Mature Student",
        socs: "Clubs & Societies",
      },
      nominees: {},
      role: "disability",
      token: "",
      nominee: false,
    };
  }

  loadNominee = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/nomination/nominees/mine`, {
        token: this.state.token,
      })
      .then((res) => {
        if (!isEmpty(res.data)) {
          return this.setState({ nominee: true });
        }
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Handle change from inputs
  handleChange = (text) => (e) => {
    this.setState({ [text]: e.target.value }, () => {
      console.log(this.state.role);
    });
  };
  // Submit data to backend
  handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.nominee) {
      return toast.error("You are already a nominee.");
    }
    const { role, token } = this.state;
    if (role) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/nomination/enter`, {
          role,
          token,
        })
        .then((res) => {
          this.setState({ nominee: true });
          toast.success(res.data.message);
        })
        .catch((err) => {
          toast.error(err.response.data.error);
        });
    } else {
      toast.error("Something went wrong. Refresh and try again.");
    }
  };

  componentDidMount() {
    this.setState({ token: getCookie("token") }, () => {
      this.loadNominee();
    });
  }

  render() {
    const { roles, role } = this.state;
    return (
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <ToastContainer />
        <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="mt-12 flex flex-col items-center">
              <Link
                to="/nominations"
                className="text-xl xl:text-xl text-center "
              >
                {"<"} Nominations
              </Link>
              <h1 className="text-2xl xl:text-3xl font-extrabold">
                Register as a Nominee
              </h1>
              <form
                className="w-full flex-1 mt-8 text-indigo-500"
                onSubmit={this.handleSubmit}
              >
                <div className="mx-auto max-w-xs relative">
                  {/* <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    placeholder="First Name"
                    onChange={handleChange("first_name")}
                    value={first_name}
                  /> */}

                  <select
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    onChange={this.handleChange("role")}
                  >
                    {Object.keys(roles).map((key, i) => {
                      return (
                        <option key={i} value={key}>
                          {roles[key]}
                        </option>
                      );
                    })}
                  </select>

                  <button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-purple-600 text-gray-100 w-full py-4 rounded-lg hover:bg-purple-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    Enter Nominations
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EnterNomination;

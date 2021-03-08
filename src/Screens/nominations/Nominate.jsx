import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import { getCookie } from "../../helpers/auth";
import { isEmpty } from "../../helpers/basic";

class Nominate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      id: "",
      role: "",
      nominated: false,
      token: "",
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.nominated) {
      return toast.error("You've already nominated this nominee.");
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/nomination/nominate`, {
        token: this.state.token,
        nominee: this.state.id,
      })
      .then((res) => {
        toast.success(res.data.message);
        this.props.history.push("/dashboard");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  async componentDidMount() {
    const token = getCookie("token");
    const { id } = this.props.match.params;
    const { nominee } = this.props.location.state;
    let nominated = false;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/nomination/signees/mine`, {
        token,
      })
      .then((res) => {
        if (!isEmpty(res.data)) {
          // map through nominations
          res.data.map((n) => {
            if (n.nominee._id == id) {
              nominated = true;
            }
          });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });

    this.setState({
      token,
      name: `${nominee.user.pref_first_name} ${nominee.user.last_name}`,
      id,
      role: `${nominee.role}`,
      nominated,
    });
  }
  render() {
    const { name, role } = this.state;

    if (isEmpty(this.state.name)) {
      return "Loading...";
    }

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
                Do you want to nominate {name} for {role}?
              </h1>

              <form
                className="w-full flex-1 mt-8 text-indigo-500"
                onSubmit={this.handleSubmit}
              >
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  Nominate
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Nominate;

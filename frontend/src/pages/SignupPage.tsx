import React, { useState } from "react";
// import httpClient from "../httpClient";
import { apiClient } from "../api/client";
import { AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { setUserID } from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignupPage: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const logInUser = async () => {
    console.log(userId, password);

    try {
      const resp = await apiClient.post("/signup", {
        username: userId,
        password: password,
      });

      console.log("response: ", resp);

      dispatch(setUserID(resp.data.userID));

      navigate("/");
      toast.success("User signed up and logged in")
    } catch (error: any) {
      console.log("Signup error", error)
      toast.error(error.response.data.error);
      // if (error.response.status === 401) {
      //   // alert("Something went wrong");
      // }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-secondary p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h1 className="text-2xl font-semibold text-white text-center mb-6">
          Create your Account 
        </h1>
        <form>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="email">
              Email:
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2" htmlFor="password">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => logInUser()}
            className="w-full py-2 bg-primary text-white border-2 border-white rounded-md hover:bg-opacity-80 focus:outline-none"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;

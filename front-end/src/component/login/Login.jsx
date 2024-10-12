import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useHttp from "../customHook/useHttp";
import { useState } from "react";

const Login = () => {
  const { loading, sendRequest } = useHttp();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("hello world");

    const request = {
      url: "",
      method: "POST",
      body: {
        username: e.target.username,
        password: e.target.password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    };

    sendRequest(request, () => {});
  };

  return (
    <div className="grid grid-cols-2 w-full">
      <div className="bg-gradient-to-r from-green-600 to-green-700 w-full h-screen gap-10 flex justify-start flex-col items-center rounded-br-full">
        <h1 className="mt-10 text-white font-bold text-3xl">New Here?</h1>
        <p className="w-1/2 text-center text-white text-sm ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem facilis
          quasi nesciunt maiores! Nam, id consectetur! Hic esse, rem quidem
        </p>
        <img className="w-72 h-72 " src="/assets/images/login.png" />
      </div>
      <div className="w-full flex flex-col gap-36 items-center justify-start">
        <div className="text-center mt-9">
          <img
            src="https://um6ss.ma/wp-content/uploads/2024/02/UM6SS.png"
            className="w-full h-36"
          />
        </div>
        <form className="p-4 scale-150" onSubmit={handleSubmit}>
          <div className="px-2 text-center mb-3 font-bold text-white text-3xl">
            <h3 className="text-black">Login</h3>
          </div>
          <div className="mb-3 relative">
            <FontAwesomeIcon
              className="absolute left-3 top-3 text-gray-500"
              icon={faEnvelope}
            />
            <input
              className="py-3 px-2 pl-10  w-96 rounded-md outline-none bg-gray-200 hover:bg-gray-300 text-xs text-gray-700 focus:bg-gray-300"
              placeholder="Entrer votre Mail"
              name="username"
            />
          </div>
          <div className="mb-3 relative">
            <FontAwesomeIcon
              className="absolute left-3 top-3 text-gray-500"
              icon={faKey}
            />
            <input
              className="py-3 px-2 pl-10 w-96 rounded-md outline-none bg-gray-200 hover:bg-gray-300 text-xs text-gray-700 focus:bg-gray-300"
              placeholder="Entrer votre Password"
              name="password"
            />
          </div>
          <div className="mt-5 text-center">
            <button className="bg-gradient-to-r from-green-600 to-green-700 px-10 py-1 pb-2 text-white rounded-lg">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

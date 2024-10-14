import { useState } from "react";
import TabAddUser from "../tap-add-user/TabAddUser";
import { Link } from "react-router-dom";
import Header from "../header/header";

const AddUser = () => {
  const [tab, setTab] = useState("admin");

  const selectTab = (value) => {
    setTab(value);
    console.log(tab);
  };

  return (
    <div className="w-full">
      <Header />
      <TabAddUser tabSelected={tab} onSelectTab={selectTab} />
      <form className="rounded shadow py-10 mt-5 my-auto block border-l-4 border-l-gray-600 w-1/2 m-auto p-5">
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Name</label>
          <input className="block w-full px-2 py-1 outline-none rounded-md  border" />
        </div>
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Email</label>
          <input className="block w-full px-2 py-1 outline-none rounded-md  border" />
        </div>
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Password</label>
          <input
            className="block w-full px-2 py-1 outline-none rounded-md  border"
            type="password"
          />
        </div>
        {/* <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Role</label>
          <select className="rounded-md w-full px-2 py-2 bg-white border">
            <option disabled>Select a role</option>
            <option value={"admin"}>Admin</option>
            <option value={"support_it"}>Support it</option>
            <option value={"client"}>Client</option>
          </select>
        </div> */}
        {/* <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Fonction</label>
          <select className="rounded-md w-full px-2 py-2 bg-white border">
            <option disabled>Select a role</option>
            <option value={"Konosys"}>Konosys</option>
            <option value={"Canvas"}>Canvas</option>
            <option value={"Biostar"}>Biostar</option>
          </select>
        </div> */}
        {tab === "support" && (
          <div className="flex justify-between gap-3 items-start my-3">
            <label className="w-32">Fonction</label>
            <div className="w-full">
              <div className="w-full">
                <input type="checkbox"></input>
                <label className="ml-3">Technicien Si</label>
              </div>
              <div className="w-full">
                <input type="checkbox"></input>
                <label className="ml-3">Infra-structure</label>
              </div>
              <div className="w-full">
                <input type="checkbox"></input>
                <label className="ml-3">Support-It</label>
              </div>
              <div className="w-full">
                <input type="checkbox"></input>
                <label className="ml-3">Planification</label>
              </div>
              <div className="w-full">
                <input type="checkbox"></input>
                <label className="ml-3">Finance</label>
              </div>
              <div className="w-full">
                <input type="checkbox"></input>
                <label className="ml-3">Scolarité</label>
              </div>
            </div>
          </div>
        )}

        {tab !== "admin" && (
          <div className="flex justify-between gap-3 items-center my-3">
            <label className="w-32">Departement</label>
            <select className="rounded-md w-full px-2 py-2 bg-white border">
              <option disabled>Select a Departement</option>
              <option value={"Konosys"}>Konosys</option>
              <option value={"Canvas"}>Canvas</option>
              <option value={"Biostar"}>Biostar</option>
            </select>
          </div>
        )}
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Localisation</label>
          <select className="rounded-md w-full px-2 py-2 bg-white border">
            <option disabled>Select a Localisation</option>
            <option value={"Anfa"}>Anfa</option>
            <option value={"Ligue arab"}>Ligue arab</option>
            <option value={"anas inboMail"}>anas inboMail</option>
          </select>
        </div>
        <div className="flex gap-2 mt-10">
          <button className="bg-green-800 rounded py-2 px-16 text-white hover:bg-green-700">
            Ajouter
          </button>
          <Link
            to={"/tickets/usersList"}
            className="bg-red-80 border border-red-800 text-red-800 rounded py-2 px-8 hover:bg-red-700 hover:text-white transition-all"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddUser;

import { useEffect, useState } from "react";
import TabAddUser from "../tap-add-user/TabAddUser";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/header";
import useHttp from "../customHook/useHttp";

const AddUser = () => {
  // const [tab, setTab] = useState("admin");

  // const selectTab = (value) => {
  //   setTab(value);
  //   console.log(tab);
  // };
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const { sendRequest, loading } = useHttp();
  const navigate = useNavigate();
  const [specialisations, setSpecialisation] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSpecialisationChange = (e) => {
    const index = specialisations.indexOf(e.target.value);
    const isChecked = e.target.checked;
    if (isChecked && index === -1) {
      setSpecialisation([...specialisations, e.target.value]);
    } else {
      const newSpecialisation = specialisations.filter(
        (specialisation, i) => i !== index
      );
      setSpecialisation([...newSpecialisation]);
    }
  };

  useEffect(() => {
    setFormData({
      ...formData,
      specialisation_ids: [...specialisations],
    });
  }, [specialisations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const request = {
      url: "http://127.0.0.1:8000/api/register",
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    sendRequest(request, getData);
  };

  const getData = (data) => {
    // navigate("/tickets/usersList");
    console.log(data);
  };

  return (
    <div className="w-full">
      <Header
        name={"Mezrioui Hakim"}
        greeting={"Have a nice day"}
        role={"super-admin"}
        profile={
          "https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
        }
      />
      {/* <TabAddUser tabSelected={tab} onSelectTab={selectTab} /> */}
      <form
        onSubmit={handleSubmit}
        className="rounded shadow py-10 mt-5 my-auto block border-l-4 border-l-gray-600 w-1/2 m-auto p-5"
      >
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Name</label>
          <input
            onBlur={handleChange}
            name="name"
            className="block w-full px-2 py-1 outline-none rounded-md  border"
          />
        </div>
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Email</label>
          <input
            onBlur={handleChange}
            name="email"
            className="block w-full px-2 py-1 outline-none rounded-md  border"
          />
        </div>
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Password</label>
          <input
            onBlur={handleChange}
            name="password"
            className="block w-full px-2 py-1 outline-none rounded-md  border"
            type="password"
          />
        </div>
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Role</label>
          <select
            name="role"
            onChange={handleChange}
            className="rounded-md w-full px-2 py-2 bg-white border"
          >
            <option disabled>Select a role</option>
            <option value={"admin"}>Admin</option>
            <option value={"supportIt"}>Support it</option>
            <option value={"client"}>Client</option>
          </select>
        </div>

        {formData.role === "supportIt" && (
          <div className="flex flex-col  w-fit  gap-3 items-center my-3">
            {/* <label className="w-32">Specialisation</label> */}
            {/* <select
              name="specialisation_id"
              className="rounded-md w-full px-2 py-2 bg-white border"
            >
              <option disabled>Select a specialisation</option>
              <option value={"2"}>Konosys</option>
              <option value={"2"}>Canvas</option>
              <option value={"3"}>Biostar</option>
            </select> */}
            <label>Specialisation</label>
            <span className="text-start w-full flex items-center gap-3">
              <input
                onChange={handleSpecialisationChange}
                name="specialisation_id"
                type="checkbox"
                value={"1"}
              />
              <label>spes1</label>
            </span>
            <span className="text-start w-full flex items-center gap-3">
              <input
                onChange={handleSpecialisationChange}
                name="specialisation_id"
                type="checkbox"
                value={"2"}
              />
              <label>spes2</label>
            </span>
            <span className="text-start w-full flex items-center gap-3">
              <input
                onChange={handleSpecialisationChange}
                name="specialisation_id"
                type="checkbox"
                value={"3"}
              />
              <label>spes3</label>
            </span>
            <span className="text-start w-full flex items-center gap-3">
              <input
                onChange={handleSpecialisationChange}
                name="specialisation_id"
                type="checkbox"
                value={"4"}
              />
              <label>spes4</label>
            </span>
          </div>
        )}
        {/* {tab === "support" && (
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
        )}  */}

        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Fonction</label>
          <select
            onBlur={handleChange}
            name="fonction_id"
            className="rounded-md w-full px-2 py-2 bg-white border"
          >
            <option disabled>Select a Fonction</option>
            <option value={1}>Konosys</option>
            <option value={2}>Canvas</option>
            <option value={3}>Biostar</option>
          </select>
        </div>

        {/* {tab !== "admin" && ( */}
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Departement</label>
          <select
            onBlur={handleChange}
            name="departement_id"
            className="rounded-md w-full px-2 py-2 bg-white border"
          >
            <option disabled>Select a Departement</option>
            <option value={1}>Konosys</option>
            <option value={2}>Canvas</option>
            <option value={3}>Biostar</option>
          </select>
        </div>
        {/* )} */}
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Localisation</label>
          <select
            onBlur={handleChange}
            name="localisation_id"
            className="rounded-md w-full px-2 py-2 bg-white border"
          >
            <option disabled>Select a Localisation</option>
            <option value={1}>Anfa</option>
            <option value={2}>Ligue arab</option>
            <option value={3}>anas inboMail</option>
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

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useHttp from "../customHook/useHttp";

const UpdateUser = () => {
  const params = useParams();
  const navigate = useNavigate();
  const {sendRequest, loading} = useHttp();
  
  const [user, setUser] = useState({});
  const [departements, setDepartements] = useState([]);
  const [localisations, setLocalisations] = useState([]);

  
  useEffect(() => {
    // setRoleUser(params.role);
    const id = params.id;
    const token = localStorage.getItem("accessToken");

    
    const request1 = {
      url: `http://127.0.0.1:8000/api/departements`,
      headers: {
        "Content-Type": "application/json",
      }
    }

    sendRequest(request1, getData1);

    const request2 = {
      url: `http://127.0.0.1:8000/api/localisations`,
      headers: {
        "Content-Type": "application/json",
      }
    }

    sendRequest(request2, getData2);

    const request3 = {
      url: `http://127.0.0.1:8000/api/user/${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    sendRequest(request3, getData3);
  }, []);

  const getData1 = (dataRec) => {
    setDepartements([...dataRec]);
  }
  const getData2 = (dataRec) => {
    setLocalisations(dataRec);
  }
  const getData3 = (dataRec) => {
    setUser(dataRec);
  }

  const handleChange = (e) => {
    const {name, value} = e.target;
    
    setUser({
      ...user,
      [name]: value,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
  }

  return (
    <div>
      <div
        onClick={() => navigate(-1)}
        className="fixed top-0 left-0 z-10 h-screen w-full"
        style={{ backgroundColor: "rgba(0, 0, 0, .5)" }}
      ></div>
      <form onSubmit={handleSubmit} className="absolute top-20 left-1/4 z-40 rounded shadow py-10 mt-10  border-l-4 border-l-gray-600 w-1/2 p-5 bg-white">
        <img
          className="  h-28 mb-12"
          src="https://um6ss.ma/wp-content/uploads/2024/02/UM6SS.png"
          alt=""
        />
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Name</label>
          <input onChange={handleChange} value={user.name || ''} className="block w-full px-2 py-1 outline-none rounded-md  border" />
        </div>
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Email</label>
          <input onBlur={handleChange} value={user.email} className="block w-full px-2 py-1 outline-none rounded-md  border" />
        </div>

        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Role</label>
          <select
            required
            name="role"
            onChange={() => {}}
            onBlur={handleChange}
            className="rounded-md w-full px-2 py-2 bg-white border"
          >
            <option selected disabled value={null}>
              Select a role
            </option>
            <option selected={user.role === "admin"} value={"admin"}>Admin</option>
            <option selected={user.role === "supportIt"} value={"supportIt"}>Support it</option>
            <option selected={user.role === "client"} value={"client"}>Client</option>
          </select>
        </div>

        {user.role === "supportIt" && (
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

        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Departement</label>
          <select onChange={handleChange} className="rounded-md w-full px-2 py-2 bg-white border">
            <option selected value={null} disabled>Select a Departement</option>
            {
              departements.map((departement) => (
                <option selected={departement.id === user.departement_id} value={departement.id}>{departement.name}</option>
              ))
            }
            {/* <option value={"Canvas"}>Canvas</option>
            <option value={"Biostar"}>Biostar</option> */}
          </select>
        </div>

        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Localisation</label>
          <select onChange={handleChange} className="rounded-md w-full px-2 py-2 bg-white border">
            <option value={null} disabled>Select a Localisation</option>
            {localisations.map((localisation) => (
              <option selected={localisation.id === user.localisation_id} value={localisation.id}>{localisation.name}</option>
            ))
          }
          </select>
        </div>
        <div className="flex gap-2 mt-10">
          <button className="bg-green-800 rounded py-2 px-16 text-white hover:bg-green-700">
            Update
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

export default UpdateUser;

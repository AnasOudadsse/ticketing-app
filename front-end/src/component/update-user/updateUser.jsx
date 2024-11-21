import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useHttp from "../customHook/useHttp";

const UpdateUser = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { sendRequest, loading } = useHttp();
  const [formData, setFormData] = useState({});

  const [user, setUser] = useState({});
  const [specialisations, setSpecialisation] = useState([]);
  const [specialisationIds, setSpecialisationIds] = useState([]);
  const [checkSpecialisations, setCheckSpecialisation] = useState({});

  const [info, setInfo] = useState({
    fonctions: [],
    departements: [],
    localisations: [],
    specialisations: [],
  });

  useEffect(() => {
    const request = {
      url: "http://127.0.0.1:8000/api/getinfo",
      headers: {
        "Content-Type": "Application/Json",
      },
    };

    sendRequest(request, getInfo);
  }, []);

  const getInfo = (dataRec) => {
    setInfo(dataRec);
  };

  useEffect(() => {
    const id = params.id;
    const token = localStorage.getItem("accessToken");

    const request3 = {
      url: `http://127.0.0.1:8000/api/user/${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    sendRequest(request3, fetchUser);
  }, []);

  const fetchUser = (dataRec) => {
    setUser(dataRec);
    const sps = dataRec.specialisations;
    setSpecialisationIds([
      ...new Set(sps.map((specialisation) => specialisation.id)),
    ]);
    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSpecialisationChange = (e) => {
    const index = specialisations.indexOf(e.target.value);
    const isChecked = e.target.checked;
    if (isChecked && index === -1) {
      setSpecialisationIds([...specialisationIds, e.target.value]);
    } else {
      const newSpecialisation = specialisationIds.filter(
        (specialisation, i) => i !== index
      );
      setSpecialisationIds([...newSpecialisation]);
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
    const id = params.id;

    const request = {
      url: `http://127.0.0.1:8000/api/users/${id}`,
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    sendRequest(request, (dataRec) => console.log(dataRec));
  };

  return (
    <div>
      <div
        onClick={() => navigate(-1)}
        className="fixed top-0 left-0 z-10 h-screen w-full"
        style={{ backgroundColor: "rgba(0, 0, 0, .5)" }}
      ></div>
      <form
        onSubmit={handleSubmit}
        className="absolute top-20 left-1/4 z-40 rounded shadow py-10 mt-10  border-l-4 border-l-gray-600 w-1/2 p-5 bg-white"
      >
        <img
          className="  h-28 mb-12"
          src="https://um6ss.ma/wp-content/uploads/2024/02/UM6SS.png"
          alt=""
        />
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Name</label>
          <input
            onChange={handleChange}
            name="name"
            value={user.name || ""}
            className="block w-full px-2 py-1 outline-none rounded-md  border"
          />
        </div>
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Email</label>
          <input
            onChange={handleChange}
            name="email"
            value={user.email}
            className="block w-full px-2 py-1 outline-none rounded-md  border"
          />
        </div>

        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Role</label>
          <select
            required
            name="role"
            onChange={handleChange}
            className="rounded-md w-full px-2 py-2 bg-white border"
          >
            <option selected disabled value={null}>
              Select a role
            </option>
            <option selected={user.role === "admin"} value={"admin"}>
              Admin
            </option>
            <option selected={user.role === "supportIt"} value={"supportIt"}>
              Support it
            </option>
            <option selected={user.role === "client"} value={"client"}>
              Client
            </option>
          </select>
        </div>

        {user.role === "supportIt" && (
          <div className="flex justify-between gap-3 items-start my-3">
            <label className="w-32">Specialisation</label>
            <span className="text-start w-full flex-wrap flex items-start gap-3">
              {info.specialisations.map((specialisation, index) => (
                <span key={index} className="flex gap-1">
                  <input
                    id={index}
                    onChange={handleSpecialisationChange}
                    name="specialisation_id"
                    type="checkbox"
                    value={specialisation.id}
                    checked={specialisationIds.includes(specialisation.id)}
                  />
                  <label>{specialisation.name}</label>
                </span>
              ))}
            </span>
          </div>
        )}

        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Departement</label>
          <select
            onChange={handleChange}
            className="rounded-md w-full px-2 py-2 bg-white border"
          >
            <option selected value={null} disabled>
              Select a Departement
            </option>
            {info.departements.map((departement) => (
              <option
                selected={departement.id === user.departement_id}
                value={departement.id}
              >
                {departement.name}
              </option>
            ))}
            {/* <option value={"Canvas"}>Canvas</option>
            <option value={"Biostar"}>Biostar</option> */}
          </select>
        </div>

        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Localisation</label>
          <select
            onChange={handleChange}
            className="rounded-md w-full px-2 py-2 bg-white border"
          >
            <option value={null} disabled>
              Select a Localisation
            </option>
            {info.localisations.map((localisation) => (
              <option
                selected={localisation.id === user.localisation_id}
                value={localisation.id}
              >
                {localisation.name}
              </option>
            ))}
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

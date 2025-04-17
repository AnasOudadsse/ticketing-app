import { Fragment, useEffect, useState } from "react";
import TabAddUser from "../tap-add-user/TabAddUser";
import { Link, useNavigate } from "react-router-dom";
import Header from "../header/header";
import useHttp from "../customHook/useHttp";
import { useToast } from "@chakra-ui/react";
import useCheckValidation from "../customHook/useCheckValidation";

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
  const [info, setInfo] = useState({
    fonctions: [],
    departements: [],
    localisations: [],
    specialisations: [],
  });
  const [specialisations, setSpecialisation] = useState([]);
  const toast = useToast();

  const {
    response,
    checkName,
    checkEmail,
    checkPassword,
    checkRole,
    checkFonction,
    checkDepartement,
    checkLocalisation,
  } = useCheckValidation();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    switch (name) {
      case "name":
        checkName(value);
        break;
      case "email":
        checkEmail(value);
        break;
      case "password":
        checkPassword(value);
        break;
      case "role":
        // checkRole(value);
        if (value !== "supportIt") {
          setFormData((prevData) => ({ ...prevData, specialisation: [] }));
        }
        break;
      case "fonction_id":
        checkFonction(value);
        break;
      case "departement_id":
        checkDepartement(value);
        break;
      case "localisation_id":
        checkLocalisation(value);
        break;
      default:
        break;
    }
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

    const userForm = document.getElementById("userForm");
    if (!userForm.checkValidity()) {
      toast({
        title: "Warning",
        description: "The form is invalid",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

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
    toast({
      title: "Success",
      description: "The register succesfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    navigate("/tickets/usersList");
  };

  if (!info) {
    return null;
  }

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
        id="userForm"
        onSubmit={handleSubmit}
        className="rounded shadow py-10 mt-5 my-auto block border-l-4 border-l-gray-600 w-1/2 m-auto p-5"
      >
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Name</label>
          <input
            required
            minLength={6}
            onBlur={handleChange}
            name="name"
            className="block w-full px-2 py-1 outline-none rounded-md  border"
          />
          {/* <input
            required
            minLength={6}
            onBlur={() => checkName(formData.name ?? "")} // Vous pouvez également passer directement la valeur ici
            name="name"
            onChange={handleChange}
            className="block w-full px-2 py-1 outline-none rounded-md border"
          /> */}
        </div>
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Email</label>
          <input
            type="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            required
            onBlur={handleChange}
            name="email"
            className="block w-full px-2 py-1 outline-none rounded-md  border"
          />
        </div>
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Password</label>
          <input
            required
            minLength={8}
            onBlur={handleChange}
            name="password"
            className="block w-full px-2 py-1 outline-none rounded-md  border"
            type="password"
          />
        </div>
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Role</label>
          <select
            required
            name="role"
            onChange={handleChange}
            onBlur={(e) => checkRole(e.target.value)}
            className="rounded-md w-full px-2 py-2 bg-white border"
          >
            <option selected disabled value={null}>
              Select a role
            </option>
            <option value={"admin"}>Admin</option>
            <option value={"supportIt"}>Support it</option>
            <option value={"client"}>Client</option>
          </select>
        </div>

        {formData.role === "supportIt" && (
          <div className="flex flex-col  w-fit  gap-3 items-start my-3">
            <label>Specialisation</label>
            <span className="text-start w-full flex-wrap flex items-start gap-3">
              {info.specialisations.map((specialisation) => (
                <span className="flex gap-1">
                  <input
                    onChange={handleSpecialisationChange}
                    name="specialisation_id"
                    type="checkbox"
                    value={specialisation.id}
                  />
                  <label>{specialisation.name}</label>
                </span>
              ))}
            </span>
          </div>
        )}
        {/* {tab === "support" && (
          <div className="flex justify-between gap-3 items-start my-3">
            <label className="w-32">Fonction</label>
            <div className="w-full">
              <div className="w-full">
                <input
                required type="checkbox"></input>
                <label className="ml-3">Technicien Si</label>
              </div>
              <div className="w-full">
                <input
                required type="checkbox"></input>
                <label className="ml-3">Infra-structure</label>
              </div>
              <div className="w-full">
                <input
                required type="checkbox"></input>
                <label className="ml-3">Support-It</label>
              </div>
              <div className="w-full">
                <input
                required type="checkbox"></input>
                <label className="ml-3">Planification</label>
              </div>
              <div className="w-full">
                <input
                required type="checkbox"></input>
                <label className="ml-3">Finance</label>
              </div>
              <div className="w-full">
                <input
                required type="checkbox"></input>
                <label className="ml-3">Scolarité</label>
              </div>
            </div>
          </div>
        )}  */}

        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Fonction</label>
          <select
            required
            onBlur={handleChange}
            name="fonction_id"
            className="rounded-md w-full px-2 py-2 bg-white border"
          >
            <option selected disabled>
              Select a Fonction
            </option>

            {info.fonctions &&
              info.fonctions.map((fonction) => (
                <option value={fonction.id}>{fonction.name}</option>
              ))}
          </select>
        </div>

        {/* {tab !== "admin" && ( */}
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Departement</label>
          <select
            required
            onBlur={handleChange}
            name="departement_id"
            className="rounded-md w-full px-2 py-2 bg-white border"
          >
            <option selected disabled>
              Select a Departement
            </option>
            {info.departements.map((departement) => (
              <option value={departement.id}>{departement.name}</option>
            ))}
          </select>
        </div>
        {/* )} */}
        <div className="flex justify-between gap-3 items-center my-3">
          <label className="w-32">Localisation</label>
          <select
            required
            onBlur={handleChange}
            name="localisation_id"
            className="rounded-md w-full px-2 py-2 bg-white border"
          >
            <option selected disabled>
              Select a Localisation
            </option>
            {info.localisations.map((localisation) => (
              <option value={1}>{localisation.name}</option>
            ))}
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

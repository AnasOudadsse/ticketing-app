import DataTable from "react-data-table-component";
import {
  faAdd,
  faCaretUp,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useEffect, useState } from "react";
import Header from "../header/header";
import { Link, Outlet, useNavigate } from "react-router-dom";
import useHttp from "../customHook/useHttp";
// import { Checkbox } from "@chakra-ui/react";
// import ArrowDownWa

const UsersList = () => {
  const [data, setData] = useState([]);
  const [dataF, setDataF] = useState([]);
  const { loading, sendRequest } = useHttp();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const request = {
      url: "http://127.0.0.1:8000/api/users",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    sendRequest(request, getData);
  }, []);

  const getData = (data) => {
    setData([...data.users]);
    setDataF([...data.users]);
  };

  const handleSearch = (e) => {
    const dataF = data.filter((enterprise) => {
      if (
        enterprise.name &&
        enterprise.name.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        return enterprise;
      }
    });

    setDataF([...dataF]);
  };

  const navigate = useNavigate();

  const columns = [
    {
      name: "name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "fonction",
      selector: (row) => row.fonction,
      sortable: true,
    },
    {
      name: "departement",
      selector: (row) => row.departement,
      sortable: true,
    },
    {
      name: "actions",
      cell: (row) => (
        <Fragment>
          <button
            onClick={() => {
              navigate(`updateuser/${row.role}`);
            }}
            className="p-2 rounded hover:bg-orange-300 btn btn-info btn-sm text-white bg-orange-400"
          >
            <FontAwesomeIcon icon={faPencil} />
          </button>
          &nbsp;
          <button
            onClick={() => {}}
            className="p-2 rounded hover:bg-red-600 btn btn-info btn-sm text-white bg-red-700"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </Fragment>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="w-full mx-auto">
      <Header
        name={"Mezrioui Hakim"}
        greeting={"Have a nice day"}
        role={"super-admin"}
        profile={
          "https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
        }
      />
      <div className="mt-10 flex justify-between">
        <input
          placeholder="Search ..."
          className="border border-slate-600 px-3 py-1 w-96 rounded"
          onChange={handleSearch}
        />
        <Link
          to={"/tickets/adduser"}
          className=" text-white bg-green-500 py-3 px-4 rounded hover:bg-green-600"
        >
          <FontAwesomeIcon icon={faAdd} className="" />
        </Link>
      </div>
      {/* {loading && (
        <div className="bg-indigo-500">
          <svg class="animate-spin text-white h-5 w-5 mr-3" viewBox="0 0 24 24"></svg>
          Loading ...
        </div>
      )} */}
      <DataTable
        columns={columns}
        data={dataF}
        pagination
        sortIcon={<FontAwesomeIcon icon={faCaretUp} size="2xl" />}
        // selectableRowsComponent={Checkbox}
        className="m-auto block mt-10"
      />

      <Outlet />
    </div>
  );
};

export default UsersList;

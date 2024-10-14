import DataTable from "react-data-table-component";
import {
  faAdd,
  faCaretUp,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useState } from "react";
import Header from "../header/header";
import { Link, Outlet, useNavigate } from "react-router-dom";
// import { Checkbox } from "@chakra-ui/react";
// import ArrowDownWa

const pre_data = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Admin",
    fonction: "HR Manager",
    departement: "Human Resources",
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "Client",
    fonction: "Software Engineer",
    departement: "Development",
  },
  {
    id: 3,
    name: "Charlie Brown",
    role: "support",
    fonction: "Data Analyst",
    departement: "Analytics",
  },
  {
    id: 4,
    name: "Diana Prince",
    role: "Manager",
    fonction: "Project Manager",
    departement: "Operations",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    role: "Admin",
    fonction: "IT Specialist",
    departement: "IT",
  },
  {
    id: 6,
    name: "Fiona Glenn",
    role: "User",
    fonction: "Accountant",
    departement: "Finance",
  },
  {
    id: 7,
    name: "George White",
    role: "User",
    fonction: "Marketing Coordinator",
    departement: "Marketing",
  },
  {
    id: 8,
    name: "Hannah Blue",
    role: "Manager",
    fonction: "Customer Service Manager",
    departement: "Customer Service",
  },
  {
    id: 9,
    name: "Ian Black",
    role: "Admin",
    fonction: "Chief Technical Officer",
    departement: "Management",
  },
  {
    id: 10,
    name: "Jane Doe",
    role: "User",
    fonction: "Graphic Designer",
    departement: "Design",
  },
  {
    id: 1,
    name: "Alice Johnson",
    role: "Admin",
    fonction: "HR Manager",
    departement: "Human Resources",
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "User",
    fonction: "Software Engineer",
    departement: "Development",
  },
  {
    id: 3,
    name: "Charlie Brown",
    role: "User",
    fonction: "Data Analyst",
    departement: "Analytics",
  },
  {
    id: 4,
    name: "Diana Prince",
    role: "Manager",
    fonction: "Project Manager",
    departement: "Operations",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    role: "Admin",
    fonction: "IT Specialist",
    departement: "IT",
  },
  {
    id: 6,
    name: "Fiona Glenn",
    role: "User",
    fonction: "Accountant",
    departement: "Finance",
  },
  {
    id: 7,
    name: "George White",
    role: "User",
    fonction: "Marketing Coordinator",
    departement: "Marketing",
  },
  {
    id: 8,
    name: "Hannah Blue",
    role: "Manager",
    fonction: "Customer Service Manager",
    departement: "Customer Service",
  },
  {
    id: 9,
    name: "Ian Black",
    role: "Admin",
    fonction: "Chief Technical Officer",
    departement: "Management",
  },
  {
    id: 10,
    name: "Jane Doe",
    role: "User",
    fonction: "Graphic Designer",
    departement: "Design",
  },
];

const UsersList = () => {
  const [data, setData] = useState(pre_data);
  const [dataF, setDataF] = useState(pre_data);

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
      <Header name={"Mezrioui Hakim"} greeting={"Have a nice day"} role={"super-admin"} profile={"https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"}  />
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

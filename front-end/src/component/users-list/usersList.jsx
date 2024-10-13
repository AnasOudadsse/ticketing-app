import DataTable from "react-data-table-component";
import { faAdd, faCaretUp, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react";
import Header from "../header/header";
// import { Checkbox } from "@chakra-ui/react";
// import ArrowDownWa

const data = [
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
          <button onClick={() => {}} className="p-2 rounded hover:bg-orange-300 btn btn-info btn-sm text-white bg-orange-400">
            <FontAwesomeIcon icon={faPencil} />
          </button>
          &nbsp;
          <button onClick={() => {}} className="p-2 rounded hover:bg-red-600 btn btn-info btn-sm text-white bg-red-700">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </Fragment>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="w-full mx-auto">
        <Header />
        <div className="mt-10 flex justify-between">
            <input placeholder="Search ..." className="border border-slate-600 px-3 py-1 w-96 rounded" />
            <button className=" text-white bg-green-500 py-3 px-4 rounded hover:bg-green-600">
                <FontAwesomeIcon icon={faAdd} className="" />
            </button>
        </div>
      <DataTable
        columns={columns}
        data={data}
        pagination
        sortIcon={<FontAwesomeIcon icon={faCaretUp} size="2xl" />}
        // selectableRowsComponent={Checkbox}
        className="m-auto block mt-10"
      />
    </div>
  );
};

export default UsersList;

import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Header from "../header/header";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import useHttp from "../customHook/useHttp";
const tickets = [
  {
    id: 1,
    problem_id: 101,
    description: "Impossible de se connecter à internet.",
    status: "open",
    attachement: "screenshot_error.png",
    supportIt: "adam bariz",
    adminID: 3,
    clientID: 10,
    created_at: "2024-10-01",
    updated_at: "2024-10-01T10:00:00Z",
    resolution_date: null,
  },
  {
    id: 2,
    problem_id: 102,
    description: "L’imprimante ne fonctionne pas.",
    status: "in_progress",
    attachement: null,
    supportIt: "hamza",
    adminID: 4,
    clientID: 12,
    created_at: "2024-10-02",
    updated_at: "2024-10-04T15:00:00Z",
    resolution_date: null,
  },
  {
    id: 3,
    problem_id: 103,
    description: "Erreur lors de la mise à jour du logiciel.",
    status: "resolved",
    attachement: "log_update_error.txt",
    supportIt: "anas oudadas",
    adminID: 2,
    clientID: 13,
    created_at: "2024-09-28",
    updated_at: "2024-09-30T09:30:00Z",
    resolution_date: "2024-09-30T09:30:00Z",
  },
  {
    id: 4,
    problem_id: 104,
    description: "L’ordinateur ne démarre pas.",
    status: "open",
    attachement: null,
    supportIt: "mezrioui hakim",
    adminID: null,
    clientID: 14,
    created_at: "2024-10-05",
    updated_at: "2024-10-05T14:00:00Z",
    resolution_date: null,
  },
  {
    id: 5,
    problem_id: 105,
    description: "Connexion réseau intermittente.",
    status: "in_progress",
    attachement: "network_log.txt",
    supportIt: "essabouni mouad",
    adminID: 3,
    clientID: 15,
    created_at: "2024-10-06",
    updated_at: "2024-10-08T12:00:00Z",
    resolution_date: null,
  },
  {
    id: 6,
    problem_id: 105,
    description: "Connexion réseau intermittente.",
    status: "in_progress",
    attachement: "network_log.txt",
    supportIt: "kamal kadimi",
    adminID: 3,
    clientID: 15,
    created_at: "2024-10-06",
    updated_at: "2024-10-08T12:00:00Z",
    resolution_date: null,
  },
  {
    id: 7,
    problem_id: 105,
    description: "Connexion réseau intermittente.",
    status: "in_progress",
    attachement: "network_log.txt",
    supportIt: "anas sadikin",
    adminID: 3,
    clientID: 15,
    created_at: "2024-10-20",
    updated_at: "2024-10-08T12:00:00Z",
    resolution_date: null,
  },
];

const ExportTickets = () => {
  const [data, setData] = useState([]);
  const [dataF, setDataF] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { sendRequest, loading } = useHttp();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const request = {
      url: "http://127.0.0.1:8000/api/all-tickets",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    sendRequest(request, getData);
  }, []);

  const getData = (dataRec) => {
    setData(dataRec.tickets);
    setDataF(dataRec.tickets);
    console.log(dataRec);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    console.log(startDate);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  useEffect(() => {
    handleFilter();
  }, [selectedCategory, search, startDate, endDate]);

  const handleFilter = () => {
    const ticketsFiltredByProblems = handleFilterByProblems(data);
    const ticketsFiltredBySearch = handleFiltredBySearch(data);
    const ticketsFiltredByDate = handleFiltredByDate(ticketsFiltredBySearch);

    setDataF(ticketsFiltredByDate);
  };

  const handleFilterByProblems = (values) => {
    const resultat = values.filter((ticket) => {
      if (selectedCategory && ticket.problem_id == selectedCategory) {
        return ticket;
      }
    });

    if (resultat.length === 0) {
      return values;
    }
    return resultat;
  };

  const handleFiltredBySearch = (values) => {
    const resultat = values.filter((ticket) => {
      if (
        search &&
        ticket.supportIt?.toLowerCase().includes(search.toLowerCase())
      ) {
        return ticket;
      }
    });

    if (resultat.length === 0 && search !== "") {
      return [];
    } else if (resultat.length === 0 && search === "") {
      return values;
    }
    return resultat;
  };

  const handleFiltredByDate = (values) => {
    const resultat = values.filter((ticket) => {
      const ticketDate = new Date(ticket.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return ticketDate >= start && ticketDate <= end;
      } else if (start) {
        return ticketDate >= start;
      } else if (end) {
        return ticketDate <= end;
      }

      return true; // Si aucune date n'est sélectionnée, on retourne toutes les valeurs
    });

    return resultat;
  };

  const exportToExcel = () => {
    // Convertir les données en une feuille de calcul Excel
    const worksheet = XLSX.utils.json_to_sheet(dataF);

    // Créer un classeur Excel
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

    // Générer le fichier Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Créer un Blob pour le fichier et l'enregistrer
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(data, "Tickets_Report.xlsx");
  };

  const columns = [
    {
      name: "Problème",
      selector: (row) => row.description, // Correspond à la description du problème
      sortable: true,
    },
    {
      name: "Statut",
      selector: (row) => row.status, // Correspond au statut du ticket
      sortable: true,
    },
    {
      name: "Support IT",
      selector: (row) => row.supportIt, // Correspond à l'ID du support IT
      sortable: true,
    },
    {
      name: "Admin",
      selector: (row) => row.adminID, // Correspond à l'ID de l'administrateur
      sortable: true,
    },
    {
      name: "Client",
      selector: (row) => row.clientID, // Correspond à l'ID du client
      sortable: true,
    },
    {
      name: "Date de résolution",
      selector: (row) => row.resolution_date, // Correspond à la date de résolution
      sortable: true,
    },
  ];

  return (
    <div className="">
      <Header
        name={"Mezrioui Hakim"}
        greeting={"Have a nice day"}
        role={"super-admin"}
        profile={
          "https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
        }
      />
      <div className="mt-10 flex justify-between">
        <select
          onChange={handleCategoryChange}
          className="border border-slate-600 px-3 py-1 w-72 rounded"
        >
          <option value="" disabled selected>
            Choisir une catégorie
          </option>
          <option value="101">Konosys</option>
          <option value="102">Réseaux</option>
          <option value="103">Canvas</option>
          <option value="104">Téléphone</option>
          <option value="105">impriment</option>
          <option value="autre">Autre</option>
        </select>

        <input
          placeholder="Search ..."
          className="border border-slate-600 px-3 py-1 w-72 rounded"
          onChange={handleSearchChange}
        />
        <span className="border border-slate-600 rounded">
          <input
            type="date"
            placeholder="Search ..."
            className="border-none  px-3 py-1 w-50 rounded outline-none"
            onChange={handleStartDateChange}
          />
          -
          <input
            type="date"
            placeholder="Search ..."
            className="border-none px-3 py-1 w-50 rounded outline-none"
            onChange={handleEndDateChange}
          />
        </span>
      </div>
      <DataTable
        columns={columns}
        data={dataF}
        pagination
        sortIcon={<FontAwesomeIcon icon={faCaretUp} size="2xl" />}
        // selectableRowsComponent={Checkbox}
        className="m-auto block mt-10"
      />
      <button
        className="px-20 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded"
        onClick={exportToExcel}
      >
        Export
      </button>
    </div>
  );
};

export default ExportTickets;

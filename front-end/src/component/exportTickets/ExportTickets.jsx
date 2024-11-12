import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Header from "../header/header";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import useHttp from "../customHook/useHttp";

const ExportTickets = () => {
  const [data, setData] = useState([]);
  const [dataF, setDataF] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { sendRequest, loading } = useHttp();
  const [problems, setProblemes] = useState([]);
  const [searchBy, setSearchBy] = useState("support_it");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const request1 = {
      url: "http://127.0.0.1:8000/api/getTicketsByUser",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const request2 = {
      url: "http://127.0.0.1:8000/api/problems",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    sendRequest(request1, getData1);
    sendRequest(request2, getData2);
  }, []);

  const getData1 = (dataRec) => {
    setData(dataRec.tickets);
    setDataF(dataRec.tickets);
  };

  const getData2 = (dataRec) => {
    setProblemes([...dataRec]);
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

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  useEffect(() => {
    handleFilter();
  }, [selectedCategory, search, startDate, endDate]);

  const handleFilter = () => {
    const ticketsFiltredByProblems = handleFilterByProblems(data);
    const ticketsFiltredBySearch = handleFiltredBySearch(
      ticketsFiltredByProblems
    );
    const ticketsFiltredByDate = handleFiltredByDate(ticketsFiltredBySearch);

    setDataF(ticketsFiltredByDate);
  };

  const handleFilterByProblems = (values) => {
    if (selectedCategory === "") {
      return values;
    }
    const resultat = values.filter((ticket) => {
      if (selectedCategory && ticket.problem_id == selectedCategory) {
        return ticket;
      }
    });

    if (resultat.length === 0) {
      return [];
    }
    return resultat;
  };

  const handleFiltredBySearch = (values) => {
    const resultat = values.filter((ticket) => {
      if (
        search &&
        ticket[searchBy].name.toLowerCase().includes(search.toLowerCase())
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
      selector: (row) => row.problem.name, // Correspond à la description du problème
      sortable: true,
    },
    {
      name: "Statut",
      selector: (row) => row.status, // Correspond au statut du ticket
      sortable: true,
    },
    {
      name: "Support IT",
      selector: (row) => row["support_it"].name, // Correspond à l'ID du support IT
      sortable: true,
    },
    // {
    //   name: "Admin",
    //   selector: (row) => row.adminID, // Correspond à l'ID de l'administrateur
    //   sortable: true,
    // },
    {
      name: "Client",
      selector: (row) => row.creator.name, // Correspond à l'ID du client
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
      <div className="mt-10 flex gap-2 justify-between flex-wrap max-[1143px]:justify-center">
        <select
          onChange={handleCategoryChange}
          className="border border-slate-600 px-3 py-1 w-72 rounded"
        >
          <option value="" disabled selected>
            Choisir une catégorie
          </option>
          {problems.map((problem) => (
            <option value={problem.id}>{problem.name}</option>
          ))}
          <option value={""}>Autre</option>
        </select>

        <select
          onChange={handleSearchByChange}
          className="border border-slate-600 px-3 py-1 w-72 rounded"
        >
          <option value="support_it" selected>
            Search by support it
          </option>
          <option value="creator">Search by client</option>
        </select>

        <input
          placeholder="Search ..."
          className="border border-slate-600 px-3 py-1 w-72 rounded"
          onChange={handleSearchChange}
        />
        <span className="border border-slate-600 rounded max-[831px]:w-72 max-[831px]:border-none">
          <input
            type="date"
            placeholder="Search ..."
            className="border-none  px-3 py-1 w-50 rounded outline-none max-[1143px]:w-72"
            onChange={handleStartDateChange}
          />
          <span className="hidden min-[831px]:hidden">-</span>
          <input
            type="date"
            placeholder="Search ..."
            className="border-none px-3 py-1 w-50 rounded outline-none max-[1143px]:w-72"
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

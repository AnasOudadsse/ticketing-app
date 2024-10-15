import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useRef } from "react";
import ReactToPrint from "react-to-print";

const PrintTicket = () => {
  const ticketRef = useRef();

  return (
    <Fragment>
      <div className="container w-3/4 m-auto my-5" ref={ticketRef}>
        <div className="grid grid-cols-2 items-center">
          <div className="border">
            <img
              className="p-2 h-20"
              src="https://um6ss.ma/wp-content/uploads/2024/02/UM6SS.png"
              alt=""
            />
            <h3 className="p-2 border">Code: 5552521</h3>
          </div>
          <div className="p-2 border h-full text-center flex items-center justify-center">
            <h1>DEMANDE D'INTERVENTION SI</h1>
          </div>
        </div>

        <div className="my-5 border grid grid-cols-2">
          <span className="p-2">
            <p>
              <b>Date d'intervention</b> : 10/05/2024
            </p>
            <p>
              <b>Lieu d'intervention</b> : Casablanca
            </p>
            <p>
              <b>Demandeur</b> : Mezrioui Hakim
            </p>
            <p>
              <b>Service</b> : SI
            </p>
          </span>
          <span className="p-2">
            <p>
              <b>Heur de declaration</b> : 15h30min
            </p>
            <p>
              <b>Heur de d'intervention</b> : 17h30min
            </p>
            <p>
              <b>Duree de d'intervention</b> : 30min
            </p>
          </span>
        </div>

        <div className="my-5">
          <h1 className="border text-center font-bold text-xl">
            Partie reserver au demandeur
          </h1>
          <div className="p-2 pl-16 border">
            <h3 className="my-2 underline">Nature d'intervention : </h3>
            <div className="w-3/4 flex flex-wrap gap-10 gap-y-2">
              <span>
                <input type="checkbox" className="mr-2" />
                <label>AZ-Clinique</label>
              </span>
              <span>
                <input type="checkbox" className="mr-2" />
                <label>Serveur d'indentite</label>
              </span>
              <span>
                <input type="checkbox" className="mr-2" />
                <label>LIMS</label>
              </span>
              <span>
                <input type="checkbox" className="mr-2" />
                <label>RIS</label>
              </span>
              <span>
                <input type="checkbox" className="mr-2" />
                <label>PACS</label>
              </span>
              <span>
                <input type="checkbox" className="mr-2" />
                <label>IMPREMENTE</label>
              </span>
              <span>
                <input type="checkbox" className="mr-2" />
                <label>KONOSYS</label>
              </span>
              <span>
                <input type="checkbox" className="mr-2" />
                <label>TELEPHONES</label>
              </span>
              <span>
                <input type="checkbox" className="mr-2" />
                <label>ORDINATEUR</label>
              </span>
              <span>
                <input type="checkbox" className="mr-2" />
                <label>CABLE RESEAUX</label>
              </span>
              <span>
                <input type="checkbox" className="mr-2" />
                <label>ACCES RESEAU</label>
              </span>
              <span>
                <input type="checkbox" className="mr-2" />
                <label>AUTRE</label>
              </span>
            </div>
          </div>
          <div className="p-2 pl-16 border">
            <h3 className="my-2 underline">observation / commentaire : </h3>
            <textarea
              className="w-full resize-none p-2 border"
              rows={3}
              placeholder="description ..."
            />
          </div>
        </div>

        <div className="my-5">
          <h1 className="border text-center font-bold text-xl">
            Partie reserver au l'intervenant
          </h1>
          <div className="p-2 pl-16 border">
            <h3 className="my-2 underline">Nature d'intervention : </h3>
            <div className="w-full flex flex-wrap justify-around gap-10 gap-y-2">
              <div>
                <span className="flex gap-2">
                  <label>Probleme resolu: </label>
                  <span className="flex">
                    <input type="checkbox" className="mr-1 " />
                    <p>oui</p>
                  </span>
                  <span className="flex">
                    <input type="checkbox" className="mr-1 " />
                    <p>non</p>
                  </span>
                </span>
                <span></span>
              </div>

              <div className="flex flex-col">
                <span className="flex gap-2">
                  <label>Probleme resolu: </label>
                  <span className="flex">
                    <input type="checkbox" className="mr-1 " />
                    <p>oui</p>
                  </span>
                  <span className="flex">
                    <input type="checkbox" className="mr-1 " />
                    <p>non</p>
                  </span>
                </span>
                <span className="flex gap-2">
                  <label>Probleme resolu: </label>
                  <span className="flex">
                    <input type="checkbox" className="mr-1 " />
                    <p>oui</p>
                  </span>
                  <span className="flex">
                    <input type="checkbox" className="mr-1 " />
                    <p>non</p>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="p-2 pl-16 border">
            <h3 className="my-2 underline">observation / commentaire : </h3>
            <textarea
              className="w-full resize-none p-2 border"
              rows={3}
              placeholder="description ..."
            />
          </div>
        </div>

        <div className="flex justify-between h-20">
          <h3 className="font-bold">Nom et Prenpm des intervenants</h3>
          <h3 className="font-bold">Nom et Prenpm du demandeur</h3>
        </div>
      </div>
      <div className="w-3/4 m-auto mb-10">
        <ReactToPrint
          content={() => ticketRef.current}
          trigger={() => (
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-28 py-1 rounded flex gap-2 items-center">
              <FontAwesomeIcon icon={faPrint} />
              Imprimer
            </button>
          )}
        />
      </div>
    </Fragment>
  );
};

export default PrintTicket;

import {
  faArrowDownWideShort,
  faArrowUpWideShort,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react";

const StatistiquesCard = ({ icon, title, number, isUp, pourcentage, bgColor, iconColor }) => {
  return (
    <Fragment>
      <div className="bg-white-200 rounded w-60 h-fit rounded-2xl px-6 py-4 shadow-xl flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex gap-1 flex-col">
            <h3 className="text-sm text-slate-500">{title}</h3>
            <p className="text-bold">{number}</p>
          </div>
          <div className={`text-3xl p-2 ${bgColor} rounded-2xl`}>
            <FontAwesomeIcon className={`${iconColor}`} icon={icon} />
          </div>
        </div>
        <div>
          <p className="text-sm">
            {isUp ? (
              <FontAwesomeIcon
                className="text-green-800 mr-3"
                icon={faArrowUpWideShort}
              />
            ) : (
              <FontAwesomeIcon
                className="text-red-800 mr-3"
                icon={faArrowDownWideShort}
              />
            )}
            {pourcentage}
             Up from yasterday
          </p>
        </div>
      </div>
    </Fragment>
  );
};

export default StatistiquesCard;

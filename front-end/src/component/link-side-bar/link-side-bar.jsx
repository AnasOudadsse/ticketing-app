import { Icon } from "@chakra-ui/react";
import { faDashboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const LinkSideBar = ({ title, link, icon }) => {
  return (
    <Link to={`/${link}`}>
      <li className="flex justify-center w-full gap-3 items-center mb-7 hover:border-r-2 hover:text-green-900 border-green-900">
        <Icon as={icon}/>
        <span className="w-full flex justify-between items-center w-28">
          {title}
        </span>
      </li>
    </Link>
  );
};

export default LinkSideBar;

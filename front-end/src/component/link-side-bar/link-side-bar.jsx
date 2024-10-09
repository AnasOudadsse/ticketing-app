import { faDashboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LinkSideBar = ({title}) => {
    return (
        <li className="flex justify-center w-full gap-3 items-center mb-7 hover:border-r-2 hover:text-green-900 border-green-900">
            <FontAwesomeIcon icon={faDashboard} />
            <span className='w-full flex justify-between items-center w-28'>
                {title}
            </span>
        </li>
    )
}

export default LinkSideBar;
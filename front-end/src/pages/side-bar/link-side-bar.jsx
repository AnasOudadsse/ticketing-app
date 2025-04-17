import { Link, useLocation } from "react-router-dom"
import PropTypes from "prop-types"

const LinkSideBar = ({ link, title, icon }) => {
  const location = useLocation()
  const isActive = location.pathname === `/${link}`

  return (
    <li className="mb-2">
      <Link
        to={`/${link}`}
        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <div
          className={`${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500 group-hover:text-green-600 group-hover:bg-green-50"
          } w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200`}
        >
          {icon && <i className={`fas ${icon.iconName}`}></i>}
        </div>
        <span className={`ml-3 font-medium ${isActive ? "text-green-700" : "text-gray-700"}`}>{title}</span>
        {isActive && <div className="ml-auto w-1.5 h-5 bg-green-500 rounded-full" />}
      </Link>
    </li>
  )
}

LinkSideBar.propTypes = {
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.object,
}

export default LinkSideBar

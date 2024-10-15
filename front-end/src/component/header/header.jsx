import { faAngleUp, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = ({ name, greeting, profile, role }) => {
  return (
    <div className="flex justify-between items-start w-full h-fit py-2 my-15">
      <div className="flex flex-col gap-1">
        <h3>Hello {name}</h3>
        <p className="text-sm text-gray-500">{greeting}</p>
      </div>
      <div className="flex items-center gap-16">
        <span className="flex gap-3">
          <img width={50} height={50} src={profile} />
          <div>
            <p>Mezrioui Hakim</p>
            <p className="text-sm text-gray-400">{role}</p>
          </div>
        </span>
        <FontAwesomeIcon icon={faAngleUp} />
      </div>
    </div>
  );
};

export default Header;

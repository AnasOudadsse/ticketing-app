import { faAngleUp, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
  return (
    <div className="flex justify-between px-10">
      <div className="flex flex-col gap-1">
        <h3>Hello Mezrioui Hakim</h3>
        <p className="text-sm text-gray-500">Have a nice day</p>
      </div>
      <div className="flex items-center gap-16">
        <span className="flex gap-3">
          <img
            width={50}
            height={50}
            src="https://img.freepik.com/photos-premium/photo-profil-vecteur-plat-homme-elegant-generee-par-ai_606187-310.jpg"
          />
          <div>
            <p>Mezrioui Hakim</p>
            <p className="text-sm text-gray-400">admin</p>
          </div>
        </span>
        <FontAwesomeIcon icon={faAngleUp} />
      </div>
    </div>
  );
};

export default Header;

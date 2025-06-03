const TabAddUser = ({ onSelectTab, tabSelected }) => {
  return (
    <div className="flex border-b-2 border-b-gray-200 my-10 w-3/4 m-auto">
      <button
        onClick={() => onSelectTab("admin")}
        className={`${tabSelected === "admin" && "bg-gray-200"} py-2 px-4 text-gray-600 hover:bg-gray-100`}
      >
        Admin
      </button>
      <button
        onClick={() => onSelectTab("support")}
        className={`${tabSelected === "support" && "bg-gray-200"}  py-2 px-4 text-gray-600 hover:bg-gray-100`}
      >
        Support
      </button>
      <button
        onClick={() => onSelectTab("client")}
        className={`${tabSelected === "client" && "bg-gray-200"}  py-2 px-4 text-gray-600 hover:bg-gray-100`}
      >
        Client
      </button>
    </div>
  );
};

export default TabAddUser;

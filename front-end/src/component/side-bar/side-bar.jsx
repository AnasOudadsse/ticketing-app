import { faHome, faUsers, faTicket } from '@fortawesome/free-solid-svg-icons'
import LinkSideBar from '../link-side-bar/link-side-bar';
// import { FaHome, FaUsers, FaTicketAlt } from "react-icons/fa";
import { Box } from '@chakra-ui/react';

const SideBar = () => {
    return (
        <div className="min-w-60 bg-slate-100 w-60 h-screen sticky top-0 left-0">
            <div className={"flex justify-center w-full h-40 grid grid-cols content-center"}>
                <img src="/assets/images/logo.jpg"  className={"w-20 h-20 "} />
            </div>
            <div className='flex justify-center pl-10'>
                <ul className='w-full'>
                    <Box>
                        <LinkSideBar link={"tickets"} title={"Dashboard"} icon={faHome} />
                        <LinkSideBar link={"tickets/usersList"} title={"Users"} icon={faUsers}/>
                        <LinkSideBar link={"tickets/ticketlist"} title={"Tickets"} icon={faTicket} />
                    </Box>
                </ul>
            </div>
        </div>
    )
}

export default SideBar;
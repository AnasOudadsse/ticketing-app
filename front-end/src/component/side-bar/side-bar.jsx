import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDashboard, faUsers, faTicket } from '@fortawesome/free-solid-svg-icons'
import LinkSideBar from '../link-side-bar/link-side-bar';

const SideBar = () => {
    return (
        <div className="min-w-60 bg-slate-100 w-60 h-screen sticky top-0 left-0">
            <div className={"flex justify-center w-full h-40 grid grid-cols content-center"}>
                <img src="/assets/images/logo.jpg"  className={"w-20 h-20 "} />
            </div>
            <div className='flex justify-center pl-10'>
                <ul className='w-full'>
                    <LinkSideBar link={"dashboard"} title={"Dashboard"} />
                    <LinkSideBar link={"dashboard/usersList"} title={"Users"} />
                    <LinkSideBar link={"dashboard/ticketlist"} title={"Tickets"} />
                </ul>
            </div>
        </div>
    )
}

export default SideBar;
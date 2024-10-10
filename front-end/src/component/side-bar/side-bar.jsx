import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDashboard, faUsers, faTicket } from '@fortawesome/free-solid-svg-icons'
import LinkSideBar from '../link-side-bar/link-side-bar';

const SideBar = () => {
    return (
        <div className="bg-slate-100 w-60 h-screen">
            <div className={"flex justify-center w-full h-40 grid grid-cols content-center"}>
                <img src="/assets/images/logo.jpg"  className={"w-20 h-20 "} />
            </div>
            <div className='flex justify-center pl-10'>
                <ul className='w-full'>
                    <LinkSideBar title={"Dashboard"} />
                    <LinkSideBar title={"Users"} />
                    <LinkSideBar title={"Tickets"} />
                </ul>
            </div>
        </div>
    )
}

export default SideBar;
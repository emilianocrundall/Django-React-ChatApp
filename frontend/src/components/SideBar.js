import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import HomeIcon from '@material-ui/icons/Home'
import ContactsIcon from '@material-ui/icons/Contacts'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { logout } from '../actions/auth'
import { useLocation } from 'react-router-dom'

const SideBar = ({auth, user, logout}) => {

    const location = useLocation()

    if(auth.loading){
        return null
    }
    if(location.pathname.match(/login/) || location.pathname.match(/register/)){
        return null
    }
    return (
        <div className='side-bar'>
            {auth.isAuthenticated ? (
            <h5 className='font-normal white p-2 t-center'>{user.username}</h5>
            ) : null}
            <nav>
                <ul>
                    <li>
                        <Link to='/' className='white'><HomeIcon /></Link>
                    </li>
                    <li>
                        <Link to='/friends' className='white'><ContactsIcon /></Link>
                    </li>
                    <li>
                        <Link to='/connect' className='white'><SupervisorAccountIcon /></Link>
                    </li>
                    <li>
                        <button onClick={() => logout()} className='btn-white' title='Logout'>
                            <ExitToAppIcon/>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.auth.user
})

export default connect(mapStateToProps, { logout })(SideBar)
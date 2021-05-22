import React, { useEffect, useState } from 'react'
import '../styles/small_loader.css'
import { get_all_type_connections, get_friends } from '../actions/auth'
import { connect } from 'react-redux'
import SearchIcon from '@material-ui/icons/Search'
import axios from 'axios'
import Cookies from 'js-cookie'
import UserConnectionDetails from './UserConnectionDetails'
import ConnectionRequestDetails from './ConnectionRequestDetails'

const FindFriends = ({auth, get_all_type_connections, get_friends}) => {

    useEffect(() => {
        get_all_type_connections()
        get_friends()
    }, [])

    const [ input, setInput ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ users, setUsers ] = useState([])

    let token = Cookies.get('token')
    let config = {
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    }

    const handleSubmit = e => {
        e.preventDefault()
        setLoading(true)
        axios
        .get(`/api/search_users/?search=${input}`, config)
        .then((res) => {
            setUsers(res.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }

    const valid_form = input !== '' ? (
        <button className='btn-form'>
            <SearchIcon />
        </button>
    ) : (
        <button className='btn-form' disabled>
            <SearchIcon />
        </button>
    )
    return (
        <div className='main'>
            <div className='connect'>
                <div className='bg-light-grey p-2'>
                    <h2 className='font-normal'>Find friends</h2>
                    <form onSubmit={handleSubmit} className='mt-2 search-form'>
                        <input
                            className='ctm-input'
                            placeholder='Username'
                            onChange={e => setInput(e.target.value)}
                        />
                        {valid_form}
                    </form>
                    {loading ? (
                        <div className='small_loader'></div>
                    ) : (
                        null
                    )}
                    {users && users.length > 0 ? (
                        <React.Fragment>
                            <h3 className='font-normal pt-2'>Results:</h3>
                            {users.map((user) => (
                                <UserConnectionDetails key={user.id} user={user} />
                            ))}
                        </React.Fragment>
                    ) : null}
                </div>
                <ConnectionRequestDetails />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
})

const mapActionsToProps = {
    get_all_type_connections,
    get_friends
}

export default connect(mapStateToProps, mapActionsToProps)(FindFriends)

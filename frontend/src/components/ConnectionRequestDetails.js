import React, { useEffect } from 'react'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import { accept_connection_request, get_connection_request_received } from '../actions/auth'
import { connect } from 'react-redux'

const ConnectionRequestDetails = ({
    accept_connection_request,
    get_connection_request_received,
    connection_request_received
}) => {

    useEffect(() => {
        get_connection_request_received()
    }, [])

    return (
        <div className='p-2 connection-requests'>
            <h2 className='font-normal mb-2'>Connection request received</h2>
            { connection_request_received && connection_request_received.length > 0 ? (
                connection_request_received.map((connect) => (
                    <div className='request-connection-details' key={connect.id}>
                    {connect.from_user ? (
                        <React.Fragment>
                            <span>{connect.from_user.username}</span>
                            <button onClick={() => accept_connection_request(connect.from_user.id)}>
                                Accept connection request <PersonAddIcon />
                            </button>
                        </React.Fragment>
                    ) : null}
                    </div>
                ))
            ) : (
                <h3 className='font-normal p-2'>There's no connection request pending</h3>
            ) }
        </div>
    )
}

const mapStateToProps = state => ({
    connection_request_received: state.auth.connection_request_received
})

const mapActionsToProps = {
    get_connection_request_received,
    accept_connection_request
}

export default connect(mapStateToProps, mapActionsToProps)(ConnectionRequestDetails)

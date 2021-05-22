import React from 'react'
import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Chats from './Chats'

const Dashboard = () => {

    return (
        <div className='main'>
            <div className='connect'>
                <Chats chat_style='p-2 chats chats-sec'/>
                <div className='p-2 connection-requests flex-cont bg-dark'>
                    <h2 className='font-normal mb-2'>
                        Connect with new people and start chatting with them
                    </h2>
                    <Link to='/connect'>
                        <span>Go now</span>
                        <ArrowForwardIcon />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

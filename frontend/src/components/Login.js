import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { TextField } from '@material-ui/core'
import { Link, Redirect } from 'react-router-dom'
import { login } from '../actions/auth'

const Login = ({ auth, login, error }) => {

    const [ data, setData ] = useState({
        username: '',
        password: '',
    })
    const [ fail, setFail ] = useState(false)

    useEffect(() => {
        if(error){
            if(error.non_field_errors){
                setFail(error.non_field_errors)
            }
        }
    }, [error])

    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault()

        login(data.username, data.password)
    }

    const valid_form = data.username && data.password !== '' ? (
        <button className='btn btn-primary fullwidth mt-1'>Sign me up</button>
    ) : (
        <button className='btn btn-primary fullwidth mt-1' disabled>Sign me up</button>
    )

    if(auth.isAuthenticated){
        return <Redirect to='/' />
    }
    return (
        <div className='container background-primary'>
            <h1 className='white p-2 font-normal title'>DJChat</h1>
            <div className='form-container p-3'>
                <h1 className='color-grey font-normal'>Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <TextField
                        size='small'
                        type='text'
                        label="Username"
                        variant="filled"
                        name='username'
                        onChange={handleChange}
                        fullWidth
                        margin='normal'
                    />
                    <TextField
                        size='small'
                        type='password'
                        label="Password"
                        variant="filled"
                        name='password'
                        onChange={handleChange}
                        fullWidth
                        margin='normal'
                    />
                    {valid_form}
                    {fail ? (
                        <div className='btn btn-primary fullwidth mt-1'>{fail}</div>
                    ) : null}
                </form>
            </div>
            <p className='white m-auto'>
                Do not have an account? click <Link to='/register' className='color-sec'>here</Link>
            </p>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    error: state.auth.error
})

export default connect(mapStateToProps, { login })(Login)

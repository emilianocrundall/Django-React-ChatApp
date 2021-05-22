import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { TextField } from '@material-ui/core'
import { Link, Redirect } from 'react-router-dom'
import { register } from '../actions/auth'

const Register = ({ auth, register, error }) => {

    const [ data, setData ] = useState({
        username: '',
        email: '',
        password: '',
        repeat_pass: ''
    })
    const [ fail, setFail ] = useState(false)

    useEffect(() => {

        if(error){
            if(error.email){
                setFail(error.email)
            } else if(error.username){
                setFail(error.username)
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
        if(data.password !== data.repeat_pass){
            setFail('Passwords do not match!')
        } else if(data.password < 6){
            setFail('The password needs to have at least six characters')
        } else{
            let form = {}
            form.username = data.username
            form.email = data.email
            form.password = data.password

            register(form)
        }
    }

    const valid_form = data.username && data.email && data.password && data.repeat_pass !== '' ? (
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
                <h1 className='color-grey font-normal'>Sign up</h1>
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
                        type='email'
                        label="Email"
                        variant="filled"
                        name='email'
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
                    <TextField
                        size='small'
                        type='password'
                        label="Confirm Password"
                        variant="filled"
                        name='repeat_pass'
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
                Already have an account? click <Link to='/login' className='color-sec'>here</Link>
            </p>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    error: state.auth.error
})

export default connect(mapStateToProps, { register })(Register)

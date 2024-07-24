import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import config from '../config/config';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

const headers = {
    'Content-Type': 'application/json'
};
const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");


export default class register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password2: '',
            is_subscribed: '0',
            passwordMsg: '',
            password2Valid: false,
            eyelogin: true,
            eyelogin1: true,
            registerMsg: false


        };
        const { match: { params } } = this.props;
        this.token = params.token
        window.scrollTo({ top: 0, behavior: 'smooth' });


    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
        if (e.target.name === 'password') {

            if (strongRegex.test(e.target.value)) {
                this.setState({
                    passwordMsg: ''
                })

            } else if (mediumRegex.test(e.target.value)) {
            }
            else if (e.target.value === '') {
                this.setState({
                    passwordMsg: 'Password is required'
                })

            }
            else {
                console.log(e.target.value);
                this.setState({
                    passwordMsg: 'Password length must contain 8 and at least 1 lowercase, 1 special character , 1 uppercase, 1 Digit'
                })
            }
        }
        else if (e.target.name === 'password2') {
            if (this.state.password !== e.target.value) {
                this.setState({
                    password2Valid: true
                })
            }
            else {
                this.setState({
                    password2Valid: false
                })
            }
        }
    }


    eyeClick(id) {
        if (id === 1) {
            this.setState({
                eyelogin: false
            })
        }
        else if (id === 2) {
            this.setState({
                eyelogin: true
            })
        }

    }

    eyeClick1(id) {
        if (id === 1) {
            this.setState({
                eyelogin1: false
            })
        }
        else if (id === 2) {
            this.setState({
                eyelogin1: true
            })
        }

    }

    componentDidMount() {
        if (this.token) {
            this.verifyAccountAPI()
        }
    }

    async verifyAccountAPI() {
        axios.post(`${config.apiUrl}/verifyAccount/` + this.token, { headers })
            .then(result => {

                if (result.data.success === true) {
                    toast.success(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER,
                    })
                    setTimeout(() => {

                        window.location.href = `${config.baseUrl}login`

                    }, 3500);
                }
                if (result.data.success === false) {
                    toast.error(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            })
            .catch(err => {
                // console.log(err);
                toast.error(err.response.data?.msg, {
                    position: toast.POSITION.TOP_CENTER,
                })
            });
        setTimeout(() => {
            window.location.href = `${config.baseUrl}login`
        }, 3500);
    }


    handleSubmit = event => {
        event.preventDefault();

        const { first_name, last_name, email, password, password2 } = this.state;


        axios.post(`${config.apiUrl}register`, { email, password, password2 })
            .then(result => {

                if (result.data.success === true) {
                    toast.success(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.setState({
                        first_name: '',
                        last_name: '',
                        email: '',
                        password: '',
                        password2: '',
                        registerMsg: true
                    })
                    // setTimeout(() => {

                    //     // window.location.reload()
                    //     window.location.href = `${config.baseUrl}login`
                    // }, 2000);
                }
            }).catch(err => {
                // console.log(err);
                toast.error(err.response.data?.msg, {
                    position: toast.POSITION.TOP_CENTER, autoClose: 1500

                }, setTimeout(() => {

                }, 500));

            })

    }

    clickChange(id) {
        if (id === 0) {

            this.setState({
                is_subscribed: '1',
                subscribeMsg: false,
            })
        }
        else if (id === 1) {


            this.setState({
                is_subscribed: '0',
                subscribeMsg: true,
            })
        }
    }


    render() {
        const { email, password, password2 } = this.state;
        return (
            <>
                <Header />
                <ToastContainer />

                <section className='login py-5'>
                    <div className='container' style={{ marginTop: '80px' }}>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='row'>
                                    <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                        <div className='loginleft'>
                                            <h1>Sign in to <br />Lord Jagannath</h1>
                                            <h5>If you have an account <br />You can <Link to={`${config.baseUrl}login`}>Login Here !</Link></h5>
                                            <div className='vectorimg'>
                                                <img src="assets/images/vector.png" className='img-fluid' alt="vector" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-6 col-md-6 col-sm-6 col-12'>
                                        <div className='loginright'>
                                            <form>
                                                <div className="form-group mb-3">
                                                    <span><i className="fa fa-envelope-o" aria-hidden="true"></i></span>
                                                    <input autoComplete="off" name="email" onChange={this.handleChange} value={email} type="text" className="form-control" placeholder='Enter Email' />
                                                </div>
                                                <div className="form-group mb-3">
                                                    <span><i className="fa fa-key" aria-hidden="true"></i></span>
                                                    <input type={this.state.eyelogin === true ? "password" : 'text'} onChange={this.handleChange} name="password" value={password} className="form-control" autoComplete="off" placeholder='Enter Password' />
                                                    {this.state.eyelogin === true ?
                                                        <i className="eyelogin fa fa-eye" onClick={this.eyeClick.bind(this, 1)}></i> :
                                                        <i className="eyelogin fa fa-eye-slash" onClick={this.eyeClick.bind(this, 2)}></i>
                                                    }
                                                </div>
                                                {this.state.passwordMsg ?
                                                    <div style={{
                                                        color: 'red', marginTop: '-15px',
                                                        marginBottom: '10px'
                                                    }}>{this.state.passwordMsg ? this.state.passwordMsg : ''}</div> : ''
                                                }

                                                <div className="form-group mb-3">
                                                    <span><i className="fa fa-key" aria-hidden="true"></i></span>
                                                    <input type={this.state.eyelogin1 === true ? "password" : 'text'} onChange={this.handleChange} name="password2" value={password2} className="form-control" autoComplete="off" placeholder='Enter Confirm Password' />
                                                    {this.state.eyelogin1 === true ?
                                                        <i className="eyelogin fa fa-eye" onClick={this.eyeClick1.bind(this, 1)}></i> :
                                                        <i className="eyelogin fa fa-eye-slash" onClick={this.eyeClick1.bind(this, 2)}></i>
                                                    }
                                                </div>

                                                {this.state.password2Valid === true ? <div style={{
                                                    color: 'red', marginTop: '-15px',
                                                    marginBottom: '10px'
                                                }}>{this.state.password2Valid === true ? 'Password not match' : ''}</div> : ''
                                                }


                                                <button type="submit" onClick={this.handleSubmit} disabled={!email || !password || !password2 || this.state.passwordMsg || this.state.password2Valid} className="btn btn-primary login"><span><i className="fa fa-download" aria-hidden="true"></i></span>SIGN UP</button>
                                                {this.state.registerMsg == true ? <p style={{ color: 'red', marginTop: '5px' }}>Please click the link sent to your registered email for verification,please check your Spam folder too</p> : ''
                                                }
                                                {/* <div className='metabox'>
                                                    <p>or directly buy and connect <br />your wallet with</p>
                                                    <div className='metainr'>
                                                        <div className='metaonebox'>
                                                            <img src="assets/images/metaone.png" alt="metaone" />
                                                        </div>
                                                        <div className='metatwobox'>
                                                            <img src="assets/images/metatwo.png" alt="metatwo" />
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </form>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                <Footer />


            </>
        )
    }
}
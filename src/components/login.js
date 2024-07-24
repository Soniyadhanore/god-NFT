import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import config from '../config/config';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

export default class login extends Component {

   constructor(props) {
      super(props);
      this.state = {
         email: '',
         password: "",
         failError: '',
         eyelogin: true,
         loading: false,
         rememberMe: false,
         abc: 0
      };
      this.handleSubmit = this.handleSubmit.bind(this)
      window.scrollTo({ top: 0, behavior: 'smooth' });

   }


   componentDidMount() {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      const email = rememberMe ? localStorage.getItem('user') : '';
      const password = rememberMe ? localStorage.getItem('pass') : '';
      this.setState({ email, rememberMe, password });
   }

   handleSubmit(e) {
      e.preventDefault();
      const { email, password } = this.state;
      const data = this.state
      this.setState({
         loading: true
      })
      const { rememberMe } = this.state;
      localStorage.setItem('rememberMe', rememberMe);
      localStorage.setItem('user', rememberMe ? this.state.email : '');
      localStorage.setItem('pass', rememberMe ? this.state.password : '');
      axios.post(`${config.apiUrl}login`, data)
         .then(result => {
            if (result.data.success === true) {
               Cookies.set('lordsNFTleUserloginSuccess', result.data);
               toast.success('Login Successfully!');
               setTimeout(() => {
                  window.location.href = `${config.baseUrl}`
               }, 1000);
            }
            else if (result.data.success === false) {
               this.setState({
                  email: '',
                  password: '',
                  failError: result.data.msg,
                  loading: false
               })
            }
         }).catch(err => {
            toast.error(err.response?.data?.msg);
            this.setState({
               loading: false
            })
         })


   }

   handleChange = e => {
      this.setState({
         [e.target.name]: e.target.value,
         failError: '',
      })
      console.log(e.target.name)

   }

   handleChange11(id) {
      if (id == 0) {
         this.setState({
            rememberMe: true,
            abc: 1
         })
      }
      else if (id == 1) {
         this.setState({
            rememberMe: false,
            abc: 0
         })
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


   render() {

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
                                 <h1>Sign up to <br />Lord Jagannath</h1>
                                 <h5>If you don't have an account <br />You can <Link to={`${config.baseUrl}register`}>Register Here !</Link></h5>
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
                                       <input autoComplete="off" name="email" onChange={this.handleChange} value={this.state.email} type="text" className="form-control" placeholder='Enter Email' />
                                    </div>
                                    <div className="form-group mb-3">
                                       <span><i className="fa fa-key" aria-hidden="true"></i></span>
                                       <input type={this.state.eyelogin === true ? "password" : 'text'} onChange={this.handleChange} name="password" value={this.state.password} placeholder='Enter Password' className="form-control" autoComplete="off" />
                                       {this.state.eyelogin === true ?
                                          <i className="eyelogin fa fa-eye" onClick={this.eyeClick.bind(this, 1)}></i> :
                                          <i className="eyelogin fa fa-eye-slash" onClick={this.eyeClick.bind(this, 2)}></i>
                                       }
                                    </div>
                                    <div className="row mb-3">
                                       <div className="col-md-6">
                                          <div class="form-check">

                                             <input class="form-check-input" name="rememberMe" checked={this.state.rememberMe} type="checkbox" onChange={this.handleChange11.bind(this, this.state.abc)} value="" id="defaultCheck1" />&nbsp;
                                             <label class="form-check-label" for="defaultCheck1">
                                                Remember me
                                             </label>
                                          </div>
                                       </div>
                                       <div className="col-md-6 text-end">
                                          <Link to={`${config.baseUrl}forgetpassword`}>Forgot Password?</Link>
                                       </div>
                                    </div>
                                    <button type="submit" onClick={this.handleSubmit} disabled={!this.state.email || !this.state.password} className="btn btn-primary login"><span><i className="fa fa-download" aria-hidden="true"></i></span>{this.state.loading === false ? 'LOG In' : 'Loading...'}</button>
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
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
export default class forgetpassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            loading:false,
            forgetMsg:false
        }
        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }
    componentDidMount() {
        window.scrollTo({ top: 0, behavior: 'smooth' });

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    async submitForm(e) {
        e.preventDefault()
        // this.setState(initialState)
        const { email } = this.state;
        const data = this.state
        this.setState({
            loading:true
        })
        axios.post(`${config.apiUrl}/forgot`, data, { headers }, { email })
            .then(result => {
                if (result.data.success === true) {
                    toast.success(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.setState({
                        loading:false,
                        forgetMsg:true,
                        email:''
                    })
                }
                // `${config.baseUrl}login`
                else if (result.data.success === false) {
                    toast.error(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.setState({
                        loading:false
                    })
                }
            })

            .catch(err => {
                if (err.request) { } if (err.response) {
                    toast.error(err.response.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
                this.setState({
                    loading:false
                })
            });
        // .catch(err => {      
        //     alert('1')
        //     console.error(err.request.response.msg);      
        //     toast.error(err.result?.data?.msg, {
        //     position: toast.POSITION.TOP_CENTER
        //     });

        // })
    }

   render() {

      return (
         <>
            <Header />
            <ToastContainer />

            <section className='login py-5'>
               <div className='container' style={{marginTop:'80px'}}>
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
                                 <form onSubmit={this.submitForm}>
                                    <div className="form-group mb-3">
                                       <span><i className="fa fa-envelope-o" aria-hidden="true"></i></span>
                                       <input autoComplete="off" onChange={this.onChange} name="email" value={this.state.email} type="text" className="form-control" placeholder='Enter Email' />
                                    </div>
                                   
                                   
                                    <button type="submit" onClick={this.handleSubmit} disabled={!this.state.email} className="btn btn-primary login"><span><i className="fa fa-download" aria-hidden="true"></i></span>{this.state.loading === false ? 'Request Reset Link' : 'Loading...'}</button>
                                    {this.state.forgetMsg == true ? <p style={{ color: 'red', marginTop: '5px' }}>A link has been sent to your registered mail address for resetting your password.</p>:''}
                                    <div className='metabox' style={{display:'none'}}>
                                       <p>or directly buy and connect <br />your wallet with</p>
                                       <div className='metainr'>
                                          <div className='metaonebox'>
                                             <img src="assets/images/metaone.png" alt="metaone" />
                                          </div>
                                          <div className='metatwobox'>
                                             <img src="assets/images/metatwo.png" alt="metatwo" />
                                          </div>
                                       </div>
                                    </div>
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
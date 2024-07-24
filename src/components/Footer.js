import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import config from '../config/config'
import axios from 'axios';
const MAX_LENGTH = 10;

export default class Footer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sociallink_list: []
        }

    }

    componentDidMount() {
        this.getTermsConditions();
        this.getPrivacyPolicy()
        this.categoryList()

    }

    async getTermsConditions() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}/getTermsConditions`
        })
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        landingPage: response.data.response[0]
                    })

                }
            })
    }

    async getPrivacyPolicy() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}/getPrivacypolicy`
        })
            .then(response => {
                if (response.data.success === true) {
                    // alert('333')
                    this.setState({
                        landingPage: response.data.response[0]
                    })

                }
            })
    }


    async categoryList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}getSociallink`,
                data: {}
            })
                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            sociallink_list: result.data.response
                        })


                    }

                    else if (result.data.success === false) {

                    }
                })

                .catch(err => {
                })
    }


    render() {
        return (
            <>
                <footer className='py-5'>
                    <div className='container-fluid'>
                        <div className='row pt-5 f_inner'>
                            <div className='col-md-4 col-12'>
                                <div className='f-logobox'>
                                    <div className='f-logo'>
                                        <div className='godlogobox'>
                                            <img src="assets/images/godlogo.png" alt="godlogo" />
                                        </div>
                                        <h5>VSB Digital Studio</h5>
                                    </div>
                                    <div className='f-icon'>
                                        <ul>
                                            <li><a href={this.state.sociallink_list[0]?.facebook ? this.state.sociallink_list[0]?.facebook : '#'}><span><i class="fa fa-facebook" aria-hidden="true"></i></span></a></li>
                                            <li><Link href={this.state.sociallink_list[0]?.twitter ? this.state.sociallink_list[0]?.twitter : '#'} target="_blank"><span><i class="fa fa-twitter" aria-hidden="true"></i></span></Link></li>
                                            <li><Link href={this.state.sociallink_list[0]?.linkedin ? this.state.sociallink_list[0]?.linkedin : '#'} target="_blank"><span><i class="fa fa-linkedin" aria-hidden="true"></i></span></Link></li>
                                            <li><Link href={this.state.sociallink_list[0]?.pinterest ? this.state.sociallink_list[0]?.pinterest : '#'} target="_blank"><span><i class="fa fa-pinterest-p" aria-hidden="true"></i></span></Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-2 col-12'>
                                <div className='f-linkbox'>
                                    <h4>Links</h4>
                                    <div className='f-link'>
                                        <ul>
                                            <li><Link href="#">Home</Link></li>
                                            {/* <li><Link href="#">Pricing</Link></li> */}
                                            {/* <li><Link href="#">Download</Link></li> */}
                                            <li><Link to={`${config.baseUrl}aboutus`}>About</Link></li>
                                            <li><Link to={`${config.baseUrl}howto`}>How To</Link></li>

                                            {/* <li><Link href="#">Service</Link></li> */}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-2 col-12'>
                                <div className='f-supportbox'>
                                    <h4>Support</h4>
                                    <div className='f-supportbox'>
                                        <ul>
                                            <li><Link to={`${config.baseUrl}faq`}>FAQ</Link></li>
                                            <li><Link to={`${config.baseUrl}privacyandpolicy`}>Privacy Policy</Link></li>
                                            <li><Link to={`${config.baseUrl}termsandcondition`}>Terms of use</Link></li>
                                            {/* <li><Link href="#">Contact</Link></li> */}
                                            {/* <li><Link href="#">Reporting</Link></li> */}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-4 col-12'>
                                <div className='f-contact'>
                                    <h4>Contact Us  </h4>
                                    <div className='f-icon'>
                                        <h5>+880 12345678</h5>
                                        <p>youremail@gmail.co</p>
                                        <h5>Rangpur City</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='copyright mt-3 text-center'>
                        <p className='copyright-p'>Copyright & Design by @md riad islam</p>
                    </div>
                </footer>
            </>
        )
    }
}
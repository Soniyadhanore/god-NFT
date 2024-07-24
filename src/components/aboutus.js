import React, { Component } from 'react';
import axios from 'axios';
import Footer from './Footer';
import Header from './Header';
import config from '../config/config'
import Cookies from 'js-cookie';

export default class aboutus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            aboutus: [],
        }
        this.loginData = (!Cookies.get('lordsNFTleUserloginSuccess')) ? [] : JSON.parse(Cookies.get('lordsNFTleUserloginSuccess'));
        this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    }

    componentDidMount() {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.getAbout();
    }


    async getAbout() {

        await axios.get(`${config.apiUrl}getAbout`, {},)
            .then(result => {
                const data = result.data;
                if (result.data.success === true) {
                    this.setState({
                        aboutus: result.data.response[0],
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
                <Header />
                <div className="no-bottom no-top" id="content">
                    <div id="top" />

                    <section id="subheader" className="text-light" style={{height:"286px", backgroundImage: `url("images/background/about-us.png")`, backgroundSize: 'cover' }}>
                        <div className="center-y relative text-center">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12 text-center">
                                        <h1 className='edit-head'>About Us</h1>
                                    </div>
                                    <div className="clearfix" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section aria-label="section">
                        <div className="container">
                            <div className="term-condition">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-12 mt-4">
                                        <p dangerouslySetInnerHTML={{ __html: this.state.aboutus.about }} className="privency_text"></p>                </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
                <Footer />
            </>
        )
    }
}
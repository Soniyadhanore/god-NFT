import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'
import Footer from './Footer';
import Header from './Header';
import config from '../config/config'

export default class termsandcondition extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            termsandcondition: [],

        }

    }

    componentDidMount() {
        this.getTandCList();
    }


    async getTandCList() {

        await axios.get(`${config.apiUrl}getTermsConditions`, {},)
            .then(result => {
                const data = result.data;
                if (result.data.success === true) {
                    this.setState({
                        termsandcondition: result.data.response[0],
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

                    <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/background/contact.jpg")`, backgroundSize: 'cover' }}>
                        <div className="center-y relative text-center">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12 text-center">
                                        <h1>Terms &amp; Condition</h1>
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
                                    <div className="col-lg-12 col-md-12 col-12">
                                        <p dangerouslySetInnerHTML={{ __html: this.state.termsandcondition.terms_conditions }} style={{ textAlign: "justify" }}></p>

                                    </div>
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
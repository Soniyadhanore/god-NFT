import React, { Component } from 'react';
import axios from 'axios';
import Footer from './Footer';
import Header from './Header';
import config from '../config/config'
import Cookies from 'js-cookie';

export default class howto extends Component {

    constructor(props) {
        super(props);
        this.state = {
            video_list: [],
        }
        this.loginData = (!Cookies.get('lordsNFTleUserloginSuccess')) ? [] : JSON.parse(Cookies.get('lordsNFTleUserloginSuccess'));
        this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    }

    componentDidMount() {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        this.contactList();
    }


    async contactList() {
        await axios.get(`${config.apiUrl}getVideos`, {},)
            .then(result => {

                if (result.data.success === true) {
                    this.setState({
                        video_list: result.data.response
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

                    <section className='howto'>
                        <div className='container-fluid m-0 p-0'>
                            <div className='row'>
                                <div className='col-12'>
                                    {/* <h1>How To</h1> */}
                                    {/* <video controls autoPlay loop>
                                        <source src="assets/vidoes/abstract_buddha_face.mp4" type="video/mp4"/>
                                    </video> */}
                                    <div className='nftvideo'>
                                        {this.state.video_list.map((item) => {
                                            return(
                                                <iframe src={config.imageUrl1 +  item.video_pic} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                            )
                                          
                                        })}
                                    
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
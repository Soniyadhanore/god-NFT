import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import config from '../config/config'
import Cookies from 'js-cookie';
import Countdown, { zeroPad } from 'react-countdown';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Player } from 'video-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const MAX_LENGTH = 10;

export default class userprofile extends Component {
  constructor(props) {
    super(props)
    const { match: { params } } = this.props;
    this.id = params.id
    this.state = {
      userData: {},
      getWalletData: {},
      myNftData: [],
      collectionData: [],
      userData: [],
      isActive: 1,
      value: '',
      copied: false,
    };
    this.loginData = (!Cookies.get('lordsNFTleUserloginSuccess')) ? [] : JSON.parse(Cookies.get('lordsNFTleUserloginSuccess'))
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));

    this.walletType = localStorage.getItem('walletType')

    console.log(this.walletType)

  }



  async getUserDataAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserDetails`,
      data: { "id": this.id }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          userData: response.data.response
        })
      }
    })
  }

  async getWalletDataAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getWalletDetail`,
      headers: { authorization: token },
      data: { "user_id": this.id, 'email': this.loginData?.user_email }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getWalletData: response.data
        })
      }
    })
  }



  //  ========================================== Portfolio API's Start==========================================

  async getMyNftAPI(nftType = null) {
    if (!nftType) {
      var nftType = 1
      this.setState({
        isActive: 1
      })
    } else {
      var nftType = nftType
      this.setState({
        isActive: nftType
      })
    }

    this.setState({
      'saleHistory': [],
      'nftType': nftType,
      'FavouritesHistory': []
    })

    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}portfolio`,
      headers: { authorization: token },
      data: { "user_id": this.id, 'email': this.loginData?.user_email, 'type': nftType, 'login_user_id': this.loginData.id }
      // data: { "user_id": 262, 'email': this.loginData?.user_email, 'type': nftType, 'login_user_id': 262 }
    }).then(response => {

      if (response.data.success === true) {
        this.setState({
          myNftData: response.data.response,
          saleHistory: response.data.response,
          FavouritesHistory: response.data.response
        })
      }
    })
  }


  getTimeOfStartDate(dateTime) {
    var date = new Date(dateTime); // some mock date
    var milliseconds = date.getTime();
    return milliseconds;
  }

  CountdownTimer({ days, hours, minutes, seconds, completed }) {
    if (completed) {
      // Render a completed state
      return "Starting";
    } else {
      // Render a countdowns
      var dayPrint = (days > 0) ? days + 'd' : '';
      return <span>{dayPrint} {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s</span>;
    }
  };


  async likeCount(item) {
    if (this.loginData && this.loginData.id) {
      await axios({
        method: 'post',
        url: `${config.apiUrl}likeitem`,
        data: {
          "user_id": this.loginData.id,
          "item_id": item.item_id
        }
      }).then((res) => {
        if (res.data.success === true) {
          this.getMyNftAPI(this.state.nftType)
        }

      }).catch((error) => {

      })
    } else {
      toast.error('Please Login First')
    }
  }


  // ==============================   Collections API's Start =================================================

  async getCollectionDataAPI() {
    const token = this.token
    this.setState({
      isActive: 3
    })
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserCollection`,
      headers: { authorization: token },
      data: { "user_id": this.id, 'email': this.loginData?.user_email }
      // data: { "user_id": 262, 'email': this.loginData?.user_email }
    }).then(response => {

      if (response.data.success === true) {
        this.setState({
          collectionData: response.data.response
        })
      }
    })
  }


  userShow(id) {

    setTimeout(() => {
      window.location.href = `${config.baseUrl}UserProfile/` + id.owner_id
    });
  }

  componentDidMount() {
    this.getUserDataAPI()
    this.getWalletDataAPI()
    this.getMyNftAPI()
    this.getCollectionDataAPI()
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }


  render() {
    return (

      <>
        <Header />
        <ToastContainer />

        <div className="no-bottom no-top" id="content">
          <div id="top" />
          {/* section begin */}
          <section id="profile_banner" aria-label="section" className="text-light"
            style={{
              backgroundImage: !this.state.userData.banner || this.state.userData.banner === '' || this.state.userData.banner === null || this.state.userData.banner === undefined || this.state.userData.banner === 'null'
                ?
                `url(images/banner-image-default.jpg)` :
                `url(${config.imageUrl1}${this.state.userData.banner})`
            }}>
          </section>
          {/* section close */}
          <section aria-label="section" className="d_coll no-top userprofile-page py-5">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile" style={{ marginBottom: '0px' }}>
                    <div className="profile_avatar">
                      <div className="d_profile_img">
                        {this.state.userData.profile_pic ?
                          <img src={this.state.userData.profile_pic != 'null' ?
                            config.imageUrl1 + this.state.userData.profile_pic :
                            "images/default-user-icon.jpg"} alt="default-user-icon" /> :
                          <img src="images/default-user-icon.jpg" alt="default-user-icon" />
                        }


                        {/* {this.state.userData?.is_verified == '1' ?
                          <i className="fa fa-check"></i>
                          : ""}
                        <i className="fa fa-check" /> */}
                      </div>
                      <div className="profile_name">
                        <h4>

                          <span className="profile_username">{this.state.userData?.full_name}</span>

                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {this.state.myNftData.length > 0 ?
                    this.state.myNftData.map(item => (

                      <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                        <div className="nft__item mb-3">
                          <div className="author_list_pp">
                            <a href={`${config.baseUrl}collections/` + item.collection_id} >
                              {!item.collection_profile_pic ?
                                ""
                                :
                                <img className="lazys" src={`${config.imageUrl1}` + item.collection_profile_pic} alt="" />
                              }
                            </a>
                            {item.is_verified == '1' ?
                              <i className="fab fa-check"></i>
                              : ""
                            }


                            <div className="nft__item_wrap mycollection_nft">
                              {item.file_type == 'video' ?
                                <video muted autoPlay width="100%" height="auto" controls>
                                  <source src={`https://ipfs.io/ipfs/` + item.image} type="video/mp4" />
                                </video>
                                :
                                <a href={`${config.baseUrl}nftDetail/` + item.item_id}>
                                  <img className="lazy nft__item_preview" style={{ marginTop: '15px' }} src={`https://ipfs.io/ipfs/` + item.image} alt="" />
                                </a>
                              }

                            
                                <div className="nft__item_info">
                                  <h4 style={{ color: "#000" }}>{`${item.name.substring(0, MAX_LENGTH)}..`}
                                    <small className="pull-right" style={{ color: "#000" }}>{item.is_on_sale == 0 ? "Price" : "Price"}</small></h4>
                                  <div className="nft__item_price">
                                    <div className="row">
                                      <div className="col-sm-5 portfolio-name">
                                        {item.collection_name ?
                                          item.collection_name.length > MAX_LENGTH ?
                                            (
                                              <p style={{ color: "#000" }}>
                                                {`${item.collection_name.substring(0, MAX_LENGTH)}..`}
                                              </p>
                                            ) :
                                            <p style={{ color: "#000" }}>{item.collection_name}</p>
                                          : ""}
                                      </div>
                                      <div className="col-sm-7 priceAda">
                                        <div className="d-flex pull-right"><span>

                                          <span style={{ color: "#000" }}>
                                            {'BNB ' + item.price}
                                          </span>
                                        </span></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                         
                            </div>

                          </div>
                        </div>
                      </div>
                    ))
                    : <div style={{ textAlign: 'center' }}>
                      <img style={{ width: '150px', height: '150px' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKd2o9atcvkhYF6qRh-6-vfcThr1SR0hnW0DmFSZ56otUyCKtKN_oeUbht4WmVl5JKsj4&usqp=CAU' /><br /><br />
                      <p><b>No Items To Display</b></p>
                    </div>
                  }
                </div>


              </div>
            </div></section>
        </div>


        <Footer />
      </>
    )
  }
}
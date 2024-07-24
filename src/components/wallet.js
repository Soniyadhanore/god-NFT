import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import config from '../config/config';
import axios from 'axios';
import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
import Slider from "react-slick";

const AutoplaySlider = withAutoplay(AwesomeSlider);

export default class wallet extends Component {

   constructor(props) {
      super(props)
      this.state = {
         getItemAllNfts: '',
         bannerNfts: [],
         allNfts: [],
         collections: [],
      }
   }


   componentDidMount() {
      this.totalNfts()
      this.getBannerNFTAPI()
      this.allNftsAPIAPI()
      this.collectionListAPI()
      window.scrollTo({ top: 0, behavior: 'smooth' });

   }

   //====================================================================================================================
   async totalNfts() {
      await axios({
         method: 'get',
         url: `${config.apiUrl}getItemAll`,
         data: {}
      }).then((res) => {
         if (res.data.success === true) {
            this.setState({
               getItemAllNfts: res.data.response
            })
         }
      }).catch((error) => {
      })
   }
   //====================================================================================================================
   async getBannerNFTAPI() {
      await axios({
         method: 'get',
         url: `${config.apiUrl}getBannerNFT`
      }).then((res) => {
         if (res.data.success === true) {
            this.setState({
               bannerNfts: res.data.response
            })
         }
      }).catch((error) => {

      })
   }

   //====================================================================================================================

   async allNftsAPIAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}trendingNfts`,
         data: {}
      }).then((res) => {
         if (res.data.success === true) {
            this.setState({
               allNfts: res.data.response
            })
            console.log(this.state.allNfts)
         }
      }).catch((error) => {

      })
   }

   //================================================================================================================

   async collectionListAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getHomeCollections`,
         data: {
            "limit": "0"
         }
      }).then((res) => {
         if (res.data.success === true) {
            this.setState({
               collections: res.data.response
            })
         }

      }).catch((error) => {

      })
   }



   render() {
      const settings = {
         dots: true,
         infinite: this.state.allNfts.length > 5,         // speed: 500,
         // centerMode: false,
         slidesToShow: 5,
         slidesToScroll: 1
      };

      return (
         <>
            <Header />
            
            <section className='wallet py-5'>
               <div className='container'>
                  <div className='row'>
                     <div className='col-lg-6 col-md-6 col-sm-6'>
                        <div className='walletleft'>
                            <h3>CONNECT A WALLET</h3>
                            <Link to="#">POPULAR</Link>
                            <div className='ranbowbox'>
                                <ul>
                                    <li><Link to="#"><span><img src="assets/icons/rainico1.png" alt="rainico1" /></span>Rainbow</Link></li>
                                    <li><Link to="#"><span><img src="assets/icons/rainico2.png" alt="rainico2" /></span>Coinbase Wallet</Link></li>
                                    <li><Link to="#"><span><img src="assets/icons/rainico3.png" alt="rainico3" /></span>Metamask</Link></li>
                                    <li><Link to="#"><span><img src="assets/icons/rainico4.png" alt="rainico4" /></span>Wallet Connect</Link></li>
                                </ul>
                            </div>
                        </div>
                     </div>
                     <div className='col-lg-6 col-md-6 col-sm-6'>
                        <div className='walletright'>
                            <h3>What is a wallet ?</h3>
                            <div className='wallethome'>
                                <div className='homeico'>
                                    <img src="assets/icons/walleticon1.png" alt="walleticon1" />
                                </div>
                                <div className='hometext'>
                                    <h5>A Home for your Digital Assets</h5>
                                    <p>Wallet are used to send, recieve store, and display assets like Ehtereum and NFTs.  </p>
                                </div>
                            </div>
                            <div className='wallethome'>
                                <div className='homeico'>
                                <img src="assets/icons/walleticon2.png" alt="walleticon2" />
                                </div>
                                <div className='hometext'>
                                    <h5>A New way to login</h5>
                                    <p>Instead of creating new accounts and passwords on every websites, just connet your wallet.</p>
                                </div>
                            </div>
                            <div class="butrarebox">
                                <div className=''>
                                    <Link className="butrate" to="#">But Rare</Link>
                                </div>
                                <div className='mt-3'>
                                <Link className="learnwallet" to="#">Learn</Link>
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
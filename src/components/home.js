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
import Carousel from "react-multi-carousel";
import Slider from './slider'
import toast, { Toaster } from 'react-hot-toast';
import "react-multi-carousel/lib/styles.css";
import { Fade, Zoom, Roll, Slide } from 'react-reveal';
import { AnimationOnScroll } from 'react-animation-on-scroll';
import "animate.css/animate.min.css";
const responsive = {
   superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
   },
   desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5
   },
   tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3
   },
   mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
   }
};
const AutoplaySlider = withAutoplay(AwesomeSlider);
const MAX_LENGTH = 13;


export default class home extends Component {



   constructor(props) {
      super(props)
      this.state = {
         getItemAllNfts: '',
         bannerNfts: [],
         tredingNfts: [],
         collections: [],
         recentNfts: [],
         trendingNFTData: 1,
         tredingNftsVideo: [],
         dashboarditemNfts: '',
         email: '',

      }
   }


   componentDidMount() {
      this.totalNfts()
      this.getBannerNFTAPI()
      this.trandingnftsList()
      this.collectionListAPI()
      this.recentnftList()
      this.dashboarditemAPI()
      window.scrollTo({ top: 0, behavior: 'smooth' });

   }


   //====================================================================================================================
   async dashboarditemAPI() {
      await axios({
         method: 'get',
         url: `${config.apiUrl}dashboarditem`,
         data: {}
      }).then((res) => {
         if (res.data.success === true) {
            this.setState({
               dashboarditemNfts: res.data.response
            })
         }
      }).catch((error) => {
      })
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

   async trandingnftsList() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}TrendingNfts`,
         data: {
            "user_id": "0",
            "login_user_id": this.loginData && this.loginData.id ? this.loginData.id : '0',
            "user_collection_id": "0",
            "is_featured": "1",
            "recent": "0",
            "limit": "0"
         }
      }).then((res) => {
         if (res.data.success === true) {
            // filter(item => item.collection_id != null && item.is_featured == 1)
            this.setState({
               tredingNfts: res.data.response.filter(item => (item.sell_type == 1 || (item.sell_type == 2 && new Date(item.expiry_date) > new Date())) && item.file_type == 'image'),
               tredingNftsVideo: res.data.response.filter(item => (item.sell_type == 1 || (item.sell_type == 2 && new Date(item.expiry_date) > new Date())) && item.file_type == 'video')
            })
         }
         else if (res.data.success === false) {
            // filter(item => item.collection_id != null && item.is_featured == 1)
            this.setState({
               tredingNfts: [],
               tredingNftsVideo: []
            })
         }
      }).catch((error) => {
         this.setState({
            tredingNfts: [],
            tredingNftsVideo: []
         })
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
         this.setState({
            collections: []
         })
      })
   }

   //==================================================================================================================

   async recentnftList() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getUserItem`,
         data: {
            "user_id": "0",
            "login_user_id": this.loginData && this.loginData.id ? this.loginData.id : '0',
            "user_collection_id": "0",
            "is_featured": "0",
            "recent": "1",
            "limit": "0",
            "is_trending": '0'
         }
      }).then((res) => {
         if (res.data.success === true) {
            this.setState({
               recentNfts: res.data.response.filter(item => item.collection_id != null)
            })
         }

      }).catch((error) => {

      })
   }


   trendingClick(id) {
      if (id == 1) {
         this.setState({
            trendingNFTData: 1
         })
      }
      else if (id == 2) {
         this.setState({
            trendingNFTData: 2
         })
      }
   }


   handleChange = (e) => {
      this.setState({
         [e.target.name]: e.target.value
      })
   }



   handleSubmit = async (e) => {
      e.preventDefault()

      const token = this.token
      await axios({
         method: 'post',
         url: `${config.apiUrl}insertContact`,
         headers: { authorization: token },
         data: { "email": this.state.email }
      })
         .then(result => {
            if (result.data.success === true) {
               toast.success(result.data.msg)

               this.setState({
                  name: '',
                  email: '',
                  message: '',

               })
            }
            else if (result.data.success === false) {
               toast.error(result.data.msg);
            }
         }).catch(err => {
         });
   }


   render() {
      return (
         <>
            <section className='mainbnr'>
               <Toaster />
               <Header />
               <div className='container-fluid'>
                  <div className='row'>
                     <div className='col-md-6 col-sm-6 col-12 d-flex align-items-center mt-5'>
                        <Fade left>
                           <div className='bnr-left mt-4'>
                              <h4>DISCOVER AND BUY RARE</h4>
                              <h3>LORD JAGANNATH</h3>
                              <h1>NFT COLLECTION</h1>
                              {/* <div className='butrarebox'>
                              <Link to="#" className="butrate">But Rare</Link>
                           </div> */}
                           </div>
                        </Fade>
                     </div>
                     <div className='col-md-6 col-sm-6 col-12 mt-5'>
                        <Fade right>
                           <div className='bnr-right mt-5'>
                              <div className='brncard'>
                                 <div className="card" id='bnrcardid'>
                                    <div className='cardico p-3'>
                                       <div className='carcircle'>
                                       </div>
                                       <div className='bookmar'>
                                          <ul>
                                             <li><span><img src="assets/icons/dots.png" alt="dots" /></span></li>
                                          </ul>
                                       </div>
                                    </div>
                                    <AutoplaySlider animation="cubeAnimation" organicArrows={false} play={true}
                                       cancelOnInteraction={false}
                                       interval={6000}>
                                       {this.state.bannerNfts.map((item, i) => (
                                          <div>
                                             <Link to={`${config.baseUrl}nftdetail/${item.id}`}>
                                                {item.file_type == 'image' ?
                                                   <img src={config.imageUrl + item.image} className="card-img-top" alt="brncard" /> :
                                                   <video muted autoPlay controls>
                                                      <source src={`${config.imageUrl}${item.image}`} className="card-img-top" type="video/mp4" />
                                                   </video>}
                                             </Link>
                                          </div>
                                       ))}
                                    </AutoplaySlider>
                                    {/* <img src="assets/images/brncard.png" className="card-img-top" alt="brncard" /> */}
                                    <div className="card-body">
                                       <div className='cardico'>

                                          <div className='bookmar'>
                                             <ul>
                                                <li><span><img src="assets/icons/bookmark.png" alt="bookmark" /></span></li>
                                             </ul>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className='counter'>
                                 <div className='counterinr'>
                                    <div className='countbox'>
                                       <h3>{this.state.getItemAllNfts.nft_count}</h3>
                                       <p>Art work</p>
                                    </div>
                                    <div className='countbox'>
                                       <h3>{this.state.getItemAllNfts.auction_count ? this.state.getItemAllNfts.auction_count : '0'}</h3>
                                       <p>Auction</p>
                                    </div>
                                    <div className='countbox'>
                                       <h3>{this.state.dashboarditemNfts.sold_item}</h3>
                                       <p>NFT Purchased</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </Fade>
                     </div>
                  </div>

                  <div className='row py-5'>
                     <div className='col-12'>
                        <Zoom>


                           <Slider />
                           {/* <Carousel responsive={responsive}>
                              {this.state.recentNfts.map((item) =>
                                 // return
                                 <div className="" id='godoneid' >
                                    <Link to={`${config.baseUrl}nftdetail/${item.item_id}`}>
                                       {item.file_type == 'image' ?
                                          <img src={config.imageUrl + item.image} className="img-fluid" alt="brncard" />
                                          :
                                          <video muted autoPlay controls height="200px" width="220px">
                                             <source src={`${config.imageUrl}${item.image}`} className="img-fluid" type="video/mp4" />
                                          </video>}
                                    </Link>
                                    <div className="card-body">
                                       <div className='lordtext'>
                                          <p className="card-text">
                                             {item.name.length > MAX_LENGTH ?
                                                (
                                                   `${item.name.substring(0, MAX_LENGTH)}...`
                                                ) :
                                                item.name
                                             }
                                             <br /></p>
                                          <p className="card-text">{item.price} BNB <br /></p>
                                       </div>
                                       <div className='placebtnbox'>
                                          <Link to={`${config.baseUrl}nftdetail/${item.item_id}`} className="placebtn">
                                             {item.sell_type == 1 ? 'Purchase' : 'Place Bid'}
                                          </Link>
                                       </div>
                                    </div>
                                 </div>
                                 // )

                              )}
                           </Carousel> */}
                        </Zoom>
                     </div>
                  </div>
               </div>
            </section>

            <section className='collection py-5'>
               <div className='container-fluid'>
                  <div className='row'>
                     <div className='col-12'>

                        <div className='nfthandimg'>
                           <img src="assets/images/nfthand.png" alt="nfthand" />
                        </div>

                        <div className='collectioninr'>
                           <div className='colectop'>
                              <AnimationOnScroll animateIn="animate__tada" animateOnce={true}>
                                 <h1>TOP COLLECTIONS</h1>
                              </AnimationOnScroll>

                           </div>
                        </div>



                     </div>
                  </div>
                  <div className='row'>
                     <div className='col-12 pt-5'>
                        <div >
                           <div >
                              {this.state.collections.length == 0 ? <h4 style={{ textAlign: 'center' }}>No Collections Found</h4> :
                                 <Carousel responsive={responsive}>
                                    {this.state.collections.map(item => (
                                       <AnimationOnScroll animateIn="animate__fadeInLeftBig" animateOnce={true}>
                                          <div className='mx-1'>
                                             <div className='godone'>
                                                <div className="card" id='godoneid'>
                                                   <div className='collection-details'>
                                                      <figure><img src={config.imageUrl1 + item.banner} /></figure>
                                                      <span>{item.name}</span>
                                                   </div>
                                                   <div className="card-body">
                                                      <Link to={`${config.baseUrl}collectiondetail/` + item.id}>

                                                         <img src={`${config.imageUrl1 + item.profile_pic}`} alt />

                                                      </Link>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </AnimationOnScroll>
                                    ))}
                                 </Carousel>
                              }
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            <section className='tranding pt-5'>
               <div className='container-fluid'>
                  <div className='row'>
                     <div className='col-12'>
                        <div className='collectioninr'>
                           <div className='colectop'>
                              {/* <h4>View All....</h4> */}
                              <AnimationOnScroll animateIn="animate__tada" animateOnce={true}>
                                 <h1>TRENDING NFT</h1>
                              </AnimationOnScroll>
                              <Fade left>
                                 <div className='collectmenu'>
                                    <ul>
                                       <li ><Link onClick={this.trendingClick.bind(this, 1)} style={{ background: this.state.trendingNFTData == 1 ? '#8466da' : '' }}>Image</Link></li>
                                       <li><Link onClick={this.trendingClick.bind(this, 2)} style={{ background: this.state.trendingNFTData == 2 ? '#8466da' : '' }}>Videos</Link></li>
                                    </ul>
                                 </div>
                              </Fade>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className='row mt-3'>

                     {this.state.trendingNFTData == 1 ?
                        this.state.tredingNfts.length == 0 ? <h4 className='text-center'>No NFTs Found</h4> :
                           this.state.tredingNfts.map((item) => (
                              <Roll right>
                                 <div className='col-md-3 my-2'>
                                    <div className="card" id='godoneid'>
                                       <Link to={`${config.baseUrl}nftdetail/${item.item_id}`}>
                                          {item.file_type == 'image' ?
                                             <img src={config.imageUrl + item.image} className="img-fluid" alt="brncard" />
                                             :
                                             <video muted autoPlay controls height="200px" width="220px">
                                                <source src={`${config.imageUrl}${item.image}`} className="img-fluid" type="video/mp4" />
                                             </video>}
                                       </Link>
                                       <div className="card-body">
                                          <div className='lordtext'>
                                             <p className="card-text"> {item.name.length > MAX_LENGTH ?
                                                (
                                                   `${item.name.substring(0, MAX_LENGTH)}...`
                                                ) :
                                                item.name
                                             }</p>
                                             <p className="card-text">{item.price} <br />BNB</p>
                                          </div>
                                          <div className='placebtnbox'>
                                             <Link to={`${config.baseUrl}nftdetail/${item.item_id}`} className="placebtn"> {item.sell_type == 1 ? 'Purchase' : 'Place Bid'}</Link>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </Roll>
                           )) :

                        this.state.tredingNftsVideo.length == 0 ? <h4 className='text-center'>No NFTs Found</h4> :
                           this.state.tredingNftsVideo.map((item) => (
                              <Roll left>
                                 <div className='col-md-3 my-2'>
                                    <div className="card" id='godoneid'>
                                       <Link to={`${config.baseUrl}nftdetail/${item.id}`}>
                                          {item.file_type == 'image' ?
                                             <img src={config.imageUrl + item.image} className="img-fluid" alt="brncard" />
                                             :
                                             <video muted autoPlay controls height="200px" width="220px">
                                                <source src={`${config.imageUrl}${item.image}`} className="img-fluid" type="video/mp4" />
                                             </video>}
                                       </Link>
                                       <div className="card-body">
                                          <div className='lordtext'>
                                             <p className="card-text"> {item.name.length > MAX_LENGTH ?
                                                (
                                                   `${item.name.substring(0, MAX_LENGTH)}...`
                                                ) :
                                                item.name
                                             }</p>
                                             <p className="card-text">{item.price} BNB</p>
                                          </div>
                                          <div className='placebtnbox'>
                                             <Link to="#" className="placebtn"> {item.sell_type == 1 ? 'Purchase' : 'Place Bid'}</Link>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </Roll>
                           ))
                     }



                  </div>


                  <div className='col-8 col-12 mx-auto'>
                     <Fade right>
                        <div className='contactus'>
                           <div className='col-md-6 col-12'>
                              <div className='context'>
                                 <h5>Contact Us!</h5>
                                 <p>There are many variations of passages of Lorem ipsum but the majority have suffered alteration.</p>
                              </div>
                           </div>
                           <div className='col-md-6 col-12'>
                              <div className='contactmail'>
                                 <form action="#">
                                    <div className='form-group'>
                                       <input type="text" name="email" onChange={this.handleChange} value={this.state.email} className='form-control' placeholder='Email here' />
                                    </div>
                                    <div className='form-group'>
                                       <input type="submit" onClick={this.handleSubmit} disabled={!this.state.email} name='submit' className='form-control submit' />
                                    </div>
                                 </form>
                              </div>
                           </div>
                        </div>
                     </Fade>
                  </div>
               </div>
            </section>

            {/* <section>
               <div className='container-fluid'>
               <div className='row'>
                  
                  </div>
               </div>
            </section> */}

            <Footer />


         </>
      )
   }
}
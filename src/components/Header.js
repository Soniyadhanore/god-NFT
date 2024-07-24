import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import config from '../config/config';
import Cookies from 'js-cookie';
import Web3 from 'web3';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const MAX_LENGTH = 10;

export default class Header extends Component {

   constructor(props) {
      super(props)
      this.state = {
         loginData: (!Cookies.get('lordsNFTleUserloginSuccess')) ? [] : JSON.parse(Cookies.get('lordsNFTleUserloginSuccess')),
         ConnectWalletAddress: '',
         aboutData: '',
         searchDataList: [],
         searchData: '',
      }
      this.onChange = this.onChange.bind(this)

   }


   componentDidMount() {
      setTimeout(() => {
         if (window.ethereum) {
            const { ethereum } = window;

            this.setState({
               ConnectWalletAddress: ethereum.selectedAddress
            })

            localStorage.setItem('walletType', this.state.ConnectWalletAddress)
         }
      }, 1000);
      this.getAboutDetailAPI()
   }

   loading(id) {
      setTimeout(() => {
         window.location.href = `${config.baseUrl}UserProfile/${id}`
         window.location.reload(true)
      }, 500);
   }

   loadingGroup(id) {
      setTimeout(() => {
         window.location.href = `${config.baseUrl}nftDetail/${id}`
         window.location.reload(true)
      }, 500);
   }

   //======================================= all search API c ========================================

   async allSearchAPI(id) {
      // e.preventDefault()
      await axios({
         method: 'post',
         url: `${config.apiUrl}allSearch`,
         headers: { "Authorization": this.loginData?.message },
         data: { "search": id }
      }).then(response => {

         // console.log("response.data.success", response.data.response);

         if (response.data.success === true) {
            // var collection = (response.data.response.findIndex(o => o.type === 'collection'));
            var obj1 = (response.data.response.findIndex(o => o.type === 'talent'));
            var obj = (response.data.response.findIndex(o => o.type === 'nft'));

            this.setState({
               talentIndex: obj1,
               nftIndex: obj,
               // collectionData: collection,
               searchDataList: response.data.response.filter(item => item.type != 'collection')
            })

         }
         else if (response.data.success === false) {
         }
      }).catch(err => {
         this.setState({
            searchDataList: []
         })


      })
   }


   async connectMetasmask() {
      if (window.ethereum) {
         await window.ethereum.send('eth_requestAccounts');
         window.web3 = new Web3(window.ethereum);
         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

         this.setState({
            ConnectWalletAddress: accounts[0]
         })

         localStorage.setItem('walletType', this.state.ConnectWalletAddress)
      }
      else {
         toast.error(`Please install MetaMask to use this dApp!`, {
            position: toast.POSITION.TOP_CENTER
         });
      }
   }

   logout() {
      Cookies.remove('lordsNFTleUserloginSuccess')
      setTimeout(() => {

         window.location.reload()
      });
   }


   loadingpage() {
      setTimeout(() => {
         window.location.reload()
      }, 500);
   }


   async setTabAPI(type) {
      localStorage.setItem('type', type)

      setTimeout(() => {
         window.location.reload()
      }, 500);
      // e.preventDefault()


      // this.props.headerData(e.target.id)
   }


   async getAboutDetailAPI() {
      await axios({
         method: 'post',
         url: `${config.apiUrl}getAboutDetail`,
         data: { "id": this.state.loginData?.data?.id }
      }).then(response => {
         if (response.data.success === true) {
            this.setState({
               aboutData: response.data.response
            })
         }
      })
   }

   onChange = e => {
      this.setState({
         [e.target.name]: e.target.value
      })

      if (e.target.name === 'searchData') {
         this.allSearchAPI(e.target.value)
      }
   }

   render() {
      return (
         <>

            <ToastContainer />
            <header style={{
               background: window.location.href.substring(window.location.href.lastIndexOf('/') + 1) === ''
                  ? 'transparent' : 'linear-gradient(241deg, rgba(88,34,196,1) 0%, rgba(233,117,199,1) 100%)'
            }}>
               <nav className="navbar navbar-expand-lg navbar-dark">
                  <div className="container-fluid">
                     <Link className="navbar-brand" to={`${config.baseUrl}`}>
                        <span>
                           <div className='godlogobox'>
                              <img src="assets/images/godlogo.png" alt="godlogo" />
                           </div>
                           <h5>VSB Digital Studio</h5>
                        </span>
                     </Link>
                     <Link to="#" className="d-lg-none">

                        {/* <span>
                        <img src="icons/menu.png" alt="menu" />
                     </span> */}
                     </Link>
                     <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bdNavbar" aria-controls="bdNavbar" aria-expanded="false" aria-label="Toggle navigation">

                        <span className="navbar-toggler-icon" />
                     </button>
                     <div className="collapse navbar-collapse text-center" id="bdNavbar">
                        <ul className="navbar-nav">

                           <form className="input-search" onSubmit={(e => e.preventDefault())}>
                              <input type="text" className="textbox" placeholder="Search" value={this.state.searchData} name="searchData" onChange={this.onChange} />
                              <ul className="search_ul" style={{ display: this.state.searchDataList.length === 0 ? 'none' : 'block', overflowX: 'hidden' }}>
                                 {this.state.searchDataList.map((item, i) => {

                                    return (
                                       (item.type == 'talent') ?
                                          <>
                                             {(this.state.talentIndex == i) ?
                                                <li className="mobile-font" style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: 'auto', paddingTop: '20px', borderBottom: '1px solid #ddd', marginBottom: '15px' }} >Accounts</li>
                                                : ''}

                                             {/* <p style={{color:'#000'}}>People</p> */}
                                             <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: '48px' }} title={item.full_name} >
                                                <Link to={`${config.baseUrl}UserProfile/${item.id}`} onClick={this.loading.bind(this, item.id)}>
                                                   <img src={item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                                      ? 'images/default-user-icon.jpg'
                                                      :
                                                      `${config.imageUrl1}${item.profile_pic}`} style={{ height: '35px', width: '35px', borderRadius: '50%' }} alt="" />
                                                   <span data-id={item.id} style={{ marginLeft: "10px", position: "relative", top: "-7px", color: "rgba(0, 0, 0, 0.87)" }}>{item.full_name}</span>
                                                   <br />

                                                </Link>
                                             </li></>
                                          :
                                          <>
                                             {(this.state.nftIndex == i) ?
                                                <li className="mobile-font" style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: 'auto', paddingTop: '20px', borderBottom: '1px solid #ddd', marginBottom: '15px' }} >NFT</li>
                                                : ''}
                                             <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: '48px' }} title={item.full_name} >
                                                <Link to={`${config.baseUrl}nftDetail/${item.id}`} onClick={this.loadingGroup.bind(this, item.id)}>
                                                   {item.file_type === 'image' ?
                                                      <img effect="blur" style={{ height: '35px', width: '35px', borderRadius: '50%' }} src={`${config.imageUrl}${item.profile_pic}`} alt="omg" /> :
                                                      item.file_type === 'video' ?
                                                         <img src="images/youtube-logo2.jpg" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
                                                         :
                                                         <img effect="blur" style={{ height: '35px', width: '35px', borderRadius: '50%' }} src={`${config.imageUrl}${item.profile_pic}`} alt="omg" />
                                                   }
                                                   <span data-id={item.id} style={{ marginLeft: "10px", position: "relative", top: "-7px", color: "rgba(0, 0, 0, 0.87)" }}>{item.full_name}</span>
                                                   <br />

                                                </Link>
                                             </li>
                                          </>
                                    )
                                 })}
                              </ul>
                              <span><img src="assets/images/menubar.png" alt="menubar" /></span>
                           </form>
                           <li className="nav-item">
                              <Link className="nav-link text-white" aria-current="page" to={`${config.baseUrl}`}>Home</Link>
                           </li>
                           <li className="nav-item">
                              <Link className="nav-link text-white" aria-current="page" to={`${config.baseUrl}marketplaceDetail`}>Marketplace</Link>
                           </li>
                           {/* <li className="nav-item">
                              <Link className="nav-link text-white" aria-current="page" to="#">Pricing</Link>
                           </li> */}
                           <li className="nav-item">
                              <Link className="nav-link text-white" aria-current="page" to={`${config.baseUrl}aboutus`}>About Us</Link>
                           </li>
                           <li className="nav-item">
                              <Link className="nav-link text-white" aria-current="page" to={`${config.baseUrl}howto`}>How To</Link>
                           </li>
                        </ul>
                        {this.state.loginData.length == 0 ?
                           <div className="walletbox"><Link className="menubar" to="">
                              {/* <img src="assets/images/menubar.png" alt="menubar" /> */}
                           </Link><Link className="contect-wallet" style={{ marginLeft: '35px' }} to={`${config.baseUrl}login`}>Enter</Link></div> :
                           <>

                              {(this.state.ConnectWalletAddress) ?
                                 <div className="walletbox"><Link className="menubar" to="#">
                                    <img src="assets/images/menubar.png" alt="menubar" />
                                 </Link><a className="contect-wallet" style={{ marginLeft: '35px' }} target="_blank" href={`${config.blockchinUrl}address/${this.state.ConnectWalletAddress}`}> {this.state.ConnectWalletAddress.toString().substring(0, 4) + '...' + this.state.ConnectWalletAddress.toString().substr(this.state.ConnectWalletAddress.length - 4)}</a></div> :
                                 <div className="walletbox"><Link className="menubar" to="#">
                                    <img src="assets/images/menubar.png" alt="menubar" />
                                 </Link><Link to="#" onClick={this.connectMetasmask.bind(this)} className="contect-wallet" style={{ marginLeft: '35px' }} > Connect Wallet</Link></div>
                              }

                              <div className='walletbox'>

                                 <div className="dropdown">
                                    <Link to="#" className='dropdown-toggle' id="dropdownMenuButton2" data-bs-toggle="dropdown">
                                       <span>
                                          {this.state.aboutData.profile_pic ?
                                             <img src={this.state.aboutData.profile_pic != 'null' ?
                                                config.imageUrl1 + this.state.aboutData.profile_pic :
                                                "images/default-user-icon.jpg"} className='profileimg' alt="profile" /> :
                                             <img src="assets/icons/profile.png" className='profileimg' alt="profile" />}
                                       </span>Profile
                                    </Link>
                                    <ul className="dropdown-menu px-0" aria-labelledby="dropdownMenuButton2">
                                       <div className='proinr'>
                                          {/* <div className='prodots'>
                                             <div className='dotss'></div>
                                             <div className='dotss'></div>
                                             <div className='dotss'></div>
                                          </div> */}
                                          <div className='govindapro'>
                                             <Link to="#" id="prodropdown">
                                                <span>
                                                   {this.state.aboutData.profile_pic ?
                                                      <img src={this.state.aboutData.profile_pic != 'null' ?
                                                         config.imageUrl1 + this.state.aboutData.profile_pic :
                                                         "assets/icons/profile.png"} className='profileimg' alt="profile" /> :
                                                      <img src="assets/icons/profile.png" className='profileimg' alt="profile" />}

                                                </span>
                                                {this.state.aboutData.full_name}
                                             </Link>
                                          </div>
                                          <div className='procontent'>
                                             <ul>
                                                <li><Link onClick={this.loadingpage.bind(this)} to={`${config.baseUrl}UserProfile/` + this.state.loginData?.data?.id}><span><i className="fa fa-user diff" aria-hidden="true"></i></span>My Profile</Link><span><i className="fa fa-chevron-right" aria-hidden="true"></i></span></li>

                                                <li><Link onClick={this.setTabAPI.bind(this, 1)} to={`${config.baseUrl}accountsetting`}><span><i className="fa fa-briefcase" aria-hidden="true"></i></span>Portfolio</Link></li>

                                                <li><Link onClick={this.setTabAPI.bind(this, 2)} to={`${config.baseUrl}accountsetting`}><span><i className="fa fa-gavel" aria-hidden="true"></i></span>Bids</Link></li>

                                                <li><Link onClick={this.setTabAPI.bind(this, 3)} to={`${config.baseUrl}accountsetting`}><span><i className="fa fa-inr" aria-hidden="true"></i></span>Transaction History</Link><span><i className="fa fa-chevron-right" aria-hidden="true"></i></span></li>

                                                <li><Link onClick={this.setTabAPI.bind(this, 5)} to={`${config.baseUrl}accountsetting`}><span><i className="fa fa-user-circle" aria-hidden="true"></i></span>Account Setting</Link></li>

                                                {/* <li><Link onClick={this.setTabAPI.bind(this, 6)} to={`${config.baseUrl}accountsetting`}><span><i className="fa fa-window-restore" aria-hidden="true"></i></span>Collections</Link></li> */}

                                                {/* <li><Link onClick={this.setTabAPI.bind(this, 7)} to={`${config.baseUrl}accountsetting`}><span><i className="fa fa-window-restore" aria-hidden="true"></i></span>Royalties</Link></li> */}

                                                <li><Link to={`${config.baseUrl}`} onClick={this.logout.bind(this)}><span><i className="fa fa-lock" aria-hidden="true"></i>
                                                </span>Logout</Link></li>
                                             </ul>
                                          </div>
                                       </div>
                                    </ul>
                                 </div>

                              </div>
                           </>
                        }
                     </div>
                  </div>
               </nav>
            </header>
         </>
      )
   }
}
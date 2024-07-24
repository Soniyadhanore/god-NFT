import React, { Component } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import config from '../config/config'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { Player } from 'video-react';
import Countdown, { zeroPad } from 'react-countdown';
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';

import BarLoader from 'react-bar-loader'
import Web3 from 'web3';
// import toast, { Toaster } from 'react-hot-toast';
import ReactDatatable from '@ashvin27/react-datatable'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import Modal from 'react-modal';
import { ToastContainer, Toaster, toast } from 'react-toastify';
// import toast, { Toaster } from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const headers = {
  'Content-Type': 'application/json'
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const MAX_LENGTH = 10;
export default class accountsetting extends Component {

  constructor(props) {
    super(props)
    this.state = {
      full_name: '',
      isSocial: 0,
      copied: false,
      profileData: '',
      image_file: null,
      image_preview: '',
      banner_preview: '',
      image_file1: null,
      image_preview1: '',
      email: '',
      currentPassword: '',
      password: '',
      password2: '',
      openDotId: '0',
      twoAuthenticationData: '',
      enableTwoFactor: '',
      talentStatusAPIData: '',
      facebook: "",
      insta: "",
      twitter: "",
      pinterest: "",
      website: "",
      youtube: "",
      discord: "",
      aboutData: "",
      getWalletData: [],
      deposit_amount: '',
      adaToUsd: '',
      withdrawAmount: '',
      withdrawRecepientAddress: '',
      spinLoader: '0',
      collectionData: [],
      openDotDrop: 0,
      myNftData: [],
      nftData: [],
      nftType: '1',
      saleHistory: [],
      FavouritesHistory: [],
      getUserPurchaseData: [],
      getUserSaleData: [],
      getBidPlacedHistoryData: [],
      getBidReceivedNftHistoryData: [],
      getNftBidDetailsData: [],
      modalIsOpen: false,
      selectedTab: '1',
      isPutonSale: 0,
      isTransferNft: 0,
      currentDate: '',
      endDate: '',
      transferNftItemId: '',
      transferNftAddress: '',
      getRoyaltiesData: [],
      getId: '',
      isDialogOpen: false,
      isDialogOpenBid: false,

      isCancelOrder: 0,
      blockchainUpdationType: 1,

    }
    this.loginData = (!Cookies.get('lordsNFTleUserloginSuccess')) ? [] : JSON.parse(Cookies.get('lordsNFTleUserloginSuccess'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    this.walletType = localStorage.getItem('walletType')

    this.onChange = this.handleChange1.bind(this);
    this.updateProfileDetails = this.updateProfileDetails.bind(this)
    this.onChange = this.handleChange.bind(this);
    this.onChange = this.handleTwoWay.bind(this)
    this.twoAuthenticationVerifyAPI = this.twoAuthenticationVerifyAPI.bind(this)

    // ================================== Deposit / Withdraw Histtory Start ========================================
    this.columns = [
      {
        key: "sn",
        text: "#",
        cell: (row, index) => index + 1
      },
      {
        key: "transaction_type",
        text: "Transaction Type",
        cell: (item) => {
          return (
            item.transaction_type
          );
        }
      },
      {
        key: "amount",
        text: "Amount",
        cell: (item) => {
          return (
            <span>
              ETH {item.amount}
            </span>
          );
        }
      },
      {
        key: "transaction_date",
        text: "Transaction Date",
        cell: (item) => {
          return (
            item.transaction_date
          );
        }
      },
      {
        key: "status",
        text: "Status",
        cell: (item) => {
          return (
            item.status
          );
        }
      },
      {
        key: "hash",
        text: "Blockchain View",
        cell: (item) => {
          return (
            <span>
              {item.hash ?
                <a href={`https://testnet.bscscan.com/transaction/${item.hash}`} target="_blank">
                  <span title={item.hash}>{item?.hash.toString().substring(0, 4) + '...' + item?.hash.toString().substr(item?.hash.length - 6)}
                    &nbsp; <i style={{ color: '#4ca1f4!important' }} className="fa fa-external-link"></i>
                  </span>
                </a>
                : ""
              }
            </span>
          );
        }
      },

    ];

    this.config = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false

      }
    }

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User purchase history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    this.columnsForPurchase = [
      {
        key: "sn",
        text: "#",
        cell: (row, index) => index + 1
      },
      {
        key: "image",
        text: "Image",
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
                  <img src={`${config.imageUrl}` + item.image} width="70px" />
                </div>
                :
                <video muted autoPlay width="70px" height="70px" controls>
                  <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                </video>
              }
            </Link>
          );
        }
      },
      {
        key: "item_name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
              {item.item_name}
            </Link>
          )
        }
      },
      {
        key: "collection",
        text: "Collection",
        cell: (item) => {
          return (
            item.collection_name
          );
        }
      },

      {
        key: "price",
        text: "Amount",
        cell: (item) => {
          return (
            item.price + `${item.blockchainType == 1 ? ' BNB' : ' BNB'}`
          );
        }
      },

      {
        key: "nft_datetime",
        text: "Created Date",
        cell: (item) => {
          return (
            item.nft_datetime
          );
        }
      },

      {
        key: "action",
        text: "Action",
        cell: (item) => {
          return (
            item.transfer_hash ?
              // <a href={item.transfer_hash} target="_blank">
              //   <button className="btn-main2">Blockchain view</button>
              // </a>

              <a href={item.transfer_hash} target="_blank" className='mt-3'>
                <button className="blockchain-view">Blockchain view</button>
              </a>
              : ""
          );
        }
      },


    ];

    this.configForPurchase = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false

      }
    }

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User Sale history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    this.columnsForSale = [
      {
        key: "sn",
        text: "#",
        cell: (row, index) => index + 1
      },
      {
        key: "image",
        text: "Image",
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
                  <img src={`${config.imageUrl}` + item.image} width="70px" />
                </div>
                :
                <video muted autoPlay width="70px" height="70px" controls>
                  <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                </video>
              }
            </Link>
          );
        }
      },

      {
        key: "item_name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
              {item.item_name}
            </Link>
          )
        }
      },

      {
        key: "collection",
        text: "Collection",
        cell: (item) => {
          return (
            item.collection_name
          );
        }
      },

      {
        key: "price",
        text: "Amount",
        cell: (item) => {
          return (
            item.price + `${item.blockchainType == 1 ? ' BNB' : ' BNB'}`
          );
        }
      },

      {
        key: "nft_datetime",
        text: "Created Date",
        cell: (item) => {
          return (
            item.nft_datetime
          );
        }
      },

      {
        key: "action",
        text: "Action",
        cell: (item) => {
          return (
            item.transfer_hash ?
              <a href={item.transfer_hash} target="_blank">
                <button className="blockchain-view">Blockchain view</button>
              </a>
              : ""
          );
        }
      },


    ];

    this.configForSale = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false

      }
    }

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User Bid Placed history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


    this.columnsForUserBid = [
      {
        key: "sn",
        text: "#",
        cell: (row, index) => index + 1
      },
      {
        key: "image",
        text: "Image",
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
                  <img src={`${config.imageUrl}` + item.image} width="70px" />
                </div>
                :
                <video muted autoPlay width="70px" height="70px" controls>
                  <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                </video>
              }
            </Link>
          );
        }
      },

      {
        key: "item_name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
              {item.item_name}
            </Link>
          )
        }
      },

      {
        key: "owner_name",
        text: "Owner Name",
        cell: (item) => {
          return (
            item.owner_name
          );
        }
      },

      {
        key: "item_price",
        text: "Reserve Price",
        cell: (item) => {
          return (
            item.item_price + `${item.blockchainType == 1 ? ' BNB' : ' BNB'}`
          );
        }
      },

      // {
      //   key: "max_bid",
      //   text: "Hightest Bid",
      //   cell: (item) => {
      //     return (
      //       item.max_bid + `${item.blockchainType == 1 ? ' BNB' : ' BNB'}`
      //     );
      //   }
      // },

      {
        key: "bid_price",
        text: "Your Bid",
        cell: (item) => {
          return (
            item.bid_price + `${item.blockchainType == 1 ? ' BNB' : ' BNB'}`
          );
        }
      },

      {
        key: "status",
        text: "Status",
        cell: (item) => {
          return (
            item.status
          );
        }
      },

      // {
      //   key: "action",
      //   text: "Action",
      //   cell: (item) => {
      //     return (
      //       item.status_id == '0' ?
      //         <button onClick={this.cancelBidAPI.bind(this, item)} className="btn-main2">Cancel Bid</button>
      //         : ""
      //     );
      //   }
      // },


    ];

    this.configForUserBid = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false

      }
    }

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User Bid Received history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    this.columnsForNftBidReceived = [
      {
        key: "sn",
        text: "#",
        cell: (row, index) => index + 1
      },
      {
        key: "image",
        text: "Image",
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
                  <img src={`${config.imageUrl}` + item.image} width="70px" />
                </div>
                :
                <video muted autoPlay width="70px" height="70px" controls>
                  <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                </video>
              }
            </Link>
          );
        }
      },

      {
        key: "item_name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
              {item.item_name}
            </Link>
          )
        }
      },

      {
        key: "collection_name",
        text: "Collection",
        cell: (item) => {
          return (
            item.collection_name
          );
        }
      },

      {
        key: "item_price",
        text: "Reserve Price",
        cell: (item) => {
          return (
            'BNB ' + item.price
          );
        }
      },

      // {
      //   key: "max_bid",
      //   text: "Hightest Bid",
      //   cell: (item) => {
      //     return (
      //       'BNB ' + item.max_bid
      //     );
      //   }
      // },

      {
        key: "action",
        text: "Action",
        cell: (item) => {
          return (
            <button onClick={this.viewNftBidDetails.bind(this, item.item_id)} className='sale-list btn btn-primary btn-sm' data-toggle="modal" data-target="#productShareSheet">View Bids</button>
          );
        }
      },
    ];

    this.configForNftBidReceived = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false
      }
    }

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User Sale List history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    this.salecolumns = [
      {
        key: "index",
        text: "S.No.",
        sortable: true,
        cell: (item, i) => {
          return (
            <>{i + 1}</>
          )
        }
      },
      {
        key: "image",
        text: "Image",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
                  <img src={`${config.imageUrl}` + item.image} width="70px" />
                </div>
                :
                <video muted autoPlay width="70px" height="70px" controls>
                  <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                </video>
              }
            </Link>
          );
        }
      },
      {
        key: "name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
              {item.name}
            </Link>
          )
        }
      },
      {
        key: "collection_name",
        text: "Collection",
        sortable: true
      },

      {
        key: "sell_type",
        text: "Sale Type",
        sortable: true,
        cell: (item) => {
          return (
            <>{item.sell_type == '1' ? 'Price' : item.sell_type == '2' ? "Auction" : 'Not On Sale'} </>
          )
        }
      },

      {
        key: "price",
        text: "Price",
        sortable: true,
        cell: (item) => {
          return (
            <> BNB {item.price}</>
          )
        }
      },
      {
        key: "expiry_date",
        text: "End Date",
        sortable: true,
        cell: (item) => {
          return (
            <>{item.expiry_date == '0000-00-00 00:00:00' || item.expiry_date === null ? "" : moment(item.expiry_date).format('LLL')}</>
          )
        }
      },
      {
        key: "Action",
        text: "Action",
        sortable: true,
        cell: (item) => {
          return (
            <div>
              {item.sell_type == 2 ?
                <button onClick={this.viewNftBidDetails.bind(this, item.item_id)} data-toggle="modal" data-target="#productShareSheet" className='sale-list btn btn-primary btn-sm'>View Bids</button> : ""
              }
            </div>
          )
        }
      },
    ];

    this.configs = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false
      }
    }

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Royalties >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



    this.columnsRoyalties = [
      {
        key: "sn",
        text: "#",
        cell: (row, index) => index + 1
      },
      {
        key: "image",
        text: "Image",
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
              {item.file_type == 'image' ?
                <div className="image-circle">
                  <img src={`${config.imageUrl}` + item.image} width="70px" />
                </div>
                :
                <video muted autoPlay width="70px" height="70px" controls>
                  <source src={`${config.imageUrl}${item.image}`} type="video/mp4" />
                </video>
              }
            </Link>
          );
        }
      },

      {
        key: "item_name",
        text: "Title",
        sortable: true,
        cell: (item) => {
          return (
            <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
              {item.item_name}
            </Link>
          )
        }
      },

      {
        key: "trxType",
        text: "Type",
        sortable: true
      },

      {
        key: "collection",
        text: "Collection",
        cell: (item) => {
          return (
            item.collection_name
          );
        }
      },

      {
        key: "price",
        text: "Amount",
        cell: (item) => {
          return (
            item.price + `${item.blockchainType == 1 ? ' BNB' : ' MATIC'}`
          );
        }
      },

      {
        key: "nft_datetime",
        text: "Created Date",
        cell: (item) => {
          return (
            item.nft_datetime
          );
        }
      }


    ];

    this.configRoyalties = {
      page_size: 10,
      length_menu: [10, 20, 50],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      button: {
        excel: false,
        print: false

      }
    }

  }

  handleClickOutside = event => {
    var openDotId = this.state.openDotId
    if (openDotId > '0') {
      $("#collections" + this.state.openDotId).css({ "display": "none" });
      $("#nft" + this.state.openDotId).css({ "display": "none" });
      $("#createnft" + this.state.openDotId).css({ "display": "none" });
      $("#salenft" + this.state.openDotId).css({ "display": "none" });
    }
  }

  componentDidMount() {

    var startDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    var array = startDate.split(' ');
    if (array[0]) {
      this.setState({
        currentDate: array[0],
        endDate: array[0]
      })
    }

    document.addEventListener('click', this.handleClickOutside, true);
    if (!this.loginData?.data?.id) {
      window.location.href = `${config.baseUrl}`
    }

    if (Cookies.get('selectedTab')) {
      this.setState({
        selectedTab: Cookies.get('selectedTab')
      })
      Cookies.remove('selectedTab')
    }


    this.twoAuthenticationAPI()
    this.getUserData()
    this.getAboutDetailAPI()

    setTimeout(() => {
      this.getRoyaltiesAPI()
      this.getCollectionDataAPI()
      this.getMyNftAPI()
      this.getUserPurchaseAPI()
      this.getSaleHistoryAPI()
      this.getBidPlacedHistoryAPI()
      this.getNftBidReceivedHistoryAPI()
    }, 1000);
    let type = this.props?.location?.state?.detail ? this.props?.location?.state?.detail : localStorage.getItem('type')
    console.log(type)
    if (type) {
      this.setState({
        selectedTab: type
      })
    }
    else {
      this.setState({
        selectedTab: 1
      })
    }

    // if(this.props.history.location.state){
    //   this.setState({
    //     selectedTab:this.props.history.location.state.selectedTab
    //   })
    // }

    // if(this.props.history.length == 50){
    //   this.setState({
    //     selectedTab:6
    //   })
    // }
    window.scrollTo({ top: 0, behavior: 'smooth' });


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

  // ==============================   Account Settings API's Start   ===========================================

  async getUserData() {
    let userdata = this.loginData;
    this.setState({
      full_name: userdata.full_name
    })
  }

  handleChange = e => {

    if (e.target.name == 'start_date') {
      this.setState({
        endDate: e.target.value
      })
    }

    if (e.target.name == 'price') {
      this.setState(prevState => ({
        nftData: { ...prevState.nftData, ['price']: e.target.value }
      }))
    }

    if (e.target.name == 'start_date') {
      this.setState(prevState => ({
        nftData: { ...prevState.nftData, ['start_date1']: e.target.value }
      }))
    }

    if (e.target.name == 'expiry_date') {
      this.setState(prevState => ({
        nftData: { ...prevState.nftData, ['expiry_date1']: e.target.value }
      }))
    }

    if (e.target.name == 'minimum_bid_amount') {
      this.setState(prevState => ({
        nftData: { ...prevState.nftData, ['price']: e.target.value }
      }))
    }

    this.setState({
      [e.target.name]: e.target.value
    })
  }

  async transferNftAPI() {
    const token = this.token

    this.setState({
      spinLoader: 1
    })

    await axios({
      method: 'post',
      url: `${config.apiUrl}transferNFT`,
      headers: { authorization: token },
      data: {
        "user_id": this.loginData?.data?.id,
        "address": this.loginData?.address,
        "item_id": this.state.transferNftItemId,
        "address": this.state.transferNftAddress
      }
    }).then((res) => {

      this.setState({
        spinLoader: 0
      })

      if (res.data.success === true) {
        this.modalShow(0)
        this.getMyNftAPI(this.state.nftType)
        toast.success(res.data.msg, {});
      } else {
        toast.error(res.data.msg, {});
      }

    }).catch((error) => {
      toast.error(error.response?.data?.msg, {});
    })
  }

  handleChange1 = event => {
    event.preventDefault()
    let value = event.target.value;
    this.setState(prevState => ({
      aboutData: { ...prevState.aboutData, [event.target.name]: value }
    }))
  }

  profilePicChange = (e) => {
    let image_as_base64 = URL.createObjectURL(e.target.files[0])
    let image_as_files = e.target.files[0];
    this.setState({
      image_preview: image_as_base64,
      image_file: image_as_files,
    })
  }

  bannerPicChange = (e) => {
    let image_as_base64 = URL.createObjectURL(e.target.files[0])
    let image_as_files = e.target.files[0];
    this.setState({
      banner_preview: image_as_base64,
      banner_pic: image_as_files,
    })
  }

  async twoAuthenticationAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getQR`,
      data: { "user_id": this.loginData?.data?.id }
    }).then(response => {

      if (response.data.success === true) {
        this.setState({
          twoAuthenticationData: response.data.response
        })
      }
    })
  }

  async twoAuthenticationVerifyAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}twoAuthenticationVerify `,
      data: { "user_id": this.loginData?.data?.id, 'SecretKey': this.state.twoAuthenticationData.SecretKey, 'enableTwoFactor': this.state.twoAuthenticationData.enableTwoFactor }
    }).then(response => {
      if (response.data.success === true) {
        if (this.state.twoAuthenticationData.enableTwoFactor == 1) {
          var msg = "2FA Authentication has been disabled successfully!"
        } else {
          var msg = "2FA Authentication has been enabled successfully!"
        }
        this.twoAuthenticationAPI()
        toast.success(msg);
      }
    }).catch(err => {
      toast.error('Token mismatch! Please try again.')
    })
  }


  handleTwoWay = event => {
    event.preventDefault()
    if (event.target.checked === true && event.target.type === 'checkbox') {
      event.target.value = '1'
    }
    else if (event.target.checked === false && event.target.type === 'checkbox') {
      event.target.value = '0'
    }
    let value = event.target.value;
    this.setState(prevState => ({
      twoAuthenticationData: { ...prevState.twoAuthenticationData, [event.target.name]: value }
    }))

  }

  formatInput = (e) => {
    let checkIfNum;
    if (e.key !== undefined) {
      checkIfNum = e.key === "e" || e.key === "." || e.key === "+" || e.key === "-";
    }
    else if (e.keyCode !== undefined) {
      checkIfNum = e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189;
    }
    return checkIfNum && e.preventDefault();
  }

  async getAboutDetailAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getAboutDetail`,
      data: { "id": this.loginData?.data?.id }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          aboutData: response.data.response
        })
      }
    })
  }

  updateProfileDetails(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('full_name', this.state.aboutData?.full_name);
    formData.append('email', this.state.aboutData?.email);
    formData.append('description', this.state.aboutData?.description);
    formData.append('profile_pic', this.state.image_file);
    formData.append('banner', this.state.banner_pic);
    formData.append('old_profile_pic', this.state.aboutData?.profile_pic);
    formData.append('old_banner', this.state.aboutData?.banner);
    formData.append('facebook', this.state.aboutData?.facebook);
    formData.append('twitter', this.state.aboutData?.twitter);
    formData.append('insta', this.state.aboutData?.insta);
    formData.append('telegram', this.state.aboutData?.telegram);
    formData.append('discord', this.state.aboutData?.discord);
    formData.append('user_id', this.state.aboutData?.id);
    axios.post(`${config.apiUrl}updateAboutDetail`, formData)
      .then(result => {
        if (result.data.success === true) {
          toast.success(result.data?.msg);
        } else {
          toast.error(result.data?.msg);
        }
      }).catch(err => {
        toast.error(err.response.data?.msg,

        );
      })
  }

  // ==============================   Account Settings API's End   ================================================

  // ==============================   Collections API's Start =================================================

  async getCollectionDataAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserCollection`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.data?.id, 'address': this.loginData?.address }
      // data: { "user_id": 262, 'address': this.loginData?.address }
    }).then(response => {

      if (response.data.success === true) {
        this.setState({
          collectionData: response.data.response
        })
      }
    })
  }

  async deleteCollection(collection_id) {
    $("#collections" + collection_id.id).css({ "display": "none" });

    const token = this.token
    if (collection_id.totalNft == 0) {
      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure you want to delete this collection?',
        buttons: [
          {
            label: 'Yes',
            onClick: () =>
              axios({
                method: 'post',
                url: `${config.apiUrl}deleteUserCollection`,
                headers: { authorization: token },
                data: { "user_id": this.loginData?.data?.id, 'address': this.loginData?.address, 'collection_id': collection_id.id }
              }).then(response => {
                if (response.data.success === true) {
                  toast.success(response.data.msg, {
                    style: {
                      border: '1px solid #713200',
                      padding: '20px',
                      color: 'white',
                    },
                    iconTheme: {
                      primary: 'purple',
                      secondary: '#FFFAEE',
                    },
                  });
                  this.getCollectionDataAPI()
                } else {
                  toast.error(response.data.msg,

                  );
                }
              }).catch(err => {
                toast.error(err.response.data?.msg,

                );
              })
          },
          {
            label: 'No',
          }
        ]
      });
    }
    else {
      toast.error('You cant delete this collection because of nft existing', {
        position: toast.POSITION.TOP_CENTER
      });
    }
  }

  // ==============================   Collections API's End =================================================


  //  ========================================== Portfolio API's Start==========================================

  async getMyNftAPI(nftType = null) {
    if (!nftType) {
      var nftType = 1
    } else {
      var nftType = nftType
    }

    this.setState({
      'saleHistory': [],
      'myNftData': [],
      'nftType': nftType,
      'FavouritesHistory': []
    })

    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}portfolio`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.data?.id, "login_user_id": this.loginData?.data?.id, 'address': this.loginData?.address, 'type': nftType }
      // data: { "user_id": 262, "login_user_id": 262, 'address': this.loginData?.address, 'type': nftType }
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

  async likeCount(item) {
    if (this.loginData && this.loginData?.data?.id) {
      await axios({
        method: 'post',
        url: `${config.apiUrl}likeitem`,
        data: {
          "user_id": this.loginData?.data?.id,
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

  async putOnSaleModelAPI(item, type) {
    this.setState({
      isPutonSale: 1,
      updateType: type
    })
    $("#nft" + item.item_id).css({ "display": "none" });
    await axios({
      method: 'post',
      url: `${config.apiUrl}itemDetail`,
      data: { 'item_id': item.item_id, 'user_id': this.loginData?.data?.id }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          nftData: response.data.response
        })
      }
    })
  }


  async cancelOrder(item) {
    this.setState({
      isCancelOrder: 1
    })
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure want to cancel this order?.',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            this.approveNFT(item)
        },
        {
          label: 'No',
        }
      ]
    });
  }


  async transferNFTModelAPI(item) {
    this.setState({
      isTransferNft: 1,

      transferNftItemId: item.item_id
    })
    $("#nft" + item.item_id).css({ "display": "none" });
  }

  async updateNFT(itemDetails) {

    // alert(itemDetails.token_id)
    if (window.ethereum) {
      this.setState({
        spinLoader: '1',
        isDialogOpen: true
      })

      var web3 = '';
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      let currentNetwork = await web3.currentProvider.chainId;
      web3.eth.defaultAccount = accounts[0];

      // var ETH_mainnet = 0x1;
      // var ETH_testnet = 0x4;

      // let matic_mainnet = 137;
      // let matic_testnet = 80001;

      if (itemDetails.blockchainType == 1) {
        if (currentNetwork !== web3.utils.toHex(config.BNBChainId)) {
          toast.error(config.chainMessageBNB);
          this.setState({
            spinLoader: '0',
            isDialogOpen: false
          })
          return false;
        }
        var chainId = web3.utils.toHex(config.BNBChainId);
      }

      if (itemDetails.blockchainType == 2) {
        toast.error('In Progress');
        return;
      }

      try {
        let mintFee = 0;
        let SalePrice;
        let start_date = 0;
        let expiry_date = 0;
        let tokenId = itemDetails.token_id;

        if (itemDetails.sell_type == 1) {
          SalePrice = parseInt(parseFloat(this.state.nftData?.price) * (10 ** 18)).toString()
          this.setState({
            start_date: 0,
            expiry_date: 0
          })
        }

        else if (itemDetails.sell_type == 2) {
          SalePrice = parseInt(parseFloat(this.state.nftData?.price) * (10 ** 18)).toString();
          start_date = Math.round(new Date(this.state.nftData?.start_date1).getTime() / 1000);
          expiry_date = Math.round(new Date(this.state.nftData?.expiry_date1).getTime() / 1000);
        }


        let contractAddress = `${config.marketplaceContract}`
        let from_address = accounts[0];
        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);

        await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString()).call();

        let tx_builder = await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString());

        let encoded_tx = tx_builder.encodeABI();
        let gasPrice = await web3.eth.getGasPrice();
        gasPrice = parseInt(gasPrice) + parseInt(10000000000);

        let gasLimit = await web3.eth.estimateGas({
          gasPrice: web3.utils.toHex(gasPrice),
          to: contractAddress,
          from: from_address,
          value: web3.utils.toHex(mintFee),
          chainId: chainId,
          data: encoded_tx
        });

        const txData = await web3.eth.sendTransaction({
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gasLimit),
          to: contractAddress,
          from: from_address,
          value: web3.utils.toHex(mintFee),
          chainId: chainId,
          data: encoded_tx
        });

        if (txData.transactionHash) {
          // this.setState({
          //   isDialogOpen: false
          // })
          // toast.success('Item updated on successfully!');
          // setTimeout(() => {
          //   window.location.reload()
          // }, 500);
          return true

          // let mintRes = {
          //   'ImageFileHash': ImageFileHash,
          //   'MetadataFileHash': metaHash,
          //   'hash': txData.transactionHash,
          //   'tokenId': tokenId,
          //   'from_address': from_address,
          //   'minting_fee': parseInt(mintFee) / 10 ** 18
          // }
          // this.createNftAPI(mintRes);
        } else {
          toast.error('Something went wrong please try again.');
          this.setState({
            spinLoader: '0',
            isDialogOpen: false
          })
          return false;
        }

      } catch (err) {

        if (err.message.toString().split('insufficient funds')[1]) {
          toast.error('Transaction reverted : ' + err.message)
        } else {
          if (err.toString().split('execution reverted:')[1]) {
            toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])

          } else {
            toast.error(err.message);
          }
        }

        this.setState({
          spinLoader: 0,
          isDialogOpen: false
        })
        return false;
      }
    } else {
      toast.error('Please Connect to MetaMask.');
      this.setState({
        spinLoader: 0,
        isDialogOpen: false
      })
      return false;
    }

  }
  async approveNFT(itemDetails) {

    this.setState({
      spinLoader: '1',
      isPutonSale: 0,
      isDialogOpen: true
    })

    if (window.ethereum) {

      var web3 = '';
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      let currentNetwork = await web3.currentProvider.chainId;
      web3.eth.defaultAccount = accounts[0];

      // var ETH_mainnet = 0x1;
      // var ETH_testnet = 0x4;

      // let matic_mainnet = 137;
      // let matic_testnet = 80001;


      if (itemDetails.blockchainType == 1) {
        if (currentNetwork !== web3.utils.toHex(config.BNBChainId)) {
          toast.error(config.chainMessageBNB);
          this.setState({
            spinLoader: '0',
            isPutonSale: 1,
            isDialogOpen: false
          })
          return false;
        }
        var chainId = web3.utils.toHex(config.BNBChainId);
      }

      if (itemDetails.blockchainType == 2) {
        this.setState({
          spinLoader: '0',
          isPutonSale: 1,
          isDialogOpen: false
        })
        toast.error('In Progress');
        return;
      }

      try {
        let mintFee = 0;
        let SalePrice;
        let start_date = 0;
        let expiry_date = 0;
        let tokenId = itemDetails.token_id;
        if (itemDetails.sell_type == 1) {
          SalePrice = parseInt(parseFloat(itemDetails.price) * (10 ** 18)).toString()
          this.setState({
            start_date: 0,
            expiry_date: 0
          })
        }

        else if (itemDetails.sell_type == 2) {
          SalePrice = parseInt(parseFloat(itemDetails.price) * (10 ** 18)).toString();
          start_date = Math.round(new Date(itemDetails.start_date).getTime() / 1000);
          expiry_date = Math.round(new Date(itemDetails.expiry_date).getTime() / 1000);
        }

        let contractAddress = `${config.marketplaceContract}`
        let from_address = accounts[0];
        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);

        if (this.state.isCancelOrder == 1) {
          this.setState({
            blockchainUpdationType: 2
          });
          await contract.methods.cancelOrder(tokenId.toString()).call();
          var tx_builder = await contract.methods.cancelOrder(tokenId.toString());
        } else {
          if (itemDetails.is_minted == 1) {
            await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString()).call();

            var tx_builder = await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString());
          } else {

            console.log(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString());

            await contract.methods._mint(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString()).call();

            var tx_builder = await contract.methods._mint(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString());
          }
        }

        let encoded_tx = tx_builder.encodeABI();
        let gasPrice = await web3.eth.getGasPrice();
        gasPrice = parseInt(gasPrice) + parseInt(10000000000);

        let gasLimit = await web3.eth.estimateGas({
          gasPrice: web3.utils.toHex(gasPrice),
          to: contractAddress,
          from: from_address,
          value: web3.utils.toHex(mintFee),
          chainId: chainId,
          data: encoded_tx
        });

        // const txData = await web3.currentProvider.request({
        //     method: 'BNB_sendTransaction',
        //     params: [{
        //         gasPrice: web3.utils.toHex(gasPrice),
        //         gas: web3.utils.toHex(gasLimit),
        //         to: contractAddress,
        //         from: from_address,
        //         value: web3.utils.toHex(mintFee),
        //         chainId: chainId,
        //         data: encoded_tx
        //     }],
        // });

        const txData = await web3.eth.sendTransaction({
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gasLimit),
          to: contractAddress,
          from: from_address,
          value: web3.utils.toHex(mintFee),
          chainId: chainId,
          data: encoded_tx
        });

        if (txData.transactionHash) {

          const token = this.token
          await axios({
            method: 'post',
            url: this.state.isCancelOrder ? `${config.apiUrl}cancelOrder` : `${config.apiUrl}putOnSale`,
            headers: { authorization: token },
            data: {
              "user_id": this.loginData?.data?.id,
              "address": this.loginData?.address,
              "item_id": itemDetails.item_id,
              "token_hash": txData.transactionHash,
              "is_minted": itemDetails.is_minted
            }
          }).then((res) => {
            if (res.data.success === true) {

              this.setState({
                isDialogOpen: false
              })

              this.modalShow(0)
              this.getMyNftAPI(itemDetails.nftType)
              toast.success(res.data.msg, {});
              setTimeout(() => {
                window.location.href = `${config.baseUrl}marketplaceDetail`
              }, 1000);
            } else {
              toast.error(res.data.msg, {});
            }
          }).catch((error) => {
            toast.error(error.response?.data?.msg, {});
          })
        } else {
          toast.error('Something went wrong please try again.');
          this.setState({
            spinLoader: '0',
            isPutonSale: this.state.this.state.isCancelOrder == 1 ? 0 : 1,
            isDialogOpen: false
          })
          return false;
        }

      } catch (err) {

        if (err.message.toString().split('insufficient funds')[1]) {
          toast.error('Transaction reverted : ' + err.message)
        } else {
          if (err.toString().split('execution reverted:')[1]) {
            toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])

          } else {
            toast.error(err.message);
          }
        }

        this.setState({
          spinLoader: '0',
          isPutonSale: this.state.isCancelOrder == 1 ? 0 : 1,
          isDialogOpen: false
        })
        return false;
      }
    } else {
      toast.error('Please Connect to MetaMask.');
      this.setState({
        spinLoader: '0',
        isPutonSale: this.state.isCancelOrder == 1 ? 0 : 1,
        isDialogOpen: false
      })
      return false;
    }
  }

  formatDate(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }


  async putOnSaleAPI(item) {
    console.log('putOnSaleAPI', item);
    this.setState({
      spinLoader: '1',
      isPutonSale: 0,
      isDialogOpen: true
    })

    if (this.state.updateType == 1) {
      let approveNFTRes = await this.approveNFT(item);
      if (approveNFTRes) {
        const token = this.token
        await axios({
          method: 'post',
          url: `${config.apiUrl}putOnSale`,
          headers: { authorization: token },
          data: {
            "user_id": this.loginData?.data?.id,
            "address": this.loginData?.address,
            "item_id": item.item_id
          }
        }).then((res) => {
          if (res.data.success === true) {

            this.setState({
              isDialogOpen: false
            })

            this.modalShow(0)
            this.getMyNftAPI(this.state.nftType)
            toast.success(res.data.msg, {});
          } else {
            toast.error(res.data.msg, {});
          }
        }).catch((error) => {
          toast.error(error.response?.data?.msg, {});
        })
      } else {
        this.setState({
          spinLoader: '0',
          isPutonSale: 1,
          isDialogOpen: false
        })
      }
    } else {
      let updateNFTRes = await this.updateNFT(item);
      if (updateNFTRes) {
        const token = this.token
        await axios({
          method: 'post',
          url: `${config.apiUrl}updateNftByUser`,
          headers: { authorization: token },
          data: {
            "user_id": this.loginData?.data?.id,
            "address": this.loginData?.address,
            "id": item.item_id,
            "sell_type": this.state.nftData?.sell_type,
            "price": this.state.nftData?.price,
            "start_date": this.formatDate(this.state.nftData?.start_date1),
            "expiry_date": this.formatDate(this.state.nftData?.expiry_date1)
          }
        }).then((res) => {
          if (res.data.success === true) {

            this.setState({
              isDialogOpen: false
            })

            this.modalShow(0)
            this.getMyNftAPI(this.state.nftType)
            toast.success(res.data.msg, {});
            setTimeout(() => {
              window.location.reload()
            }, 1000);
          } else {
            toast.error(res.data.msg, {});
          }
        }).catch((error) => {
          toast.error(error.response?.data?.msg, {});
        })
      } else {
        this.setState({
          spinLoader: '0',
          isPutonSale: 1,
          isDialogOpen: false
        })
      }
    }

  }

  async removeOnSaleAPI(item) {
    $("#nft" + item.item_id).css({ "display": "none" });
    $("#createnft" + item.item_id).css({ "display": "none" });
    $("#salenft" + item.item_id).css({ "display": "none" });
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}removeOnSale`,
      headers: { authorization: token },
      data: {
        "user_id": this.loginData?.data?.id,
        "address": this.loginData?.address,
        "item_id": item.item_id
      }
    }).then((res) => {

      if (res.data.success === true) {
        this.getMyNftAPI(this.state.nftType)
        toast.success(res.data.msg, {});
      } else {
        toast.error(res.data.msg, {});
      }

    }).catch((error) => {
      toast.error(error.response.data.msg, {});
    })
  }

  async deleteNFTAPI(item) {
    $("#nft" + item.item_id).css({ "display": "none" });
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}deleteNFT`,
      headers: { authorization: token },
      data: {
        "user_id": this.loginData?.data?.id,
        "address": this.loginData?.address,
        "item_id": item.item_id
      }
    }).then((res) => {
      if (res.data.success === true) {
        this.getMyNftAPI(this.state.nftType)
        toast.success(res.data.msg, {});
      } else {
        toast.error(res.data.msg, {});
      }

    }).catch((error) => {
      toast.error("Something went wrong Please try again.", {});
    })
  }


  //  ========================================== Portfolio API's End ======================================


  //  ========================================== Transactions API's Start ======================================

  async getUserPurchaseAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserPurchase`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.data?.id, "address": this.loginData?.address }
      // data: { "user_id": 262, "address": this.loginData?.address }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getUserPurchaseData: response.data.response
        })
      }
    })
  }

  async getSaleHistoryAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserSale`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.data?.id, "address": this.loginData?.address }
      // data: { "user_id": 262, "address": this.loginData?.address }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getUserSaleData: response.data.response
        })
      }
    })
  }

  //  ========================================== Transactions API's End ======================================


  //  ========================================== Bid API's End ======================================

  async getBidPlacedHistoryAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserBids`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.data?.id, "address": this.loginData?.address }
      // data: { "user_id": 262, "address": this.loginData?.address }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getBidPlacedHistoryData: response.data.response
        })
      }
    })
  }

  async getNftBidReceivedHistoryAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}myBidItem`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.data?.id, "address": this.loginData?.address }
      // data: { "user_id": 262, "address": this.loginData?.address }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getBidReceivedNftHistoryData: response.data.response
        })
      }
    }).catch(err => {
      this.setState({
        getBidReceivedNftHistoryData: []
      })
    })
  }

  async viewNftBidDetails(id) {

    this.setState({
      isSocial: 1
    })
    // this.setState({
    //   modalIsOpen: true
    // });
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getBidDetail`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.data?.id, "address": this.loginData?.address, 'item_id': id }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getNftBidDetailsData: response.data.response
        })
      }
    })

  }

  //  ========================================== Bid API's End ======================================

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   Cancel Bid API   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async cancelBidAPI(item) {
    const token = this.token

    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure you want to cancel?',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            axios({
              method: 'post',
              url: `${config.apiUrl}cancelBid`,
              headers: { authorization: token },
              data: { "user_id": this.loginData?.data?.id, "address": this.loginData?.address, 'bid_id': item.bid_id }
            }).then(response => {
              if (response.data.success === true) {
                toast.success(response.data?.msg, {});
                this.getBidPlacedHistoryAPI()
              } else {
                toast.error(response.data.msg, {});
              }
            }).catch((error) => {
              toast.error("Something went wrong Please try again.", {});
            })
        },
        {
          label: 'No',
        }
      ]
    });
  }

  openDot(openDotDrop, id) {

    this.setState({
      'openDotId': id
    })

    if (openDotDrop === 0) {
      $("#collections" + id).css({ "display": "block" });
      $("#nft" + id).css({ "display": "block" });
      $("#createnft" + id).css({ "display": "block" });
      $("#salenft" + id).css({ "display": "block" });

      this.setState({
        'openDotDrop': 1,
      })
    }
    else if (openDotDrop === 1) {
      $("#collections" + id).css({ "display": "none" });
      $("#nft" + id).css({ "display": "none" });
      $("#createnft" + id).css({ "display": "none" });
      $("#salenft" + id).css({ "display": "none" });
      this.setState({
        'openDotDrop': 0
      })
    }
  }

  async BidAcceptAPI(itemData) {

    let tokenId = itemData.token_id;
    if (window.ethereum) {

      const accounts = await window.ethereum.request({ method: 'BNB_requestAccounts' });
      let web3 = new Web3(window.ethereum);

      var chainId = web3.utils.toHex(config.BNBChainId);

      try {
        this.setState({
          processBtn: 1,
          isDialogOpenBid: true
        })
        let contractAddress = `${config.marketplaceContract}`
        let from_address = accounts[0];

        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        let tx_builder = await contract.methods.acceptBid(tokenId.toString());

        let encoded_tx = tx_builder.encodeABI();
        let gasPrice = await web3.eth.getGasPrice();

        let gasLimit = await web3.eth.estimateGas({
          gasPrice: web3.utils.toHex(gasPrice),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          data: encoded_tx
        });

        const txData = await web3.eth.sendTransaction({
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gasLimit),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          data: encoded_tx
        });


        if (txData.transactionHash) {
          const token = this.token
          axios({
            method: 'post',
            url: `${config.apiUrl}bidAccept`,
            headers: { authorization: token },
            data: { "user_id": itemData.user_id, "address": from_address, 'item_id': itemData.item_id, "bid_id": itemData.bid_id, "hash": txData.transactionHash }
          })
            .then(async response => {
              if (response.data.success === true) {
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
                toast.success(response.data?.msg, {});
                this.setState({
                  processBtn: 0,
                  isDialogOpenBid: false
                })
              }
              else if (response.data.success === false) {
                this.setState({
                  processBtn: 0,
                  isDialogOpenBid: false
                })
                toast.error(response.data?.msg, {});
              }
            })
            .catch(err => {
              this.setState({
                processBtn: 0,
                isDialogOpenBid: false
              })
              toast.error(err.response.data?.msg, {});
            })
          // window.location.reload();
        } else {
          toast.error('Something went wrong please try again3.');
          this.setState({
            processBtn: 0,
            isDialogOpenBid: false
          })
          return false;
        }

      } catch (err) {

        if (err.message.toString().split('insufficient funds')[1]) {

          toast.error('Transaction reverted : ' + err.message)

        } else {

          if (err.toString().split('execution reverted:')[1]) {
            toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])

          } else {
            toast.error(err.message);
          }
        }
        this.setState({
          processBtn: 0,
          isDialogOpenBid: false
        })
        return false;
      }

    } else {
      toast.error('Please Connect to MetaMask.');
      this.setState({
        processBtn: 0,
        isDialogOpenBid: false
      })
      return false;
    }
  }

  //  >>>>>>>>>>>>>>  Get getRoyalties Start  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  async getRoyaltiesAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserTransactions`,
      headers: { authorization: token },
      data: { "user_id": this.loginData?.data?.id }
      // data: { "user_id": 270 }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getRoyaltiesData: response.data.response
        })
      }
    })
  }

  modalShow(id) {
    if (id === 1) {
      this.setState({
        isSocial: 1,
        isPutonSale: 1,
        isTransferNft: 1
      })
    }
    else if (id === 0) {
      this.setState({
        isSocial: 0,
        isPutonSale: 0,
        isTransferNft: 0
      })
    }
  }



  sellType(type) {
    this.setState({
      'sell_type': type
    })

    this.setState(prevState => ({
      nftData: { ...prevState.nftData, ['sell_type']: type }
    }))
  }

  async setTabAPI(type) {
    this.setState({
      selectedTab: type
    })
  }

  handleChangeStartDate = e => {
    let startDate = this.formatDate(e);
    this.setState(prevState => ({
      nftData: { ...prevState.nftData, ['start_date1']: startDate },
      endDate: startDate
    }));
  }

  handleChangeEndDate = e => {
    let endDate = this.formatDate(e);
    this.setState(prevState => ({
      nftData: { ...prevState.nftData, ['expiry_date1']: endDate },
      endDate: endDate
    }))

  }

  render() {

    return (

      <>
        <Header />

        <ToastContainer />
        <div className="no-bottom no-top" id="content">
          <div id="top" />
          {this.state.updateType == 1 ?
            <Dialog
              title="Please Wait..."
              // icon="warning-sign"
              style={{
                color: '#3fa1f3',
                textAlign: "center"
              }}
              isOpen={this.state.isDialogOpen}
              isCloseButtonShown={false}
            >
              <div className="text-center pl-3 pr-3">
                {/* <BarLoader color="#e84747" height="2" /> */}
                <br />
                <h4 style={{ color: '#3fa1f3', fontSize: '16px' }}>
                  {this.state.blockchainUpdationType == 2 ?

                    'Canceling your listing will unpublish this sale from Bline and requires a transaction.'
                    :
                    'Put on sale in progress, once process completed NFT will be display on marketplace page.'
                  }

                </h4>
                <p style={{ color: '#091f3f' }}>
                  Please do not refresh page or close tab.
                </p>
                <div>
                  <div className="spinner-border"></div>
                </div>
              </div>
            </Dialog> :
            <Dialog
              title="Please Wait..."
              // icon="warning-sign"
              style={{
                color: '#3fa1f3',
                textAlign: "center"
              }}
              isOpen={this.state.isDialogOpen}
              isCloseButtonShown={false}
            >
              <div className="text-center">
                {/* <BarLoader color="#e84747" height="2" /> */}
                <br />
                <h4 style={{ color: '#3fa1f3', fontSize: '16px' }}>Canceling your listing will unpublish this sale from Bline and requires a transaction.</h4>
                <p style={{ color: '#091f3f' }}>
                  Please do not refresh page or close tab.
                </p>
                <div>
                  <div className="spinner-border"></div>
                </div>
              </div>
            </Dialog>
          }

          <Dialog
            title="Please Wait..."
            // icon="warning-sign"
            style={{
              color: '#3fa1f3',
              textAlign: "center"
            }}
            isOpen={this.state.isDialogOpenBid}
            isCloseButtonShown={false}
          >
            <div className="text-center">
              {/* <BarLoader color="#e84747" height="2" /> */}
              <br />
              <h4 style={{ color: '#3fa1f3', fontSize: '16px' }}> Bid accepting in progress, Please wait for a while.</h4>
              <p style={{ color: '#091f3f' }}>
                Please do not refresh page or close tab.
              </p>
              <div>
                <div className="spinner-border"></div>
              </div>
            </div>
          </Dialog>

          <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/subback.jpg")`, backgroundSize: 'cover' }}>
            <div className="center-y relative text-center">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1> {this.state.selectedTab == 1 ?
                      "Portfolio" : this.state.selectedTab == 2 ?
                        "Bids" : this.state.selectedTab == 3 ?
                          "Transaction History" : this.state.selectedTab == 5 ?
                            "Account Setting" : this.state.selectedTab == 6 ?
                              "Collections" : this.state.selectedTab == 7 ?
                                "Royalties" : 'My Profile'
                    } </h1>
                  </div>
                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </section>
          <section aria-label="section" className='py-5'>
            <div className="container">
              <div className=" wow fadeIn">
                <div className="row">
                  {/* <div className="col-sm-3 col-xs-12">
                    <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist">
                      <button className="nav-link" data-bs-toggle="pill" type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false"><a href={`${config.baseUrl}UserProfile/` + this.loginData?.data?.id}>My Profile</a></button>
                      <button onClick={this.setTabAPI.bind(this, '1')} className={this.state.selectedTab == '1' ? "nav-link active" : "nav-link"} id="portfolio" data-bs-toggle="pill" data-bs-target="#protfolio_tabs" type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false">Portfolio</button>
                      <button onClick={this.setTabAPI.bind(this, '2')} className={this.state.selectedTab == '2' ? "nav-link active" : "nav-link"} id="purchased-bids-tab" data-bs-toggle="pill" data-bs-target="#purchased-bids" type="button" role="tab" aria-controls="purchased-bids" aria-selected="false">Bids</button>
                      <button onClick={this.setTabAPI.bind(this, '3')} className={this.state.selectedTab == '3' ? "nav-link active" : "nav-link"} id="transitions-history-tabs" data-bs-toggle="pill" data-bs-target="#transitions-historys" type="button" role="tab" aria-controls="transitions-historys" aria-selected="false">Transaction History</button>
                      <button onClick={this.setTabAPI.bind(this, '5')} className={this.state.selectedTab == '5' ? "nav-link active" : "nav-link"} id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">Account Setting</button>

                      <button onClick={this.setTabAPI.bind(this, '6')} className={this.state.selectedTab == '6' ? "nav-link active" : "nav-link"} id="Collections-tab" data-bs-toggle="pill" data-bs-target="#Collections" type="button" role="tab" aria-controls="Collections" aria-selected="true">Collections</button>

                      <button onClick={this.setTabAPI.bind(this, '7')} className={this.state.selectedTab == '7' ? "nav-link active" : "nav-link"} id="Royalties-tab" data-bs-toggle="pill" data-bs-target="#Royalties" type="button" role="tab" aria-controls="Royalties" aria-selected="true">Royalties</button>


                    </div>
                  </div> */}
                  <div className="col-sm-12 col-xs-10">
                    <div className="tab-content create-collection pt-0" id="v-pills-tabContent">
                      <div className={this.state.selectedTab == '1' ? "tab-pane fade show active" : "tab-pane fade"} id="protfolio_tabs" role="tabpanel" aria-labelledby="portfolio">
                        <div className="row">
                          <div className='col-md-4'></div>
                          <div className="col-md-4">
                            <div className=" de-flex for-up">
                              <div className="de-flex-col">
                                <div className=" profile_setting">
                                  {!this.state.aboutData?.profile_pic || this.state.aboutData?.profile_pic === '' || this.state.aboutData?.profile_pic === null || this.state.aboutData?.profile_pic === 'null' || this.state.aboutData?.profile_pic === undefined || this.state.aboutData?.profile_pic === 'undefined' ?
                                    <img src="images/default-user-icon.jpg" style={{ display: "flex", margin: "auto" }} alt="" />
                                    :
                                    <img src={`${config.imageUrl1}` + this.state.aboutData?.profile_pic} alt="" />
                                  }
                                  <div className="profile_name">
                                    <h4>
                                      {/* {this.state.aboutData?.full_name} */}
                                      {/* <span className="profile_username">{this.state.aboutData?.user_name}</span> */}
                                      <div className='profileinnerbox'>
                                        <span id="wallet" className="profile_wallet">{this.state.aboutData?.full_name} </span>
                                        {this.walletType ?
                                          <CopyToClipboard text={this.state.aboutData?.address}
                                            onCopy={() => this.setState({ copied: true })}>
                                            <div className='copybtnbox'>
                                              <span>{this.walletType?.toString().substring(0, 4) + '...' + this.walletType?.toString().substr(this.walletType.length - 4)}</span>
                                              <button id="btn_copy" title="Copy Text">{this.state.copied ? <span className="cpbtn">Copied!</span> : 'Copy'}</button>
                                            </div>
                                          </CopyToClipboard> : ''
                                        }

                                      </div>
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='col-md-4'></div>
                          <div className="col-md-12">
                            <div className="de_tab tab_simple">
                              <ul className="de_nav py-4">
                                <li onClick={this.getMyNftAPI.bind(this, 1)} className={this.state.nftType == '1' ? 'active' : ''}><span><img src='images/own.png' />Owned</span></li>
                                {/* <li onClick={this.getMyNftAPI.bind(this, 2)} className={this.state.nftType == '2' ? 'active' : ''}><span><img src='images/create.png' />Created</span></li> */}
                                <li onClick={this.getMyNftAPI.bind(this, 3)} className={this.state.nftType == '3' ? 'active' : ''} ><span><img src='images/sale.png' />Sale Listing</span></li>
                                <li onClick={this.getMyNftAPI.bind(this, 4)} className={this.state.nftType == '4' ? 'active' : ''}><span><img src='images/fav.png' />Favourites</span></li>
                              </ul>
                              <div className="de_tab_content">
                                <div className="tab-1" style={{ display: this.state.nftType === 1 ? 'block' : 'none' }}>
                                  <div className="row">
                                    {this.state.myNftData.length > 0 ?
                                      this.state.myNftData.map(item => (

                                        <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                          <div className="nft__item">
                                            <div className="author_list_pp">
                                              <a href={`${config.baseUrl}collections/` + item.collection_id} >
                                                {!item.collection_profile_pic ?
                                                  ""
                                                  :
                                                  <img className="lazys" src={`${config.imageUrl1}` + item.collection_profile_pic} alt="" />
                                                }
                                              </a>
                                              {item.is_verified == '1' ?
                                                <i className="fa fa-check"></i>
                                                : ""
                                              }


                                              {this.loginData?.data?.id == item.owner_id ?
                                                item.is_on_sale == 1 ?
                                                  <div style={{ float: 'right', padding: "10px" }}>
                                                    <a onClick={this.cancelOrder.bind(this, item)} className=' btn-primary btn-sm text-white putonsale' href="javascript:void(0)"> Cancel listing </a>
                                                  </div>
                                                  :
                                                  <>
                                                    <div style={{ float: 'right', padding: "10px" }}>
                                                      <Link to={`${config.baseUrl}editNft/` + item.item_id} className=' btn-primary btn-sm text-white putonsale'> <i className="fa fa-edit"></i> </Link>&nbsp;
                                                      <a onClick={this.putOnSaleModelAPI.bind(this, item, 1)} className=' btn-primary btn-sm text-white putonsale' data-toggle="modal" data-target="#putOnSale" href="javascript:void(0)"> Put on sale </a>

                                                    </div>
                                                  </>
                                                : ""}
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
                                              <div className="nft__item_like" style={item.is_liked === 0 ? { color: '#ddd', cursor: 'pointer', left: '-10px', top: '0' } : { color: '#EC7498', cursor: 'pointer', left: '-10px', top: '0' }}>
                                                <i className="fa fa-heart" style={{ color: "#c83ea1" }} onClick={e => this.likeCount(item)}></i>&nbsp; &nbsp;<span style={{ color: "#000" }}>{item.like_count}</span>
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

                                <div className="tab-2" style={{ display: this.state.nftType === 2 ? 'block' : 'none' }}>

                                  <div className="row">
                                    {this.state.myNftData.length > 0 ?
                                      this.state.myNftData.map(item => (
                                        <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12">
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

                                        </div>
                                      ))
                                      : <div style={{ textAlign: 'center' }}>
                                        <img style={{ width: '150px', height: '150px' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKd2o9atcvkhYF6qRh-6-vfcThr1SR0hnW0DmFSZ56otUyCKtKN_oeUbht4WmVl5JKsj4&usqp=CAU' /><br /><br />
                                        <p><b>No Items To Display</b></p>
                                      </div>}
                                  </div>
                                </div>

                                <div className="tab-3" style={{ display: this.state.nftType === 3 ? 'block' : 'none' }}>
                                  <div className="row">
                                    <ReactDatatable
                                      config={this.configs}
                                      records={this.state.saleHistory}
                                      columns={this.salecolumns}
                                    />
                                  </div>
                                </div>

                                {this.state.nftType == '4' ?
                                  <div className="tab-4">
                                    <div className="row">

                                      {this.state.FavouritesHistory.length > 0 ?
                                        this.state.FavouritesHistory.map(item => (

                                          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">

                                            <div className="nft__item">
                                              <div className="author_list_pp">
                                                <a href={`${config.baseUrl}collections/` + item.collection_id} >
                                                  {!item.owner_profile_pic ?
                                                    ""
                                                    :
                                                    <img className="lazys" src={`${config.imageUrl1}` + item.collection_profile_pic} alt="" />
                                                  }
                                                </a>
                                                {item.is_verified == '1' ?
                                                  <i className="fa fa-check"></i>
                                                  : ""
                                                }

                                                <div className="nft__item_wrap mycollection_nft">
                                                  {item.file_type == 'video' ?
                                                    <video muted autoPlay width="100%" height="auto" controls>
                                                      <source src={`https://ipfs.io/ipfs/` + item.image} type="video/mp4" />
                                                    </video>
                                                    :
                                                    <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
                                                      <img className="lazy nft__item_preview" style={{ marginTop: '15px' }} src={`https://ipfs.io/ipfs/` + item.image} alt="" />
                                                    </Link>
                                                  }
                                                </div>
                                                <Link to={`${config.baseUrl}nftDetail/` + item.item_id}>
                                                  <div className="nft__item_info">

                                                    {item.name ?
                                                      item.name.length > MAX_LENGTH ?
                                                        (
                                                          <h4 style={{ color: "#000" }}>{`${item.name.substring(0, MAX_LENGTH)}..`} <small className="pull-right" style={{ color: "#000" }}>{item.is_on_sale == 0 ? "" : "Price"}</small></h4>
                                                        ) :
                                                        <h4 style={{ color: "#000" }}>{item.name} <small className="pull-right" style={{ color: "#000" }}>{item.is_on_sale == 0 ? "Price" : "Price"}</small></h4>
                                                      : ""}

                                                    {/* <h4>{item.name}<small className="pull-right">Price</small></h4> */}
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
                                                </Link>
                                                <div className="nft__item_like" style={item.is_liked === 0 ? { color: '#ddd', cursor: 'pointer', left: '-10px', top: '0' } : { color: '#EC7498', cursor: 'pointer', left: '-10px', top: '0' }}>
                                                  <i className="fa fa-heart" style={{ color: "#c83ea1" }} onClick={e => this.likeCount(item)}></i><span style={{ color: "#000" }}>{item.like_count}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))
                                        : <div style={{ textAlign: 'center' }}>
                                          <img style={{ width: '150px', height: '150px' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKd2o9atcvkhYF6qRh-6-vfcThr1SR0hnW0DmFSZ56otUyCKtKN_oeUbht4WmVl5JKsj4&usqp=CAU' /><br /><br />
                                          <p><b>No Items To Display</b></p>
                                        </div>}
                                    </div>
                                  </div> : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={this.state.selectedTab == '5' ? "tab-pane fade show active" : "tab-pane fade"} id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                        <div className="info-block style-1 ">
                          <div className="be-large-post-align ">
                            <h3 className="info-block-label">Profile</h3>
                          </div>
                        </div>
                        <div className="be-large-post">
                          <div className="row">

                            <div className="col-sm-12 ">

                              <div className="upload-cover">
                                <h4>Banner  </h4>
                                <div className='banner-dummy'>
                                  <div className="w-32 h-32 mb-1  rounded-lg overflow-hidden relative bg-gray-100" >

                                    {this.state.banner_preview === '' ?
                                      this.state.aboutData?.banner === null || this.state.aboutData?.banner === 'null' ?
                                        <img style={{ height: '150px', width: '100%' }} className="object-cover w-full h-32" src="images/dummy-banner.png" alt="" /> :
                                        <img style={{ height: '150px', width: '100%' }} className="object-cover w-full h-32" src={`${config.imageUrl1}${this.state.aboutData?.banner}`} alt="" /> :
                                      <img style={{ height: '150px', width: '100%' }} id="image" className="object-cover w-full h-32" src={this.state.banner_preview} />
                                    }
                                    <div className="absolute top-0 left-0 right-0 bottom-0 w-full block cursor-pointer flex items-center justify-center" type="file" >
                                      {this.state.aboutData?.banner === '' ?
                                        <button type="button" style={{ backgroundColor: '#ffffff6e' }} className="hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded-lg shadow-sm">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-camera" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x={0} y={0} width={24} height={24} stroke="none" />
                                            <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                            <circle cx={12} cy={13} r={3} />
                                          </svg>
                                        </button>
                                        : ""}
                                      <input id="fileInput" onChange={this.bannerPicChange.bind(this)} className="hidden" type="file" name="banner_pic" accept=".png,.jpg,.jpeg" />
                                    </div>

                                  </div>
                                </div>
                              </div>
                              <div className="profile" style={{ position: 'relative', marginTop: '-128px', marginLeft: 'auto', zIndex: '0', top: '40px', width: '113px', marginRight: 'auto' }}>
                                {/* <h4>Profile</h4> */}
                                <div className="w-32 h-32 mb-1  rounded-lg overflow-hidden relative bg-gray-100">
                                  {this.state.image_preview === '' ?
                                    this.state.aboutData?.profile_pic === null || this.state.aboutData?.profile_pic === 'null' ?
                                      <img style={{ height: '113px', width: '113px', borderRadius: '50%' }} className="object-cover w-full h-32" src="images/default-user-icon.jpg" alt="" />
                                      :
                                      <img style={{ height: '113px', width: '113px', borderRadius: '50%' }} className="object-cover w-full h-32" src={`${config.imageUrl1}${this.state.aboutData?.profile_pic}`} alt="" /> :
                                    <img style={{ height: '113px', width: '113px', borderRadius: '50%' }} id="image" className="object-cover w-full h-32" src={this.state.image_preview} />
                                  }

                                  <div className="absolute top-0 left-0 right-0 bottom-0 w-full block cursor-pointer flex items-center justify-center" onclick="document.getElementById('fileInput').click()">
                                    {this.state.aboutData?.profile_pic === '' ?
                                      <button type="button" style={{ backgroundColor: '#ffffff6e' }} className="hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded-lg shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-camera" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                          <rect x={0} y={0} width={24} height={24} stroke="none" />
                                          <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                          <circle cx={12} cy={13} r={3} />
                                        </svg>
                                      </button>
                                      : ""}
                                  </div>
                                  <input name="profile_pic" onChange={this.profilePicChange.bind(this)} id="fileInput" accept="image/*" className="hidden" type="file" />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <h2 className="mt-5 mb-5">Create Collection</h2> */}
                          <div className="spacer-single" />
                          <div className="socail_news mt-5">
                            <h5>Name</h5>
                            <input type="text" name="full_name" onChange={this.handleChange1} value={this.state.aboutData?.full_name} className="form-control mb-4" maxLength="50" />
                          </div>

                          <div className="socail_news">
                            <h5>Email</h5>
                            <input type="email" name="email" onChange={this.handleChange1} value={this.state.aboutData?.email} className="form-control mb-4" maxLength="50" />
                          </div>

                          <div className="socail_news">
                            <h5>Description</h5>
                            <textarea rows="3" name="description" onChange={this.handleChange1} value={this.state.aboutData?.description} className="form-control mb-4" maxLength="250" />
                          </div>

                          <div className="social-icons mt-1" style={{ backgroundSize: 'cover' }}>
                            <h5>Link social media</h5>
                            <div className="be-large-post-align">
                              <div className="social-input form-group focus-2 mt-2">
                                <div className="s_icon">
                                  <a className="social-btn color-1" href="#"><i className="fa fa-facebook" /></a>
                                </div>
                                <div className="s_input">
                                  <input className="form-control" type="text" placeholder='Enter Facebook Url' name="facebook" onChange={this.handleChange1} value={this.state.aboutData.facebook} />
                                </div>
                              </div>
                              <div className="social-input form-group focus-2 mt-2">
                                <div className="s_icon">
                                  <a className="social-btn color-2" href="#"><i className="fa fa-twitter" /></a>
                                </div>
                                <div className="s_input">
                                  <input className="form-control" type="text" placeholder='Enter Twitter Url' name="twitter" onChange={this.handleChange1} value={this.state.aboutData.twitter} />
                                </div>
                              </div>
                              <div className="social-input form-group focus-2 mt-2">
                                <div className="s_icon">
                                  <a className="social-btn color-3" href="#"><i className="fa fa-telegram " /></a>
                                </div>
                                <div className="s_input">
                                  <input className="form-control" type="text" placeholder='Enter Telegram Url' name="telegram" onChange={this.handleChange1} value={this.state.aboutData.telegram} />
                                </div>
                              </div>
                              <div className="social-input form-group focus-2 mt-2">
                                <div className="s_icon">
                                  <a className="social-btn color-5" href="#"><i className="fa fa-instagram" /></a>
                                </div>
                                <div className="s_input">
                                  <input className="form-control" type="text" placeholder='Enter Instagram Url' name="insta" onChange={this.handleChange1} value={this.state.aboutData.insta} />
                                </div>
                              </div>
                              <div className="social-input form-group focus-2 mt-2">
                                <div class="s_icon"><a class="social-btn color-5" href="#">
                                  <img className='discord' src='images/discord1.png' alt="discord"/>
                                  </a></div>
                                {/* <div className="s_icon">
                                  <a className="social-btn color-5" href="#">
                                    <div className="discord-img"><img src="images/discord.png" /></div>
                                  placeholder='Enter Url' </a>
                                </div> */}
                                <div className="s_input">
                                  <input className="form-control" type="text" placeholder='Enter Discord Url' name="discord" onChange={this.handleChange1} value={this.state.aboutData.discord} />
                                </div>
                              </div>
                            </div>

                          </div>
                          <div className="socail_news mt-4">
                            <button id="submit" className="btn-main" type="submit" onClick={this.updateProfileDetails}  >Update</button>
                          </div>
                        </div>

                        {/* <div className="security-authentication mt-4">
                          <div className="info-block style-1">
                            <div className="be-large-post-align ">
                              <h3 className="info-block-label">Security and Authentication</h3>
                            </div>
                          </div>
                          <div className="be-large-post">
                            <div className="row">
                              <div className="col-sm-6">
                                <div className="socail_news">
                                  <h5>Two-Factor Authentication with Email</h5>
                                  <p>Two-Factor Authentication (2FA) is an extra layer of security to ensure that only you have the ability to log in.</p>
                                  <input type="number" value={this.state.twoAuthenticationData.SecretKey} onChange={this.handleTwoWay}
                                    name="SecretKey" className="" onKeyDown={this.formatInput} />
                                  <br />
                                </div>
                              </div>
                              <div className="col-sm-6 text-center">
                                <img src={this.state.twoAuthenticationData.QR_code} className="img-responsive" />
                              </div>
                              <p>{this.state.twoAuthenticationData?.enableTwoFactor == 1 ?
                                "Status: Enable" : "Status: Disable"
                              }</p>
                              <div className="col-sm-12">
                                <div className="socail_news mt-0" style={{ backgroundSize: 'cover' }}>
                                  <button disabled={!this.state.twoAuthenticationData.SecretKey} type="submit" onClick={this.twoAuthenticationVerifyAPI} className="btn-main ">Submit</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>

                      <div className={this.state.selectedTab == '3' ? "tab-pane fade show active" : "tab-pane fade"} id="transitions-historys" role="tabpanel" aria-labelledby="transitions-history-tabs">
                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                          <li className="nav-item" role="presentation">
                            <button className="nav-link active with_border" id="pills-home-tabs" data-bs-toggle="pill" data-bs-target="#pills-homes" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Purchase History</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            {/* <button className="nav-link with_border" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Sale History</button> */}
                          </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                          <div className="tab-pane fade show active" id="pills-homes" role="tabpanel" aria-labelledby="pills-home-tabs">
                            <ReactDatatable
                              config={this.configForPurchase}
                              records={this.state.getUserPurchaseData}
                              columns={this.columnsForPurchase}
                            />
                          </div>
                          <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                            <ReactDatatable
                              config={this.configForSale}
                              records={this.state.getUserSaleData}
                              columns={this.columnsForSale}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={this.state.selectedTab == '2' ? "tab-pane fade show active" : "tab-pane fade"} id="purchased-bids" role="tabpanel" aria-labelledby="purchased-bids-tab">
                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                          <li className="nav-item" role="presentation">
                            <button className="nav-link active with_border" id="your-purchased-tab" data-bs-toggle="pill" data-bs-target="#your-purchased" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Bid Placed</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            {/* <button className="nav-link with_border" id="your-bids-tab" data-bs-toggle="pill" data-bs-target="#your-bids" type="button" role="tab" aria-controls="your-bids" aria-selected="false">Bid Received</button> */}
                          </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                          <div className="tab-pane fade show active" id="your-purchased" role="tabpanel" aria-labelledby="your-purchased-tab">
                            <ReactDatatable
                              config={this.configForUserBid}
                              records={this.state.getBidPlacedHistoryData}
                              columns={this.columnsForUserBid}
                            />
                          </div>
                          <div className="tab-pane fade" id="your-bids" role="tabpanel" aria-labelledby="your-bids-tab">
                            <ReactDatatable
                              config={this.configForNftBidReceived}
                              records={this.state.getBidReceivedNftHistoryData}
                              columns={this.columnsForNftBidReceived}
                            />
                          </div>
                        </div>
                      </div>





                      <div className={this.state.selectedTab == '7' ? "tab-pane fade show active" : "tab-pane fade"} id="Royalties" role="tabpanel" aria-labelledby="Royalties-tab">
                        <div className="info-block style-1  mt-2">
                          <div className="be-large-post-align ">
                            <h3 className="info-block-label d-inline">Royalties</h3>
                          </div>
                        </div>
                        <div className="be-large-post">
                          <ReactDatatable
                            config={this.configRoyalties}
                            records={this.state.getRoyaltiesData}
                            columns={this.columnsRoyalties}
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>

        <div className={this.state.isSocial === 0 ? "modal fade" : "modal fade show"} id="productShareSheet" style={{ display: this.state.isSocial === 0 ? 'none' : 'block' }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Bids Details</h5>
                <button type="button" className="close" data-dismiss="modal" style={{
                  fontSize: '26px'
                }} aria-label="Close" onClick={this.modalShow.bind(this, 0)} >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-striped mb-0">
                    <thead>
                      <tr>

                        <th>Image</th>
                        <th>Username</th>
                        <th>Title</th>
                        <th>Bid Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.getNftBidDetailsData.length === 0 ?
                        <tr >
                          <td colspan="6" className="text-center"><p>No data found!!</p></td></tr> :
                        this.state.getNftBidDetailsData.map(item => (
                          <tr>
                            <td><img width="50px" height="50px" src={`${config.imageUrl1}` + item.profile_pic}></img></td>
                            <td>{item.full_name}</td>
                            <td>{item.item_name}</td>
                            <td>{item.bid_price} BNB</td>
                            <td>
                              <button type='submit' id={'acceptId' + item.bid_id} onClick={this.BidAcceptAPI.bind(this, item)} className="btn btn-primary acceptId">Accept</button>
                            </td>
                          </tr>
                        ))}
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={this.state.isPutonSale === 0 ? "modal fade" : "modal fade show"} id="putOnSale" style={{ display: this.state.isPutonSale === 0 ? 'none' : 'block' }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
          <div className="modal-dialog" role="document">

            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel"> Put On Sale </h5>
                <a type="button" className="close" data-dismiss="modal" style={{
                  fontSize: '26px'
                }} aria-label="Close" onClick={this.modalShow.bind(this, 0)} >
                  <span aria-hidden="true">&times;</span>
                </a>
              </div>

              <div className="modal-body">
                <div className="de_tab tab_methods">
                  <div className="de_tab_content">
                    {this.state.nftData?.sell_type === 1 ?
                      <>
                        <p style={{ color: 'red' }}>List price and listing schedule can not be edited once the item is listed. You will need to cancel your listing and relist the item with the updated price and dates.</p>
                        <h5>NFT Type : Price</h5>
                        <h5>Price</h5>
                        <input type="text" disabled value={this.state.nftData?.price} name="price" id="item_price_bid" className="form-control" placeholder="Enter Price" />
                      </>
                      :
                      this.state.nftData?.sell_type === 2 ?
                        <>
                          <p style={{ color: 'red' }}>List price and listing schedule can not be edited once the item is listed. You will need to cancel your listing and relist the item with the updated price and dates.</p>
                          <h5>NFT Type : Auction</h5>
                          <h5>Minimum bid</h5>
                          <input type="text" name="minimum_bid_amount" disabled value={this.state.nftData?.price} id="item_price_bid" className="form-control" placeholder="Enter Minimum Bid" />
                          <div className="spacer-10" />
                          <div className="row">
                            <div className="col-md-6">
                              <h5>Starting date</h5>
                              <DatePicker className="form-control" name="start_date" disabled value={this.state.nftData?.start_date1 ? this.state.nftData?.start_date1 : ''} />
                            </div>
                            <div className="col-md-6">
                              <h5>Expiration date</h5>
                              <DatePicker className="form-control" name="expiry_date" minDate={this.state.endDate} disabled value={this.state.nftData?.expiry_date1 ? this.state.nftData?.expiry_date1 : ''} />

                            </div>
                            <div className="spacer-single" />
                          </div>
                        </>
                        :

                        ""
                    }
                  </div>
                </div>
                <div className="spacer-10" />
                {this.state.spinLoader === '0' ?
                  <input type="submit" onClick={this.approveNFT.bind(this, this.state.nftData)} value="Approve" id="submit" className="btn-main mt-2" defaultValue="Create Item" />
                  :
                  <button disabled className="btn-main mt-2" id="deposit-page" >Processing &nbsp; <i className="fa fa-spinner fa-spin validat"></i></button>
                }
                <div className="spacer-single" />
              </div>
            </div>

          </div>
        </div>

        <div className={this.state.isTransferNft === 0 ? "modal fade" : "modal fade show"} id="transferNft" style={{ display: this.state.isTransferNft === 0 ? 'none' : 'block' }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Transfer NFT</h5>
                <button type="button" className="close" data-dismiss="modal" style={{
                  fontSize: '26px'
                }} aria-label="Close" onClick={this.modalShow.bind(this, 0)} >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="spacer-10" />
                <h5>Address</h5>
                <input type="text" onChange={this.handleChange} value={this.state.transferNftAddress} name="transferNftAddress" className="form-control" placeholder="Enter address" />
                <div className="spacer-10" />
                {this.state.spinLoader === '0' ?
                  <input type="submit" disabled={!this.state.transferNftAddress} onClick={this.transferNftAPI.bind(this, this.state.nftData)} value="Submit" id="submit" className="btn-main" defaultValue="Create Item" />
                  :
                  <button disabled className="btn-main" id="deposit-page" >Transfer NFT &nbsp; <i className="fa fa-spinner fa-spin validat"></i></button>
                }
                <div className="spacer-single" />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    )
  }
}
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import axios from 'axios';
import config from '../config/config';
import { Player } from 'video-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon, EmailIcon, EmailShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Web3 from 'web3';
import Swal from 'sweetalert2'
import Cookies from 'js-cookie';
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import Countdown, { zeroPad } from 'react-countdown';
import moment from 'moment'

const MAX_LENGTH = 10;

export default class nftdetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      nftDetails: '',
      maxBid: '',
      isResponse: false,
      shareUrl: 1,
      getMarketActivityList: [],
      getMarketActivityList1: [],
      isDialogOpen: false,
      modalopen: '',
      bid_price: '',
      Biderror: '',
      loginData: (!Cookies.get('lordsNFTleUserloginSuccess')) ? [] : JSON.parse(Cookies.get('lordsNFTleUserloginSuccess'))

    }
    this.onChange = this.onChange.bind(this)


  }

  componentDidMount() {
    this.getDetail(0)
    this.getMarketplaceActivityAPI()
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }


  async getMarketplaceActivityAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getMarketActivity`,
      data: { "item_id": this.props.match.params.id }
    }).then(result => {
      if (result.data.success === true) {
        this.setState({
          getMarketActivityList: result.data.response,
          getMarketActivityList1: result.data.response.filter(item => item.transaction_type_id == 4),

        })
        console.log('getMarketActivityList1', this.state.getMarketActivityList1)
      }
      else if (result.data.success === false) {
        this.setState({
          getMarketActivityList: [],
          getMarketActivityList1: [],

        })
      }
    }).catch(err => {
      this.setState({
        getMarketActivityList: [],
        getMarketActivityList1: [],

      })

    });
  }


  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  closebutton() {
    this.setState({
      modalopen: '',
    })
  }



  async getDetail(itemLike) {
    this.setState({
      isResponse: true
    })

    await axios({
      method: 'post',
      url: `${config.apiUrl}itemDetail`,
      data: {
        "user_id": this.state.loginData?.data?.id ? this.state.loginData?.data?.id : "0",
        "item_id": this.props.match.params.id,
        "itemLike": itemLike
      }
    }).then((res) => {
      if (res.data.success === true) {

        let time = res.data.response.expiry_date;
        time = new Date(time);
        time = time.getTime();
        let cc = new Date();
        cc = cc.getTime();
        var diff = Math.round(parseInt(time) / 1000) - (parseInt(cc) / 1000);

        if (diff <= (24 * 3600)) {
          this.setState({
            timerStart: true
          })
        }

        let startTime = res.data.response.start_date;
        startTime = new Date(startTime);
        startTime = startTime.getTime();
        let curDate = new Date();
        curDate = curDate.getTime();
        var diff1 = Math.round(parseInt(startTime) / 1000) - (parseInt(curDate) / 1000);

        if (diff1 <= (24 * 3600)) {
          this.setState({
            startTimerStart: true
          })
        }

        this.setState({
          nftDetails: res.data.response,
          maxBid: parseFloat(res.data.response?.max_bid).toFixed(6),
          bidIncreasePercentage: res.data.settingData?.bid_increase_percentage,
          isResponse: false
        })
      }

    }).catch((error) => {

    })
  }


  async likeCount(item_id) {
    if (this.state.loginData && this.state.loginData?.data?.id) {
      await axios({
        method: 'post',
        url: `${config.apiUrl}likeitem`,
        data: {
          "user_id": this.state.loginData?.data?.id,
          "item_id": item_id
        }
      }).then((res) => {
        if (res.data.success === true) {
          this.getDetail(1);
        }

      }).catch((error) => {

      })
    } else {
      toast.error('Please Login!!');
    }
  }

  //=======================================================================================================

  openshare(id) {
    if (id == 1) {
      this.setState({
        shareUrl: 2
      })
    }
    else if (id == 2) {
      this.setState({
        shareUrl: 1
      })
    }
  }

  //=======================================================================================================

  refreshClick() {
    window.location.reload()
  }




  async purchaseItem() {
    if (this.state.loginData.length == 0) {
      this.pleaselogin()
    } else {
      let tokenId = this.state.nftDetails.token_id;
      let tokenPrice = this.state.nftDetails.price;
      let coin = this.state.nftDetails.blockchainType;
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let web3 = new Web3(window.ethereum);
        let currentNetwork = web3.currentProvider.chainId;

        if (currentNetwork !== web3.utils.toHex(config.BNBChainId)) {
          toast.error(config.chainMessageBNB);
          this.setState({
            spinLoader: '0',
            isDialogOpen: false
          })
          return false;
        }
        try {
          tokenPrice = parseInt((parseFloat(tokenPrice)) * 10 ** 18);
          let from_address = accounts[0];
          var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
          var currentBal = parseFloat(getBalace).toFixed(6)
          if (currentBal < this.state.nftDetails.price) {
            toast.error(`Insufficient fund for transfer`);
            this.setState({
              spinLoader: '0',
              isDialogOpen: false
            })
            return false;
          }

          this.setState({
            spinLoader: 1,
            isDialogOpen: true
          })
          await this.trnasferNFT(tokenId, coin, tokenPrice);
        } catch (error) {
          toast.error('Something went wrong please try again2.');
          this.setState({
            spinLoader: 0,
            isDialogOpen: false
          })
          return false;
        }
      } else {
        toast.error('Please Connect to MetaMask.');
        this.setState({
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }
    }
  }

  async trnasferNFT(tokenId, coin, tokenPrice) {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      let web3 = new Web3(window.ethereum);
      var chainId = web3.currentProvider.chainId;
      try {

        let contractAddress = `${config.marketplaceContract}`
        let from_address = accounts[0];

        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        let tx_builder = '';
        let cryptoAmount = tokenPrice;
        let itemPrice = 0;

        itemPrice = tokenPrice / 10 ** 18;
        tx_builder = await contract.methods.buy(tokenId.toString());

        let encoded_tx = tx_builder.encodeABI();
        let gasPrice = await web3.eth.getGasPrice();

        let gasLimit = await web3.eth.estimateGas({
          gasPrice: web3.utils.toHex(gasPrice),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          value: web3.utils.toHex(cryptoAmount),
          data: encoded_tx
        });

        const txData = await web3.eth.sendTransaction({
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gasLimit),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          value: web3.utils.toHex(cryptoAmount),
          data: encoded_tx
        });

        if (txData.transactionHash) {
          var paymentArr = {
            txHash: txData.transactionHash,
            itemPrice: itemPrice,
            from_address: contractAddress,
            to_address: from_address,
            paymentType: coin,
          }
          this.buyItemAPI(paymentArr)
        } else {
          toast.error('Something went wrong please try again3.');
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
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }

    } else {
      toast.error('Please Connect to MetaMask.');
      this.setState({
        spinLoader: '0',
        isDialogOpen: false
      })
      return false;
    }
  }

  async buyItemAPI(paymentArr) {
    await axios({
      method: 'post',
      url: `${config.apiUrl}nftPurchase`,
      data: {
        "item_id": this.state.nftDetails?.item_id,
        "sell_type": this.state.nftDetails?.sell_type,
        "user_id": this.state.loginData?.data?.id,
        "owner_id": this.state.nftDetails?.owner_id,
        "user_name": this.state.loginData?.data?.full_name,
        "price": paymentArr.itemPrice,
        "cryptoPrice": this.state.nftDetails.price,
        "buyerAddress": paymentArr.from_address,
        "to_address": paymentArr.to_address,
        "tokenId": this.state.nftDetails?.token_id,
        "trx_amount": paymentArr.trx_amount,
        "trx_currency": this.state.paymentType,
        "trx_hash": paymentArr.txHash,
        "itemName": this.state.nftDetails?.name,
        "itemimage": this.state.nftDetails?.image,
        "owner_address": this.state.nftDetails?.owner_address,
        "trx_type": "Crypto"
      }
    }).then(async response => {
      if (response.data.success === true) {
        toast.success(response.data.msg);
        setTimeout(() => {
          window.location.href = `${config.baseUrl}`
        }, 2000);
      } else {
        toast.error(`Something went wrong! Please try again.`);
      }
      this.setState({
        nftPurchaseBtn: 0
      })
    }).catch(err => {
      toast.error(`Something went wrong! Please try again.`);
      this.setState({
        nftPurchaseBtn: 0
      })
    });
  }



  async pleaselogin() {
    await Swal.fire({
      icon: 'error',
      title: 'Oops',
      text: "Please Login to your Account"
    })
    window.location.href = `${config.baseUrl}` + "login"
  }



  async bidItem(id) {
    if (this.state.loginData.length == 0) {
      this.pleaselogin()
    }
    else if (id === 2) {
      this.setState({
        modalopen: 1
      })
    }
  }



  async bidPlaced() {
    if (this.state.loginData.length == 0) {
      this.pleaselogin()
    } else {
      let tokenId = this.state.nftDetails.token_id;
      let tokenPrice = parseFloat(this.state.bid_price).toFixed(6);

      if ((parseFloat(this.state.maxBid).toFixed(6)) > tokenPrice) {
        toast.error('Bid amount should be higher than max bid amount!!');
        return false;
      }
      let coin = this.state.nftDetails.blockchainType;

      if (window.ethereum) {

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let web3 = new Web3(window.ethereum);
        let currentNetwork = web3.currentProvider.chainId;
        // let eth_mainnet = 0x1;
        // let eth_testnet = 0x4;

        // let matic_mainnet = 137;
        // let matic_testnet = 80001;

        if (coin == 1) {
          if (currentNetwork !== web3.utils.toHex(config.BNBChainId)) {

            toast.error(config.chainMessageBNB);
            this.setState({
              spinLoader: '0',
              isDialogOpen: false
            })
            return false;
          }
        } else {
          if (currentNetwork !== web3.utils.toHex(config.BNBChainId)) {

            toast.error(config.chainMessageBNB);
            this.setState({
              spinLoader: '0',
              isDialogOpen: false
            })
            return false;
          }
        }

        try {
          this.setState({
            spinLoader: '0',
            modalopen: '',
            isDialogOpen: true
          })

          if (coin == 1) {
            tokenPrice = parseInt((parseFloat(tokenPrice)) * 10 ** 18);
          } else {
            tokenPrice = parseInt((parseFloat(tokenPrice)) * 10 ** 18);
          }

          await this.placeBidNow(tokenId, coin, tokenPrice);
        } catch (error) {
          toast.error('Something went wrong please try again2.');
          this.setState({
            spinLoader: '0',
            isDialogOpen: false
          })
          return false;
        }
      } else {
        toast.error('Please Connect to MetaMask.');
        this.setState({
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }
    }
  }


  async placeBidNow(tokenId, coin, tokenPrice) {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      let web3 = new Web3(window.ethereum);
      var chainId = config.bnb_chain;
      try {

        let contractAddress = `${config.marketplaceContract}`
        let from_address = accounts[0];

        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        let tx_builder = '';
        tx_builder = await contract.methods.placeBid(tokenId.toString());

        let encoded_tx = tx_builder.encodeABI();
        let gasPrice = await web3.eth.getGasPrice();

        let gasLimit = await web3.eth.estimateGas({
          gasPrice: web3.utils.toHex(gasPrice),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          value: web3.utils.toHex(tokenPrice),
          data: encoded_tx
        });

        const txData = await web3.eth.sendTransaction({
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gasLimit),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          value: web3.utils.toHex(tokenPrice),
          data: encoded_tx
        });

        if (txData.transactionHash) {
          var paymentArr = {
            bidAmount: parseFloat(this.state.bid_price).toFixed(6),
            txHash: txData.transactionHash,
          }
          this.bidPlaceAPI(paymentArr)
        } else {
          toast.error('Something went wrong please try again3.');
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
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }
    } else {
      toast.error('Please Connect to MetaMask.');
      this.setState({
        spinLoader: '0',
        isDialogOpen: false
      })
      return false;
    }
  }

  async bidPlaceAPI(paymentArr) {
    await axios({
      method: 'post',
      url: `${config.apiUrl}insertBid`,
      data: {
        "bid_price": paymentArr.bidAmount,
        "user_id": this.state.loginData?.data?.id,
        "item_id": this.state.nftDetails?.item_id,
        "owner_id": this.state.nftDetails?.owner_id,
        "txhash": paymentArr.txHash,
      }
    }).then(async response => {
      if (response.data.success === true) {
        toast.success(response.data.msg);
        setTimeout(() => {
          window.location.href = `${config.baseUrl}`
        }, 2000);
      } else {
        toast.error(`Something went wrong! Please try again6.`);
      }
      this.setState({
        spinLoader: '0',
        isDialogOpen: false
      })
      this.setState({
        nftPurchaseBtn: 0
      })
    }).catch(err => {
      toast.error(`Something went wrong! Please try again7.`);
      this.setState({
        spinLoader: '0',
        isDialogOpen: false
      })
      this.setState({
        nftPurchaseBtn: 0
      })
    });
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

  render() {
    return (
      <>
        <Header />
        <ToastContainer />


        <Dialog
          title="Please Wait..."
          style={{
            color: '#590ba2',
            textAlign: "center"
          }}
          isOpen={this.state.isDialogOpen}
          isCloseButtonShown={false}
        >
          <div className="text-center pl-3 pr-3">
            < br />
            {this.state.nftDetails.sell_type == 1 ?
              <h4 style={{ color: '#590ba2', fontSize: '16px' }}>
                Buying process in progress, once process completed NFT will be show on portfolio page.
              </h4>
              :
              <h4 style={{ color: '#590ba2', fontSize: '16px' }}>
                Bidding process in progress, once process completed bid will be show on bids page.
              </h4>
            }

            <p style={{ color: '#091f3f' }}>
              Please do not refresh page or close tab.
            </p>
            <div>
              <div class="spinner-border"></div>
            </div>
          </div>
        </Dialog>

        <section className='profile py-5'>
          <div className='container'>
            <div className='row align-items-center mt-3'>
              <div className='col-md-6 col-sm-6 col-12'>
                <div className='proimg'>
                  <div className='colimgbox'>
                    <div id='mainvideonft'>
                      {this.state.nftDetails.file_type === 'image' ?
                        <img src={`${config.imageUrl}${this.state.nftDetails.image}`} className='img-fluid' alt="" /> :
                        this.state.nftDetails.file_type === 'video' ?
                          <Player className='img-fluid' src={`${config.imageUrl}${this.state.nftDetails.image}`} /> :
                          <img src={`${config.imageUrl}${this.state.nftDetails.image}`} className='img-fluid' alt="" />
                      }
                    </div>

                  </div>
                </div>
              </div>
              <div className='col-md-6 col-sm-6 col-12'>
                <div className='profiletext'>
                  <h2>{this.state.nftDetails.name}</h2>
                  {/* <h1>{this.state.nftDetails.description}</h1> */}
                  <div className='govindatbox'>
                    <div className='govindimg'>
                      <img src="assets/images/govindimg.png" alt="govindimg" />
                    </div>
                    <div className='creater'>
                      <h6>creator</h6>
                      <h5>{this.state.nftDetails.creator}</h5>
                    </div>
                  </div>
                  <div className='optionico'>
                    <ul>
                      <li><Link style={this.state.nftDetails.is_liked === 0 ? { color: '#fff', cursor: 'pointer' } : { color: '#EC7498', cursor: 'pointer' }}><span onClick={e => this.likeCount(this.state.nftDetails.item_id)}><i class="fa fa-heart" aria-hidden="true"></i></span>{this.state.nftDetails.like_count}</Link></li>
                      <li><Link to="#" onClick={this.openshare.bind(this, this.state.shareUrl)}>
                        <span data-toggle="modal" data-target="#productShareSheet"><i className="fa fa-share-alt"></i> Share</span>
                        {/* <span><i class="fa fa-share-alt" aria-hidden="true"></i></span>Share */}
                      </Link>
                      </li>
                      <li><Link to="#" onClick={this.refreshClick.bind(this)}><span><i class="fa fa-refresh" aria-hidden="true"></i></span>refresh</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        <section className='protabs pt-5'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-md-6 px-lg-5'>
                <div className="uploadtab">
                  <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="pills-homeone-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-homeone"
                        type="button"
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected="false"
                      >
                        Overview
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-profiletwo-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-profiletwo"
                        type="button"
                        role="tab"
                        aria-controls="pills-profile"
                        aria-selected="true"
                      >
                        Owners
                      </button>
                    </li>
                    {this.state.nftDetails.sell_type == 2 ?
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="pills-profiletwo-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-profilethree"
                          type="button"
                          role="tab"
                          aria-controls="pills-profile"
                          aria-selected="true"
                        >
                          Bids
                        </button>
                      </li> : ''
                    }

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-profiletwo-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-profilefour"
                        type="button"
                        role="tab"
                        aria-controls="pills-profile"
                        aria-selected="true"
                      >
                        History
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="tab-content" id="pills-tabContent">
                  <div className="tab-pane fade active show" id="pills-homeone" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                    <div className='createtext mb-4'>
                      <h3>Description</h3>
                      <p>{this.state.nftDetails.description}</p>
                    </div>
                    <div className='createtext'>

                      {this.state.nftDetails.sell_type == 2 ?
                        <div>
                          <h3>Latest bids</h3>
                          <div className='inrcreate'>
                            <h5>{this.state.maxBid > this.state.nftDetails.price ? this.state.maxBid + ' BNB' : ' No bids yet. Be  the first to place  a bid'}</h5>
                          </div>
                        </div> : ''
                      }

                      <h3>Details</h3>
                      <div className='inrcreate'>
                        <ul>
                          <li><a target="_blank" href={config.BNBAddressUrl + this.state?.nftDetails?.contract_address}><span><img src="images/bnbicon.png" alt="ethereum" /></span>Contract Address:{this.state?.nftDetails?.contract_address?.toString().substring(0, 4) + '...' + this.state?.nftDetails?.contract_address?.toString().substr(this.state?.nftDetails?.contract_address?.length - 4)}</a></li>

                          <li><Link href="#"><span><img src="images/bnbicon.png" alt="ethereum" /></span>Token Id : {this.state?.nftDetails?.token_id}</Link></li>
                          <li><Link href="#"><span><img src="images/bnbicon.png" alt="ethereum" /></span>BNB (ERC-721)</Link></li>
                          <li><a target="_blank" href={`${config.imageUrl}${this.state.nftDetails.image}`}><span><i class="fa fa-eye" aria-hidden="true"></i></span>Open original <span><i class="fa fa-long-arrow-up" aria-hidden="true"></i></span></a></li>
                          <li><a target="_blank" href={config.metadataUrl + this.state.nftDetails.token_id}><span><i class="fa fa-eye" aria-hidden="true"></i></span>Metadata</a></li>
                        </ul>

                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="pills-profiletwo" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                    <span><img src={`${config.imageUrl1}${this.state.nftDetails.owner_profile_pic}`} style={{ height: '50px', width: '50px' }}></img> <p>{this.state.nftDetails.owner}</p></span>
                  </div>
                  <div className="tab-pane fade" id="pills-profilethree" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                    <div className='container mt-5 px-0'>
                      <div className='col-sm-12'>
                        <div className='table-responsive'>
                          <table className='table table-striped mobile-none' width="100%">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Event</th>
                                <th>Price</th>
                                <th>From</th>
                                {/* <th>Address</th> */}
                                <th>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.getMarketActivityList1.length > 0 ?

                                this.state.getMarketActivityList1.map((item, i) => {
                                  return (
                                    <tr>
                                      <td>{i + 1}</td>
                                      <td>
                                        {item.transaction_type}
                                      </td>
                                      <td>
                                        {item.transaction_type_id != 2 ?
                                          `${item.amount} ${item.blockchainType == 2 ? ' Matic' : ' ETH'}` : ""
                                        }
                                      </td>
                                      <td>
                                        <Link to={`${config.baseUrl}UserProfile/` + item.user_id}>
                                          {item.full_name}
                                        </Link>
                                      </td>
                                      {/* <td>
                                  <a target="_blank" href={config.blockchinUrl + item.address}>
                                    <p title={item.address}>{item.address == null ? '' : item.address.toString().substring(0, 8) + '...' + item.address.toString().substr(item.address.length - 8)}</p>
                                  </a>
                                </td> */}
                                      <td>
                                        {item.transaction_date}
                                      </td>
                                    </tr>
                                  )
                                })
                                :
                                // <span className='text-center bg-grey'><img style={{ width: '100%' }} src='images/nodata-found.png' /></span>
                                <p>No Data Found</p>
                              }

                            </tbody>
                          </table>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="pills-profilefour" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                    <div className='container mt-5 px-0'>
                      <div className='col-sm-12'>
                        <div className='table-responsive'>
                          <table className='table table-striped mobile-none' width="100%">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Event</th>
                                <th>Price</th>
                                <th>From</th>
                                {/* <th>Address</th> */}
                                <th>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.getMarketActivityList.length > 0 ?
                                this.state.getMarketActivityList.map((item, i) => {
                                  return (
                                    <tr>
                                      <td>{i + 1}</td>
                                      <td>
                                        {item.transaction_type}
                                      </td>
                                      <td>
                                        {item.transaction_type_id != 2 ?
                                          `${item.amount} ${item.blockchainType == 2 ? ' Matic' : ' ETH'}` : ""
                                        }
                                      </td>
                                      <td>
                                        <Link to={`${config.baseUrl}UserProfile/` + item.user_id}>
                                          {item.full_name}
                                        </Link>
                                      </td>
                                      {/* <td>
                                  <a target="_blank" href={config.blockchinUrl + item.address}>
                                    <p title={item.address}>{item.address == null ? '' : item.address.toString().substring(0, 8) + '...' + item.address.toString().substr(item.address.length - 8)}</p>
                                  </a>
                                </td> */}
                                      <td>
                                        {item.transaction_date}
                                      </td>
                                    </tr>
                                  )
                                })
                                :
                                <span className='text-center bg-grey'><img style={{ width: '100%' }} src='images/nodata-found.png' /></span>
                              }

                            </tbody>
                          </table>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-6 px-lg-5'>
                <div className='createtext'>
                  <div className='inrcreate'>
                    <h4>Price</h4>
                    <h4>{this.state.nftDetails.price} BNB</h4>
                  </div>
                  {this.state.nftDetails.sell_type == 2 && this.state.nftDetails.is_on_sale == 1 ?
                    <div className='inrcreate'>
                      {new Date(this.state.nftDetails.start_date) > new Date() ?
                        <>
                          <div className='mb-2'>
                            <i className="fa fa-clock-o" aria-hidden="true" />&nbsp;
                            Sale start in <br />
                          </div>
                          {(this.state.nftDetails.start_date && this.state.startTimerStart) ?
                            <span style={{ fontSize: '20px' }}>
                              <Countdown
                                date={this.getTimeOfStartDate(this.state.nftDetails.start_date)}
                                renderer={this.CountdownTimer}

                              />
                            </span>
                            :
                            <>
                              {/* <span className="days">{moment(this.state.nftDetails.start_date).diff(moment(), 'days')} day </span> */}
                              <span style={{ fontSize: '20px' }}>
                                <Countdown
                                  date={this.getTimeOfStartDate(this.state.nftDetails.start_date)}
                                  renderer={this.CountdownTimer}
                                />
                              </span>

                            </>
                          }
                          &nbsp;
                          ({moment(this.state.nftDetails.start_date).format('LLL')})
                        </>
                        :
                        new Date(this.state.nftDetails.expiry_date) > new Date() ?
                          <>
                            <div className='mb-2'>
                              <i className="fa fa-clock-o" aria-hidden="true" />&nbsp;
                              Sale ends in &nbsp;
                            </div>
                            {(this.state.nftDetails.expiry_date && this.state.timerStart) ?
                              <span style={{ fontSize: '20px' }}>
                                <Countdown
                                  date={this.getTimeOfStartDate(this.state.nftDetails.expiry_date)}
                                  renderer={this.CountdownTimer}
                                /> </span> :
                              <>
                                {/* <span className="days">{moment(this.state.nftDetails.expiry_date).diff(moment(), 'days')} day </span> */}
                                <span style={{ fontSize: '20px' }}>
                                  <Countdown
                                    date={this.getTimeOfStartDate(this.state.nftDetails.expiry_date)}
                                    renderer={this.CountdownTimer}
                                  />   </span>
                              </>
                            }
                            &nbsp;
                            ({moment(this.state.nftDetails.expiry_date).format('LLL')})
                          </>
                          :
                          "Sale ends"
                      }
                    </div> : ''
                  }


                  {/* disabled={new Date(this.state.nftDetails.start_date) > new Date() || new Date(this.state.nftDetails.expiry_date) < new Date() || this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id || this.state.nftDetails?.is_on_sale == 0 ? true : false} onClick={this.bidItem.bind(this, this.state.nftDetails.sell_type)} */}
                  {this.state.nftDetails.is_on_sale == 1 ? 
                  <div className='buybntbox'>
                  {/* onClick={this.purchaseItem.bind(this, this.state.nftDetails.sell_type)} */}
                  {this.state.nftDetails.sell_type == 1 ?
                    <Link onClick={this.purchaseItem.bind(this, this.state.nftDetails.sell_type)}>{this.state.nftDetails.sell_type == 1 ? 'Buy' : 'Place Bid'} Now for {this.state.nftDetails.price} BNB</Link> :
                    <Link disabled={new Date(this.state.nftDetails.start_date) > new Date() || new Date(this.state.nftDetails.expiry_date) < new Date() || this.state.nftDetails.is_sold === 1 || this.state.loginData?.data?.id == this.state.nftDetails.owner_id || this.state.nftDetails?.is_on_sale == 0 ? true : false} onClick={this.bidItem.bind(this, this.state.nftDetails.sell_type)}>{this.state.nftDetails.sell_type == 1 ? 'Buy' : 'Place Bid'} Now for {this.state.nftDetails.price} BNB</Link>
                  }

                  {/* <Link href="#">Buy Now for 0.1 ETH</Link> */}
                </div>:''
                }
                  
                </div>
              </div>
            </div>
          </div>
        </section>



        <div className={this.state.shareUrl == 1 ? "modal fade" : "modal fade show"} id="productShareSheet" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false" style={{ display: this.state.shareUrl == 1 ? 'none' : 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Share this Creation</h5>
                <button type="button" className="close" onClick={this.openshare.bind(this, 2)} data-dismiss="modal" style={{
                  fontSize: '26px',
                  border: 'none',
                  background: '#fff'
                }} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="col-sm-12">
                  <div className="row text-center">


                    <div className="col-sm-2">

                    </div>
                    <div className="col-sm-8">

                      <div className="row">

                        <div className="d-inline-block col-sm-4 col-xs-4 text-center mb-3">

                          <FacebookShareButton
                            url={`${config.sharingUrl}${this.id}`}
                            quote={this.state.nftDetails?.name + '-' + "\n" + this.state.nftDetails?.description}

                            className="Demo__some-network__share-button">
                            <FacebookIcon target="_blank"
                              size={32}
                              round />
                          </FacebookShareButton>

                          <br />
                          <span className="mt-1 d-block">Facebook</span>
                        </div>

                        <div className="d-inline-block col-sm-4 col-xs-4 text-center mb-3 pb-1">

                          <TwitterShareButton
                            url={window.location.href}
                            title={this.state.nftDetails?.name + '-' + "\n" + this.state.nftDetails?.description}
                            className="Demo__some-network__share-button">
                            <TwitterIcon
                              size={32}
                              round />
                          </TwitterShareButton>
                          <br />
                          <span className="mt-1 d-block">Twitter</span>
                        </div>



                        <div className="d-inline-block col-sm-4 col-xs-4 text-center mb-3 pb-4">

                          <EmailShareButton
                            url={window.location.href}

                            subject={"Check out this Rare Digital Art Work from Gods NFT" + "\n" + this.state.nftDetails?.name + '-' + "\n" + this.state.nftDetails?.description}
                            body={"hey there, pls share my link" + <a href={window.location.href}></a>}
                            className="Demo__some-network__share-button">
                            <EmailIcon
                              size={32}
                              round />
                          </EmailShareButton>
                          <br />
                          <span className="mt-1 d-block">Email</span>
                        </div>


                      </div>
                    </div>
                    <div className="col-sm-2"></div>







                  </div>
                </div>
                <div className="row text-center">
                  <div className="col-sm-3"></div>
                  <div className="d-inline-block col-sm-3 col-xs-6 text-center mb-3 pb-1">
                    <WhatsappShareButton
                      url={window.location.href}
                      title={this.state.nftDetails?.name + '-' + "\n" + "Check out this Rare Digital Art Work from Infinity 8" + "\n" + this.state.nftDetails?.description + "\n"}
                      className="Demo__some-network__share-button">
                      <WhatsappIcon
                        size={32}
                        round />
                    </WhatsappShareButton>
                    <br />
                    <span className="mt-1 d-block">WhatsApp</span>
                  </div>
                  <div className="d-inline-block col-sm-3 col-xs-6 text-center mb-3 pb-1" style={{ margin: '-23px' }}>

                    <br />
                    <CopyToClipboard text={window.location.href}
                      onCopy={() => this.setState({ copied: true })}>
                      <img src="images/copy-link.png" style={{ cursor: 'pointer' }} className="link-copy" />
                    </CopyToClipboard>
                    {this.state.copied ? <span className="mt-1 d-block">Copied!</span> : <span className="mt-1 d-block">Copy link</span>}

                  </div>
                  <div className="col-sm-3"></div>


                </div>


              </div>

            </div>
          </div>
        </div>

        {/* //=======================================  Bid modal ===================================================== */}

        <div id="myModal" className={this.state.modalopen === '' ? "modal fade cart-modal" : "modal fade cart-modal show"} role="dialog" style={{ background: '0% 0% / cover rgba(6, 6, 6, 0.32)', display: this.state.modalopen === '' ? 'none' : 'block' }}
          data-backdrop="false">
          <div className="modal-dialog modal-dialog-centered" style={{ margin: 'auto', marginTop: '15px' }}>
            <div className="modal-content">
              <div className="" style={{ borderBottom: "1px solid transparent" }}>
                <button type="button" onClick={this.closebutton.bind(this)} className="close btnClose" data-dismiss="modal">&times;</button>
              </div>
              <div className="modal-body" style={{ padding: '0px' }}>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="row p-4">
                      <div className="">
                        <h4 className="strong payment-method-options">Offer Method</h4>
                      </div>
                      <div className="tab-wrapper style-1">

                        <div className="tabs-content clearfix">

                          <div class="tab-info active" style={{ display: 'block' }}>
                            <div className="col-12 mt-3">
                              <strong>Your offer must be greater than: {this.state.maxBid} </strong>
                            </div>
                            <div className="col-12 mt-3">
                              <div className="input-group">
                                <div className="input-group-prepend" style={{ backgroundColor: "#fff" }}>
                                  <span className="input-group-text"> {this.state.nftDetails?.blockchainType == 1 ? 'BNB' : 'MATIC'} </span>
                                </div>
                                <input type="text" className="form-control currency  ccbid-price"
                                  placeholder="Offer amount" onKeyPress={(event) => {
                                    if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                      event.preventDefault();
                                    }
                                  }} id="bidAmountCC" name="bid_price" value={this.state.bid_price} onChange={this.onChange} required="" />
                              </div>

                              {this.state.Biderror === 1 ?
                                <p style={{ color: 'red' }}>Bid price should be greater than {this.state.nftDetails?.max_bid}</p> : ''
                              }

                            </div>

                            <div className="mt-4">
                              <div className="col-12 nopadding">
                                <span style={{ color: 'red', fontFamily: 'cursive', textAlign: 'center' }}>{this.state.ErrorMessage}</span>

                                <div className="my-3 text-center">

                                  {(this.state.cryptoPayBtnDesable) ?
                                    <button className="btn-main btn-lg mb-3" title="Place Bid"
                                      mptrackaction="nux:giveapproval" disabled>Processing...</button>
                                    :
                                    <button className="btn-main btn-lg mb-3" title="Place Bid"
                                      mptrackaction="nux:giveapproval" disabled={parseFloat(this.state.bid_price ? this.state.bid_price : 0).toFixed(6) < parseFloat(this.state.maxBid).toFixed(6)}
                                      onClick={this.bidPlaced.bind(this)}>Place Bid</button>
                                  }

                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    )
  }
}
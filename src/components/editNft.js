import React, { Component } from 'react';
import axios from 'axios';
import Footer from './Footer';
import Header from './Header';
import config from '../config/config'
import { Player } from 'video-react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dialog, Classes } from "@blueprintjs/core";

export default class editNft extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            description: '',
            user_collection_id: '0',
            item_category_id: '0',
            royalty_percent: '0',
            methodType: '1',
            sell_type: '1',
            price: '0',
            minimum_bid: '0',
            start_date: '',
            expiry_date: '',
            image_file: '',
            image_preview: '',
            categoryData: [],
            collectionData: [],
            spinLoader: '0',
            currentDate: '',
            endDate: '',
            popupData: false
        }
        this.loginData = (!Cookies.get('lordsNFTleUserloginSuccess')) ? [] : JSON.parse(Cookies.get('lordsNFTleUserloginSuccess'));
        this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
        this.updateNftAPI = this.updateNftAPI.bind(this)
        this.onChange = this.handleChange.bind(this);

        const { match: { params } } = this.props;
        this.id = params.id
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

        Cookies.set('selectedTab', '1');

        if (!this.loginData?.data?.id) {
            window.location.href = `${config.baseUrl}`
        }
        this.getCategoryAPI()
        this.getUserCollectionAPI()
        this.getNftDetailsAPI()
        window.scrollTo({ top: 0, behavior: 'smooth' });

    }

    async getNftDetailsAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}itemDetail`,
            data: { 'item_id': this.id, 'user_id': this.loginData?.id }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    nftData: response.data.response
                })
            }
        })
    }

    async getCategoryAPI() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getCategory`,
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    categoryData: response.data.response
                })
            }
        })
    }

    async getUserCollectionAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getUserCollection`,
            data: { "user_id": this.loginData?.id }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    collectionData: response.data.response
                })
            }
        })
    }

    nftimageChange = (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];

        if (image_as_files.type.indexOf('image') === 0) {
            var file_type = 'image';
        } else {
            var file_type = 'video';
        }

        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['file_type']: file_type }
        }))

        this.setState({
            image_preview: image_as_base64,
            image_file: image_as_files,
            file_type: file_type,
            image_type: e.target.files[0].type,
            imageError: ""
        })
    }

    handleChange = e => {

        if (e.target.name == 'name') {
            this.setState({
                'nameError': ""
            })
        }

        if (e.target.name == 'description') {
            this.setState({
                'descError': ""
            })
        }

        if (e.target.name == 'user_collection_id') {
            this.setState({
                'collectionError': ""
            })
        }

        if (e.target.name == 'item_category_id') {
            this.setState({
                'categoryError': ""
            })
        }

        if (e.target.name == 'start_date') {
            this.setState(prevState => ({
                nftData: { ...prevState.nftData, ['start_date1']: e.target.value }
            }))

            this.setState({
                endDate: e.target.value
            })

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

        let value = e.target.value;
        this.setState(prevState => ({
            nftData: { ...prevState.nftData, [e.target.name]: value }
        }))
    }

    sellType(type) {
        this.setState({
            'sell_type': type
        })

        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['sell_type']: type }
        }))
    }

    validate = () => {
        let nameError = ""
        let descError = ""
        let imageError = ""
        let collectionError = ""
        let categoryError = ""

        if (this.state.nftData?.name === '') {
            nameError = "Title is required."
        }
        if (this.state.nftData?.description === '') {
            descError = "Description is required."
        }
        if (this.state.nftData?.user_collection_id === '0' || this.state.nftData?.user_collection_id === '') {
            collectionError = "Collection is required."
        }
        if (this.state.nftData?.item_category_id === '0' || this.state.nftData?.item_category_id == '') {
            categoryError = "Category is required."
        }
        if (this.state.nftData?.image_file === '') {
            imageError = "Image is required."
        }
        if (nameError || descError || imageError || collectionError || categoryError) {

            window.scrollTo(0, 220)

            this.setState({
                nameError, descError, categoryError, collectionError, imageError
            })
            return false
        }
        return true
    }


    handleChangeStartDate = e => {
        let startDate = this.formatDate(e);
        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['start_date1']: startDate }
        }))
    }

    handleChangeEndDate = e => {
        let endDate = this.formatDate(e);
        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['expiry_date1']: endDate }
        }))
    }

    formatDate(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }


    async metaDataUpload(file) {
        let resIPF = await axios({
            method: 'post',
            url: `${config.apiUrl}updateMetadata`,
            data: {
                "tokenid": this.state.nftData?.token_id,
                "name": this.state.nftData?.name,
                "description": this.state.nftData?.description,
                "image": `https://meme.mypinata.cloud/ipfs/${this.state.image_preview ? this.state.ImageFileHash : this.state.nftData?.image}`
            }
        });
        let status = resIPF.data.status;
        this.setState({
            token_id: status
        })
        return status;

    }


    async imageUpload() {
        let formData1 = new FormData();
        formData1.append('file', this.state.image_file);
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let resIPF = await axios.post(url,
            formData1,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                    'pinata_api_key': '3c3d185fd38e70efed9d',
                    'pinata_secret_api_key': '9c728404ac34c99c2199b074a6035ca8d54e17740e2777f4d37a7c0bde274654'
                }
            }
        );
        let ipfsImg = resIPF.data.IpfsHash;
        this.setState({
            ImageFileHash: ipfsImg
        })
        return ipfsImg;
    }

    async metaDataUpload(file) {
        let resIPF = await axios({
            method: 'post',
            url: `${config.apiUrl}updateMetadata`,
            data: {
                "tokenid": this.state.nftData?.token_id,
                "name": this.state.nftData?.name,
                "description": this.state.nftData?.description,
                "image": `https://meme.mypinata.cloud/ipfs/${this.state.image_preview ? this.state.ImageFileHash : this.state.nftData?.image}`
            }
        });
        let status = resIPF.data.status;
        this.setState({
            token_id: status
        })
        return status;

    }


    async updateNftAPI(e) {
        e.preventDefault();
        const isValid = this.validate()
        if (!isValid) {

        }
        else {
            this.setState({
                spinLoader: '1',

            })

            let ImageFileHash = this.state.ImageFileHash;
            if (this.state.image_preview) {
                ImageFileHash = await this.imageUpload();
            } else {
                ImageFileHash = this.state.nftData?.image;
            }

            await this.metaDataUpload();

            let formData = new FormData();
            // let formData1 = new FormData();
            // if (this.state.image_file) {
            //     formData1.append('file', this.state.image_file);
            //     const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            //     var resIPF = await axios.post(url,
            //         formData1,
            //         {
            //             headers: {
            //                 'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
            //                 'pinata_api_key': '13a09709ea30dc4fcc31',
            //                 'pinata_secret_api_key': 'b6f2e00b393de9902ead2fb02dfc4a6325df8c7cfe8734e1493f918e7f7aa7c9'
            //             }
            //         }
            //     );
            //     formData.append('image', resIPF.data.IpfsHash);
            //     formData.append('file_type', this.state.file_type);
            // } else {
            //     formData.append('image', "");
            //     formData.append('file_type', this.state.nftData?.file_type);
            // }

            formData.append('price', this.state.nftData?.price);
            formData.append('item_id', this.state.nftData?.item_id);
            formData.append('image', ImageFileHash);
            formData.append('name', this.state.nftData?.name);
            formData.append('file_type', this.state.file_type ? this.state.file_type : this.state.nftData?.file_type);
            formData.append('royalty_percent', this.state.nftData?.royalty_percent);
            formData.append('description', this.state.nftData?.description);
            formData.append('start_date', this.state.nftData?.start_date1 ? this.formatDate(this.state.nftData?.start_date1) : '');
            formData.append('expiry_date', this.state.nftData?.expiry_date1 ? this.formatDate(this.state.nftData?.expiry_date1) : '');
            formData.append('item_category_id', this.state.nftData?.item_category_id);
            formData.append('user_collection_id', this.state.nftData?.user_collection_id);
            formData.append('sell_type', this.state.nftData?.sell_type);
            formData.append('user_id', this.loginData?.id);
            formData.append('email', this.loginData?.user_email);
            formData.append('to_address', this.loginData?.address);


            this.setState({
                imageData: ImageFileHash
            })



            axios.post(`${config.apiUrl}updateNftByUser`, formData)
                .then(result => {



                    if (result.data.success === true) {
                        this.setState({
                            spinLoader: '0',
                            popupData: true
                        })
                        // toast.success(result.data.msg, {
                        // });
                        // setTimeout(() => {
                        //     window.location.href = `${config.baseUrl}accountsetting`
                        // }, 2000);
                    } else {
                        toast.error(result.data.msg, {

                        });
                        this.setState({
                            spinLoader: '0'
                        })
                    }
                }).catch(err => {
                    toast.error(err.response.data?.msg,

                    );
                    this.setState({
                        spinLoader: '0'
                    })
                })
        }
    }

    movePage() {
        this.props.history.push({
            pathname: `${config.baseUrl}accountsetting`,
            state: { detail: 1 }
        })
        // window.location.href = `${config.baseUrl}accountsetting`
    }


    render() {
        return (

            <>
                <Header />
                <ToastContainer />
                <Dialog
                    className='create-popup'
                    title={`You Updated-${this.state.nftData?.name}`}
                    // icon="warning-sign"
                    style={{
                        color: '#3fa1f3',
                        textAlign: "center"
                    }}
                    isOpen={this.state.popupData}
                    isCloseButtonShown={false}
                >
                    <div className="text-center pl-3 pr-3" style={{ backgroundColor: "#fff" }}>
                        {/* <BarLoader color="#e84747" height="2" /> */}
                        <br />
                        <h4 style={{ color: '#3fa1f3', fontSize: '16px' }}>To get set up for selling on marketplace, please put the item on sale from portfolio page.</h4>
                        {/* <p style={{ color: '#091f3f' }}>
              Please do not refresh page or close tab.
            </p> */}
                        <div className="" style={{ padding: "32px", margin: "20px" }}>
                            <img src={`${config.imageUrl + this.state.imageData}`} style={{ boxShadow: "rgb(204 204 204) 0px 0px 7px 7px", width: "100%" }} />
                        </div>
                        <button type='button' className='update-nft' onClick={this.movePage.bind(this)}>Ok</button>
                        {/* <div>
              <div className="spinner-border"></div>
            </div> */}
                    </div>
                </Dialog>
                <div className="no-bottom no-top" id="content">
                    <div id="top" />
                    {/* section begin */}

                    <section id="subheader" className="text-light" style={{height: "286px", backgroundImage: `url("images/background/6013544.jpg")`, backgroundSize: 'cover' }}>
                        <div className="center-y relative text-center">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12 text-center">
                                        <h1 className='edit-head'>Edit NFT</h1>
                                    </div>
                                    <div className="clearfix" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section aria-label="section">
                        <div className="container">
                            <div className="row wow fadeIn">
                                <div className='col-lg-2'></div>
                                <div className="col-lg-8">
                                    <form id="form-create-item" className="form-border" method="post" action="email.php">
                                        <div className="field-set">
                                            <h5 className='head-nft'>Image</h5>
                                            <div className='col-sm-4 col-8'>
                                                {/* <p >File types supported: PNG, JPG, GIF or WEBP</p> */}
                                                <div className="d-create-file">
                                                    {this.state.nftData?.file_type === 'image' ?
                                                        this.state.image_preview === '' ?
                                                            <img style={{ height: '150px', width: '150px',  }} id="image" className="object-cover w-full h-32" src={`${config.imageUrl}` + this.state.nftData?.image} />
                                                            :
                                                            <img style={{ height: '150px', width: '150px',  }} id="image" className="object-cover w-full h-32" src={this.state.image_preview} />

                                                        :
                                                        this.state.nftData?.file_type === 'video' ?
                                                            this.state.image_preview != '' ?
                                                                <Player style={{ height: '50px', width: '50px',  }} id="image" className="" src={this.state.image_preview} />
                                                                :
                                                                <Player id="image" className="" src={`${config.imageUrl}` + this.state.nftData?.image} />
                                                            : ""
                                                    }

                                                    <br/>
                                                    <input type="button" style={{ opacity: this.state.image_preview == '' ? '0' : '0' }} id="get_file" className="btn-main" defaultValue="Browse" />
                                                    {/* <input type="file" accept=".png,.jpg,.gif,.webo,.mp4" onChange={this.nftimageChange.bind(this)} id="upload_file" name="image" /> */}
                                                </div>
                                                <span className="error-asterick"> {this.state.imageSizeError}</span>
                                            </div>
                                            <div className="spacer-single" />
                                             <h5 className='head-nft'>Title</h5>
                                            <input type="text" name="name" onChange={this.handleChange} id="item_title" value={this.state.nftData?.name} disabled className="form-control" placeholder="e.g. 'Crypto Funk" />
                                            <span className="error-asterick"> {this.state.nameError}</span>
                                            <div className="spacer-10" />
                                             <h5 className='head-nft'>Description</h5>
                                            <textarea data-autoresize name="description" onChange={this.handleChange} id="item_desc" disabled className="form-control" placeholder="e.g. 'This is very limited item'" value={this.state.nftData?.description} ></textarea>
                                            <span className="error-asterick"> {this.state.descError}</span>

                                            {/* <div className="spacer-10" />
                                             <h5 className='head-nft'>Royalties</h5>
                                            <input onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} type="text" value={this.state.nftData?.royalty_percent} onChange={this.handleChange} disabled={this.state.nftData?.is_minted == 1} name="royalty_percent" id="item_royalties" className="form-control" placeholder="suggested: 0%, 5%, 10%, 20%. Maximum is 25%" /> */}
                                            <div className="spacer-10" />
                                             <h5 className='head-nft'>Select sale method</h5>
                                            <div className="de_tab tab_methods">
                                                <ul className="de_nav">
                                                    <li onClick={this.sellType.bind(this, 1)} className={this.state.nftData?.sell_type == 1 ? 'active' : ''}><span><i className="fa fa-tag" />Price</span>
                                                    </li>
                                                    <li className={this.state.nftData?.sell_type == 2 ? 'active' : ''} onClick={this.sellType.bind(this, 2)}><span><i className="fa fa-hourglass-1" />Timed auction</span>
                                                    </li>

                                                </ul>
                                                <div className="de_tab_content">
                                                    {this.state.nftData?.sell_type === 1 ?
                                                        <>
                                                            <h5>Price</h5>
                                                            <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} value={this.state.nftData?.price} name="price" id="item_price_bid" className="form-control" placeholder="Enter Price" />
                                                        </>

                                                        :
                                                        this.state.nftData?.sell_type === 2 ?
                                                            <>
                                                                <h5>Minimum bid</h5>
                                                                <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} name="minimum_bid_amount" onChange={this.handleChange} value={this.state.nftData?.price} id="item_price_bid" className="form-control" placeholder="Enter Minimum Bid" />
                                                                <div className="spacer-10" />
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5>Starting date</h5>
                                                                        <DatePicker name="start_date" className="form-control" minDate={new Date()} value={this.state.nftData?.start_date1} onChange={this.handleChangeStartDate} />
                                                                        {/* <span className="error-asterick"> {this.state.startDateError}</span> */}
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <h5>Expiration date</h5>
                                                                        <DatePicker name="expiry_date" className="form-control" minDate={new Date()} value={this.state.nftData?.expiry_date1} onChange={this.handleChangeEndDate} />
                                                                    </div>
                                                                    <div className="spacer-single" />
                                                                </div>
                                                            </>
                                                            :

                                                            ""

                                                    }

                                                </div>
                                            </div>
                                            <div className="spacer-10 mt-2" >
                                            {this.state.spinLoader === '0' ?
                                                 <button type="submit" onClick={this.updateNftAPI} value="Update" id="submit" className="connect-wallet" defaultValue="Create Item" >Update</button>
                                                :
                                                <button className="contect-wallet" type="submit" id="deposit-page" >Updating NFT &nbsp; <i className="fa fa-spinner fa-spin validat"></i></button>
                                           }
                                           </div>
                                            <div className="spacer-single" />
                                        </div></form>
                                </div>
                                <div className="col-lg-2">
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
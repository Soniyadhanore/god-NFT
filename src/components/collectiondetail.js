import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import axios from 'axios';
import config from '../config/config';
import Accordion from 'react-bootstrap/Accordion'
import 'react-accessible-accordion/dist/fancy-example.css';

export default class collectiondetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            marketPlaces: [],
            marketPlacesBackup: [],
            searchAnything: "",
            allMarketPlaces: [],
            collections: [],
            searchCollection: '',
            collectionIds: [],
            categories: [],
            itemCategoryIds: [],
            collectionData: this.props.match.params.id,
            singlecollections: ''
        }


    }


    componentDidMount() {
        this.marketPlaceList()
        this.allMarketPlaces()
        this.collectionList()
        this.getCategories()
        this.getSingleCollection()
        window.scrollTo({ top: 0, behavior: 'smooth' });

    }


    //============================================  Single user collection  ================================

    async getSingleCollection() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getSingleUserCollection`,
            data: { 'collection_id': this.state.collectionData }
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    singlecollections: res.data.response
                })
                console.log(this.state.singlecollections);
            }
        }).catch((error) => {

        })
    }

    //========================================================================================================

    async collectionList() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getAdminCollection`,
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    collections: res.data.response
                })
                console.log(this.state.collections);
            }
        }).catch((error) => {

        })
    }

    //========================================================================================================

    searchCollection = (e) => {
        const { value } = e.target
        this.setState({ searchCollection: value })
        var regex = new RegExp(value);
        const matchedCollection = this.state.collections.filter(item => item.name.match(regex));
        if (matchedCollection.length > 0) {
            this.setState({ collections: matchedCollection })
        } else {
            this.collectionList()
        }

    }


    //====================================================================================================


    CollectionHandler = (e, selectitem) => {
        e.preventDefault()
        let collectionIds = [...this.state.collectionIds];

        const index = collectionIds.indexOf(selectitem.id);

        if (index > -1) {
            collectionIds.splice(index, 1);
        } else {
            collectionIds.push(selectitem.id);
        }

        this.setState({ collectionIds });
        const filterItems = this.state.allMarketPlaces.filter(item => collectionIds.includes(item.collection_id));
        if (filterItems.length > 0) {
            this.setState({ marketPlaces: filterItems })
        } else {
            this.setState({ marketPlaces: [] })
        }




        if (collectionIds.length == 0) {
            // this.setState({ marketplace: this.state.allMarketPlaces })
            this.componentDidMount()
        }

    }

    //=========================================================================================================
    async marketPlaceList() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}marketplace`,
            data: {
                "user_id": "0",
                "user_collection_id": this.state.collectionData,
                "login_user_id": this.loginData && this.loginData.id ? this.loginData.id : '0',
                "is_featured": "0",
                "recent": "0",
                "limit": "0"
            }
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    marketPlaces: this.subcategory_id != undefined ? res.data.response.filter(item => item.item_category_id == parseInt(this.subcategory_id)) : res.data.response,
                    marketPlacesBackup: this.subcategory_id != undefined ? res.data.response.filter(item => item.item_category_id == parseInt(this.subcategory_id)) : res.data.response,
                })
            }
            // alert(this.state.marketPlaces)
        }).catch((error) => {

        })
    }

    //===================================================================================================

    async allMarketPlaces() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}marketplace`,
            data: {
                "user_id": "0",
                "login_user_id": this.loginData && this.loginData.id ? this.loginData.id : '0',
                "user_collection_id": this.state.collectionData,
                "is_featured": "0",
                "recent": "0",
                "limit": "0"
            }
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    allMarketPlaces: res.data.response
                })
            }

        }).catch((error) => {

        })

    }

    //===================================================================================================

    searchAnything = (e) => {
        const { value } = e.target
        this.setState({ searchAnything: value })
        var regex = new RegExp(value.toUpperCase());
        const matchedData = this.state.allMarketPlaces.filter(item => (item.name == null ? '' : item.name.toUpperCase().match(regex)) || item.description.toUpperCase().match(regex) || (item.collection_name == null ? '' : item.collection_name.toUpperCase().match(regex)));
        if (matchedData.length > 0) {
            this.setState({ marketPlaces: matchedData })
        } else {
            this.setState({ marketPlaces: [] })
        }
    }

    //===================================================================================================


    PriceHeaderFilter = async (e) => {
        this.setState({ marketPlaces: [] })

        if (e.target.value === 'Lowtohigh') {
            var lowtohigh = this.state.marketPlaces.sort((a, b) => (parseFloat(a.usd_price).toFixed(6)) - (parseFloat(b.usd_price).toFixed(6)));
            this.setState({ marketPlaces: lowtohigh })
        } else if (e.target.value === 'Hightolow') {
            var hightolow = this.state.marketPlaces.sort((a, b) => (parseFloat(b.usd_price).toFixed(6)) - (parseFloat(a.usd_price).toFixed(6)));
            this.setState({ marketPlaces: hightolow })
        }

        else {
            await axios({
                method: 'post',
                url: `${config.apiUrl}marketplace`,
                data: {
                    "user_id": "0",
                    "user_collection_id": this.state.collectionData,
                    "login_user_id": this.loginData && this.loginData.id ? this.loginData.id : '0',
                    "is_featured": "0",
                    "recent": "0",
                    "limit": "0"
                }
            }).then((res) => {
                if (res.data.success === true) {
                    this.setState({
                        marketPlaces: res.data.response,
                        marketPlacesBackup: res.data.response,
                    })
                    console.log(this.state.marketPlacesBackup);
                }

            }).catch((error) => {

            })
        }
    }

    //========================================================================================================

    selectTypeHandler = (value) => {
        const filterItems = this.state.allMarketPlaces.filter(item => item.sell_type == value);
        if (filterItems.length > 0) {
            this.setState({ marketPlaces: filterItems, selectType: value })
        } else {
            this.setState({ marketplaces: [] })
        }
    }

    //========================================================================================================

    async getCategories() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getCategory`,
            params: {
                "limit": "0"
            }
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    categories: res.data.response
                })

            }

        }).catch((error) => {

        })
    }

    //=========================================================================================================


    CategoryHandler = async (e, selectcategory) => {
        console.log(selectcategory);
        e.preventDefault()
        let itemCategoryIds = [...this.state.itemCategoryIds];


        const index = itemCategoryIds.indexOf(selectcategory.id);

        if (index > -1) {
            itemCategoryIds.splice(index, 1);
        } else {
            itemCategoryIds.push(selectcategory.id);
        }

        this.setState({ itemCategoryIds });
        const filterItems = this.state.allMarketPlaces.filter(item => itemCategoryIds.includes(item.item_category_id));
        if (filterItems.length > 0) {
            this.setState({ marketPlaces: filterItems })
        } else {
            this.setState({ marketPlaces: [] })
        }

        if (itemCategoryIds.length == 0) {
            this.componentDidMount()
        }

    }


    refresh() {
        window.location.reload()
    }

    render() {
        return (
            <>
                <Header />
                <section className='collectionbnr py-5'>
                    <div className='container-fluid'>
                        <div className='row align-items-center mt-4'>
                            <div className='col-md-8 col-sm-6 col-12'>
                                <div className='coltextleft'>
                                    <h1>{this.state.singlecollections?.name}</h1>

                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 col-12 mt-4'>
                                <div className='colimgright'>
                                    <div className='colimgbox'>
                                        <img src={config.imageUrl1 + this.state.singlecollections?.banner} className='img-fluid' alt="collectionbnr" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='fntimg'>
                            <img src={config.imageUrl1 + this.state.singlecollections?.profile_pic} className='img-fluid' alt="nftmonkey" />
                        </div>
                    </div>
                </section>

                <section className='created pt-5'>
                    <div className='container'>
                        <div className='row align-items-center justify-content-end'>
                            <div className='col-12 px-0 createlord'>
                                <div className='createtext'>
                                    <h3>CREATED BY: {this.state.singlecollections?.full_name}</h3>
                                    <p>{this.state.singlecollections?.description}</p>
                                   
                                </div>
                            </div>
                           
                        </div>
                    </div>
                </section>

                <section className='godtabs pt-5'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'>
                                <div className="uploadtab py-1 mt-3">
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
                                                Items
                                            </button>
                                        </li>
                                        
                                    </ul>
                                </div>
                                <div className='tabsearchbox'>
                                    <div className='col-md-3 col-12 mb-3'>
                                    <div className='filterbox'>
                                        <div className='filterblock1'>
                                            <Link to="#"><span><i class="fa fa-chevron-left" aria-hidden="true"></i></span>Filter</Link>
                                        </div>
                                        <div className='filterblock2'>
                                            <span style={{ cursor: 'pointer' }}><i class="fa fa-refresh" onClick={this.refresh.bind(this)} aria-hidden="true"></i></span>
                                        </div>
                                    </div>
                                    </div> 
                                    <div className='col-md-6 col-12 mb-3'>
                                    <div className='searchblock'>
                                        <form>
                                            <input type="text" class="textbox" placeholder="Search" onChange={e => this.searchAnything(e)} value={this.state.searchAnything} />
                                            <span><img src="assets/images/menubar.png" alt="menubar" /></span>
                                        </form>
                                    </div>
                                    </div>  
                                    <div className='col-md-3 col-12 mb-3'>
                                    <div className='selectprice'>
                                        <div className="selectbox" id="f_selectbox">
                                            <select name="cars" id="cars" onChange={e => this.PriceHeaderFilter(e)}>
                                                <option value='All'>Price Filter</option>
                                                <option value='Lowtohigh'>Price: Low to High</option>
                                                <option value='Hightolow'>Price: High to Low</option>
                                            </select>
                                        </div>
                                        {/* <div className='driveico'>
                                            <Link href=""><span><img src="assets/icons/windows.png" alt="windows" /></span></Link>
                                            <Link href=""><span><img src="assets/icons/googleapp.png" alt="googleapp" /></span></Link>
                                        </div> */}
                                    </div>
                                    </div>
                                </div>
                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade active show" id="pills-homeone" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                                        <div className='row align-items-center'>
                                            <div className='col-md-4 col-sm-6'>
                                                <div className='tabaccordian'>
                                                    <Accordion>
                                                        <Accordion.Item eventKey="0">
                                                            <Accordion.Header>
                                                                <p>  Status</p>
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                <div className="tab1-nft" style={{ backgroundSize: 'cover' }}>
                                                                    <div className="accordion-body Panel--isContentPadded FeaturedFilter--items">
                                                                        <div className='status'>
                                                                            <button type='button' className='btn'>
                                                                                <div className={`FeaturedFilter-item ${this.state.selectType === 1 ? 'FeaturedFilter--isSelected' : ""}`} onClick={e => this.selectTypeHandler(1)}>Buy now </div>
                                                                            </button>
                                                                            <button type='button' className='btn'>
                                                                                <div className={`FeaturedFilter-item ${this.state.selectType === 2 ? 'FeaturedFilter--isSelected' : ""}`} onClick={e => this.selectTypeHandler(2)}>On Auction</div>
                                                                            </button>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </Accordion.Body>
                                                        </Accordion.Item>

                                                        <Accordion.Item eventKey="1" style={{display:'none'}}>
                                                            <Accordion.Header> <p>
                                                                Collection
                                                            </p></Accordion.Header>
                                                            <Accordion.Body>
                                                                <div className="collections-list">
                                                                    <div className=" ddtCpj CollectionFilter--results">
                                                                        <div className="Scrollbox--content">
                                                                            {this.state.collections.map((item) => {
                                                                                return (
                                                                                    item.nftCount > 0 ?
                                                                                        <div className="CollectionFilter--item">
                                                                                            <div className=" hezVSt Image--isImageLoaded Image--isImageLoaderVisible CollectionFilter--item-image" style={{ height: '32px', width: '32px' }}><img className="Image--image" src={`${config.imageUrl1}${item.profile_pic}`} style={{ objectFit: 'cover' }} /></div>
                                                                                            <label className="CollectionFilter--item-name" style={{ padding: '5px', width: '110%', cursor: 'pointer', backgroundColor: (this.state.collectionIds.includes(item.id)) ? '#ddd' : '' }} onClick={e => this.CollectionHandler(e, item)}>
                                                                                                {item.name}
                                                                                            </label>

                                                                                        </div> : '')
                                                                            })}
                                                                            <div className="Blockreact__Block-sc-1xf18x6-0 Flexreact__Flex-sc-1twd32i-0 FlexColumnreact__FlexColumn-sc-1wwz3hp-0 VerticalAlignedreact__VerticalAligned-sc-b4hiel-0 CenterAlignedreact__CenterAligned-sc-cjf6mn-0 ctiaqU jYqxGr ksFzlZ iXcsEj cgnEmv">
                                                                                <div height="1px" width="1px" className="Blockreact__Block-sc-1xf18x6-0 cqowQV" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </Accordion.Body>
                                                        </Accordion.Item>

                                                        <Accordion.Item eventKey="1">
                                                            <Accordion.Header>
                                                                <p>categories</p>
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                <div className=" gUuGNP CategoryFilter--panel">
                                                                    <div className="Scrollbox--content">
                                                                        {this.state.categories.map(item => {
                                                                            return (
                                                                                //     item.nft_count > 0 ?
                                                                                <div className="CategoryFilter--item">

                                                                                    <label className="CategoryFilter--name" style={{ padding: '5px', width: '100%', cursor: 'pointer', background: (this.state.itemCategoryIds.includes(item.id)) ? '#f0daeb' : '' }} onClick={e => this.CategoryHandler(e, item)}>{item.name}</label>
                                                                                </div>
                                                                                //   : ''
                                                                            )
                                                                        })}

                                                                    </div>

                                                                </div>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>

                                                </div></div>
                                            <div className='col-md-8 col-sm-6'>
                                                <div className='row'>
                                                    <div className='col-12 d-flex'>
                                                    {this.state.marketPlaces.length === 0 ?
                                                        <div className='nonftbox'><p className="nonft">No NFT found!</p></div> :
                                                        this.state.marketPlaces.map(item => {
                                                            return (
                                                                <div className='col-md-4 col-12 mb-2 me-2'>
                                                                    <div class="card" id='godoneid'>
                                                                        <Link to={`${config.baseUrl}nftdetail/${item.item_id}`}>

                                                                            {item.file_type === 'image' ?
                                                                                <img effect="blur" class="img-fluid" src={`${config.imageUrl}${item.image}`} alt="omg" /> :
                                                                                item.file_type === 'video' ?
                                                                                    <video muted autoPlay controls height="150px">
                                                                                        <source src={`${config.imageUrl}${item.image}`} className="img-fluid" type="video/mp4" />
                                                                                    </video> : ''
                                                                            }
                                                                        </Link>

                                                                        <div class="card-body">
                                                                            <div className='lordtext'>
                                                                                <p class="card-text">{item.name}</p>
                                                                                <p class="card-text">{item.price} BNB</p>
                                                                            </div>
                                                                            <div className='placebtnbox'>
                                                                                <Link to={`${config.baseUrl}nftdetail/${item.item_id}`} className="placebtn">{item.sell_type == 1 ? 'Purchase' : 'Place Bid'}</Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                    <div className="tab-pane fade" id="pills-profiletwo" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                                        <p>two</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='statusbox'>

                            </div>
                        </div>
                    </div>

                </section>


                <Footer />
            </>
        )
    }
}
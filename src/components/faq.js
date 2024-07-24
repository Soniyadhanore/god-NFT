import React, { Component } from 'react';
import axios from 'axios';
import Footer from './Footer';
import Header from './Header';
import config from '../config/config'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
export default class faq extends Component {


  constructor(props) {
    super(props)
    this.state = {
      faqLists: [],
    };


  }

  async getFaqList() {
    await axios({
      method: 'get',
      url: `${config.apiUrl}faqlist`,
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({ faqLists: res.data.response })
      }

    }).catch((error) => {

    })
  }

  componentDidMount() {
    this.getFaqList();
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }


  render() {
    return (

      <>
      <Header />
        <div className="no-bottom no-top" id="content">
          <div id="top" />

          <section id="subheader" className="text-light" style={{height:"286px" ,backgroundImage: `url("images/background/about-us.png")` }}>
            <div className="center-y relative text-center">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1 className='edit-head'>FAQ</h1>

                  </div>
                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </section>

          <section aria-label="section ">
            <div className="container">
              <div className="row mb-5 text-center">
                <div className="col-md-12 mt-4" style={{ backgroundSize: 'cover' }}>
                  <h3>FAQ</h3>
                  <div className="accordion accordion-flush" id="accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                  <Accordion preExpanded={['a']}>
                                {this.state.faqLists.map(item => (
                                    <AccordionItem>
                                        <AccordionItemHeading>
                                            <AccordionItemButton>
                                                {item.question}

                                            </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel>
                                            <p>
                                                {item.answer}

                                            </p>
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                ))}



                            </Accordion>

                  </div>
                </div>
              </div>
            </div>
          </section>
          <Footer/>
        </div>
        <br /> <br />


      </>
    )
  }
}

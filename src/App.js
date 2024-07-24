import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import config from './config/config'
import home from './components/home'
import collectiondetail from './components/collectiondetail';
import nftdetail from './components/nftdetail';
import login from './components/login';
import wallet from './components/wallet';
import register from './components/register';
import VerifyAccount from './components/register';
import forgetpassword from './components/forgetpassword';
import resetpassword from './components/resetpassword';
import accountsetting from './components/account-setting';
import userprofile from './components/userprofile';
import editNft from './components/editNft';
import aboutus from './components/aboutus';
import faq from './components/faq';
import marketplaceDetail from './components/marketplace';
import termsandcondition from './components/termsandcondition'
import privacyandpolicy from './components/privacypolicy';
import howto from './components/howto';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={`${config.baseUrl}`} exact component={home} />
        <Route path={`${config.baseUrl}collectiondetail/:id`} exact component={collectiondetail} />
        <Route path={`${config.baseUrl}nftdetail/:id`} exact component={nftdetail} />
        <Route path={`${config.baseUrl}login`} exact component={login} />
        <Route path={`${config.baseUrl}wallet`} exact component={wallet} />
        <Route path={`${config.baseUrl}register`} exact component={register} />
        <Route path={`${config.baseUrl}forgetpassword`} exact component={forgetpassword} />
        <Route path={`${config.baseUrl}verifyAccount/:token`} component={VerifyAccount} />
        <Route path={`${config.baseUrl}resetpassword`} exact component={resetpassword} />
        <Route path={`${config.baseUrl}resetpassword/:token`} component={resetpassword} />
        <Route path={`${config.baseUrl}accountsetting`} component={accountsetting} />
        <Route path={`${config.baseUrl}aboutus`} component={aboutus} />
        <Route path={`${config.baseUrl}faq`} component={faq} />
        <Route path={`${config.baseUrl}editNft/:id`} component={editNft} />
        <Route path={`${config.baseUrl}userprofile/:id`} component={userprofile} />
        <Route path={`${config.baseUrl}marketplaceDetail`} component={marketplaceDetail} />
        <Route path={`${config.baseUrl}termsandcondition`} component={termsandcondition} />
        <Route path={`${config.baseUrl}privacyandpolicy`} component={privacyandpolicy} />
        <Route path={`${config.baseUrl}howto`} component={howto} />



      </Switch>
    </BrowserRouter>
  );
}

export default App;

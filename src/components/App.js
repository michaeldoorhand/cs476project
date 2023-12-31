import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar'
import Main from './Main'
import art1 from '../images/art1.png';
import art2 from '../images/art2.jpg';
import { Link } from 'react-router-dom'; 


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = SocialNetwork.networks[networkId]
    if(networkData) {
      const socialNetwork = web3.eth.Contract(SocialNetwork.abi, networkData.address)
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({ postCount })
      // Load Posts
      for (var i = 1; i <= postCount; i++) {
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      // Sort posts. Show highest tipped posts first
      this.setState({
        posts: this.state.posts.sort((a,b) => b.tipAmount - a.tipAmount )
      })
      this.setState({ loading: false})
    } else {
      window.alert('SocialNetwork contract not deployed to detected network.')
    }
  }

  createPost(content) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  tipPost(id, tipAmount) {
    this.setState({ loading: true })
    this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true
    }

    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
  }

  render() {
    return (
      <div>
         <Navbar account={this.state.account} />
        <div className='art-box'>
            <img src={art1} alt="Art 1" className='art1' />
        </div>
       <div className='text-container'>
          <div className='header-1'>
              Care Chain
          </div>
          <div className='header-2'>
            Solving healthcare interoperability one chain at a time!
          </div>
        </div>
        <div className='main-row'>
          <div className='box'>
            <div className='box-text'> Add Chain</div>
            <Link to="/add" className="button-box"> 
                <button type='button' className='link-button'>Add</button>
            </Link>
          </div>
          <div className='box'>
            <div className='box-text'> View Chain</div>
            <Link to="/view" className="button-box"> 
              <button type='button' className='link-button'>View</button>
            </Link>
          </div>
          <div className='box'>
           <div className='box-text'> Share Chain</div>
           <Link to="/share" className="button-box"> 
              <button type='button' className='link-button'>Share</button>
          </Link>
          </div>
        </div>
        <div className='art-box'>
            <img src={art2} alt="Art 1" className='art2' />
        </div>
        <div className='footer'> 
          <div className='footer-txt'>Be sure to follow us on social media! @CareChain</div>
          
        </div>

      </div>
    );
  }
}

export default App;
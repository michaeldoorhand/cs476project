import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar'
import Main from './Main'

class ViewDemo extends Component {

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
      const demographicCount = await socialNetwork.methods.demographicCount().call()
      this.setState({ demographicCount })
      // Load Posts
      for (var i = 1; i <= demographicCount; i++) {
        const post = await socialNetwork.methods.demographics(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      // Sort posts. Show highest tipped posts first
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

  addDemographic(content) {
    this.setState({ loading: true });

    // Extract data from the content object
    const {
        firstName,
        lastName,
        dateOfBirth,
        height,
        weight,
        bloodType
    } = content;

    this.state.socialNetwork.methods.addDemographic(
        firstName,
        lastName,
        dateOfBirth,
        height,
        weight,
        bloodType
    ).send({ from: this.state.account })
    .once('receipt', (receipt) => {
        this.setState({ loading: false });
    });
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
      displayDemographic: false,
      loading: true,
      formData: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        height: '',
        weight: '',
        bloodType: ''
    }
    }

    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
  }

  handleInputChange = (event, inputName) => {
    const value = event.target.value;
    
    this.setState(prevState => ({
        formData: {
            ...prevState.formData,
            [inputName]: value
        }
    }));
    };

    handleToggle = () => {
        this.setState((prevState) => ({
          displayDemographic: !prevState.displayDemographic,
        }));
      };

    render() {
        const { posts } = this.props;
        return (
          <div className='view-container'>
            {this.state.loading ? (
              <div> loading </div>
            ) : (
              <div className='record-subsection'>
                
                    <button onClick={this.handleToggle}>
                    {this.state.displayDemographic ? 'Hide' : 'Show'} Demographics
                    </button>
                
    
                {this.state.displayDemographic && (
                  <div className='record-subsection'>
                    {posts.map((post, key) => (
                      <div className='record-box' key={key}>
                        <div className='data-pair'>
                          <label className='label-text'>First name</label>
                          <div className='data-text'>{post.firstName}</div>
                        </div>
                        <div className='data-pair'>
                          <label className='label-text'>Last name</label>
                          <div className='data-text'>{post.lastName}</div>
                        </div>
                        <div className='data-pair'>
                          <label className='label-text'>Date of Birth</label>
                          <div className='data-text'>{post.dateOfBirth}</div>
                        </div>
                        <div className='data-pair'>
                          <label className='label-text'>Height</label>
                          <div className='data-text'>{post.height}</div>
                        </div>
                        <div className='data-pair'>
                          <label className='label-text'>Weight</label>
                          <div className='data-text'>{post.weight}</div>
                        </div>
                        <div className='data-pair'>
                          <label className='label-text'>Blood Type</label>
                          <div className='data-text'>{post.bloodType}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      }
    }

export default ViewDemo;
import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar'
import Main from './Main'

class Add extends Component {

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

    handleSubmit = () => {
        // Access this.state.formData for your dictionary of key-value pairs
        console.log(this.state.formData); // You can submit this data or perform other actions here
        this.addDemographic(this.state.formData)
    };

  render() {
    return (
        <div>
                <Navbar account={this.state.account} />
              <div className='add-container'>
                <div className='add-row'>
                  <div className='add-title'>
                    Add Demographic
                  </div>
                  <div className="container-fluid mt-5" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                      <div className="row">
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>First Name</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.firstName}
                                      onChange={e => this.handleInputChange(e, 'firstName')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Last Name</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.lastName}
                                      onChange={e => this.handleInputChange(e, 'lastName')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Date of Birth</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.dateOfBirth}
                                      onChange={e => this.handleInputChange(e, 'dateOfBirth')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Height</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.height}
                                      onChange={e => this.handleInputChange(e, 'height')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Weight</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.weight}
                                      onChange={e => this.handleInputChange(e, 'weight')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Blood Type</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.bloodType}
                                      onChange={e => this.handleInputChange(e, 'bloodType')}
                                  />
                              </div>
                          </div>
                      </div>
                      <div className="row justify-content-center mt-3">
                          <div className="col-md-2">
                              <button className="submit-button" onClick={this.handleSubmit}>
                                  Submit
                              </button>
                          </div>
                      </div>
                  </div>
                </div>
                
                
              </div>
              <div className='add-container'>
                <div className='add-row'>
                  <div className='add-title'>
                    Add Appointment
                  </div>
                  <div className="container-fluid mt-5" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                      <div className="row">
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Appointment Date</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.firstName}
                                      onChange={e => this.handleInputChange(e, 'firstName')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Appointment Time</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.lastName}
                                      onChange={e => this.handleInputChange(e, 'lastName')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Location</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.dateOfBirth}
                                      onChange={e => this.handleInputChange(e, 'dateOfBirth')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Reason</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.height}
                                      onChange={e => this.handleInputChange(e, 'height')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Status</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.weight}
                                      onChange={e => this.handleInputChange(e, 'weight')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Provider</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.bloodType}
                                      onChange={e => this.handleInputChange(e, 'bloodType')}
                                  />
                              </div>
                          </div>
                      </div>
                      <div className="row justify-content-center mt-3">
                          <div className="col-md-2">
                              <button className="submit-button" onClick={this.handleSubmit}>
                                  Submit
                              </button>
                          </div>
                      </div>
                  </div>
                </div>
                
                
              </div>
              <div className='add-container'>
                <div className='add-row'>
                  <div className='add-title'>
                    Add Encounter
                  </div>
                  <div className="container-fluid mt-5" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                      <div className="row">
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Encounter Date</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.firstName}
                                      onChange={e => this.handleInputChange(e, 'firstName')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Encounter Result</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.lastName}
                                      onChange={e => this.handleInputChange(e, 'lastName')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Diagnosis</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.dateOfBirth}
                                      onChange={e => this.handleInputChange(e, 'dateOfBirth')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Procedure</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.height}
                                      onChange={e => this.handleInputChange(e, 'height')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Payment</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.weight}
                                      onChange={e => this.handleInputChange(e, 'weight')}
                                  />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <label>Provider</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      value={this.state.formData.bloodType}
                                      onChange={e => this.handleInputChange(e, 'bloodType')}
                                  />
                              </div>
                          </div>
                      </div>
                      <div className="row justify-content-center mt-3">
                          <div className="col-md-2">
                              <button className="submit-button" onClick={this.handleSubmit}>
                                  Submit
                              </button>
                          </div>
                      </div>
                  </div>
                </div>
                
                
              </div>
              <div className='footer2'> 
                <div className='footer-txt'>Be sure to follow us on social media! @CareChain</div>
              </div>
            </div>
    );
  }
}

export default Add;
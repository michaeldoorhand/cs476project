import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import SocialNetwork from '../abis/SocialNetwork.json'
import Navbar from './Navbar'
import Main from './Main'
import ViewDemo from './ViewDemo';
import ViewAppoint from './ViewAppoint';
import ViewEncount from './ViewEncount';

class View extends Component {

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
      const appointmentCount = await socialNetwork.methods.appointmentCount().call()
      const encounterCount = await socialNetwork.methods.encounterCount().call()

      this.setState({ demographicCount })
      // Load Demographics
      for (var i = 1; i <= demographicCount; i++) {
        const demo = await socialNetwork.methods.demographics(i).call()
        if(demo.author === this.state.account) {
          this.setState({
            demographics: [...this.state.demographics, demo]
          })
        }
      }
      // Load Appointments
      for (var i = 1; i <= appointmentCount; i++) {
        const appt = await socialNetwork.methods.appointments(i).call()
        if(appt.author === this.state.account) {
          this.setState({
            appointments: [...this.state.appointments, appt]
          })
        }
      }
      // Load Encounters
      for (var i = 1; i <= encounterCount; i++) {
        const enct = await socialNetwork.methods.encounters(i).call()
        if(enct.author === this.state.account) {
          this.setState({
            encounters: [...this.state.encounters, enct]
          })
        }
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
      demographics: [],
      appointments: [],
      encounters: [],
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

  render() {
    return (
      <div>
        
        {console.log(this.state.encounters)}
        
        <Navbar account={this.state.account} />
        <div className='header-padding'></div>
        <div>
          <ViewDemo posts={this.state.demographics} />
          <ViewAppoint posts={this.state.appointments}/>
          <ViewEncount posts={this.state.encounters}/>
        </div>
      </div>
    );
  }
}

export default View;
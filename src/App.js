import React, { Component } from 'react'
import VerificationContract from '../build/contracts/Verification.json'
import getWeb3 from './utils/getWeb3'
// import ipfs from './ipfs'
import axios from 'axios'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: '',
      web3: null,
      buffer: null,
      account: null,
      signature: null,
      address: null,
      signa: null
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.instantiateContract = this.instantiateContract.bind(this);
    this.signMessage = this.signMessage.bind(this);
    this.verify = this.verify.bind(this);

  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    //this.state.web3 = this.state.web3.bind(this);

    const contract = require('truffle-contract')
    var verification = contract(VerificationContract)
    verification.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      verification.deployed().then((instance) => {
        this.verificationInstance = instance
        this.setState({ account: accounts[0] })
        // Get the value from the contract to prove it worked.
        return this.verificationInstance.setSign.call(accounts[0])
      }).then((ipfsHash) => {
        console.log('contract response', ipfsHash.toNumber());
        // Update state with the result.
        return this.setState({ ipfsHash })
      })
    })
  }

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  signMessage(event) {
    var that = this;
    event.preventDefault()
    const axios = require('axios');

    // var show = function (elem) {
    // elem.style.display = 'block';
    // };

    // var hide = function (elem) {
    // elem.style.display = 'none';
    // };
    // var elem1 = document.getElementById("content");
    // hide( elem1);
    // var elem2 = document.getElementById("loader");
    // show( elem2);

    var name1 = document.getElementById('name1').value;
    var subject = document.getElementById('subject').value;
    var year = document.getElementById('year').value;
    var qualification = document.getElementById('qualification').value;

    // var certificat = {
    //   id: id,
    //   name1: name1,
    //   subject: subject,
    //   year: year,
    //   qualification: qualification
    // }
    //       console.log(certificat, "_________certificat");

    // axios.post('http://localhost:1337/certificate/create', certificat)
    // .then(function (response) {
    //   console.log(response);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // }); 

    const message = this.state.web3.sha3( name1 + subject + year + qualification );
    console.log('message', message);
      //, function(err,result) {}
 
    

    this.state.web3.eth.sign(that.state.account, message, function(err,result) {
        console.log('signature after web3 sign', result)
        console.log(err, result)
        //document.getElementById('form').trigger('reset')
        const elem1 = document.querySelector('#msg');
        elem1.innerHTML = 'message:' + ' ' + message ;
        //document.getElementById('msg').html('message:' + ' ' + message)
        this.setState({signature: result})
        //document.getElementById('signature').html('signature:' + ' ' + this.state.signature) 
        const elem2 = document.querySelector('#signature');
        elem2.innerHTML = 'signature:' + ' ' + this.state.signature ;   
        
        console.log('signature before setSign', this.state.signature);
      //const counter = this.verificationInstance.setSign(this.state.signature, {from: this.state.account}); 
      //console.log('counter', counter);
      //return counter;
        this.verificationInstance.setSign(that.state.signature, {from: this.state.account})
          .then((result) => {
           console.log('certificateCount result', result);
           return this.verificationInstance.certificateCount();
          })
          .then(function(certificateCount) { 
          console.log('certificateCount', certificateCount.toNumber())
          //document.getElementById('storage').show();
          // show(elem1);
          // hide(elem2);
          window.alert('Signature stored in blockchain!'); 
          console.log('thiiiiiiiis', that);
          var tty= that.verificationInstance.certificates(certificateCount);
          console.log('count', tty);

          return tty;
          })
          .catch((err) => {
          console.error(err);
          window.alert("There was an error recovering certificateCount")
          })
          .then(function(certificate) {
          var id = certificate[0];
          //console.log('certificateCount from blockchain',that.state);
          //that.setState({signa: certificate[1]});
          console.log('signature from blockchain', that.state.web3.toHex( certificate[1]));
          return id;
          })
          .then(function(id) {
            var certificat = {
            iden: id,  
            name1: name1,
            subject: subject,
            year: year,
            qualification: qualification
          }
          console.log(certificat, "_________certificat");
          return axios.post('http://localhost:1337/certificate/create', certificat);
          })
          .then(function (response) {
            console.log('mysql certificate', response);
          })
          .catch(function (error) {
            console.log(error);
          }); 
          //$('#storage').show();
          //$("#content").show();
          //$("#loader").hide();
          window.alert('Message signed!-->');
    }.bind(this));  
  }

  getCertificate(event) {
    event.preventDefault()
    const varA = document.getElementById("identification").value;
    const axios = require('axios');
    console.log(varA, "999999999999999")

    // $("#content").hide();
    // $("#loader").show();
     axios.get('http://localhost:1337/certificate/'+varA)
    //, {
    //params: {
    //  ID: varA
    //}
    //})
    .then(function (response) {
      console.log(response.data.name1);
    })
    .catch(function (error) {
      console.log(error);
    }); 
  
    
    var show = function (elem) {
    elem.style.display = 'block';
    };

    var hide = function (elem) {
    elem.style.display = 'none';
    };
    var elem1 = document.getElementById("content");
    hide( elem1);
    var elem2 = document.getElementById("loader");
    show( elem2);
    window.alert('Certificate is extracted from the database!');
  }

  verify(event) {
    var that = this;
    event.preventDefault()
    const axios = require('axios');

    // var show = function (elem) {
    // elem.style.display = 'block';
    // };

    // var hide = function (elem) {
    // elem.style.display = 'none';
    // };
    //const elem1 = document.getElementById("content");
    //hide( elem1);
    //const elem2 = document.getElementById("loader");
    //show( elem2);
    
    // var verificationInstance;
    // App.contracts.Verification.deployed()
    // .then(function(instance) {
    //   verificationInstance = instance;
    var certificateId = document.getElementById('certificateCount').value;
    var ver_msg,signa, cert;
    var signer;
    console.log('certificateCount', certificateId);
    that.verificationInstance.certificates(certificateId)
    .then(function(certificate) {
      var id = certificate[0];
      console.log('id', certificate[0].toNumber());
      signa = certificate[1];
      that.setState({signature: signa});
      //console.log('signature', that.state.web3.toHex(signa));
      console.log('app.signature', that.state.signature);

      return signa;
    })
    .then(function(result) {
      console.log('signa', signa);
      console.log('certificateId', certificateId);
      return (axios.get('http://localhost:1337/certificate/' + certificateId));     
    })
    .then(function(response) {
      console.log('response', response);
      cert = response;
      ver_msg = that.state.web3.sha3(response.data.name1 + response.data.subject + response.data.year + response.data.qualification);
      console.log('message', ver_msg);
      return ver_msg;
    })
    .then(function(result) {
      console.log('signature before "recover"', signa);
      console.log('message before "recover"', ver_msg);

      return signer = that.verificationInstance.recover(ver_msg, signa);
    })
    .then(function(result) {  
      console.log('signer', result);
      that.setState({address: result});
      return that.verificationInstance.authority();
    })
    .then(function(authority) {
      if (that.state.address === authority) {
        console.log('verified!');
        const address1 = document.querySelector('#address');
        address1.innerHTML = 'The certificate is verified. The address that signed it is' + ' ' + that.state.address ;
 
        var name1 = cert.data.name1;
        var subject = cert.data.subject;
        var year = cert.data.year;
        var qualification = cert.data.qualification;

        const certificateResult = document.querySelector('#certResults');
        certificateResult.innerHTML = 
              "<tr><th>" +
              certificateId +
              "</th><td>" +
              name1 +
              "</td><td>" +
              subject +
              "</td><td>" +
              year +
              "</td><td>" +
              qualification +
              "</td></tr>";
      } else {
        console.log('not verified');
        const address2 = document.querySelector('#address');
        address2.innerHTML = 'The certificate is NOT verified. The address that signed it is' + ' ' + that.state.address ;
        //document.getElementById('address').html('The certificate is NOT verified. The address that signed it is' + ' ' + that.state.address);
      }
    }).catch((err) => {
      console.error(err);
      window.alert("There was an error recovering signature.")
    });

    // show( elem1);
    // hide( elem2);  
  }

  onSubmit(event) {
    event.preventDefault()

      axios.get('http://localhost:1337/hash', {
    params: {
      // ID: 12345
    }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });  

    //   ipfs.files.add(this.state.buffer, (error, result) => {
    //     if(error) {
    //       console.error(error)
    //       return
    //     }
    //     this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
    //       return this.setState({ ipfsHash: result[0].hash })
    //       console.log('ifpsHash', this.state.ipfsHash)
    //     })
    //   })
   }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Certificate DApp</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Blockchain Certificate</h1>
              <p>Certificate hash is stored on The Ethereum Blockchain!</p>
            </div>

            {/*<div id="loader">
              <p className="pure-u-1-1">Loading...</p>
            </div>*/}
            <div id="content" className="pure-u-1-1">
              <h2>Sign a Document</h2>
              <p>Sign a document from your account with the form below and broadcast it to the blockchain!</p>
              <form onSubmit={this.signMessage} className="" role="form">
                
                <div className="form-group">
                  <input id="name1" className="form-control" type="text" name="name1"></input>
                </div>
                <div className="form-group">
                  <input id="subject" className="form-control" type="text"></input>
                </div>
                <div className="form-group">
                  <input id="year" className="form-control" type="text"></input>
                </div>
                <div className="form-group">
                  <input id="qualification" className="form-control" type="text"></input>
                </div>
                <button type="submit" className="pure-button-primary">Sign & Send</button>
              </form>
              <p id="msg"></p>
              <p id="signature"></p>
              {/*<button onClick={this.getCertificate}> get</button>
              <form onSubmit={this.getCertificate} className="" role="form">
                <div className="form-group">
                  <input id="identification" className="form-control" type="text"></input>
                </div>
                <button type="submit" className="pure-button-primary">Get Certificate</button>    
              </form>*/}
              <p id="certificate"></p>
              <form onSubmit={this.verify} className="" role="form">
                <div className="form-group">
                  <input id="certificateCount" className="form-control" type="text"></input>
                </div>
                {/*<div className="form-group">
                  <input id="ver_msg" className="form-control" type="text"></input>
                </div>*/}  
                <button type="submit" className="pure-button-primary">Validate</button>  
              </form> 
              <p id="address"></p>
              <table className="table">
               <thead>
                 <tr>
                   <th scope="col">#</th>
                   <th scope="col">Name</th>
                   <th scope="col">Subject</th>
                   <th scope="col">Year</th>
                   <th scope="col">Qualification</th>
                 </tr>
               </thead>
               <tbody id="certResults"></tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
    );
  }
}

export default App

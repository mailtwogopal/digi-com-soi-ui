import React from 'react';
import axios from 'axios';
import { Alert } from 'reactstrap';
import { Checkmark } from 'react-checkmark';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/components/layout.css';
import { Button } from 'react-bootstrap';
import ShowModal from './modal';
import Table from 'react-bootstrap/Table';
import addimage from './assets/addimage.svg';
import loadingIcon from './assets/loading.gif';

class LayoutSection extends React.Component {
    constructor(props) {
        super(props);
        this.calcLayoutSection = this.calcLayoutSection.bind(this);
        this.sendFormData = this.sendFormData.bind(this);
        this.callApi = this.callApi.bind(this);
        this.callbackFunction = this.callbackFunction.bind(this);        
        this.state = {
            userName: "",
            userEmail: "",
            image: addimage,
            objectCount: 0,
            objectsList: "",
            loading: 0,
            error: undefined,
            addModalShow: false,
            inputsection:"show-section",
            modaldisplay:"hide-section",
            formtitle:"Scan Details"
        };
        this.url = 'https://dkkmcz6a8g.execute-api.us-east-1.amazonaws.com/dev/upload-to-s3?username=' + this.state.userEmail;
        this.emailbodyarr = [];
        this.showConsentButton = true;
    }

    callbackFunction = (fromModal) => {
        if (fromModal !== "") {
            this.setState(({loading: 3}))
        }
    }
    callApi = async (reqBody, reqHeader) => {
        try {
            const data = await axios.post(this.url, reqBody, { headers: reqHeader }).then(res => {
                return res.data.body;
            })
            return data
        } catch (e) {
            console.log('Error in get labels :' + e);
        }
    }
    onChange(e) {
        let files = e.target.files;
        console.log('File Details:', files);
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);

        reader.onload = (e) => {
            let imageVal = e.target.result.split(',');
            this.setState(() => ({ image: imageVal[1] }));
        }
    }

    onChangeName(e) {
        this.setState({ userName: e.target.value });
    }

    onChangeEmail(e) {
        this.setState({ userEmail: e.target.value });
    }

    onBlur(e) {
        let url = 'https://83n292q7ka.execute-api.us-east-1.amazonaws.com/prod/?TopicArn=arn:aws:sns:us-east-1:268057325970:ListInfo'
        const getSubscription = async () => {
            try {
                const data = await axios.get(url).then(res => { // toLowerCase()
                    console.log('get method')
                    console.log(res.data.ListSubscriptionsByTopicResponse.ListSubscriptionsByTopicResult.Subscriptions.length);
                    res.data.ListSubscriptionsByTopicResponse.ListSubscriptionsByTopicResult.Subscriptions.map(item => {
                        if ((this.state.userEmail.toLocaleLowerCase()) === item.Endpoint) {
                            if (item.SubscriptionArn === "PendingConfirmation") {
                                this.showConsentButton = true;
                                return this.showConsentButton;
                            }
                            else {
                                this.showConsentButton = false;
                                return this.showConsentButton;
                            }
                        }
                        return this.showConsentButton;
                    })
                })
                return data;
            } catch (e) {
                console.log('Error in send data :' + e);
            }
        }
        getSubscription();
    }

    calcLayoutSection(e) {
        e.preventDefault();
        const name = (e.target.elements.name.value.trim());
        const email = (e.target.elements.email.value.trim());
        this.setState(() => ({ userName: name, userEmail: email, loading: 1 }));
        console.log('Inside calcLayoutSection');
        let reqBody = {
            "name": this.state.userName,
            "email": this.state.userEmail,
            "image": this.state.image
        }
        let reqHeader = {
            "Content-Type": "application/json"
        }

        const getLabels = async () => {
            const apiResp = await this.callApi(reqBody, reqHeader);
            let emailbodyobj = {};
            emailbodyobj = apiResp;
            emailbodyobj.Labels.map(item => {
                this.emailbodyarr.push(' ' + item.Name);
                return this.emailbodyarr;
            })
            this.setState(() => ({ objectsList: apiResp, loading: 2, inputsection:'hide-section', formtitle:"Scan Result" }));
        }
        getLabels();
    }

    handleClick(e) {
        window.location.reload();
        /* // e.preventDefault();
        this.setState(()=>(
        {
            userName: "",
            userEmail: "",
            image: addimage,
            objectCount: 0,
            objectsList: "",
            loading: 0,
            error: undefined,
            addModalShow: false,
            inputsection:"show-section",
            modaldisplay:"hide-section",
            formtitle:"Scan Details"
        })
        ) */
    }
  
    sendFormData(e) {
        e.preventDefault();
        console.log("identified objects that will be email to " + this.state.userEmail + " are :")
        console.log(this.emailbodyarr);
        let reqBody = {
            'subject': 'Analysis of the picture',
            "message": 'Dear ' +  this.state.userName +  '. Thanks for uploading the picture for analysis. We glad to inform you that, our analysis is complete and objects are identified. The result is as follows : ' + this.emailbodyarr + '.'
        }
        let config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        
        let url = 'https://rk7zodptd5.execute-api.us-east-1.amazonaws.com/Prod?TopicArn=arn:aws:sns:us-east-1:268057325970:ListInfo'
        const sendData = async () => {
            try {
                const data = await axios.post(url, reqBody, config).then(res => {
                    this.setState(() => ({ loading: 3 }));
                    this.inputName.value = '';
                    this.inputEmail.value = '';
                    this.inputImage.value = '';
                    return res.data.body;
                })
                return data;
            } catch (e) {
                console.log('Error in send data :' + e);
            }
        }
        sendData();
    }

    render() {
        console.log("webClass Render");
        let addModalClose = () => {
            this.setState({addModalShow: false})
            if (this.state.loading === 3) {
                this.setState({userName: '', userEmail: ''})
                this.inputImage.value = '';   
            }
        }
        return (
            <div className="container-main">
                <form className="container" onSubmit={this.calcLayoutSection}>

                        <div><h4 className="card-title">{this.state.formtitle}</h4></div>
                        <hr className="splitter"></hr>
                        <div className={this.state.inputsection}> 
                        <div className="row">
                            <div className="col-25">
                                <label>Name</label>
                            </div>
                            <div className="col-75">
                                <input 
                                    ref={(ref) => this.inputName = ref} 
                                    id="inputName" value={this.state.userName} 
                                    autoComplete='Off' 
                                    type='text' 
                                    name='name' 
                                    placeholder='Enter your name' 
                                    onChange={(e) => this.onChangeName(e)} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-25">
                                <label>Email</label>
                            </div>
                            <div className="col-75">
                                <input 
                                    ref={(ref) => this.inputEmail = ref} 
                                    id="inputEmail" value={this.state.userEmail} 
                                    autoComplete='Off' 
                                    type='email'
                                    name='email' 
                                    placeholder='Enter your email' 
                                    onChange={(e) => this.onChangeEmail(e)} 
                                    required
                                    pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
                                    onBlur={(e) => this.onBlur(e) }
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-25">
                                <label>Add Image</label>
                            </div>
                            <div className="col-75">
                            <label className="addimageContainer">
                                <input 
                                    ref={(ref) => this.inputImage = ref} 
                                    id="inputImage" 
                                    autoComplete='Off' 
                                    type='file' 
                                    name='image'
                                    accept='image/*'
                                    onChange={(e) => this.onChange(e)} 
                                />
                                <img src={(this.state.image).substr(-4)===".svg" ? this.state.image : `data:image/png;base64,${this.state.image}` } width="50px" alt="addimage"/>
                                
                            </label>
                             
                                
                               
                            </div>
                        </div>

                            <div className="button-align">
                                    <Button 
                                        variant="primary"
                                        disabled={((this.state.image).substr(-4)===".svg") ? true : false}
                                        type="submit"
                                        className="hideProp button_width"
                                    >
                                        Scan Image
                                    </Button>
                            </div>
                        </div>
                        
                        {this.state.loading === 1 ?
                            <div className="loadingbar">
                                <img src = {loadingIcon} alt = "fetching details..." />
                             {/* <p className="loadingbar"> Fetching Details....</p> */}
                            </div> :
                        <p></p>}
                        
                        {this.state.loading === 2 ?
                            <div className="row">
                                <div className="result-table"> 
                                    <div>
                                    <img className="scannedImage" alt="imagemissing" src={`data:image/png;base64,${this.state.image}`} />

                                        {/* <ol>
                                            <label>Objects identified for the uploaded picture:</label>
                                            {this.state.objectsList.Labels.map((lst, index) => {
                                                return (<li key={index}>
                                                    <p>{lst.Name}</p>
                                                </li>
                                                )   
                                            })}
                                        </ol> */}
                                        <Table className="table_sec" responsive striped bordered hover size="sm">
                                            <thead>
                                                <tr><th>#</th>
                                                    <th>Identified Object</th>
                                                    <th>Accuracy Level</th>
                                                    </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.objectsList.Labels.map((lst, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="align-center">{index+1}</td>
                                                        <td>{lst.Name}</td>
                                                        <td className="align-center">{Math.round(lst.Confidence) + "%"}</td>
                                                    </tr>
                                                );
                                            }
                                            )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div> :
                        <p></p>}

                        {this.state.loading === 2 && this.showConsentButton === true ?
                                <div className="button-align">
                                            <Button 
                                                variant="warning" 
                                                className="button_width"
                                                onClick={() => {this.setState({addModalShow: true, modaldisplay:"show-section"})}}>
                                                    Consent
                                            </Button>
                                            <Button 
                                                variant="secondary" 
                                                className="close-button "
                                                onClick={(e) => this.handleClick(e)} 
                                                >
                                                    Back
                                            </Button>
                                            <ShowModal 
                                                dataFromParent={this.state.userEmail}
                                                parentCallback={this.callbackFunction}
                                                show={this.state.addModalShow}
                                                onHide={addModalClose}
                                                display={this.state.modaldisplay}
                                            />
                                    </div>
                        :
                        <p></p>}

                        {this.state.loading === 2 && this.showConsentButton === false ?
                                <div className="button-align">
                                            <Button 
                                                variant="success" 
                                                className="button_width"
                                                onClick={this.sendFormData}>
                                                    Email Me
                                            </Button>
                                            <Button 
                                                variant="secondary" 
                                                className="close-button "
                                                onClick={(e) => this.handleClick(e)} 
                                                >
                                                    Back
                                            </Button>
                                            
                                    </div>
                        :
                        <p></p>}
                        
                        {this.state.loading === 3 ?
                            <div className="row">
                                <div className="emailConfirm">
                                    <div>
                                        <Checkmark 
                                            size='large'>
                                        </Checkmark>
                                        <Alert 
                                            color="success">
                                                Email sent successfully. Please check your inbox
                                        </Alert>
                                        <Button 
                                        variant="primary"
                                        type="button"
                                        className="close-button button_width"
                                        onClick={(e) => this.handleClick(e)} 
                                    >
                                        Home
                                    </Button>
                                    </div>
                                </div>
                            </div> :
                        <p></p>}
                    
                </form>
            </div>
        )
    }
}

export default LayoutSection;

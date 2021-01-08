import React from 'react';
import axios from 'axios';
import './styles/components/layout.css';
import * as ReactBootStrap from 'react-bootstrap';

class LayoutSection extends React.Component {
    constructor(props) {
        super(props);
        this.calcLayoutSection = this.calcLayoutSection.bind(this);
        this.sendFormData = this.sendFormData.bind(this);
        this.callApi = this.callApi.bind(this);
        this.state = {
            userName: "",
            userEmail: "",
            image: "",
            objectCount: 0,
            objectsList: "",
            loading: 0,
            error: undefined
        };
        this.url = 'https://dkkmcz6a8g.execute-api.us-east-1.amazonaws.com/dev/upload-to-s3?username=' + this.state.userEmail;
        this.emailbodyarr = [];
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
            //"Access-Control-Allow-Origin": "*",
            //"Access-Control-Request-Headers" : "Origin, Content-Type",
            //"Access-Control-Request-Methods": "OPTIONS,POST",
            "Content-Type": "application/json"
        }
        // let url = 'https://dkkmcz6a8g.execute-api.us-east-1.amazonaws.com/dev/upload-to-s3?username=' + this.state.userEmail;

        const getLabels = async () => {
            const apiResp = await this.callApi(reqBody, reqHeader);
            let emailbodyobj = {};
            emailbodyobj = apiResp;
            emailbodyobj.Labels.map(item => {
                this.emailbodyarr.push(' ' + item.Name);
                return this.emailbodyarr;
            })
            this.setState(() => ({ objectsList: apiResp, loading: 2 }));
        }
        getLabels();
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
                    // const onSubmit = (values, onSubmitProps) => {
                    //     onSubmitProps.onSubmitProps(false)
                    //     onSubmitProps.resetForm()
                    // }
                    this.inputName.value = '';
                    this.inputEmail.value = '';
                    this.inputImage.value = '';
                    return res.data.body;
                })
                return data
            } catch (e) {
                console.log('Error in send data :' + e);
            }
        }
        sendData();
    }

    render() {
        console.log("webClass Render");
        return (
            <div class="container">
                <form onSubmit={this.calcLayoutSection}>
                    <fieldset>
                        <legend>Details</legend>
                        <div class="row">
                            <div class="col-25">
                                <label>Name</label>
                            </div>
                            <div class="col-75">
                                <input ref={(ref) => this.inputName = ref} id="inputName" value={this.state.userName} autoComplete='Off' type='text' name='name' placeholder='Enter your name' onChange={(e) => this.onChangeName(e)} />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-25">
                                <label>Email</label>
                            </div>
                            <div class="col-75">
                                <input ref={(ref) => this.inputEmail = ref} id="inputEmail" value={this.state.userEmail} autoComplete='Off' type='text' name='email' placeholder='Enter your email' onChange={(e) => this.onChangeEmail(e)} />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-25">
                                <label>Image</label>
                            </div>
                            <div class="col-75">
                                <input ref={(ref) => this.inputImage = ref} id="inputImage" autoComplete='Off' type='file' name='image' onChange={(e) => this.onChange(e)} />
                            </div>
                        </div>

                        <div class="row">
                            <button disabled={((!this.state.userName) && (!this.state.userEmail) && (!this.state.image))}>Identify Objects</button>
                        </div>
                        {this.state.loading === 1 ?
                            <div>
                                <p> Fetching Details....</p>
                            </div> :
                            <p></p>}

                        {this.state.loading === 2 ?
                            <div class="row">
                                <div class="col-75">
                                    <div>
                                        <ol>
                                            <label>Objects identified for the uploaded picture:</label>
                                            {this.state.objectsList.Labels.map((lst, index) => {
                                                return (<li key={index}>
                                                    <p>{lst.Name}</p>
                                                </li>
                                                )
                                            })}
                                        </ol>
                                    </div>
                                </div>
                            </div> :
                            <p></p>}

                        {this.state.loading === 2 ?
                            <div class="row">
                                <div class="col-75">
                                    <div>
                                        <button type='reset' onClick={this.sendFormData}>Email Me</button>
                                    </div>
                                </div>
                            </div> :
                            <p></p>}
                        
                        {this.state.loading === 3 ?
                            <div class="row">
                                <div class="col-75">
                                    <div>
                                        <label>Email sent successfully. Please check your inbox</label>
                                    </div>
                                </div>
                            </div> :
                            <p></p>}
                    </fieldset>
                </form>
                <div>
                    <ReactBootStrap.Spinner animation="border" />
                </div>
            </div>
        )
    }
}

export default LayoutSection;
import { React, Component } from 'react';
import axios from 'axios';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import './styles/components/layout.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../src/Details';

class ShowModal extends Component{
    
    constructor(props) {
        super(props);
        console.log("Modal Constructor");
        this.sendSubscription = this.sendSubscription.bind(this);
        this.state = {
            snackbaropen: false, 
            snackbarmsg: ''
            // iAgreeButtonClicked: false
        }
        this.url = 'https://7c34ee83xf.execute-api.us-east-1.amazonaws.com/Prod/?TopicArn=arn:aws:sns:us-east-1:268057325970:ListInfo&Protocol=email';
    };
    
    snackbarClose = (event) =>{
        this.setState({snackbaropen:false});
    }

    sendSubscription(props) {
        console.log("inside modal component");
        console.log(this.props.dataFromParent);
        let reqBody = {
            "email": this.props.dataFromParent
        }
        let config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const checkConsent = async () => {
            try {
                console.log(JSON.stringify(reqBody));
                const data = await axios.post(this.url, reqBody, config).then(res => {
                    return res.data.SubscribeResponse.SubscribeResult.SubscriptionArn;
                })
                return data;
            } catch (e) {
                console.log('Error in send data :' + e);
            }
        }
        var consentResp = checkConsent();
        if (consentResp === "pending confirmation"){
        }
        this.props.onHide();
        // this.setState(() => ({iAgreeButtonClicked: true}))
    }  
    render() {
        return (
            <div className="container">
                <Snackbar 
                anchorOrigin={{vertical:'bottom',horizontal:'center'}}
                open = {this.state.snackbaropen}
                autoHideDuration = {3000}
                onClose={this.snackbarClose}

                message = {<span id="message-id">{this.state.snackbarmsg}</span>}
                action={[
                <IconButton
                key="close"
                arial-label="Close"
                color="inherit"
                onClick={this.snackbarClose}
                >
                x
                </IconButton>
                ]}
                />
                <Modal
                    {...this.props}
                    size="sm"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    keyboard={false}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Attention
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                        <p>
                            In order to receive email, please subscribe.
                        </p>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer class="button-align">
                        <Button 
                            variant="danger"
                            type="submit"
                            onClick={this.sendSubscription}
                            // onClick={this.sendSubscription(this.state.iAgreeButtonClicked)}
                        >
                            I Agree
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
export default ShowModal;
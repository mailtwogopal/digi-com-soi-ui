import React from 'react';
import axios from 'axios';
import './styles/components/layout.css';
import * as ReactBootStrap from 'react-bootstrap';

class LayoutSection extends React.Component{
    constructor(props){
        super(props);        
        this.calcLayoutSection = this.calcLayoutSection.bind(this);
        this.state = {
            userName:"",
            userEmail:"",
            image:"",
            objectCount:0,
            objectsList:"",
            loading:0,
            error: undefined,
            names: []
        };
      }

      onChange(e){
          let files = e.target.files;
          console.log('File Details:',files);
          let reader = new FileReader();
          reader.readAsDataURL(files[0]);

          reader.onload = (e) =>{
            //console.log('Uploaded Image',e.target.result);
            let imageVal = e.target.result.split(',');
              this.setState(() => ({ image: imageVal[1]}));
            }
      }

        onChangeName(e) {
            this.setState({ userName: e.target.value });
        }

        onChangeEmail(e) {
            this.setState({ userEmail: e.target.value });
        }
      
    calcLayoutSection(e){
      e.preventDefault();
      const name = (e.target.elements.name.value.trim());
      const email = (e.target.elements.email.value.trim());
      this.setState(() => ({ userName: name, userEmail: email, loading:1 }));
      console.log('Inside calcLayoutSection');
      let reqBody = {
          "name":this.state.userName,
          "email":this.state.userEmail,
          "image":this.state.image
        }
      let reqHeader = {
        //"Access-Control-Allow-Origin": "*",
        //"Access-Control-Request-Headers" : "Origin, Content-Type",
        //"Access-Control-Request-Methods": "OPTIONS,POST",
        "Content-Type": "application/json"
      }
      let url = 'https://dkkmcz6a8g.execute-api.us-east-1.amazonaws.com/dev/upload-to-s3?username='+this.state.userEmail

      const getLabels = async () => {
          try{
              const data = await axios.post(url, reqBody, {headers:reqHeader}).then(res => {
                    console.log('getLabels Response :'+ JSON.stringify(res.data.body))
                    this.setState(() => ({objectsList:res.data.body, loading:2}));
                    return res.data.body;
              })
              return data
          } catch(e){
              console.log('Error in get labels :'+e);
          }
      }
      getLabels();
    }
    
    render(){
        console.log("webClass Render");
        return(
            <div class="container">
                <form onSubmit={this.calcLayoutSection}>
                    <fieldset>
                        <legend>Details</legend>

                        <div class="row">
                            <div class="col-25">
                                <label>Name</label>
                            </div>
                            <div class="col-75">
                                <input autoComplete='Off' type='text' name='name' placeholder='Enter your name' onChangeName={(e)=>this.onChangeName(e)}/>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-25">
                                <label>Email</label>
                            </div>
                            <div class="col-75">
                                <input autoComplete='Off' type='text' name='email' placeholder='Enter your email' onChangeEmail={(e)=>this.onChangeEmail(e)}/>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-25">
                                <label>Image</label>
                            </div>
                            <div class="col-75">
                                <input autoComplete='Off' type='file' name='image' onChange={(e)=>this.onChange(e)}/>
                            </div>
                        </div>

                        <div class="row">
                            <button disabled={((!this.state.userName) && (!this.state.userEmail) && (!this.state.image))}>Identify Objects</button>
                        </div>          
                        {this.state.loading === 1 ? 
                        <div>
                            <p> Fetching Details....</p>
                        </div>: 
                        <p></p>}
                        
                        {this.state.loading === 2 ? 
                        <div class="row">
                            <div class="col-75">
                                {/* <label> {JSON.stringify(this.state.objectsList)}</label> */}
                                this.state.names = {JSON.stringify(this.state.objectsList)}
                                {/* <label>{this.state.names}</label> */}
                                <ul>
                                    {this.state.names.map(function(name, index){
                                        return (
                                            <div key={index}>
                                                <label>{name.Labels.Name}</label>
                                            </div>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>:
                        <p></p>}
                    </fieldset>
                </form>
                <div>
                    <ReactBootStrap.Spinner animation="border"/>
                </div>
            </div>
        )
    }
}

export default LayoutSection;
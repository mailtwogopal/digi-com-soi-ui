import React, {Component} from 'react'
import LayoutSection from './Details'


class LayoutClass extends Component{

    constructor(){   
        super();
        this.state = {
            likeCount : 0
        }
        console.log("webClass Constructor");     
    }

   countLike = () => {
        let totalCount = this.state.likeCount + 1
        this.setState({likeCount: totalCount});
   }
    
    render(){
        
        console.log("webClass Render");
        return(
            <div>
            <h1 align='center'>Smart Object Identifier</h1> 
            <h2 align='center'>Test Harness</h2> 
            <LayoutSection/>
            <br/>
            {this.state.likeCount > 100 ? <p> Reached 100 Likes </p>:''}
            <button onClick = {this.countLike} >Like</button>
            <p> Total Likes: {this.state.likeCount}</p>
            </div>
        )
    }

    componentDidMount(){
        console.log("webClass Component Did Mount");
    }

    componentDidUpdate(){
        console.log("webClass Component Updated")
    }

}

export default LayoutClass;
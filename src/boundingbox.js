import React from 'react';

class Boundingbox extends React.Component {

    constructor(){   
        super();    
    }

    render(){
        const params = {
            image: this.props.image,
            boxes: [
                // coord(0,0) = top left corner of image
                //[x, y, width, height]
                //[0, 0, 250, 250],
                //[300, 0, 250, 250],
                //[700, 0, 300, 25],
                //[1100, 0, 250, 300]
                { coord: [769, 386, 288, 189], label: "car1 - 98%" },
                { coord: [97, 34, 78, 75], label: "vinoth method" },
                { coord: [700, 0, 300, 25], label: "B" },
                { coord: [1100, 0, 25, 300], label: "C" }
            ],
            options: {
                colors: {
                    normal: 'rgba(255,225,255,1)',
                    selected: 'rgba(0,225,204,1)',
                    unselected: 'rgba(100,100,100,1)'
                },
                showLabels: true
            }
        }

        return(
            <label>From boundingbox component</label>
        )
    }

}

export default Boundingbox;
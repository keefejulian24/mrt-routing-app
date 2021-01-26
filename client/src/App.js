import {Component} from 'react';
import './App.css';
import Selector from './components/Selector';
import Routes from './components/Routes';
import Button from '@material-ui/core/Button';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stations: [],
            source: '',
            destination: '',
            routes: [],
            initial: true
        };
    }
    
    handleSourceChange = (e) => {
        this.setState({ source: e.target.value });
    };

    handleDestinationChange = (e) => {
        this.setState({ destination: e.target.value });
    };

    // get route suggestions for normal case (without time)
    findRoute = async () => {
        var response = await fetch(`/navigation?source=${this.state.source}&destination=${this.state.destination}`);
        var routes = await response.json();
        this.setState({routes: routes, initial: false})
    };

    // get list of station names
    getStations = async () => {
        var response = await fetch(`/stations`);
        var stations = await response.json();
        return stations.sort();
    };

    componentDidMount() {
        this.getStations()
            .then(res => {
                this.setState({stations: res});
            })
    };

    render() {
        return (
            <div className='app'>
                <h2>MRT ROUTING APP</h2>
                <div className='form'>
                    <Selector
                        label = 'Source'
                        onChange = {this.handleSourceChange}
                        value = {this.state.source}
                        options = {this.state.stations}
                    />
                    <Selector
                        label = 'Destination'
                        onChange = {this.handleDestinationChange}
                        value = {this.state.destination}
                        options = {this.state.stations}
                    />
                    <Button variant="contained" color="primary" onClick={this.findRoute}>Find Route</Button>
                </div>
                {this.state.initial ? 
                    <div className='result'>
                        Please select source and destination
                    </div>
                    :
                    this.state.routes.length > 0 ?
                        <div className='result'>
                            <Routes routes={this.state.routes}/>
                        </div>
                        :
                        <div className='result'>
                            No available route found
                        </div>
                }
                
            </div>
        );
    }
}

export default App;

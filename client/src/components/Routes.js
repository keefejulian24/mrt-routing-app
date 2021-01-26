import { makeStyles } from '@material-ui/core/styles';
import Route from './Route';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    }
}));

// List of route component
function Routes(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {props.routes.map((route, idx) => (
                <Route rank={idx+1} route={route}/>
            ))}
            
        </div>
    );
}

export default Routes;
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        minWidth: 500
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

// Accordion component containing list of steps
function Route(props) {
    const classes = useStyles();

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography className={classes.heading}>Route {props.rank} ({props.route.cost} station(s) travelled)</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List className={classes.root}>
                    {props.route.steps.map((step, idx) => (
                        <ListItem>
                            <ListItemText primary={(idx+1) + '. ' + step} />
                        </ListItem>
                    ))}
                </List>
            </AccordionDetails>
        </Accordion>
    );
}

export default Route;
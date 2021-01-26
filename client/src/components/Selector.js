import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

// Drop down selector component
function Selector(props) {
    const classes = useStyles();

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel>
                    {props.label}
                </InputLabel>
                <Select
                    value={props.value}
                    onChange={props.onChange}
                    displayEmpty
                    className={classes.selectEmpty}
                >
                {props.options.map((name) => (
                    <MenuItem key={name} value={name}>
                        {name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default Selector;
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

export default function ColindanciaTransList({onChange, colindanciasSelected}) {
    const fracciones = useSelector(state => state.fracciones.fracciones);

    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(() => {
        if(fracciones){
            setLeft(fracciones);
        }
    }, []);

    useEffect(() => {
        console.log("colindanciasSelected: ", colindanciasSelected);
        const inicialiceTransList = () =>{
            let checkedCols = fracciones.filter(f => {
                let existId = colindanciasSelected.find(cs => cs === f.id);
                return existId !== undefined;
            });
            console.log("colindancias Checked right: ", colindanciasSelected);
            if(checkedCols.length > 0){
                let initLeft = fracciones;
                let leftCheck = intersection(checkedCols, initLeft);
                setRight(leftCheck);
                setLeft(not(initLeft, leftCheck));
                setChecked(not(checkedCols, leftCheck));
            }
        }

        if(colindanciasSelected.length > 0){
            inicialiceTransList();
        }else{
            setLeft(fracciones);
            setRight([]);
            setChecked([]);
        }
    }, [colindanciasSelected]);

    useEffect(() => {
        console.log("Change Right: ", right);
        onChange(right);
    }, [right]);
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (title, items) => (
        <Card>
            <CardHeader
                sx={{ px: 2, py: 1 , backgroundColor: '#1f2a40', backgroundImage: 'none'}}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        color="secondary" variant="contained"
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{
                    width: 250,
                    height: 230,
                    bgcolor: '#3d475b',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value.id}-label`;
                    const itemLabel = `Lote: ${value.lote} - Número catastral: ${value.numeroCatastral}`;

                    return (
                        <ListItem
                            key={value.id}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    color="secondary" variant="contained"
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={itemLabel} />
                        </ListItem>
                    );
                })}
            </List>
        </Card>
    );

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>{customList('Colindancias', left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        color="secondary"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="mover seleccionado a la derecha"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="mover seleccionado a la izquierda"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList('Seleccionadas', right)}</Grid>
        </Grid>
    );
}

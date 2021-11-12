import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import Modal from "react-modal";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { api } from "../constants";
import "./Users.css";

Modal.setAppElement("#root");

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  { id: "email", numeric: false, disablePadding: true, label: "Email" },
  { id: "role", numeric: false, disablePadding: true, label: "Role" },
  { id: "password", numeric: false, disablePadding: true, label: "Password" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "normal" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <Typography
        className={classes.title}
        variant="h5"
        id="tableTitle"
        component="div"
      >
        Users
      </Typography>

      {numSelected === 1 ? (
        <React.Fragment>
          <Tooltip title="Edit">
            <IconButton aria-label="edit" onClick={props.onEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={props.onDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      ) : (
        <Tooltip title="Add">
          <IconButton aria-label="Add" onClick={props.handleAdd}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    width: "380px ",
    display: "flex",
    justifyContent: "center",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function Users() {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [modal, setmodal] = useState({
    isAdmin: false,
    name: "",
    email: "",
    password: "",
  });
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const history = useHistory();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChange = (key) => (event) => {
    setmodal((old) => {
      return {
        ...old,
        [key]: event.target.value,
      };
    });
  };

  const handleClick = (event, email) => {
    const selectedIndex = selected.indexOf(email);

    if (selectedIndex === -1) {
      setSelected([email]);
    } else {
      setSelected([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (email) => selected.indexOf(email) !== -1;

  const onDelete = () => {
    const confirm = window.confirm("Are you sure?");
    if (confirm) {
      axios
        .post(api.deleteuser, { email: selected[0] })
        .then((data) => {
          setSelected([]);
          setRows((old) => old.filter((data) => data.email !== selected[0]));
          toast.success("Deleted successfully!", {
            position: "top-right",
            autoClose: 1750,
            hideProgressBar: true,
          });
        })
        .catch((error) => {
          toast.error("Error!", {
            position: "top-right",
            autoClose: 1750,
            hideProgressBar: true,
          });
        });
    }
  };

  const onEdit = () => {
    history.push(`/admin/edituser/${selected[0]}`);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  function handleModal() {
    setIsOpen((old) => !old);
  }

  const saveUser = () => {
    axios
      .post(api.signup , {
        name: modal.name,
        email: modal.email,
        password: modal.password,
        role: modal.isAdmin ? 0 : 1,
      })
      .then((data) => {
        if (data.data === "SUCCESS") {
          setRows((old) => {
            return [
              ...old,
              {
                name: modal.name,
                password: modal.password,
                email: modal.email,
                role: modal.isAdmin ? 0 : 1,
              },
            ];
          });
          setmodal({
            isAdmin: false,
            name: "",
            email: "",
            password: "",
          });
          handleModal();
          toast.success("saved successfully!", {
            position: "top-right",
            autoClose: 1750,
            hideProgressBar: true,
          });
        }
      })
      .catch((err) => {
        window.alert(err);
      });
  };

  useEffect(() => {
    axios
      .get(api.users)
      .then((data) => {
        setRows(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      setRows([]);
    };
  }, []);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleAdd={handleModal}
          onDelete={onDelete}
          onEdit={onEdit}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.email);
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.email)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.email}</TableCell>
                      <TableCell align="center">
                        {row.role ? "user" : "admin"}
                      </TableCell>
                      <TableCell align="center">{row.password}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleModal}
          style={customStyles}
          contentLabel="Add Modal"
        >
          <div id="add-user-modal">
            <div>
              <TextField
                id="standard-basic"
                label="Name"
                value={modal.name}
                onChange={handleChange("name")}
              />
            </div>
            <div>
              <TextField
                id="standard-basic"
                label="Email"
                value={modal.email}
                onChange={handleChange("email")}
              />
            </div>
            <div>
              <TextField
                id="standard-basic"
                label="Password"
                value={modal.password}
                onChange={handleChange("password")}
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={modal.isAdmin}
                    onChange={(event) => {
                      setmodal((old) => {
                        return {
                          ...old,
                          isAdmin: event.target.checked,
                        };
                      });
                    }}
                  />
                }
                label="Admin"
              />
            </div>
            <div>
              <div>
                <Button variant="contained" color="primary" onClick={saveUser}>
                  add
                </Button>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleModal}
                >
                  cancel
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
      <ToastContainer />
    </div>
  );
}

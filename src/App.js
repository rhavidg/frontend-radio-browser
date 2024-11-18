import * as React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Pagination } from "@mui/material";
import Typography from "@mui/material/Typography";
import service from "./services/service.js";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReactPlayer from "react-player";
import { ActionsContainer, DetailsWrapper, PageContainer } from "./styles";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { Drawer, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function App() {
  const [radios, setRadios] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [searchParam, setSearchParam] = React.useState("name");
  const [page, setPage] = React.useState(1);
  const [favorites, setFavorites] = React.useState(() => {
    const storedFavorites = localStorage.getItem("Favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [itemEdit, setItemEdit] = React.useState();
  const [itemEditIndex, setItemEditIndex] = React.useState();
  const [startIndex, setStartIndex] = React.useState(0);
  const [endIndex, setEndIndex] = React.useState(10);
  const [currentItems, setCurrentItems] = React.useState([]);
  const itemsPerPage = 10;
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(true);
  const timeoutRef = React.useRef(null);

  const handleKeyUp = (e) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      getRadiosByParam();
    }, 500);
  };
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    bgcolor: "background.paper",
    border: "1px solid transparent",
    borderRadius: "25px",
    boxShadow: 24,
    p: 4,
  };

  function redirect(link) {
    window.open(link);
  }
  async function getRadios() {
    const result = await service.getRadios();
    setRadios(result.data);
    setCurrentItems(result.data.slice(startIndex, endIndex));
  }

  async function getRadiosByParam() {
    const result = await service.getRadiosByParam(searchParam, search);
    setRadios(result.data);
  }

  function handleModalClose() {
    setIsModalOpen(false);
  }

  function getFavorites() {
    const favorites = localStorage.getItem("Favorites");
    if (favorites) {
      setFavorites(JSON.parse(favorites));
    } else {
      setFavorites([]);
    }
  }

  React.useEffect(() => {
    getRadios();
    getFavorites();
  }, []);

  React.useEffect(() => {
    const newStartIndex = (page - 1) * itemsPerPage;
    const newEndIndex = newStartIndex + itemsPerPage;
    setStartIndex(newStartIndex);
    setEndIndex(newEndIndex);
    setCurrentItems(radios.slice(newStartIndex, newEndIndex));
  }, [page, radios]);

  React.useEffect(() => {
    if (itemEdit && itemEdit.stationuuid) {
      const updatedFavorites = favorites.map((item) => {
        if (item.stationuuid === itemEdit.stationuuid) {
          return itemEdit;
        }
        return item;
      });
      setFavorites(updatedFavorites);
    }
  }, [itemEdit]);

  React.useEffect(() => {
    localStorage.setItem("Favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div className="App">
      <div>
        <Button variant="contained" id="btn-menu" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </Button>
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              borderRight: "1px solid gray",
              padding: "10px",
              width: "25vw",
            }}
            id="drawer"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <div>
                <TextField
                  id="standard-basic"
                  variant="standard"
                  placeholder="search here"
                  value={search}
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: "5px",
                    height: "50px",
                  }}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyUp={() => handleKeyUp()}
                />
              </div>

              <div>
                <InputLabel id="demo-simple-select-label">Search by</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Search for"
                  sx={{ bgcolor: "background.paper", height: "50px" }}
                  onChange={(e) => {
                    setSearchParam(e.target.value);
                  }}
                  value={searchParam}
                >
                  <MenuItem value={"name"}>Name</MenuItem>
                  <MenuItem value={"country"}>Country</MenuItem>
                  <MenuItem value={"language"}>Language</MenuItem>
                </Select>
              </div>
              <div
                style={{
                  width: "25%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
                onClick={toggleDrawer(false)}
              >
                <CloseIcon sx={{ cursor: "pointer" }} />
              </div>
            </Box>

            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                borderRadius: "25px",
                marginTop: "10px",
                padding: "10px",
              }}
            >
              {currentItems &&
                currentItems.map((item) => {
                  return (
                    <>
                      <ListItem
                        alignItems="flex-start"
                        onClick={() =>
                          setFavorites((prevFavorites) => {
                            if (
                              prevFavorites.some(
                                (fav) => fav.stationuuid === item.stationuuid
                              )
                            ) {
                              return prevFavorites;
                            }
                            return [...prevFavorites, item];
                          })
                        }
                        sx={{ cursor: "pointer" }}
                      >
                        <ListItemAvatar>
                          <Avatar alt="Remy Sharp" src={item.favicon} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.name}
                          secondary={
                            <Box
                              sx={{
                                display: "flex",
                                gap: "10px",
                              }}
                            >
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  color: "text.primary",
                                  display: "inline",
                                }}
                              >
                                {item.country}
                              </Typography>
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  color: "text.primary",
                                  display: "inline",
                                }}
                              >
                                {favorites.some(
                                  (favorite) =>
                                    favorite.stationuuid === item.stationuuid
                                ) && <CheckIcon />}
                              </Typography>
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  color: "text.primary",
                                  display: "inline",
                                  marginLeft: "auto",
                                }}
                                onClick={() => setCurrentlyPlaying(item)}
                              >
                                <PlayCircleOutlineIcon />
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </>
                  );
                })}
              {radios && (
                <Pagination
                  count={
                    radios.length % 10 === 0
                      ? radios.length / 10
                      : radios.length / 10 + 1
                  }
                  page={page}
                  onChange={(event, value) => setPage(value)}
                />
              )}
            </List>
          </Box>
        </Drawer>
      </div>
      <PageContainer>
        <Box>
          <h1>Radio Browser</h1>
          <h2>FAVORITE RADIOS</h2>,
          <List
            sx={{
              width: "500px",
              bgcolor: "background.paper",
              borderRadius: "25px",
              padding: "10px",
            }}
            id="list"
          >
            <h1>Now playing</h1>
            {currentlyPlaying && currentlyPlaying.url ? (
              <Box>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={currentlyPlaying.favicon} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={currentlyPlaying.name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "text.primary", display: "inline" }}
                        >
                          {currentlyPlaying.country}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <ReactPlayer
                  url={currentlyPlaying.url}
                  playing={true}
                  controls={true}
                  width="100%"
                  height="50px"
                />
                <Divider variant="inset" component="hl" />
              </Box>
            ) : (
              <p>Click on a radio to play</p>
            )}

            {favorites &&
              favorites.map((item, index) => {
                return (
                  <Box id="list">
                    <ListItem alignItems="center">
                      <ListItemAvatar onClick={() => setCurrentlyPlaying(item)}>
                        <Avatar alt="Remy Sharp" src={item.favicon} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={
                          <DetailsWrapper>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: "text.primary", display: "inline" }}
                            >
                              {item.country}
                            </Typography>
                          </DetailsWrapper>
                        }
                        sx={{ cursor: "pointer" }}
                        onClick={() => setCurrentlyPlaying(item)}
                      />
                      <ActionsContainer>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: "text.primary",
                            display: "inline",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setItemEdit(item);
                            setItemEditIndex(index);
                            setIsModalOpen(true);
                          }}
                        >
                          <EditIcon />
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: "text.primary",
                            display: "inline",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setFavorites((prevFavorites) => {
                              if (
                                currentlyPlaying &&
                                currentlyPlaying.stationuuid == item.stationuuid
                              ) {
                                setCurrentlyPlaying(null);
                              }
                              const updatedFavorites = prevFavorites.filter(
                                (fav) => fav.stationuuid !== item.stationuuid
                              );
                              return updatedFavorites;
                            })
                          }
                        >
                          <DeleteIcon data-testid="delete-icon" />
                        </Typography>
                      </ActionsContainer>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </Box>
                );
              })}
          </List>
        </Box>
      </PageContainer>

      {/* Edit modal */}
      {itemEdit && (
        <Modal open={isModalOpen} onClose={handleModalClose}>
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit your radio
            </Typography>
            <InputLabel sx={{ marginTop: "10px" }}>Name:</InputLabel>
            <TextField
              value={itemEdit.name}
              onChange={(e) =>
                setItemEdit((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              sx={{ marginTop: "10px" }}
            />
            <InputLabel sx={{ marginTop: "10px" }}>Country:</InputLabel>
            <TextField
              value={itemEdit.country}
              onChange={(e) =>
                setItemEdit((prev) => ({
                  ...prev,
                  country: e.target.value,
                }))
              }
              sx={{ marginTop: "10px" }}
            />
          </Box>
        </Modal>
      )}
    </div>
  );
}

export default App;

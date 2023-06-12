import React, { useEffect, useState } from "react";
import { PageTitle } from "../components/PageTitle";
import PokeList from "../components/PokeList";
import { SearchBox } from "../components/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { getPokemons } from "../features/pokemons/pokemonSlice";
import { useLocation } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

export const HomePage = () => {
  const { search, page, type } = useSelector((state) => state.pokemons);
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = location;
  const pokemonAdded = state ? state.pokemonAdded : false;

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    console.log("Pokemon added:", pokemonAdded);
    if (pokemonAdded) {
      setOpenSnackbar(true);
      const { state } = location;
      if (state && state.pokemonAdded) {
        delete state.pokemonAdded;
      }
    }
  }, [pokemonAdded, location]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  useEffect(() => {
    dispatch(getPokemons({ page, search, type }));
  }, [page, search, type, dispatch]);

  return (
    <>
      {pokemonAdded && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Pokemon added successfully!
          </Alert>
        </Snackbar>
      )}
      <PageTitle title="Pokedex" />
      <SearchBox />
      <PokeList />
    </>
  );
};

import { FormProvider, FTextField } from "./form";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  alpha,
  Stack,
  Chip,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

import { addPokemon } from "../features/pokemons/pokemonSlice";
import { useNavigate } from "react-router-dom";
import { pokemonTypes } from "../pokemonTypes";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const defaultValues = {
  name: "",
  id: "",
  url: "",
  type1: "",
  type2: "",
};

export default function PokemonModal({ open, setOpen }) {
  const navigate = useNavigate();
  const methods = useForm(defaultValues);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const dispatch = useDispatch();

  const { pokemons } = useSelector((state) => state.pokemons);

  // Find the maximum ID from the existing Pokemon list
  const maxPokemonId = Math.max(
    ...pokemons.map((pokemon) => parseInt(pokemon.id))
  );

  // Calculate the new ID by incrementing the maximum ID by 1
  const newPokemonId = maxPokemonId + 1;

  const onSubmit = (data) => {
    const { name, url } = data;
    const types = selectedTypes.filter((type) => type !== "");
    dispatch(
      addPokemon({
        name,
        id: newPokemonId.toString(),
        imgUrl: url,
        types,
      })
    );
    navigate("/");
    handleClose();
  };

  const handleClose = () => setOpen(false);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleChange = (event) => {
    const selected = event.target.value;
    if (selected.length <= 2) {
      setSelectedTypes(selected);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Typography variant="subtitle2">Name</Typography>
              <FTextField
                name="name"
                fullWidth
                rows={4}
                placeholder="Enter Pokemon's name"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <Typography variant="subtitle2">Image Url</Typography>
              <FTextField
                name="url"
                fullWidth
                // rows={4}
                placeholder="Enter Image Url"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <Typography variant="subtitle2">Select types</Typography>
              <Select
                labelId="multiple-types-label"
                id="multiple-types"
                multiple
                value={selectedTypes}
                onChange={handleChange}
                MenuProps={MenuProps}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {pokemonTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    <span
                      style={{
                        fontWeight: selectedTypes.includes(type)
                          ? "bold"
                          : "normal",
                      }}
                    >
                      {type}
                    </span>
                  </MenuItem>
                ))}
              </Select>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="small"
                  loading={
                    isSubmitting
                    // || isLoading
                  }
                >
                  Create Pokemon
                </LoadingButton>
              </Box>
            </Stack>
          </FormProvider>
        </Box>
      </Modal>
    </div>
  );
}

import Box from '@mui/material/Box';
import { FormProvider, FTextField } from './form';
import Modal from '@mui/material/Modal';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector} from 'react-redux';
import { alpha, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { addPokemon } from '../features/pokemons/pokemonSlice';
import { useNavigate } from 'react-router-dom';
import { POKEMONS_PER_PAGE } from '../../app/config';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const defaultValues = {
    name: '',
    id: '',
    url: '',
    type1: '',
    type2: '',
};

export default function PokemonModal({ open, setOpen }) {
    const navigate = useNavigate()
    const methods = useForm(defaultValues);
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    const dispatch = useDispatch();

    const { pokemons } = useSelector((state) => state.pokemons);

    // Find the maximum ID from the existing Pokemon list
    const maxPokemonId = Math.max(...pokemons.map((pokemon) => parseInt(pokemon.id)));

    // Calculate the new ID by incrementing the maximum ID by 1
    const newPokemonId = maxPokemonId + 1;

    const onSubmit = (data) => {
        const { name, url, type1, type2 } = data
        dispatch(addPokemon({ name, id: newPokemonId.toString(), imgUrl: url, types: [type1, type2] }))
                
        // Calculate the new page based on the maximum ID and the limit
        const newPage = Math.ceil((maxPokemonId + 1) / POKEMONS_PER_PAGE);

        navigate(`/pokemons/${newPokemonId}`, { state: { page: newPage } });
        handleClose();
    };

    const handleClose = () => setOpen(false);

    return (
        <div>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            <FTextField
                                name="name"
                                fullWidth
                                rows={4}
                                placeholder="Name"
                                sx={{
                                    '& fieldset': {
                                        borderWidth: `1px !important`,
                                        borderColor: alpha('#919EAB', 0.32),
                                    },
                                }}
                            />
                            {/* <FTextField
                                name="id"
                                fullWidth
                                rows={4}
                                placeholder="Id"
                                sx={{
                                    '& fieldset': {
                                        borderWidth: `1px !important`,
                                        borderColor: alpha('#919EAB', 0.32),
                                    },
                                }}
                            /> */}
                            <FTextField
                                name="url"
                                fullWidth
                                // rows={4}
                                placeholder="Image Url"
                                sx={{
                                    '& fieldset': {
                                        borderWidth: `1px !important`,
                                        borderColor: alpha('#919EAB', 0.32),
                                    },
                                }}
                            />
                            <FTextField
                                name="type1"
                                fullWidth
                                rows={4}
                                placeholder="Type 1"
                                sx={{
                                    '& fieldset': {
                                        borderWidth: `1px !important`,
                                        borderColor: alpha('#919EAB', 0.32),
                                    },
                                }}
                            />
                            <FTextField
                                name="type2"
                                fullWidth
                                rows={4}
                                placeholder="Type 2"
                                sx={{
                                    '& fieldset': {
                                        borderWidth: `1px !important`,
                                        borderColor: alpha('#919EAB', 0.32),
                                    },
                                }}
                            />

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
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

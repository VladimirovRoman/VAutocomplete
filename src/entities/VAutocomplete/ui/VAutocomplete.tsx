import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { fetchComments, searchComments } from '../model/services/fetchComments';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store/store';
import { getComments, getLoadingStatus } from '../model/selectors/commentsSelectors';
import { IComment } from '../model/types/comment';
import { Button, CircularProgress } from '@mui/material';
import { ListboxComponent, StyledPopper } from '../../../app/shared';

export function VAutocomplete() {
    const dispatch = useDispatch<ThunkDispatch<RootState, void, any>>();
    const comments = useSelector(getComments) as IComment[];
    const loading = useSelector(getLoadingStatus);
    const [inputValue, setInputValue] = React.useState<string>('');

    function debounce(func: Function, delay: number) {
        let timeoutId: ReturnType<typeof setTimeout>;

        return function debounced(...args: any[]) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    }

    const debouncedSearch = React.useCallback(
        debounce((value: string) => {
            dispatch(searchComments(value));
        }, 1000),
        [dispatch]
    );

    const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
        setInputValue(value);
        debouncedSearch(value);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <Button onClick={() => dispatch(fetchComments())} variant="outlined">
                Autocomplete
            </Button>
            <Autocomplete
                id="virtualize-demo"
                sx={{ width: 700 }}
                disableListWrap
                PopperComponent={StyledPopper}
                ListboxComponent={ListboxComponent}
                options={comments}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                getOptionLabel={(option: IComment) => option.name}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Comments"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading === 'loading' ? (
                                        <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                renderOption={(props, option, state) => {
                    return [props, option, state.index] as React.ReactNode;
                }}
                renderGroup={(params) => params as any}
            />
        </div>
    );
}

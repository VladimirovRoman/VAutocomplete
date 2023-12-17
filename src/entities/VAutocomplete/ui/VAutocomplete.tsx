/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { Autocomplete, CircularProgress, TextField, Card, CardContent, Button } from '@mui/material';
import { getComments, getLoadingStatus } from '../model/selectors/commentsSelectors';
import { fetchComments } from '../model/services/fetchComments';
import { IComment } from '../model/types/comment';
import { RootState } from '../../../app/store/store';

import styles from './VAutocomplete.module.css';

export const VAutocomplete = () => {
    const dispatch = useDispatch<ThunkDispatch<RootState, void, any>>();
    const [filteredComments, setFilteredComments] = useState<IComment[]>([]);
    const comments = useSelector(getComments) as IComment[];
    const loading = useSelector(getLoadingStatus);

    useEffect(() => {
        setFilteredComments(comments);
    }, [comments]);

    return (
        <div className={styles.comments_container}>
            <Button onClick={() => dispatch(fetchComments())} variant="outlined">
                Autocomplete
            </Button>
            <Autocomplete
                className=""
                options={filteredComments || []}
                getOptionLabel={(option: IComment) => option.name}
                loading={loading === 'loading'}
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
                renderOption={(props, option: IComment, state) => (
                    <li {...props}>
                        <Card variant="outlined">
                            <CardContent
                                style={{ backgroundColor: state.index % 2 === 0 ? 'white' : 'lightgray' }}
                            >
                                <p>name: {option.name} </p>
                                <p>email : {option.email}</p>
                                <p>body : {option.body}</p>
                            </CardContent>
                        </Card>
                    </li>
                )}
                style={{ width: 700, marginTop: 20 }}
            />
        </div>
    );
};

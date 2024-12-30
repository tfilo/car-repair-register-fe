import { CloudUpload, Delete } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useId, useRef } from 'react';
import FileComponent from './FileComponent';

type FileInputProps = {
    label: string;
    files: FileList | null;
    setFiles: (files: FileList | null) => void;
};

type SelectedFilesProps = {
    files: FileList | null;
};

const SelectedFiles: React.FC<SelectedFilesProps> = ({ files }) => {
    if (files === null) {
        return null;
    }

    return (
        <Stack
            display='flex'
            flexDirection='column'
            gap={2}
        >
            <Typography>Nové prílohy na nahratie:</Typography>
            {Array.from(files).map((f) => (
                <FileComponent
                    fileSize={f.size}
                    fileType={f.type}
                    fileName={f.name}
                    key={f.name}
                />
            ))}
        </Stack>
    );
};

const FileInput: React.FC<FileInputProps> = ({ label, files, setFiles }) => {
    const uniqueId = useId();
    const inputRef = useRef<HTMLInputElement>(null);

    const onFileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(event.target.files);
    };

    return (
        <Box
            display='flex'
            flexDirection='column'
            border='1px solid lightgray'
            borderRadius={1}
            padding={2}
            gap={2}
        >
            <Box
                display='flex'
                gap={2}
                justifyContent='space-between'
            >
                <Button
                    startIcon={<CloudUpload />}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (inputRef && 'current' in inputRef) {
                            inputRef.current?.click();
                        }
                    }}
                    variant='outlined'
                    sx={{ height: 48 }}
                >
                    {label}
                </Button>
                {files !== null && (
                    <Button
                        startIcon={<Delete />}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setFiles(null);
                            if (inputRef && 'current' in inputRef && inputRef.current !== null) {
                                inputRef.current.value = '';
                            }
                        }}
                        variant='outlined'
                        color='error'
                        sx={{ height: 48 }}
                    >
                        Odstrániť nové prílohy
                    </Button>
                )}
            </Box>
            <input
                title={label}
                id={uniqueId + 'fileInput'}
                ref={inputRef}
                multiple
                accept='image/*,.pdf,.doc,.docx,.odt,.ods,.xlsx,.xls,.txt,.rtf'
                type='file'
                onChange={onFileChangeHandler}
                style={{
                    display: 'none'
                }}
                tabIndex={-1}
            />
            <SelectedFiles files={files} />
        </Box>
    );
};

export default FileInput;

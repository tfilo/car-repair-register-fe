import { CloudUpload, Delete } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useId, useRef } from 'react';
import FileComponent from './FileComponent';

type FileInputProps = {
    label: string;
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

type SelectedFilesProps = {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

const SelectedFiles: React.FC<SelectedFilesProps> = ({ files, setFiles }) => {
    if (files.length === 0) {
        return null;
    }

    return (
        <Stack
            display='flex'
            flexDirection='column'
            gap={2}
        >
            <Typography>Nové prílohy na nahratie:</Typography>
            {files.map((f, fIndex) => (
                <FileComponent
                    fileSize={f.size}
                    fileType={f.type}
                    fileName={f.name}
                    key={`${f.name}_${fIndex}`}
                    onDelete={() =>
                        setFiles((prev) => {
                            return prev.filter((_, idx) => idx !== fIndex);
                        })
                    }
                />
            ))}
        </Stack>
    );
};

const FileInput: React.FC<FileInputProps> = ({ label, files, setFiles }) => {
    const uniqueId = useId();
    const inputRef = useRef<HTMLInputElement>(null);

    const onFileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles: File[] = [];
            for (const file of event.target.files) {
                newFiles.push(file);
            }
            setFiles((prev) => {
                return [...prev, ...newFiles];
            });
        }
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
                    data-cy='add-file-button'
                >
                    {label}
                </Button>
                {files.length > 0 && (
                    <Button
                        startIcon={<Delete />}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setFiles([]);
                            if (inputRef && 'current' in inputRef && inputRef.current !== null) {
                                inputRef.current.value = '';
                            }
                        }}
                        variant='outlined'
                        color='error'
                        sx={{ height: 48 }}
                        data-cy='remove-files-button'
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
            <SelectedFiles
                files={files}
                setFiles={setFiles}
            />
        </Box>
    );
};

export default FileInput;

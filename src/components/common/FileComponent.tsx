import { Delete, DescriptionOutlined, Download, PhotoOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import { useMemo } from 'react';
import { fileSizeFormatter } from '../../utils/formatterUtil';

type FileComponentProps = {
    fileType: string;
    fileSize?: number;
    fileName: string;
    onDownload?: () => Promise<void> | void;
    onDelete?: () => Promise<void> | void;
    isPending?: boolean;
};

const FileComponent: React.FC<FileComponentProps> = ({ fileName, fileType, fileSize, onDownload, onDelete, isPending }) => {
    const Icon = useMemo(() => {
        if (fileType.toLowerCase().startsWith('image/')) {
            return PhotoOutlined;
        } else if (fileType.toLowerCase() === 'application/pdf') {
            return PictureAsPdfOutlined;
        } else {
            return DescriptionOutlined;
        }
    }, [fileType]);

    return (
        <Card sx={{ display: 'flex', paddingX: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: '1' }}>
                    <Icon fontSize='large' />
                    <CardContent sx={{ flex: '1' }}>
                        <Typography
                            sx={{ wordBreak: 'break-all' }}
                            component='div'
                            variant='subtitle1'
                            data-cy={`download-${fileName.toLowerCase().replaceAll(' ', '_')}-file-name`}
                        >
                            {fileName}
                        </Typography>
                        {fileSize !== undefined && (
                            <>
                                <Typography
                                    variant='subtitle1'
                                    component='div'
                                    color={fileSize < window.ENV.MAX_ATTACHMENT_SIZE ? 'textSecondary' : 'error'}
                                    data-cy={`download-${fileName.toLowerCase().replaceAll(' ', '_')}-file-size`}
                                >
                                    Veľkosť: {fileSizeFormatter(fileSize)}
                                </Typography>
                                {fileSize > window.ENV.MAX_ATTACHMENT_SIZE && (
                                    <Typography
                                        color='error'
                                        data-cy={`download-${fileName.toLowerCase().replaceAll(' ', '_')}-file-size-warning`}
                                    >
                                        POZOR - súbor prekročil povolenú veľkosť {fileSizeFormatter(window.ENV.MAX_ATTACHMENT_SIZE)} a
                                        nebude nahraný!
                                    </Typography>
                                )}
                            </>
                        )}
                    </CardContent>
                </Box>
                {(!!onDownload || !!onDelete) && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                        {!!onDownload && (
                            <IconButton
                                color='primary'
                                title='Stiahnuť prílohu'
                                onClick={onDownload}
                                disabled={isPending}
                                data-cy={`download-${fileName.toLowerCase().replaceAll(' ', '_')}-file-button`}
                            >
                                <Download />
                            </IconButton>
                        )}
                        {!!onDelete && (
                            <IconButton
                                color='error'
                                title='Odstrániť prílohu'
                                onClick={onDelete}
                                disabled={isPending}
                                data-cy={`remove-${fileName.toLowerCase().replaceAll(' ', '_')}-file-button`}
                            >
                                <Delete />
                            </IconButton>
                        )}
                    </Box>
                )}
            </Box>
        </Card>
    );
};

export default FileComponent;

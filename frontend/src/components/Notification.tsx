import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import React from 'react';

export interface NotificationProps {
	open: boolean;
	onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
	message: string;
	severity?: 'success' | 'info' | 'warning' | 'error';
	autoHideDuration?: number;
}

const Notification: React.FC<NotificationProps> = ({
	open,
	onClose,
	message,
	severity = 'info',
	autoHideDuration = 4000,
}) => {
	return (
		<Snackbar
			open={open}
			autoHideDuration={autoHideDuration}
			onClose={onClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
		>
			<Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default Notification;

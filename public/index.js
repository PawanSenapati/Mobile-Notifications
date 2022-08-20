const notificationArr = [];
const rowDiv = document.getElementById('table-body');

const updateTable = () => {
	let tempHTML = '';

	notificationArr.forEach((notification) => {
		const temp = `
            <tr>
                <td>${notification.time.split(' ')[4]}</td>
                <td>${notification.appName}</td>
                <td>${notification.title}</td>
                <td>${notification.message}</td>
            </tr>
        `;
		tempHTML += temp;
	});
	rowDiv.innerHTML = tempHTML;
};

function initailizeSocket() {
	var socket = io();
	socket.on('notification:recieved', (notificationData) => {
		notificationArr.unshift(notificationData);
		updateTable();
		if (
			(notificationData.appName === 'Phone' &&
				notificationData.message === 'Incoming call') ||
			['Messages', 'WhatsApp'].includes(notificationData.appName)
		) {
			notify(notificationData);
		}
	});
	swal('Server Connected!', 'Your notifications will appear here.', 'success');
}

function notify(notification) {
	let permission = Notification.permission;
	if (permission === 'granted') {
		showNotification(notification);
	} else if (permission === 'default') {
		requestAndShowPermission(notification);
	} else {
		console.error('Notification permission not granted');
	}
}

function showNotification(notification) {
	console.log('showNotification');
	if (document.visibilityState === 'visible') {
		console.log('site visible');
		return;
	}
	const title = notification.appName + ': ' + notification.title;
	const icon = window.location.origin + '/assets/phone.png';
	const body = notification.message;
	const notificationPopup = new Notification(title, { body, icon });
	new Audio('./assets/cool_notification.mp3').play();
	notificationPopup.onclick = () => {
		notificationPopup.close();
		window.parent.focus();
	};
}
function requestAndShowPermission(notification) {
	console.log('requestPermission');
	Notification.requestPermission(function (permission) {
		console.log(permission);
		if (permission === 'granted') {
			showNotification(notification);
		}
	});
}

swal({
	text: 'Enter Password:',
	content: {
		element: 'input',
		attributes: {
			type: 'password',
			placeholder: 'Enter your password here!',
		},
	},
	button: {
		text: 'Submit',
	},
})
	.then((password) => {
		if (!password) {
			swal('Empty password!', 'This page will be reloaded.', 'error').then(
				() => {
					window.location.reload();
				}
			);
			throw 'Empty Password';
		}

		return fetch('/auth', {
			method: 'POST',
			body: JSON.stringify({
				password: password,
			}),
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
			},
		});
	})
	.then((results) => {
		return results.json();
	})
	.then((json) => {
		const isPasswordCorrect = json.isPasswordCorrect;
		if (isPasswordCorrect) {
			initailizeSocket();
		} else {
			swal('Incorrect password!', 'This page will be reloaded.', 'error').then(
				() => {
					window.location.reload();
				}
			);
			throw 'Incorrect Password';
		}
	})
	.catch((err) => {
		console.error(err);
	});

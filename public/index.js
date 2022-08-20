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
	});
	swal('Server Connected!', 'Your notifications will appear here.', 'success');
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

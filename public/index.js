const socket = io();
const notificationArr = [];
const rowDiv = document.getElementById('table-body');

const updateTable = () => {
	let tempHTML = '';

	notificationArr.forEach((notification) => {
		const temp = `
            <tr>
                <td>${notification.time.split(" ")[4]}</td>
                <td>${notification.appName}</td>
                <td>${notification.title}</td>
                <td>${notification.message}</td>
            </tr>
        `;
		tempHTML += temp;
	});
	rowDiv.innerHTML = tempHTML;
};

socket.on('notification:recieved', (notificationData) => {
	notificationArr.unshift(notificationData);
	updateTable();
});

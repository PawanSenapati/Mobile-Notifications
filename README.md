# Missing Phone?
---

### Summary
This project helps to get your phone's notification to a webpage so that you can see your your notifications even if the phone is not with you.

### How it works?
- This project uses [IFTTT](https://ifttt.com). IFTTT app is installed in the phone and whenever a notification arrives, it sends that notification to our server using POST request.
- Our webpage connects to the server using [socket.io](https://socket.io) after successful verification of the password. Whenever a nitification comes to the server, it emits a socket event which is then handled by frontend to show it in a table format and to push a notification.

### Technologies Used
- IFTTT: To push notification to our server
- NodeJS: To create a server and handle requests
- SocketIO: To send notifications from server to our webpage in realtime
- HTML/Bootstrap/JavaScript: For the user facing webpage

### How you can use this project
- Clone this repository and deploy it anywhere which supports sockets. I preferr using [Heroku](httsp://heroku.com) as it has some free tier. Find the tutorial [here](https://devcenter.heroku.com/articles/deploying-nodejs). **Make sure to set Config vars as per the `.env.example` file. It is used to verify the request from IFTTT and to validate user password.**
- Install IFTTT app and create an applet.
  - In "If This" section, choose "Android Device" > "Notification Recieved". 
  - In "Then That" section, search for "Webhook" > "Make a web request".
  - In URL, provide your server's URL with `/notification` route. Eg. If your server's URL is `https://example.com`, then the URL in IFTTT webhook will be `https://example.com/notification`
  - Select method as `POST`
  - Select content type as `application/json`
  - Set an additional header `x-auth` which will be verified for every request IFTTT makes to your server. It should be same as environment variable `X_AUTH` in the server.
      ```
      x-auth:some-very-secure-string
      ```
  - Set the body as:
    ```
    {
        "title": "<<<{{AndroidDevice.anyNewNotification.NotificationTitle}}>>>",
        "appName":"<<<{{AndroidDevice.anyNewNotification.AppName}}>>>",
        "message":"<<<{{AndroidDevice.anyNewNotification.NotificationMessage}}>>>",
        "time":"<<<{{AndroidDevice.anyNewNotification.ReceivedAt}}>>>"
    }
    ```
  - Create the applet. IFTTT will ask for permission to access noyification from your phone. Grant them! Here you GO! If all is setup well, you'll now be able to see notification on the webpage.
 
### Future Works/Community
I am planning to add some more features in this project in ear future. If you want any features to be added, please open an issue in the repository with the feature request. If you want to contribute to this project, feel free to open a pull request. 
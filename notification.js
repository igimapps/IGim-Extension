self.addEventListener('notificationclick', event =>  event.notification.close())
const createNotification = (title, body) => {
  registration.showNotification(title, {
    body,
    icon: '/igim/app/assets/img/logo_128x128.png',
    // data: "UUID",
    // message: "Request Done",
    // actions: [
    //   { action: 'Open', title: 'Open' },
    //   { action: 'Close', title: 'Close' }
    // ]
  })
}

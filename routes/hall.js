var express = require('express');
var router = express.Router();

let roomData = [{
  room_id: 1,
  room_name: 'room1',
  booked_status: true,
  amenities: "Kitchen facilities, like: fridge, coffee maker and microwave",
  price_per_hr: 200,
  seats_available: 3,
  booking_details: [
    {
      customer_name: 'Arjun',
      date: "2022-04-01",
      start_time: "8 AM",
      end_time: "5 PM"
    },
    {
      customer_name: 'Asha',
      date: "2022-03-01",
      start_time: "8 AM",
      end_time: "5 PM"
    }]
}, {
  room_id: 2,
  room_name: 'room2',
  booked_status: false,
  amenities: "Kitchen facilities, like: fridge, coffee maker and microwave",
  price_per_hr: 200,
  seats_available: 3,
  booking_details: []
}, {
  room_id: 3,
  room_name: 'room3',
  booked_status: false,
  amenities: "Kitchen facilities, like: fridge, coffee maker and microwave",
  price_per_hr: 200,
  seats_available: 3,
  booking_details: []
}]

//List all rooms with booked data

router.get('/all-rooms', function (req, res) {
  res.json({
    data: roomData.map(({ room_name, booked_status, booking_details }) => {
      const room_data = { room_name, booked_status, booking_details }
      return room_data
    })
  })
});

//List all customers with booked data

router.get('/customers', function (req, res) {
  res.json({
    data: roomData.filter(
      ({ booking_details }) => booking_details.length > 0)
      .map(({ room_name, booking_details }) => {
        const room_data = { room_name, booking_details }
        return room_data
      })
  })
});

//get all data of hall booking API

router.get('/', function (req, res) {
  res.json({
    data: roomData
  })
});

//get data by id in hall booking API // id here is roomid

router.get('/:id', function (req, res) {
  res.json({
    data: roomData[req.params.id - 1]
  })
});

//Creating a Room with amenities, price_per_hr, seats_available

/*
sample data :
{
  "amenities":"Kitchen facilities, like: fridge, coffee maker and microwave",
  "price_per_hr": 200,
  "seats_available": 3
}
*/
router.post('/room', function (req, res) {
  const { amenities, price_per_hr, seats_available } = req.body;

  roomData.push({
    room_id: roomData.length + 1,
    room_name: 'room' + (roomData.length + 1),
    booked_status: false,
    amenities,
    price_per_hr,
    seats_available,
    booking_details: []
  })
  res.send('Room details added..');
});


//booking a room with avaialbility check , pass thhe room id in the URL params

/*
sample data :
{
  "customer_name":"Ashley",
  "date": "2022-04-01",
  "start_time": "8 AM",
  "end_time": "5 PM"
}
*/

router.put('/room/:id', function (req, res) {
  const { customer_name, date, start_time, end_time } = req.body;
  const dateNow = Date.now();
  const bookingDate = new Date(date);
  if (req.params.id <= roomData.length && bookingDate.getTime() > dateNow) {
    const bookedDates = roomData[req.params.id - 1].booking_details.map(({ date }) => date)
    if (bookedDates.indexOf(date) < 0) {
      roomData[req.params.id - 1].booked_status = true;
      roomData[req.params.id - 1].booking_details.push({ customer_name, date, start_time, end_time });
      res.json({
        statusCode: 200,
        message: "Room booked Successfully"
      })
    }
    else {
      res.json({
        message: "Room is not vaccant"
      })
    }

  }
  else {
    res.json({
      statusCode: 400,
      message: "Invalid request, Kindly contact the helpdesk"
    })
  }
})

module.exports = router;

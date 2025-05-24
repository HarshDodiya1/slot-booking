const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

module.exports = db;

// table 1: Venues
// | Column | Type      | Description     |
// | ------ | --------- | --------------- |
// | id     | UUID (PK) | Unique venue ID |
// | name   | Text      | Venue name      |

// table 2: Slots
// | Column    | Type      | Description                 |
// | --------- | --------- | --------------------------- |
// | id        | UUID (PK) | Slot ID                     |
// | venue\_id | UUID (FK) | Linked to `venues.id`       |
// | date      | Date      | Date of the slot            |
// | time      | Text      | Slot time, e.g., "10:00 AM" |
// | booked    | Boolean   | Is it already booked?       |

// table 3: Bookings
// | Column     | Type      | Description               |
// | ---------- | --------- | ------------------------- |
// | id         | UUID (PK) | Booking ID                |
// | user\_name | Text      | Name of person booking    |
// | sport      | Text      | Sport being played        |
// | slot\_id   | UUID (FK) | Linked to `slots.id`      |
// | timestamp  | Timestamp | When the booking was made |

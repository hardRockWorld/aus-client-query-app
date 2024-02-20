const getFormattedDate = (date, withTime = true) => {
    if (date === undefined) {
        return "";
    }
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    var hour = date.getHours().toString();
    hour = hour.length > 1 ? hour : "0" + hour;

    var minutes = date.getMinutes().toString();
    minutes = minutes.length > 1 ? minutes : "0" + minutes;

    return withTime
        ? year + "-" + month + "-" + day + " " + hour + ":" + minutes
        : year + "-" + month + "-" + day;
};

// const parseDate = (formattedDate) => {
//     if (!formattedDate) {
//       return undefined; // Handle empty or undefined input
//     }
//
//     const [datePart, timePart] = formattedDate.split(' ');
//
//     const [year, month, day] = datePart.split('-');
//     const isValidDate = !isNaN(year) && !isNaN(month) && !isNaN(day);
//
//     if (!isValidDate) {
//       console.error("Invalid date format:", formattedDate);
//       return undefined; // Handle invalid date format
//     }
//
//     const parsedDate = new Date(year, month - 1, day); // Month is zero-based
//
//     if (timePart) {
//       const [hour, minutes, seconds] = timePart.split(':');
//       const isValidTime = !isNaN(hour) && !isNaN(minutes) && !isNaN(seconds);
//
//       if (!isValidTime) {
//         console.error("Invalid time format:", formattedDate);
//         return parsedDate; // Return date part only if time is invalid
//       }
//
//       parsedDate.setHours(parseInt(hour), parseInt(minutes), parseInt(seconds));
//     }
//
//     return parsedDate;
// }

const parseDate = date => {
    // Check if date is a string and not empty
    if (typeof date === "string" && date.trim() !== "") {
        return new Date(date);
    }

    // Check if date is a Date object
    if (date instanceof Date && !isNaN(date.getTime())) {
        return date;
    }

    // If none of the above, return null or handle it as appropriate for your use case
    return null;
};

export { getFormattedDate, parseDate };

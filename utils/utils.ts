export const getAttendanceStatusLabel = (status: string) => {
  return status === "onTime"
    ? ["On time", "#41B3A2", "OT"]
    : status === "late"
    ? ["Late", "#C7253E", "L"]
    : status === "half-day"
    ? ["Half day", "#DEAC80", "HD"]
    : status === "full-day"
    ? ["Full day", "#694F8E", "P"]
    : status === "absent"
    ? ["Absent", "#CA8787", "A"]
    : "";
};

export function timePassedSinceCheckIn(checkInTime: any) {
  if (checkInTime) {
    // Get the current time
    const now = new Date();

    // Convert the past time to a Date object
    const past = new Date(checkInTime);

    // Calculate the difference in milliseconds
    const diff = now.getTime() - past.getTime();

    // Calculate the difference in hours and minutes
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    // Return the formatted time spent
    return `${diffHours}h ${diffMinutes}m`;
  }

  return "";
}

export const attendanceStatuses = [
  ["On time", "#41B3A2", "OT"],
  ["Late", "#C7253E", "L"],
  ["Half day", "#DEAC80", "HD"],
  ["Full day", "#694F8E", "P"],
  ["Absent", "#CA8787", "A"],
];

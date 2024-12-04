export function formatTime12Hour(date: any, timeZone: string): string {
  if (date) {
    return new Date(date).toLocaleString("en-GB", {
      timeZone: timeZone,
      hour12: true,
      minute: "2-digit",
      hour: "2-digit",
    });
  }

  return "";
}

export function formatDate(date: any, timeZone: string): string {
  if (date) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone,
    });

    return formatter.format(new Date(date));
  }

  return "";
}

export function getStartOrEndDate({
  year,
  month,
  day,
  type = "start",
}: {
  day: number;
  month: number;
  year: number;
  type?: string;
}) {
  const localOffsetHours = 5;
  const localOffsetMinutes = 30;

  const date = new Date(Date.UTC(year, month, day));

  if (type === "start") {
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0 - localOffsetHours,
        0 - localOffsetMinutes
      )
    );
  } else if (type === "end") {
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59
      )
    );
  }

  throw new Error("Invalid type specified. Use 'start' or 'end'.");
}

export function getCurrentAndPast7DaysDate() {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - 7);

  return {
    to: today,
    from: pastDate,
  };
}

export function getDateTimeRangeQuery(
  type: string,
  dateRange?: { from: string; to: string }
) {
  if (type === "live") {
    const day = new Date();

    const time = {
      year: day.getFullYear(),
      month: day.getMonth(),
      day: day.getDate(),
    };

    const currentDayStart = getStartOrEndDate(time);
    const currentDayEnd = getStartOrEndDate({ ...time, type: "end" });

    return {
      $gte: currentDayStart,
      $lt: currentDayEnd,
    };
  } else if (type === "date-range") {
    const fromTime = new Date(dateRange?.from ?? "");
    const toTime = new Date(dateRange?.to ?? "");

    const fromDate = {
      year: fromTime.getFullYear(),
      month: fromTime.getMonth(),
      day: fromTime.getDate(),
    };

    const toDate = {
      year: toTime.getFullYear(),
      month: toTime.getMonth(),
      day: toTime.getDate(),
    };

    const fromDateStart = getStartOrEndDate(fromDate);
    const toDateStart = getStartOrEndDate({ ...toDate, type: "end" });

    return {
      $and: [
        { date: { $gte: fromDateStart } },
        { date: { $lte: toDateStart } },
      ],
    };
  }
}

export function getDateRangeColumns(fromDate: Date, toDate: Date) {
  const dates = [];
  const currentDate = new Date(fromDate);

  while (currentDate <= toDate) {
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    dates.push({ field: formatDateToMMDD(currentDate), headerName: formattedDate,  });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export function formatDateToMMDD(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0'); 
  
  return `${month}/${day}`;
}
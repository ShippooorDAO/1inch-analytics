export function createDailyTimestamps(
  startTimestamp: number,
  endTimestamp: number
): number[] {
  const timestamps = [];
  let timestamp = startTimestamp;
  while (timestamp < endTimestamp) {
    timestamps.push(timestamp);
    timestamp += 86400;
  }
  return timestamps;
}

export function createWeeklyTimestamps(
  startTimestamp: number,
  endTimestamp: number
): number[] {
  const timestamps = [];
  let timestamp = startTimestamp;
  while (timestamp < endTimestamp) {
    timestamps.push(timestamp);
    timestamp += 604800;
  }
  return timestamps;
}

export function createMonthlyTimestamps(
  startTimestamp: number,
  endTimestamp: number
): number[] {
  const timestamps = [];
  let timestamp = startTimestamp;
  while (timestamp < endTimestamp) {
    timestamps.push(timestamp);
    timestamp += 2629743;
  }
  return timestamps;
}

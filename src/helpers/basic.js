export const isEmpty = (obj) => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
};

export const timeToMilliseconds = (t) => {
  let time = t.split(":");
  return time[0] * 3600000 + time[1] * 60000 + (time[2] ? time[2] * 1000 : 0);
};

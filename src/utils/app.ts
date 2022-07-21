export const makeDownloadPhotoUrl = (
  downloadPhotoUrl: string,
  googleDriveId: string,
  imageExtention: string
) => {
  let downloadUrl = `${downloadPhotoUrl}/${googleDriveId}`;
  if (imageExtention) downloadUrl += `.${imageExtention}`;

  return downloadUrl;
};

export const getOnlyTrueTags = (tags: { [name: string]: boolean }) => {
  const result: { [id: string]: boolean } = {};
  for (let id in tags) {
    if (tags[id] === true) {
      result[id] = true;
    }
  }

  return result;
};

export const millisecondsToYears = (mSeconds: number) => {
  return Math.floor(mSeconds / 31536000000);
};

export const getLizzyYearsOld = () => {
  const birthday = new Date("2018-07-07");

  const now = new Date();

  const mSeconds = now.getTime() - birthday.getTime();

  return millisecondsToYears(mSeconds);
};

export const getYearsOld = (date: Date) => {
  const birthday = new Date("2018-07-07");

  //console.log("Date", date.getTime(), birthday.getTime());

  const mSeconds = date.getTime() - birthday.getTime();

  //console.log("mSeconds", mSeconds);

  //console.log("result", mSeconds / 31536000000);

  return millisecondsToYears(mSeconds);
};

export const getAlphabetMonth = (date: Date, withDay: boolean = false) => {
  const month = date.getMonth();
  switch (month) {
    case 0:
      return `январ${withDay ? "я" : "ь"}`;
    case 1:
      return `феврал${withDay ? "я" : "ь"}`;
    case 2:
      return `март${withDay ? "а" : ""}`;
    case 3:
      return `апрел${withDay ? "я" : "ь"}`;
    case 4:
      return `ма${withDay ? "я" : "й"}`;
    case 5:
      return `июн${withDay ? "я" : "ь"}`;
    case 6:
      return `июл${withDay ? "я" : "ь"}`;
    case 7:
      return `август${withDay ? "а" : ""}`;
    case 8:
      return `сентябр${withDay ? "я" : "ь"}`;
    case 9:
      return `октябр${withDay ? "я" : "ь"}`;
    case 10:
      return `ноябр${withDay ? "я" : "ь"}`;
    case 11:
      return `декабр${withDay ? "я" : "ь"}`;

    default:
      throw new Error(`Unknown month number  ${month}`);
  }
};

import { curry, flow, cond, isString } from "lodash-es";
import {
  minLenMsg,
  maxLenMsg,
  regexMsg,
  isFileInputEmptyMsg,
  minDateMsg,
  maxDateMsg,
  isDateValidThrown,
  strToDate,
  hasTrueValue,
  maxFileSizeMBmsg,
  isValidFileFormatMsg,
} from "./main";

/* export type ValidationStream = {
  state: any;
  name: string;
  value: any;
  errors: string[];
}; */

export type DataToValidate = {
  name: string;
  value: any;
};

export type ValidationData /* <T extends {[key: string]: any}> */ = {
  isValidOnSubmit: boolean;
  formState: any;
  dataToValidate: DataToValidate;
  /* eventTarget: any;
  name: string;
  value: any;
  files?: FileList;
  type:
    | "text"
    | "select-one"
    | "select-multiple"
    | "textarea"
    | "checkbox"
    | "file";
  checked?: boolean; */
  errors: { [name: string]: string[] };
};

// HELPER FUNCTIONS

/* export const isFileInputEmpty = (fileList: FileList) => {
  return fileList.length < 1;
}; */

export const withSetValidationError = (result: string, val: ValidationData) => {
  if (result === "") return val;

  const {
    dataToValidate: { name },
    errors: errs,
  } = val;

  const errors = errs[name] ? [...errs[name], result] : [result];

  return { ...val, errors: { ...errs, [name]: errors } };
};

export const minLenMsgComposed = (len: number, msg: string) => (
  val: ValidationData
) => withSetValidationError(minLenMsg(len, msg, val.dataToValidate.value), val);

export const maxLenMsgComposed = (len: number, msg: string) => (
  val: ValidationData
) => withSetValidationError(maxLenMsg(len, msg, val.dataToValidate.value), val);

export const regexMsgComposed = (options: { pattern: RegExp }, msg: string) => (
  val: ValidationData
) =>
  val.isValidOnSubmit
    ? withSetValidationError(
        regexMsg(options, msg, val.dataToValidate.value),
        val
      )
    : val;

export const maxDateMsgComposed = (max: Date, msg: string) => (
  val: ValidationData
) => {
  return withSetValidationError(
    maxDateMsg(max, msg, strToDate(val.dataToValidate.value)),
    val
  );
};

export const minDateMsgComposed = (min: Date, msg: string) => (
  val: ValidationData
) =>
  withSetValidationError(
    minDateMsg(min, msg, strToDate(val.dataToValidate.value)),
    val
  );

/*   maxFileSizeMBmsg, 
  isValidFileFormatMsg
 */

export const maxFileSizeMBmsgComposed = (max: number, msg: string) => (
  val: ValidationData
) =>
  withSetValidationError(
    maxFileSizeMBmsg(max, msg, (val.dataToValidate.value as FileList)[0].size),
    val
  );

export const isValidFileFormatMsgComposed = (
  formats: string[],
  msg: string
) => (val: ValidationData) =>
  withSetValidationError(
    isValidFileFormatMsg(
      formats,
      msg,
      (val.dataToValidate.value as FileList)[0].type
    ),
    val
  );

export const isDateValidThrownComposed = (val: ValidationData) => {
  isDateValidThrown(val.dataToValidate.value);
  return val;
};

const isStringReadyToValidate = ({
  dataToValidate: { value },
}: ValidationData) => {
  return isString(value) && value !== "";
};

const isStringReadyToValidateComposed = ({
  dataToValidate: { value },
}: ValidationData) => {
  return isStringReadyToValidate(value);
};

const isFileReadyToValidateComposed = ({
  dataToValidate: { value },
}: ValidationData) => {
  return Boolean(value instanceof FileList && value.length > 0);
};

const onEmptyValueMsgComposed = (required: boolean, msg: string) => (
  val: ValidationData
) => {
  //return required === true ? { ...val, errors: [msg] } : val;
  const res = required === true ? msg : "";
  return withSetValidationError(res, val);
};

/* export const liftDateComposed = (val: ValidationData) => {
  const dateStr: string = val.value;
  val.value = new Date(dateStr);

  return val;
}; */

// FUNCTIONS BY FIELD NAME

export const photoDescValidation = (required: boolean) =>
  cond([
    [
      isStringReadyToValidateComposed,
      flow(
        maxLenMsgComposed(3000, "Слишком много букв..."),
        regexMsgComposed(
          { pattern: /[a-zA-ZА-Яа-я 0-9:?!(),.-]*/ },
          "Пожалуйста, не используйте спец символы..."
        )
      ),
    ],
    [
      () => true,
      onEmptyValueMsgComposed(required, "Пожалуйста, добавьте описание..."),
    ],
  ]);

export const photoFileValidation = (required: boolean) =>
  cond([
    [
      isFileReadyToValidateComposed,
      flow(
        isValidFileFormatMsgComposed(
          ["jpeg", "png", "jpg"],
          "Файл должен быть типа: jpeg, png, jpg"
        ),
        maxFileSizeMBmsgComposed(21, "Максимальный размер файла 21 Mb.")
      ),
    ],
    [() => true, onEmptyValueMsgComposed(required, "А где фота?")],
  ]);

/* export const photoFileValidation =
  (required: boolean) => (val: ValidationData) => {
    if (required === false) return val;
    else {
      return withSetValidationError(
        isFileInputEmptyMsg("А где фота?", val.files),
        val
      );
    }
  }; */

export const photoTagsValidation = (required: boolean) => (
  val: ValidationData
) => {
  if (required === false) return val;

  const msg = "Добавьте хотя бы один тэг.";

  //return hasTrueValue(val.value) ? "" : msg;

  const res = hasTrueValue(val.dataToValidate.value) ? "" : msg;

  return withSetValidationError(res, val);
};

export const photoDateValidation = (required: boolean) =>
  cond([
    [
      (val: ValidationData) => Boolean(val.dataToValidate.value),
      flow(
        isDateValidThrownComposed,
        maxDateMsgComposed(new Date(), "Фотка сделана в будущем?"),
        minDateMsgComposed(new Date(2018, 6, 8), "Раньше даты рождения?")
      ),
    ],
    [
      () => true,
      onEmptyValueMsgComposed(
        required,
        "Укажите в какое время сделана фота, хотя бы примерно, пожалуйста."
      ),
    ],
  ]);

// We get { value: tagId, checked }
// We must make { value: "tags", value: { tagId: true/false }}
/* export const liftTagDataToTagsState = (val: ValidationData) => {
  const tagId = val.name;

  const tagsState = { ...val.formState.tags };

  tagsState[tagId] = val.checked;

  return {
    ...val,
    name: "tags",
    value: tagsState,
  };
};
 */
export const photoAgeValidation = (required: boolean) => (
  val: ValidationData
) => {};

/* export class PhotoClientValidator extends PhotoValidator {
  age = 3;

  tagsValidation = (tags: PhotoFormTagsData, required: boolean) => {
    if (required === false) return "";

    let isTap = false;

    if (!tags) isTap = false;

    for (let i in tags) {
      if (tags[i] === true) {
        isTap = true;
        break;
      }
    }

    return isTap ? "" : "Добавьте хотя бы один тэг.";
  };

  yearsOldValidation = (value: string) => {
    if (!value) return "";

    const yearsOld = parseInt(value);

    if (isNaN(yearsOld)) throw new Error("Years old must be number...");
    //if(typeof value !== "number") throw new Error("Years old must be number...");

    if (yearsOld < 0 || yearsOld > 3) throw new Error("Bad years old...");

    return "";
  };
}
 */

import {
  withSetValidationError,
  photoDateValidation,
  maxDateMsgComposed,
  photoTagsValidation,
  DataToValidate,
  ValidationData,
} from "./validation";

const data: ValidationData = {
  isValidOnSubmit: false,
  formState: {},
  //name: "fluid",
  //value: "helo",
  //type: "text",
  //checked: false,
  dataToValidate: {
    name: "",
    value: "",
  },
  errors: {
    desc: ["helo", "bye"],
    tags: ["blue"],
  },
};

describe("validatior", () => {
  test("", () => {
    expect(true).toEqual(true);
  });
  /* test("withSetValidationError", () => {
    expect(withSetValidationError("", data)).toEqual(data);

    expect(withSetValidationError("white socket", data)).toEqual({
      ...data,
      errors: {
        fluid: ["white socket"],
        desc: ["helo", "bye"],
        tags: ["blue"],
      },
    });

    const newData = {
      ...data,
      errors: {
        fluid: ["blue spoon"],
        desc: ["helo", "bye"],
        tags: ["blue"],
      },
    };

    expect(withSetValidationError("white socket", newData)).toEqual({
      ...data,
      errors: {
        fluid: ["blue spoon", "white socket"],
        desc: ["helo", "bye"],
        tags: ["blue"],
      },
    });
  });

  /* test.only("maxDateMsgComposed", () => {
    const dateData = {
      ...data,
      name: "date",
      type: "date",
      value: "2020-08-02",
      errors: {},
    };

    expect(maxDateMsgComposed(new Date(), "Hello")(dateData)).toEqual("hello");
  }); 

  test("photoDateValidation", () => {
    const dateData = {
      ...data,
      name: "date",
      type: "date",
      value: "2022-11-23",
      errors: {},
    };

    expect(photoDateValidation(false)(dateData)).toEqual({
      ...dateData,
      errors: { date: ["Фотка сделана в будущем?"] },
    });
  }); */
  /* describe.only("photoTagsValidation", () => {
    const tagsData = {
      ...data,
      name: "date",
      type: "date",
      value: {
        "12sdf": false,
        "23asd": false,
      },
      errors: {},
    };

    test("If required === false it do nothing", () => {
      expect(photoTagsValidation(false)(tagsData)).toEqual(tagsData);
    });

    test("If required === true and no checked tags it add error msg to errors", () => {
      expect(photoTagsValidation(true)(tagsData)).toEqual({
        ...tagsData,
        errors: { date: ["Добавьте хотя бы один тэг."] },
      });
    });

    test("If required === true and we get checked tags it do nothing", () => {
      tagsData.value["12sdf"] = true;

      expect(photoTagsValidation(true)(tagsData)).toEqual(tagsData);
    });
  }); */
});

import { defineRule, configure } from "vee-validate";
import { required, email, min, max, between } from "@vee-validate/rules";
import { localize, setLocale } from "@vee-validate/i18n";
defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);
defineRule("between", between);
configure({
  generateMessage: localize("en", {
    messages: {
      required: "{field} không được để trống",
      //   min: "{_field_} không được nhỏ hơn {length} kí tự",
      //   max: "{field} không được nhỏ hơn {value} kí tự",
      //   between: "{field} phải từ 0:{min} đến {max} kí tự",
    },
  }),
});

setLocale("en");

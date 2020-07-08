import { useState } from "react";
import { translations } from "../components/translations";

export default function useRenderTranslationLabel() {
  const [appLanguage, setAppLanguage] = useState(2);

  const renderLabel = (label) => {
    if (!translations[label]) {
      console.log(label);
    } else {
      const o = translations[label].find(
        (translation) => translation.lang_id === appLanguage
      );
      return o.label;
    }
  };

  let RenderTranslationLabel = {
    renderLabel,
    appLanguage,
    setAppLanguage,
  };

  return RenderTranslationLabel;
}

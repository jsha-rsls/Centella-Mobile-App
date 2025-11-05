import React from "react";

export const SelectionContext = React.createContext({
  hasSelections: false,
  setHasSelections: () => {},
});
